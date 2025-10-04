import React, { useState, useRef, useMemo } from 'react';
import FilterPanel from '../components/FilterPanel';
import DataPreviewTable from '../components/DataPreviewTable';
import VisualizationPanel from '../components/VisualizationPanel';
import DownloadPanel from '../components/DownloadPanel';
import { useLocation } from 'react-router-dom';
import { useCsvData } from '../context/CsvDataContext';

const COLUMN_ALIASES = {
  village: ['village', 'village name', 'location', 'city', 'town'],
  disease: ['disease', 'diseases', 'illness', 'condition', 'diseases (previous)'],
  age: ['age', 'years'],
  gender: ['gender', 'sex'],
  weight: ['weight', 'weight (kg)'],
  height: ['height', 'height (cm)'],
  date: ['date', 'timestamp', 'recorded at', 'created at']
};
function normalize(str) {
  return (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}
function mapColumns(headers) {
  const mapping = {};
  Object.entries(COLUMN_ALIASES).forEach(([key, aliases]) => {
    const found = headers.find(h => aliases.some(alias => normalize(h) === normalize(alias)));
    if (found) mapping[key] = found;
  });
  return mapping;
}
function remapRow(row, mapping) {
  const newRow = { ...row };
  Object.entries(mapping).forEach(([key, col]) => {
    newRow[key] = row[col];
  });
  return newRow;
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

const defaultFilters = { village: [], disease: [], ageRange: [], gender: [], search: '' };
const AGE_RANGES = ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'];

const ReportsPage = () => {
  const { csvData, setCsvData, remappedData, setRemappedData, fileName, setFileName, columnMap, setColumnMap } = useCsvData();
  const [filters, setFilters] = useState(defaultFilters);
  const chartRef = useRef(null);
  const dashboardRef = useRef(null);
  const location = useLocation();

  // Remove localStorage logic, just use context state
  React.useEffect(() => {
    if (!remappedData.length) {
      setCsvData([]);
      setRemappedData([]);
      setFileName('');
      setColumnMap({});
    }
  }, []);

  // CSV upload handler (in-memory only)
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target.result;
      const data = parseCSV(text);
      const headers = data.length > 0 ? Object.keys(data[0]) : [];
      const mapping = mapColumns(headers);
      setColumnMap(mapping);
      const remapped = data.map(row => remapRow(row, mapping));
      setCsvData(data);
      setRemappedData(remapped);
      setFilters(defaultFilters);
    };
    reader.readAsText(file);
  };

  // Filtering logic (multi-select)
  const filteredData = useMemo(() => {
    let data = remappedData;
    if (filters.village && filters.village.length)
      data = data.filter(row => filters.village.includes(row.village));
    if (filters.disease && filters.disease.length)
      data = data.filter(row => filters.disease.includes(row.disease));
    if (filters.gender && filters.gender.length)
      data = data.filter(row => filters.gender.includes(row.gender));
    if (filters.ageRange && filters.ageRange.length) {
      data = data.filter(row => {
        const age = parseInt(row.age, 10);
        return filters.ageRange.some(range => {
          switch (range) {
            case '18-24': return age >= 18 && age <= 24;
            case '25-34': return age >= 25 && age <= 34;
            case '35-44': return age >= 35 && age <= 44;
            case '45-54': return age >= 45 && age <= 54;
            case '55-64': return age >= 55 && age <= 64;
            case '65+': return age >= 65;
            default: return true;
          }
        });
      });
    }
    if (filters.search && filters.search.trim()) {
      const search = filters.search.trim().toLowerCase();
      data = data.filter(row => Object.values(row).some(val => String(val).toLowerCase().includes(search)));
    }
    return data;
  }, [remappedData, filters]);

  // Extract unique values for multi-select dropdowns
  const villageOptions = useMemo(() => Array.from(new Set(remappedData.map(row => row.village).filter(Boolean))), [remappedData]);
  const diseaseOptions = useMemo(() => Array.from(new Set(remappedData.map(row => row.disease).filter(Boolean))), [remappedData]);
  const genderOptions = useMemo(() => Array.from(new Set(remappedData.map(row => row.gender).filter(Boolean))), [remappedData]);

  // Export filtered CSV
  const handleExport = () => {
    if (!filteredData.length) return;
    const headers = Object.keys(filteredData[0]);
    const csvRows = [headers.join(',')];
    for (const row of filteredData) {
      csvRows.push(headers.map(h => '"' + String(row[h] || '').replace(/"/g, '""') + '"').join(','));
    }
    const csv = csvRows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'filtered_data.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Reset filters
  const handleReset = () => setFilters(defaultFilters);

  return (
    <div className="w-full min-h-[80vh] flex flex-col items-center justify-center py-8 bg-[#F7F5ED]">
      <div ref={dashboardRef} className="w-full max-w-7xl bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
        <h2 className="text-3xl font-bold text-center mb-6">Reports &amp; Visualizations</h2>
        {/* CSV Upload */}
        <div className="w-full flex flex-col items-center mb-4">
          <label htmlFor="csv-upload" className="mb-2 font-semibold text-lg text-gray-700">Upload CSV</label>
          <input
            id="csv-upload"
            type="file"
            accept=".csv"
            onChange={handleUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => document.getElementById('csv-upload').click()}
            className="bg-green-600 text-white px-6 py-2 rounded font-semibold shadow hover:bg-green-700 transition mb-4"
          >
            {fileName ? 'Change CSV File' : 'Upload CSV File'}
          </button>
          {fileName && (
            <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded flex items-center text-sm font-medium mb-4">
              <span className="mr-2">File:</span> {fileName}
            </div>
          )}
        </div>
        {/* Filters */}
        {remappedData.length > 0 && (
          <FilterPanel
            csvData={remappedData}
            filters={filters}
            setFilters={setFilters}
            onExport={handleExport}
            onReset={handleReset}
            diseaseColumn={columnMap.disease}
            villageOptions={villageOptions}
            diseaseOptions={diseaseOptions}
            genderOptions={genderOptions}
            multiSelect={true}
            ageRanges={AGE_RANGES}
          />
        )}
        {/* Data Preview Table */}
        {remappedData.length > 0 && <DataPreviewTable csvData={filteredData} />}
        {/* Visualizations */}
        {remappedData.length > 0 && (
          <VisualizationPanel csvData={filteredData} filters={filters} diseaseColumn={columnMap.disease} chartRef={chartRef} />
        )}
        {/* Download Panel */}
        {remappedData.length > 0 && <DownloadPanel csvData={filteredData} chartRef={dashboardRef} />}
        {/* If no file uploaded, show prompt */}
        {remappedData.length === 0 && (
          <div className="w-full text-center text-gray-500 py-8">Please upload a CSV file to view filters and visualizations.</div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage; 