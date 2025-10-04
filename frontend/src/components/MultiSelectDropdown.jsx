import React, { useState, useRef, useEffect } from 'react';

const MultiSelectDropdown = ({ options, selected, onChange, label, placeholder = 'All' }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (option) => {
    if (selected.includes(option)) {
      onChange(selected.filter((v) => v !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const allSelected = selected.length === options.length;
  const handleSelectAll = () => {
    if (allSelected) {
      onChange([]);
    } else {
      onChange(options);
    }
  };

  return (
    <div className="relative min-w-[160px]" ref={ref}>
      <label className="block text-gray-700 text-sm mb-1">{label}</label>
      <button
        type="button"
        className="w-full border rounded px-3 py-2 text-left bg-white focus:outline-none focus:ring-2 focus:ring-green-600 text-black"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="truncate block min-h-[1.2em] text-black">
          {selected.length === 0 ? (
            <span className="text-gray-400">{placeholder}</span>
          ) : (
            selected.join(', ')
          )}
        </span>
      </button>
      {open && (
        <div className="absolute z-30 mt-1 w-full bg-white border rounded shadow-lg max-h-56 overflow-y-auto">
          <div className="px-3 py-2 border-b flex items-center gap-2 cursor-pointer hover:bg-gray-50 text-black" onClick={handleSelectAll}>
            <input type="checkbox" checked={allSelected} readOnly />
            <span className="text-sm text-black">Select All</span>
          </div>
          {options.map((option) => (
            <div
              key={option}
              className="px-3 py-2 flex items-center gap-2 cursor-pointer hover:bg-gray-50 text-black"
              onClick={() => toggleOption(option)}
            >
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => toggleOption(option)}
                onClick={(e) => e.stopPropagation()}
              />
              <span className="text-sm text-black">{option}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown; 