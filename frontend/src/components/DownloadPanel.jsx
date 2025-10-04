import React from 'react';
import * as XLSX from 'xlsx';

const DownloadPanel = ({ csvData }) => {
  // Download Excel
  const handleDownloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Filtered Data');
    XLSX.writeFile(wb, 'filtered_data.xlsx');
  };

  // Download summary statistics as TXT
  const handleDownloadSummary = () => {
    const total = csvData.length;
    const villages = Array.from(new Set(csvData.map(r => r.village))).join(', ');
    const diseases = Array.from(new Set(csvData.map(r => r.disease))).join(', ');
    const summary = `Total records: ${total}\nVillages: ${villages}\nDiseases: ${diseases}`;
    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'summary.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full flex flex-wrap gap-4 items-center justify-center mb-6">
      <button className="bg-yellow-600 text-white px-6 py-2 rounded font-semibold shadow hover:bg-yellow-700 transition" onClick={handleDownloadExcel}>Download Excel Report</button>
      <button className="bg-purple-600 text-white px-6 py-2 rounded font-semibold shadow hover:bg-purple-700 transition" onClick={handleDownloadSummary}>Download Summary Statistics</button>
    </div>
  );
};

export default DownloadPanel; 