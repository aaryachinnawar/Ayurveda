import React, { useState } from 'react';

const DataPreviewTable = ({ csvData }) => {
  const [page, setPage] = useState(0);
  const pageSize = 100;
  const total = csvData.length;
  const headers = csvData[0] ? Object.keys(csvData[0]) : [];
  const pagedData = csvData.slice(page * pageSize, (page + 1) * pageSize);
  const pageCount = Math.ceil(total / pageSize);

  if (!csvData.length) return <div className="w-full text-center text-gray-500 py-8">No data to display.</div>;

  return (
    <div className="w-full overflow-x-auto mb-6">
      <div className="flex justify-between items-center mb-2">
        <div className="text-gray-700 font-medium">Showing {Math.min((page * pageSize) + 1, total)} - {Math.min((page + 1) * pageSize, total)} of {total} records</div>
        <div className="flex gap-2">
          <button disabled={page === 0} onClick={() => setPage(p => Math.max(0, p - 1))} className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50">Prev</button>
          <span className="text-gray-600">Page {page + 1} / {pageCount}</span>
          <button disabled={page >= pageCount - 1} onClick={() => setPage(p => Math.min(pageCount - 1, p + 1))} className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50">Next</button>
        </div>
      </div>
      <table className="w-full bg-white rounded-xl border border-gray-200 text-left text-xs">
        <thead className="bg-gray-50">
          <tr>
            {headers.map(h => <th key={h} className="px-2 py-2 font-semibold text-gray-800 whitespace-nowrap">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {pagedData.map((row, i) => (
            <tr key={i} className="border-t border-gray-100 hover:bg-gray-50 transition">
              {headers.map(h => <td key={h} className="px-2 py-2 text-gray-700 whitespace-nowrap">{row[h]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataPreviewTable; 