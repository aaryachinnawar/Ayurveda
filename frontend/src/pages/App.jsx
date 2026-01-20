import FilterPanel from './components/FilterPanel';
import DataPreviewTable from './components/DataPreviewTable';
import VisualizationPanel from './components/VisualizationPanel';
import DownloadPanel from './components/DownloadPanel';
import queryString from 'query-string';
import React from 'react';

const defaultFilters = {
  villageName: '',
  wardArea: '',
  ageRange: '',
  gender: '',
  educationLevel: '',
  occupation: '',
  heardAbout: '',
  hearingSource: [],
  medicine: [],
  surgery: [],
  gynecology: [],
  pediatrics: [],
  ent: [],
  search: ''
};

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
      villageName: parsed.villageName || '',
      wardArea: parsed.wardArea || '',
      ageRange: parsed.ageRange || '',
      gender: parsed.gender || '',
      educationLevel: parsed.educationLevel || '',
      occupation: parsed.occupation || '',
      heardAbout: parsed.heardAbout || '',
      hearingSource: parsed.hearingSource ? (Array.isArray(parsed.hearingSource) ? parsed.hearingSource : [parsed.hearingSource]) : [],
      medicine: parsed.medicine ? (Array.isArray(parsed.medicine) ? parsed.medicine : [parsed.medicine]) : [],
      surgery: parsed.surgery ? (Array.isArray(parsed.surgery) ? parsed.surgery : [parsed.surgery]) : [],
      gynecology: parsed.gynecology ? (Array.isArray(parsed.gynecology) ? parsed.gynecology : [parsed.gynecology]) : [],
      pediatrics: parsed.pediatrics ? (Array.isArray(parsed.pediatrics) ? parsed.pediatrics : [parsed.pediatrics]) : [],
      ent: parsed.ent ? (Array.isArray(parsed.ent) ? parsed.ent : [parsed.ent]) : [],
      search: parsed.search || ''
    }));
    // eslint-disable-next-line
  }, []);

  // Helper function to find column name by partial match
  const findColumn = (row, keywords) => {
    if (!row) return null;
    const keys = Object.keys(row);
    return keys.find(k => keywords.some(keyword => k.toLowerCase().includes(keyword.toLowerCase())));
  };

  // Filtering logic
  const filteredData = React.useMemo(() => {
    let data = csvData;
    
    // Village Name filter
    if (filters.villageName) {
      const villageCol = findColumn(data[0], ['village']);
      if (villageCol) {
        data = data.filter(row => String(row[villageCol] || '').toLowerCase() === filters.villageName.toLowerCase());
      }
    }

    // Ward/Area filter
    if (filters.wardArea) {
      const wardCol = findColumn(data[0], ['ward', 'area']);
      if (wardCol) {
        data = data.filter(row => String(row[wardCol] || '').toLowerCase() === filters.wardArea.toLowerCase());
      }
    }

    // Gender filter
    if (filters.gender) {
      const genderCol = findColumn(data[0], ['gender']);
      if (genderCol) {
        data = data.filter(row => String(row[genderCol] || '').toLowerCase() === filters.gender.toLowerCase());
      }
    }

    // Education Level filter
    if (filters.educationLevel) {
      const eduCol = findColumn(data[0], ['education']);
      if (eduCol) {
        data = data.filter(row => String(row[eduCol] || '').toLowerCase() === filters.educationLevel.toLowerCase());
      }
    }

    // Occupation filter
    if (filters.occupation) {
      const occCol = findColumn(data[0], ['occupation']);
      if (occCol) {
        data = data.filter(row => String(row[occCol] || '').toLowerCase() === filters.occupation.toLowerCase());
      }
    }

    // Heard About filter
    if (filters.heardAbout) {
      const heardCol = findColumn(data[0], ['heard', 'datt', 'meghe']);
      if (heardCol) {
        data = data.filter(row => String(row[heardCol] || '').toLowerCase() === filters.heardAbout.toLowerCase());
      }
    }

    // Age Range filter
    if (filters.ageRange) {
      const ageCol = findColumn(data[0], ['age']);
      if (ageCol) {
        data = data.filter(row => {
          const age = parseInt(row[ageCol], 10);
          if (isNaN(age)) return false;
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
    }

    // Multi-select filters - Hearing Source
    if (filters.hearingSource && filters.hearingSource.length > 0) {
      const hearCol = findColumn(data[0], ['hear', 'source', 'how']);
      if (hearCol) {
        data = data.filter(row => {
          const value = String(row[hearCol] || '').toLowerCase();
          return filters.hearingSource.some(filter => value.includes(filter.toLowerCase()));
        });
      }
    }

    // Multi-select filters - Medicine/Panchakarma
    if (filters.medicine && filters.medicine.length > 0) {
      const medCol = findColumn(data[0], ['medicine', 'panchakarma']);
      if (medCol) {
        data = data.filter(row => {
          const value = String(row[medCol] || '').toLowerCase();
          return filters.medicine.some(filter => value.includes(filter.toLowerCase()));
        });
      }
    }

    // Multi-select filters - Surgery
    if (filters.surgery && filters.surgery.length > 0) {
      const surgCol = findColumn(data[0], ['surgery']);
      if (surgCol) {
        data = data.filter(row => {
          const value = String(row[surgCol] || '').toLowerCase();
          return filters.surgery.some(filter => value.includes(filter.toLowerCase()));
        });
      }
    }

    // Multi-select filters - Gynecology
    if (filters.gynecology && filters.gynecology.length > 0) {
      const gynCol = findColumn(data[0], ['gynecology', 'gynec']);
      if (gynCol) {
        data = data.filter(row => {
          const value = String(row[gynCol] || '').toLowerCase();
          return filters.gynecology.some(filter => value.includes(filter.toLowerCase()));
        });
      }
    }

    // Multi-select filters - Pediatrics
    if (filters.pediatrics && filters.pediatrics.length > 0) {
      const pedCol = findColumn(data[0], ['pediatric', 'pediatr']);
      if (pedCol) {
        data = data.filter(row => {
          const value = String(row[pedCol] || '').toLowerCase();
          return filters.pediatrics.some(filter => value.includes(filter.toLowerCase()));
        });
      }
    }

    // Multi-select filters - ENT
    if (filters.ent && filters.ent.length > 0) {
      const entCol = findColumn(data[0], ['ent', 'ophthalmology', 'eye', 'ear']);
      if (entCol) {
        data = data.filter(row => {
          const value = String(row[entCol] || '').toLowerCase();
          return filters.ent.some(filter => value.includes(filter.toLowerCase()));
        });
      }
    }

    // Global search filter
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

export default ReportsPage;
