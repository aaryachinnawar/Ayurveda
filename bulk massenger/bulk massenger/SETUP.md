# Bulk WhatsApp Messenger Setup

## Prerequisites

1. WhatsApp Business API access
2. Node.js installed

## Configuration

1. Create a `.env` file in this directory with the following variables:

```
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id_here
WHATSAPP_ACCESS_TOKEN=your_access_token_here
PORT=3000
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

The server will run on http://localhost:3000

## Getting WhatsApp API Credentials

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or use an existing one
3. Add WhatsApp Business API product
4. Get your Phone Number ID and Access Token from the WhatsApp API settings

## CSV Format

Your CSV file should include:
- A phone column (phone, phonenumber, mobile, whatsapp)
- Optional name column for personalization
- Phone numbers must include country code (E.164 format), e.g., 919876543210

## Message Templates

Use variables in your messages:
- `{{name}}` - Customer name
- `{{phone}}` - Customer phone number

Example: "Hi {{name}}, this is a reminder for your appointment."
