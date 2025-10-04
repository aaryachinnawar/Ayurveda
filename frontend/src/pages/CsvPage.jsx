import React, { useState } from 'react';
import CsvUpload from '../components/CsvUpload';
import CsvTable from '../components/CsvTable';
import Layout from '../components/Layout';
import { fetchFilteredCsvData } from '../services/api';
import MultiSelectDropdown from '../components/MultiSelectDropdown';
import { toast } from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import { useCsvData } from '../context/CsvDataContext';

const COLUMN_ALIASES = {
  disease: ["disease", "diseases (previous)", "illness", "condition"],
  age: ["age", "years"],
  village: ["village", "location", "city", "town"],
  gender: ["gender", "sex"],
  weight: ["weight", "weight (kg)"],
  height: ["height", "height (cm)"]
};

function normalize(str) {
  return (str || "").toLowerCase().replace(/[^a-z]/g, "");
}

function mapColumns(headers) {
  const mapping = {};
  Object.entries(COLUMN_ALIASES).forEach(([key, aliases]) => {
    const found = headers.find(h =>
      aliases.some(alias => normalize(h) === normalize(alias))
    );
    if (found) mapping[key] = found;
  });
  return mapping;
}

function parseCSV(text) {
  const lines = text.split('\n').filter(Boolean);
  if (lines.length === 0) return [];
  const headers = lines[0].split(',');
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const row = {};
    headers.forEach((h, i) => {
      row[h.trim()] = values[i] ? values[i].trim() : '';
    });
    return row;
  });
}

function remapRow(row, mapping) {
  const newRow = { ...row };
  Object.entries(mapping).forEach(([key, col]) => {
    newRow[key] = row[col];
  });
  return newRow;
}

const VILLAGES = ['Nagpur', 'Pune', 'Mumbai'];
const DISEASES = ['Diabetes', 'Hypertension', 'Asthma'];
const AGE_RANGES = ['18-24', '25-34', '35-44', '45-54', '55+'];
const GENDERS = ['Male', 'Female', 'Other'];

function escapeCSVValue(value) {
  if (value == null) return '';
  const str = String(value);
  // Only quote if contains comma, quote, or newline
  if (/[",\n]/.test(str)) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

function toCSV(rows) {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const csvRows = [headers.join(',')];
  for (const row of rows) {
    csvRows.push(headers.map(h => escapeCSVValue(row[h])).join(','));
  }
  return csvRows.join('\n');
}

function downloadCSV(rows, filename = 'filtered_data.csv') {
  const csv = toCSV(rows);
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast.success('Filtered CSV exported!');
}

const CsvPage = () => {
  const { csvData, setCsvData, remappedData, setRemappedData, fileName, setFileName, columnMap, setColumnMap } = useCsvData();
  const [village, setVillage] = useState([]);
  const [disease, setDisease] = useState([]);
  const [ageRange, setAgeRange] = useState('');
  const [gender, setGender] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [villageOptions, setVillageOptions] = useState([]);
  const [diseaseOptions, setDiseaseOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  // Remove localStorage logic, just use context state
  React.useEffect(() => {
    if (!remappedData.length) {
      setCsvData([]);
      setRemappedData([]);
      setFileName('');
      setColumnMap({});
      setFilteredData([]);
      setVillageOptions([]);
      setDiseaseOptions([]);
    }
  }, []);

  // Recalculate options when remappedData changes
  React.useEffect(() => {
    if (remappedData.length) {
      const villages = Array.from(new Set(remappedData.map(row => (row.village || '').trim()).filter(Boolean)));
      const diseases = Array.from(new Set(remappedData.map(row => (row.disease || '').trim()).filter(Boolean)));
      setVillageOptions(villages);
      setDiseaseOptions(diseases);
    } else {
      setVillageOptions([]);
      setDiseaseOptions([]);
    }
  }, [remappedData]);

  const handleUpload = (file) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const data = parseCSV(text);
      // Detect columns
      const headers = data.length > 0 ? Object.keys(data[0]) : [];
      const mapping = mapColumns(headers);
      setColumnMap(mapping);
      // Remap all rows to standard keys
      const remapped = data.map(row => remapRow(row, mapping));
      setRemappedData(remapped);
      setCsvData(data);
      setFilteredData(remapped); // show all data by default
      setVillage([]);
      setDisease([]);
      setAgeRange('');
      setGender('');
      // Extract unique villages and diseases from remapped data
      const villages = Array.from(new Set(remapped.map(row => (row.village || '').trim()).filter(Boolean)));
      const diseases = Array.from(new Set(remapped.map(row => (row.disease || '').trim()).filter(Boolean)));
      setVillageOptions(villages);
      setDiseaseOptions(diseases);
      toast.success('CSV file uploaded successfully!');
    };
    reader.onerror = () => {
      toast.error('Failed to read the CSV file.');
    };
    reader.readAsText(file);
  };

  // Backend filter fetch
  const fetchBackendFilter = async (filters) => {
    setLoading(true);
    try {
      const data = await fetchFilteredCsvData({ ...filters, fileName });
      setFilteredData(data);
    } catch (e) {
      // fallback to frontend filter
      setFilteredData(csvData.filter(row => {
        // Use mapped columns
        const vCol = columnMap.village;
        const dCol = columnMap.disease;
        const gCol = columnMap.gender;
        const aCol = columnMap.age;
        return (
          (!filters.village.length || (vCol && filters.village.includes((row[vCol] || '').trim()))) &&
          (!filters.disease.length || (dCol && filters.disease.includes((row[dCol] || '').trim()))) &&
          (!filters.gender || (gCol && row[gCol] === filters.gender)) &&
          (!filters.ageRange || (() => {
            if (!aCol) return true;
            const age = parseInt(row[aCol], 10);
            if (filters.ageRange === '18-24') return age >= 18 && age <= 24;
            if (filters.ageRange === '25-34') return age >= 25 && age <= 34;
            if (filters.ageRange === '35-44') return age >= 35 && age <= 44;
            if (filters.ageRange === '45-54') return age >= 45 && age <= 54;
            if (filters.ageRange === '55+') return age >= 55;
            return true;
          })())
        );
      }));
    } finally {
      setLoading(false);
    }
  };

  // Only apply filters when user changes a filter (not on upload)
  React.useEffect(() => {
    if (csvData.length > 0 && (village.length || disease.length || ageRange || gender)) {
      fetchBackendFilter({ village, disease, ageRange, gender });
    } else if (csvData.length > 0 && !village.length && !disease.length && !ageRange && !gender) {
      setFilteredData(csvData);
    }
    // eslint-disable-next-line
  }, [village, disease, ageRange, gender, columnMap]);

  const resetFilters = () => {
    setVillage([]);
    setDisease([]);
    setAgeRange('');
    setGender('');
    setFilteredData(csvData);
  };

  return (
    <Layout>
      <div className="w-full min-h-[80vh] flex flex-col items-center justify-center py-8 bg-[#F7F5ED]">
        <div className="w-full max-w-7xl bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
          <h2 className="text-3xl font-bold text-center mb-6">CSV Data Upload &amp; Filter</h2>
          <div className="w-full flex flex-col items-center mb-4">
            <CsvUpload onUpload={handleUpload} fileName={fileName} />
          </div>
          {fileName && (
            <div className="w-full flex items-center justify-center mb-4">
              <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded flex items-center text-sm font-medium">
                <span className="mr-2">File selected:</span> {fileName}
              </div>
            </div>
          )}
          {/* Filters */}
          <div className="w-full flex flex-wrap gap-4 items-center justify-center mb-6">
            <MultiSelectDropdown
              options={villageOptions}
              selected={village}
              onChange={setVillage}
              label="Village"
            />
            <MultiSelectDropdown
              options={diseaseOptions}
              selected={disease}
              onChange={setDisease}
              label="Disease"
            />
            <div>
              <label className="block text-gray-700 text-sm mb-1">Age Range</label>
              <select value={ageRange} onChange={e => setAgeRange(e.target.value)} className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600 text-black">
                <option value="">All</option>
                {AGE_RANGES.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm mb-1">Gender</label>
              <select value={gender} onChange={e => setGender(e.target.value)} className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600 text-black">
                <option value="">All</option>
                {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <button className="bg-green-600 text-white px-6 py-2 rounded font-semibold shadow hover:bg-green-700 transition mt-6 sm:mt-0" onClick={() => downloadCSV(filteredData)} disabled={loading}>
              {loading ? 'Exporting...' : 'EXPORT FILTERED CSV'}
            </button>
            <button className="ml-2 bg-gray-200 text-gray-700 px-4 py-2 rounded font-semibold shadow hover:bg-gray-300 transition mt-6 sm:mt-0" onClick={resetFilters} disabled={loading}>
              Reset Filters
            </button>
          </div>
          {/* Table */}
          <div className="w-full mt-2">
            {loading ? <div className="text-center text-green-700 font-semibold py-8">Loading...</div> : <CsvTable data={filteredData} />}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CsvPage; 