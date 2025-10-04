import FilterPanel from './components/FilterPanel';
import DataPreviewTable from './components/DataPreviewTable';
import VisualizationPanel from './components/VisualizationPanel';
import DownloadPanel from './components/DownloadPanel';
import queryString from 'query-string';
import React from 'react';

const defaultFilters = { village: [], disease: [], ageRange: '', gender: [], search: '' };

const ReportsPage = () => {
  const [csvData, setCsvData] = React.useState([]);
  const [fileName, setFileName] = React.useState('');
  const [filters, setFilters] = React.useState(defaultFilters);
  const [loading, setLoading] = React.useState(true);

  // Load CSV data from localStorage
  React.useEffect(() => {
    const saved = localStorage.getItem('csvPageState');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCsvData(parsed.csvData || []);
        setFileName(parsed.fileName || '');
      } catch {}
    }
    setLoading(false);
  }, []);

  // Sync filters to URL
  React.useEffect(() => {
    const params = queryString.stringify(filters, { arrayFormat: 'comma' });
    window.history.replaceState(null, '', `?${params}`);
  }, [filters]);

  // Parse filters from URL on mount
  React.useEffect(() => {
    const parsed = queryString.parse(window.location.search, { arrayFormat: 'comma' });
    setFilters(f => ({
      ...f,
      ...parsed,
      village: parsed.village ? (Array.isArray(parsed.village) ? parsed.village : [parsed.village]) : [],
      disease: parsed.disease ? (Array.isArray(parsed.disease) ? parsed.disease : [parsed.disease]) : [],
      gender: parsed.gender ? (Array.isArray(parsed.gender) ? parsed.gender : [parsed.gender]) : [],
      ageRange: parsed.ageRange || '',
      search: parsed.search || ''
    }));
    // eslint-disable-next-line
  }, []);

  // Filtering logic
  const filteredData = React.useMemo(() => {
    let data = csvData;
    if (filters.village && filters.village.length)
      data = data.filter(row => filters.village.includes(row.village));
    if (filters.disease && filters.disease.length)
      data = data.filter(row => filters.disease.includes(row.disease));
    if (filters.gender && filters.gender.length)
      data = data.filter(row => filters.gender.includes(row.gender));
    if (filters.ageRange) {
      data = data.filter(row => {
        const age = parseInt(row.age, 10);
        switch (filters.ageRange) {
          case '18-24': return age >= 18 && age <= 24;
          case '25-34': return age >= 25 && age <= 34;
          case '35-44': return age >= 35 && age <= 44;
          case '45-54': return age >= 45 && age <= 54;
          case '55-64': return age >= 55 && age <= 64;
          case '65+': return age >= 65;
          default: return true;
        }
      });
    }
    if (filters.search && filters.search.trim()) {
      const search = filters.search.trim().toLowerCase();
      data = data.filter(row => Object.values(row).some(val => String(val).toLowerCase().includes(search)));
    }
    return data;
  }, [csvData, filters]);

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

  if (loading) return <div className="min-h-[60vh] flex flex-col items-center justify-center text-gray-600 text-xl">Loading report...</div>;
  if (!csvData || csvData.length === 0) {
    return <div className="min-h-[60vh] flex flex-col items-center justify-center text-gray-600 text-xl">No CSV data found. Please upload a file on the Upload page.</div>;
  }

  return (
    <div className="w-full min-h-[80vh] flex flex-col items-center justify-center py-8 bg-[#F7F5ED]">
      <div className="w-full max-w-7xl bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
        <h2 className="text-3xl font-bold text-center mb-6">Reports &amp; Visualizations</h2>
        <div className="w-full flex flex-col items-center mb-4">
          <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded flex items-center text-sm font-medium mb-4">
            <span className="mr-2">File:</span> {fileName}
          </div>
          <FilterPanel csvData={csvData} filters={filters} setFilters={setFilters} onExport={handleExport} onReset={handleReset} />
          <DataPreviewTable csvData={filteredData} />
          <VisualizationPanel csvData={filteredData} />
          <DownloadPanel csvData={filteredData} />
        </div>
      </div>
    </div>
  );
};
 