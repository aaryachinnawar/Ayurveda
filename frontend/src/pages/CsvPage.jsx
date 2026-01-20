import React, { useMemo, useState } from 'react';
import CsvUpload from '../components/CsvUpload';
import CsvTable from '../components/CsvTable';
import Layout from '../components/Layout';
import FilterPanel from '../components/FilterPanel';
import { toast } from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import { useCsvData } from '../context/CsvDataContext';

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

function findColumn(row, keywords) {
  if (!row) return null;
  const keys = Object.keys(row);
  return keys.find(k => keywords.some(keyword => k.toLowerCase().includes(keyword.toLowerCase())));
}

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
  const [filters, setFilters] = useState(defaultFilters);
  const location = useLocation();

  // Remove localStorage logic, just use context state
  React.useEffect(() => {
    if (!remappedData.length) {
      setCsvData([]);
      setRemappedData([]);
      setFileName('');
      setColumnMap({});
      setFilters(defaultFilters);
    }
  }, []);

  const handleUpload = (file) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const data = parseCSV(text);
      setCsvData(data);
      // Keep remappedData aligned with csvData for other pages, but do not force old keys.
      setRemappedData(data);
      setColumnMap({});
      setFilters(defaultFilters);
      toast.success('CSV file uploaded successfully!');
    };
    reader.onerror = () => {
      toast.error('Failed to read the CSV file.');
    };
    reader.readAsText(file);
  };

  const filteredData = useMemo(() => {
    let data = csvData;

    if (filters.villageName) {
      const villageCol = findColumn(data[0], ['village']);
      if (villageCol) {
        data = data.filter(row => String(row[villageCol] || '').toLowerCase() === filters.villageName.toLowerCase());
      }
    }

    if (filters.wardArea) {
      const wardCol = findColumn(data[0], ['ward', 'area']);
      if (wardCol) {
        data = data.filter(row => String(row[wardCol] || '').toLowerCase() === filters.wardArea.toLowerCase());
      }
    }

    if (filters.gender) {
      const genderCol = findColumn(data[0], ['gender']);
      if (genderCol) {
        data = data.filter(row => String(row[genderCol] || '').toLowerCase() === filters.gender.toLowerCase());
      }
    }

    if (filters.educationLevel) {
      const eduCol = findColumn(data[0], ['education']);
      if (eduCol) {
        data = data.filter(row => String(row[eduCol] || '').toLowerCase() === filters.educationLevel.toLowerCase());
      }
    }

    if (filters.occupation) {
      const occCol = findColumn(data[0], ['occupation']);
      if (occCol) {
        data = data.filter(row => String(row[occCol] || '').toLowerCase() === filters.occupation.toLowerCase());
      }
    }

    if (filters.heardAbout) {
      const heardCol = findColumn(data[0], ['heard', 'datt', 'meghe']);
      if (heardCol) {
        data = data.filter(row => String(row[heardCol] || '').toLowerCase() === filters.heardAbout.toLowerCase());
      }
    }

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

    if (filters.hearingSource && filters.hearingSource.length > 0) {
      const hearCol = findColumn(data[0], ['hear', 'source', 'how']);
      if (hearCol) {
        data = data.filter(row => {
          const value = String(row[hearCol] || '').toLowerCase();
          return filters.hearingSource.some(filter => value.includes(String(filter).toLowerCase()));
        });
      }
    }

    if (filters.medicine && filters.medicine.length > 0) {
      const medCol = findColumn(data[0], ['medicine', 'panchakarma']);
      if (medCol) {
        data = data.filter(row => {
          const value = String(row[medCol] || '').toLowerCase();
          return filters.medicine.some(filter => value.includes(String(filter).toLowerCase()));
        });
      }
    }

    if (filters.surgery && filters.surgery.length > 0) {
      const surgCol = findColumn(data[0], ['surgery']);
      if (surgCol) {
        data = data.filter(row => {
          const value = String(row[surgCol] || '').toLowerCase();
          return filters.surgery.some(filter => value.includes(String(filter).toLowerCase()));
        });
      }
    }

    if (filters.gynecology && filters.gynecology.length > 0) {
      const gynCol = findColumn(data[0], ['gynecology', 'gynec']);
      if (gynCol) {
        data = data.filter(row => {
          const value = String(row[gynCol] || '').toLowerCase();
          return filters.gynecology.some(filter => value.includes(String(filter).toLowerCase()));
        });
      }
    }

    if (filters.pediatrics && filters.pediatrics.length > 0) {
      const pedCol = findColumn(data[0], ['pediatric', 'pediatr']);
      if (pedCol) {
        data = data.filter(row => {
          const value = String(row[pedCol] || '').toLowerCase();
          return filters.pediatrics.some(filter => value.includes(String(filter).toLowerCase()));
        });
      }
    }

    if (filters.ent && filters.ent.length > 0) {
      const entCol = findColumn(data[0], ['ent', 'ophthalmology', 'eye', 'ear']);
      if (entCol) {
        data = data.filter(row => {
          const value = String(row[entCol] || '').toLowerCase();
          return filters.ent.some(filter => value.includes(String(filter).toLowerCase()));
        });
      }
    }

    if (filters.search && filters.search.trim()) {
      const search = filters.search.trim().toLowerCase();
      data = data.filter(row => Object.values(row).some(val => String(val).toLowerCase().includes(search)));
    }

    return data;
  }, [csvData, filters]);

  const resetFilters = () => setFilters(defaultFilters);

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
          <FilterPanel
            csvData={csvData}
            filters={filters}
            setFilters={setFilters}
            onExport={() => downloadCSV(filteredData)}
            onReset={resetFilters}
          />
          {/* Table */}
          <div className="w-full mt-2">
            <CsvTable data={filteredData} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CsvPage; 