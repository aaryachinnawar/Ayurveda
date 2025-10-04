require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { parse } = require('csv-parse');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Basic security and parsing
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static frontend
app.use(express.static(path.join(__dirname, 'public')));

// Rate limit for API endpoints
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120, // up to 120 requests/min from a single IP
});
app.use('/api/', apiLimiter);

// File upload setup
const uploadsDir = path.join(__dirname, 'uploads');
try {
  fs.mkdirSync(uploadsDir, { recursive: true });
} catch (_) {}
const upload = multer({
  dest: uploadsDir,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// Helpers
function normalizeHeader(h) {
  return String(h || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '');
}

function compileTemplate(template, vars) {
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, k) => {
    const val = vars[k];
    return val == null ? '' : String(val);
  });
}

async function sendWhatsAppText({ phoneNumberId, accessToken, to, body }) {
  const url = `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`;
  const payload = {
    messaging_product: 'whatsapp',
    to,
    type: 'text',
    text: { body },
  };
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };
  try {
    const res = await axios.post(url, payload, { headers, timeout: 20000 });
    return { ok: true, data: res.data };
  } catch (err) {
    return {
      ok: false,
      error: err.response?.data || err.message || 'Unknown error',
      status: err.response?.status,
    };
  }
}

// Simple concurrency pool
async function promisePool(items, concurrency, worker) {
  const results = [];
  let i = 0;
  const active = new Set();

  async function runNext() {
    if (i >= items.length) return;
    const idx = i++;
    const p = (async () => worker(items[idx], idx))()
      .then((r) => (results[idx] = r))
      .catch((e) => (results[idx] = { ok: false, error: e?.message || String(e) }))
      .finally(() => active.delete(p));
    active.add(p);

    if (active.size >= concurrency) {
      await Promise.race(active);
    }
    return runNext();
  }

  await Promise.all(Array(Math.min(concurrency, items.length)).fill(0).map(runNext));
  await Promise.all(active);
  return results;
}

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Send messages from CSV
// Expects multipart/form-data with fields:
// - csv: file (headers should include name, phone)
// - message: string (supports {{name}})
// Optional fields:
// - concurrency: number (default 5)
// - dryRun: 'true' | 'false' (default false)
app.post('/api/send', upload.single('csv'), async (req, res) => {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  if (!phoneNumberId || !accessToken) {
    return res.status(500).json({
      ok: false,
      error: 'Server not configured. Set WHATSAPP_PHONE_NUMBER_ID and WHATSAPP_ACCESS_TOKEN in .env',
    });
  }

  const messageTemplate = (req.body.message || '').trim();
  const concurrency = Math.max(1, Math.min(20, Number(req.body.concurrency || 5)));
  const dryRun = String(req.body.dryRun || 'false').toLowerCase() === 'true';

  if (!messageTemplate) {
    return res.status(400).json({ ok: false, error: 'Message is required' });
  }
  if (!req.file) {
    return res.status(400).json({ ok: false, error: 'CSV file is required' });
  }

  const filePath = req.file.path;

  try {
    const rows = await new Promise((resolve, reject) => {
      const records = [];
      const parser = fs
        .createReadStream(filePath)
        .pipe(
          parse({
            columns: true,
            skip_empty_lines: true,
            trim: true,
          })
        );

      parser.on('data', (rec) => records.push(rec));
      parser.on('end', () => resolve(records));
      parser.on('error', (e) => reject(e));
    });

    if (!rows.length) {
      return res.status(400).json({ ok: false, error: 'CSV has no data rows' });
    }

    // Map headers
    const sample = rows[0] || {};
    const headerMap = Object.keys(sample).reduce((acc, k) => {
      acc[normalizeHeader(k)] = k;
      return acc;
    }, {});

    const nameKey = headerMap['name'] || headerMap['fullname'] || headerMap['customername'];
    const phoneKey = headerMap['phone'] || headerMap['phonenumber'] || headerMap['mobile'] || headerMap['whatsapp'];

    if (!phoneKey) {
      return res.status(400).json({ ok: false, error: 'CSV must include a phone column (e.g., phone, phonenumber, mobile, whatsapp)' });
    }

    const contacts = rows.map((r) => {
      const name = nameKey ? r[nameKey] : '';
      const phone = String(r[phoneKey] || '').replace(/\D+/g, '');
      return { name, phone };
    }).filter((c) => c.phone);

    if (!contacts.length) {
      return res.status(400).json({ ok: false, error: 'No valid phone numbers found in CSV' });
    }

    // WhatsApp requires E.164, ensure user provides numbers with country code
    // We will pass the numeric-only string, assuming it includes country code.

    const results = await promisePool(contacts, concurrency, async (c) => {
      const body = compileTemplate(messageTemplate, { name: c.name, phone: c.phone });
      if (dryRun) {
        return { ok: true, dryRun: true, to: c.phone, body };
      }
      const resp = await sendWhatsAppText({
        phoneNumberId,
        accessToken,
        to: c.phone,
        body,
      });
      return { ...resp, to: c.phone };
    });

    const summary = {
      total: contacts.length,
      succeeded: results.filter((r) => r.ok).length,
      failed: results.filter((r) => !r.ok).length,
    };

    res.json({ ok: true, summary, results: results.slice(0, 50), note: results.length > 50 ? 'Showing first 50 results' : undefined });
  } catch (e) {
    console.error('Send error:', e);
    res.status(500).json({ ok: false, error: e?.message || 'Server error' });
  } finally {
    // Cleanup uploaded file
    fs.promises.unlink(filePath).catch(() => {});
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
