import React, { useState, useRef } from 'react';

const CsvTable = ({ data }) => {
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [filter, setFilter] = useState('');
  const [sortMenu, setSortMenu] = useState({ open: false, header: null, x: 0, y: 0 });
  const headerRefs = useRef({});

  if (!data || data.length === 0) {
    return <div className="text-gray-500 text-center py-8">No data to display.</div>;
  }

  const headers = Object.keys(data[0]);

  const handleSort = (header, e) => {
    e.preventDefault();
    const rect = headerRefs.current[header]?.getBoundingClientRect();
    const parentRect = e.target.closest('table')?.getBoundingClientRect();
    // Position menu below the header cell, relative to the table container
    setSortMenu({
      open: true,
      header,
      x: rect && parentRect ? rect.left - parentRect.left : e.clientX,
      y: rect && parentRect ? rect.bottom - parentRect.top : e.clientY
    });
  };

  const applySort = (header, order) => {
    setSortBy(header);
    setSortOrder(order);
    setSortMenu({ open: false, header: null, x: 0, y: 0 });
  };

  const closeMenu = () => setSortMenu({ open: false, header: null, x: 0, y: 0 });

  let filteredData = data;
  if (filter) {
    filteredData = data.filter(row =>
      headers.some(h => String(row[h]).toLowerCase().includes(filter.toLowerCase()))
    );
  }

  let sortedData = [...filteredData];
  if (sortBy) {
    sortedData.sort((a, b) => {
      if (a[sortBy] < b[sortBy]) return sortOrder === 'asc' ? -1 : 1;
      if (a[sortBy] > b[sortBy]) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }

  return (
    <div className="relative w-full px-2 md:px-8">
      <input
        type="text"
        placeholder="Filter..."
        value={filter}
        onChange={e => setFilter(e.target.value)}
        className="mb-4 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400 w-full max-w-xs text-black"
      />
      <div className="overflow-x-auto w-full">
        <table className="min-w-[900px] w-full border rounded-xl text-left bg-white">
          <thead>
            <tr className="bg-green-100 text-green-900">
              {headers.map(header => (
                <th
                  key={header}
                  ref={el => (headerRefs.current[header] = el)}
                  className="px-4 py-2 font-semibold cursor-pointer select-none relative"
                  onClick={e => handleSort(header, e)}
                >
                  <span className="flex items-center gap-1">
                    {header}
                    {sortBy === header ? (
                      sortOrder === 'asc' ? <span>▲</span> : <span>▼</span>
                    ) : (
                      <span className="text-green-700">⇅</span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, idx) => (
              <tr key={idx} className="even:bg-gray-50">
                {headers.map(header => (
                  <td key={header} className="px-4 py-2 border-t text-black">{row[header]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {/* Sort menu (mock) */}
        {sortMenu.open && (
          <div
            className="absolute z-20 bg-white border rounded shadow-lg text-sm min-w-[140px]"
            style={{ top: sortMenu.y + 4, left: sortMenu.x }}
            onMouseLeave={closeMenu}
          >
            <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => { setSortBy(null); setSortMenu({ open: false, header: null, x: 0, y: 0 }); }}>Unsort</div>
            <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => applySort(sortMenu.header, 'asc')}>Sort by ASC</div>
            <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => applySort(sortMenu.header, 'desc')}>Sort by DESC</div>
            <div className="px-4 py-2 text-gray-400 cursor-not-allowed">Hide</div>
            <div className="px-4 py-2 text-gray-400 cursor-not-allowed">Show columns</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CsvTable; 