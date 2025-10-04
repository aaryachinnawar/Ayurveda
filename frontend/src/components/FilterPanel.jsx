import React, { useState, useEffect, useMemo } from 'react';

const AGE_RANGES = ['All', '18-24', '25-34', '35-44', '45-54', '55-64', '65+'];

const FilterPanel = ({ csvData, filters, setFilters, onExport, onReset, diseaseColumn }) => {
  // Extract unique values for dropdowns, fallback to 'None' if empty
  const villageOptions = useMemo(() => ['All', ...Array.from(new Set(csvData.map(row => row.village).filter(Boolean)))], [csvData]);
  const diseaseOptions = useMemo(() => {
    if (!diseaseColumn) return ['All', 'None'];
    const vals = Array.from(new Set(csvData.map(row => row[diseaseColumn]).filter(Boolean)));
    return ['All', ...(vals.length ? vals : ['None'])];
  }, [csvData, diseaseColumn]);
  const genderOptions = useMemo(() => {
    const vals = Array.from(new Set(csvData.map(row => row.gender).filter(Boolean)));
    return ['All', ...(vals.length ? vals : ['None'])];
  }, [csvData]);

  // Search bar state
  const [searchInput, setSearchInput] = useState(filters.search || '');
  useEffect(() => {
    const handler = setTimeout(() => {
      setFilters(f => ({ ...f, search: searchInput }));
    }, 400);
    return () => clearTimeout(handler);
  }, [searchInput, setFilters]);

  // Handlers for dropdowns
  const handleChange = (key, value) => {
    setFilters(f => ({
      ...f,
      [key]: value === 'All' ? '' : value
    }));
  };

  return (
    <div className="w-full flex flex-wrap gap-4 items-center justify-center mb-6">
      <div>
        <label className="block text-gray-700 text-sm mb-1">Village</label>
        <select
          value={filters.village || 'All'}
          onChange={e => handleChange('village', e.target.value)}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600 text-black min-w-[120px]"
        >
          {villageOptions.map(v => <option key={v} value={v}>{v}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-gray-700 text-sm mb-1">Disease</label>
        <select
          value={filters.disease || 'All'}
          onChange={e => handleChange('disease', e.target.value)}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600 text-black min-w-[120px]"
        >
          {diseaseOptions.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-gray-700 text-sm mb-1">Age Range</label>
        <select
          value={filters.ageRange || 'All'}
          onChange={e => handleChange('ageRange', e.target.value)}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600 text-black min-w-[100px]"
        >
          {AGE_RANGES.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-gray-700 text-sm mb-1">Gender</label>
        <select
          value={filters.gender || 'All'}
          onChange={e => handleChange('gender', e.target.value)}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600 text-black min-w-[100px]"
        >
          {genderOptions.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>
      <div>
        <input
          type="text"
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          placeholder="Filter..."
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600 text-black min-w-[160px]"
        />
      </div>
      <button
        className="bg-green-600 text-white px-6 py-2 rounded font-semibold shadow hover:bg-green-700 transition"
        onClick={onExport}
        type="button"
      >
        Export Filtered CSV
      </button>
      <button
        className="ml-2 bg-gray-200 text-gray-700 px-4 py-2 rounded font-semibold shadow hover:bg-gray-300 transition"
        onClick={onReset}
        type="button"
      >
        Reset Filters
      </button>
    </div>
  );
};

export default FilterPanel; 