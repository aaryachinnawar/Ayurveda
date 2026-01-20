import React, { useState, useEffect, useMemo } from 'react';

// Constants for dropdown options
const EDUCATION_LEVELS = ['All', 'Illiterate', 'Upto 10th standard', 'HSC', 'Graduate', 'Postgraduate and above'];
const GENDER_OPTIONS = ['All', 'Female', 'Male', 'Transgender'];
const OCCUPATION_OPTIONS = ['All', 'Student', 'Homemaker', 'Private Job', 'Government Job', 'Business/self Employed', 'Retired', 'Unemployed'];
const HEARD_ABOUT_OPTIONS = ['All', 'Yes', 'No'];
// Exact options for \"How did you hear about DMAMCHRC?\" dropdown
const HEARING_SOURCES = [
  'Flex boards/Posters',
  'Newspaper',
  'Social Media',
  'Health Camp',
  'Referred by Doctor',
  'Friends/Family',
  'I have not heard about it'
];
const MEDICINE_OPTIONS = ['All', 'Diabetes', 'Hypertention', 'Asthama', 'Heart disease', 'Paralysis', 'Breathlesness,Weakness', 'Skin Disease', 'Obesity', 'Acidity/Hyper Acidity', 'Arthritis/knee pain/Back pain', 'Thyroid'];
const SURGERY_OPTIONS = ['All', 'Urine Disorder', 'Hernia', 'Hydrocele', 'Cyst', 'Kidney Stone', 'Piles/Haemorrhoids', 'Fistula', 'Corn', 'Diabetic Wounds, Venous Ulcers'];
const GYNECOLOGY_OPTIONS = ['All', 'Menstrual Disorder', 'Abnormal vaginal bleeding', 'Uterine Prolapse', 'Infertility', 'White Discharge', 'Cyst in a breast', 'PCOD', 'ANC'];
const PEDIATRICS_OPTIONS = ['All', 'Allergic Rhinitis', 'Malnourish Children', 'Difficulty in Speech to child', 'Convulsions', 'Not gaining weight', 'Cerebral Palsy', 'Obesity in Children', 'Mentally Deficient', 'Other'];
const ENT_OPTIONS = ['All', 'Diminished Vision', 'Discharge from eye', 'Sqint', 'Pterygium', 'Ear discharge', 'DNS', 'Migraine'];

const AGE_RANGES = ['All', '18-24', '25-34', '35-44', '45-54', '55-64', '65+'];

const FilterPanel = ({ csvData, filters, setFilters, onExport, onReset }) => {
  // Extract unique values for dropdowns
  const villageOptions = useMemo(() => {
    const col = csvData[0] ? Object.keys(csvData[0]).find(k => k.toLowerCase().includes('village')) : null;
    if (!col) return ['All'];
    const vals = Array.from(new Set(csvData.map(row => row[col]).filter(Boolean)));
    return ['All', ...(vals.length ? vals : ['None'])];
  }, [csvData]);

  const wardOptions = useMemo(() => {
    const col = csvData[0] ? Object.keys(csvData[0]).find(k => k.toLowerCase().includes('ward') || k.toLowerCase().includes('area')) : null;
    if (!col) return ['All'];
    const vals = Array.from(new Set(csvData.map(row => row[col]).filter(Boolean)));
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

  const handleMultiSelect = (key, value) => {
    setFilters(f => {
      const current = Array.isArray(f[key]) ? f[key] : [];
      if (value === 'All') {
        return { ...f, [key]: [] };
      }
      if (current.includes(value)) {
        return { ...f, [key]: current.filter(v => v !== value) };
      }
      return { ...f, [key]: [...current, value] };
    });
  };

  const handleSingleSelectAsArray = (key, value) => {
    setFilters(f => ({
      ...f,
      [key]: value ? [value] : []
    }));
  };

  return (
    <div className="w-full flex flex-col gap-4 mb-6">
      {/* Basic Filters Row */}
      <div className="w-full flex flex-wrap gap-4 items-center justify-center">
        <div>
          <label className="block text-gray-700 text-sm mb-1">Village Name</label>
          <select
            value={filters.villageName || 'All'}
            onChange={e => handleChange('villageName', e.target.value)}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600 text-black min-w-[150px]"
          >
            {villageOptions.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 text-sm mb-1">Ward/Area</label>
          <select
            value={filters.wardArea || 'All'}
            onChange={e => handleChange('wardArea', e.target.value)}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600 text-black min-w-[150px]"
          >
            {wardOptions.map(w => <option key={w} value={w}>{w}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 text-sm mb-1">Age Range</label>
          <select
            value={filters.ageRange || 'All'}
            onChange={e => handleChange('ageRange', e.target.value)}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600 text-black min-w-[120px]"
          >
            {AGE_RANGES.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 text-sm mb-1">Gender Of Patient</label>
          <select
            value={filters.gender || 'All'}
            onChange={e => handleChange('gender', e.target.value)}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600 text-black min-w-[140px]"
          >
            {GENDER_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 text-sm mb-1">Education Level</label>
          <select
            value={filters.educationLevel || 'All'}
            onChange={e => handleChange('educationLevel', e.target.value)}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600 text-black min-w-[180px]"
          >
            {EDUCATION_LEVELS.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 text-sm mb-1">Occupation</label>
          <select
            value={filters.occupation || 'All'}
            onChange={e => handleChange('occupation', e.target.value)}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600 text-black min-w-[180px]"
          >
            {OCCUPATION_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 text-sm mb-1">Heard About DMAMCHRC</label>
          <select
            value={filters.heardAbout || 'All'}
            onChange={e => handleChange('heardAbout', e.target.value)}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600 text-black min-w-[120px]"
          >
            {HEARD_ABOUT_OPTIONS.map(h => <option key={h} value={h}>{h}</option>)}
          </select>
        </div>
      </div>

      {/* Multi-select Filters Row */}
      <div className="w-full flex flex-wrap gap-4 items-center justify-center">
        <div>
          <label className="block text-gray-700 text-sm mb-1">How did you hear about DMAMCHRC?</label>
          <select
            value={Array.isArray(filters.hearingSource) && filters.hearingSource.length ? filters.hearingSource[0] : ''}
            onChange={e => handleSingleSelectAsArray('hearingSource', e.target.value)}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600 text-black min-w-[200px]"
          >
            <option value="" hidden>All</option>
            {HEARING_SOURCES.map(h => <option key={h} value={h}>{h}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 text-sm mb-1">Medicine/Panchakarma</label>
          <select
            value={Array.isArray(filters.medicine) && filters.medicine.length ? filters.medicine[0] : ''}
            onChange={e => handleSingleSelectAsArray('medicine', e.target.value)}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600 text-black min-w-[200px]"
          >
            <option value="" hidden>All</option>
            {MEDICINE_OPTIONS.filter(m => m !== 'All').map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 text-sm mb-1">Surgery</label>
          <select
            value={Array.isArray(filters.surgery) && filters.surgery.length ? filters.surgery[0] : ''}
            onChange={e => handleSingleSelectAsArray('surgery', e.target.value)}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600 text-black min-w-[200px]"
          >
            <option value="" hidden>All</option>
            {SURGERY_OPTIONS.filter(s => s !== 'All').map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 text-sm mb-1">Gynecology</label>
          <select
            value={Array.isArray(filters.gynecology) && filters.gynecology.length ? filters.gynecology[0] : ''}
            onChange={e => handleSingleSelectAsArray('gynecology', e.target.value)}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600 text-black min-w-[200px]"
          >
            <option value="" hidden>All</option>
            {GYNECOLOGY_OPTIONS.filter(g => g !== 'All').map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 text-sm mb-1">Pediatrics</label>
          <select
            value={Array.isArray(filters.pediatrics) && filters.pediatrics.length ? filters.pediatrics[0] : ''}
            onChange={e => handleSingleSelectAsArray('pediatrics', e.target.value)}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600 text-black min-w-[200px]"
          >
            <option value="" hidden>All</option>
            {PEDIATRICS_OPTIONS.filter(p => p !== 'All').map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 text-sm mb-1">Ophthalmology & ENT</label>
          <select
            value={Array.isArray(filters.ent) && filters.ent.length ? filters.ent[0] : ''}
            onChange={e => handleSingleSelectAsArray('ent', e.target.value)}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600 text-black min-w-[200px]"
          >
            <option value="" hidden>All</option>
            {ENT_OPTIONS.filter(opt => opt !== 'All').map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>
      </div>

      {/* Search and Action Buttons Row */}
      <div className="w-full flex flex-wrap gap-4 items-center justify-center">
        <div>
          <label className="block text-gray-700 text-sm mb-1">Search</label>
          <input
            type="text"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            placeholder="Search across all fields..."
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600 text-black min-w-[200px]"
          />
        </div>
        <div className="flex items-end gap-2">
          <button
            className="bg-green-600 text-white px-6 py-2 rounded font-semibold shadow hover:bg-green-700 transition"
            onClick={onExport}
            type="button"
          >
            Export Filtered CSV
          </button>
          <button
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded font-semibold shadow hover:bg-gray-300 transition"
            onClick={onReset}
            type="button"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
