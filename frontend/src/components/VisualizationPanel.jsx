import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28FD0', '#FF6F91', '#6EC6FF', '#FFD166'];

function getAgeGroup(age) {
  const n = parseInt(age, 10);
  if (isNaN(n)) return 'Unknown';
  if (n < 18) return '<18';
  if (n <= 24) return '18-24';
  if (n <= 34) return '25-34';
  if (n <= 44) return '35-44';
  if (n <= 54) return '45-54';
  if (n <= 64) return '55-64';
  return '65+';
}

const chartTypes = [
  { label: 'Bar', value: 'bar' },
  { label: 'Line', value: 'line' },
  { label: 'Area', value: 'area' },
];

const VisualizationPanel = ({ csvData, filters, diseaseColumn, chartRef }) => {
  // Chart type override state
  const [chartType, setChartType] = useState({});

  // Demographics Bar Chart: Age by Gender
  const ageGenderData = React.useMemo(() => {
    const groups = {};
    csvData.forEach(row => {
      const gender = row.gender || 'Unknown';
      const ageGroup = getAgeGroup(row.age);
      if (!groups[ageGroup]) groups[ageGroup] = { ageGroup };
      groups[ageGroup][gender] = (groups[ageGroup][gender] || 0) + 1;
    });
    return Object.values(groups);
  }, [csvData]);

  // Village-wise Disease Bar Chart
  const villageDiseaseData = React.useMemo(() => {
    const map = {};
    csvData.forEach(row => {
      const village = row.village || 'Unknown';
      map[village] = (map[village] || 0) + 1;
    });
    return Object.entries(map).map(([village, count]) => ({ village, count }));
  }, [csvData]);

  // Weight vs Height Scatter Plot (BMI)
  const bmiData = csvData.filter(row => {
    const weight = parseFloat(row.weight);
    const height = parseFloat(row.height);
    return !isNaN(weight) && !isNaN(height) && height > 0;
  }).map(row => ({
    weight: parseFloat(row.weight),
    height: parseFloat(row.height),
    bmi: parseFloat(row.weight) / ((parseFloat(row.height) / 100) ** 2),
    gender: row.gender || 'Unknown',
  }));

  // Pie chart for disease distribution in a single village
  const showVillagePie = filters && filters.village && filters.village !== '' && filters.village !== 'All';
  const villagePieData = React.useMemo(() => {
    if (!showVillagePie || !diseaseColumn) return [];
    const filtered = csvData.filter(row => row.village === filters.village);
    const map = {};
    filtered.forEach(row => {
      const disease = row[diseaseColumn] || 'Unknown';
      map[disease] = (map[disease] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [csvData, filters, showVillagePie, diseaseColumn]);

  // Chart type override handler
  const handleChartType = (chart, type) => setChartType(t => ({ ...t, [chart]: type }));

  return (
    <div className="w-full flex flex-col gap-8 mb-6" ref={chartRef}>
      {/* Demographics Bar Chart */}
      <div className="bg-gray-50 text-gray-700 px-4 py-2 rounded">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold">Demographics: Age Distribution by Gender</span>
          <select value={chartType.demographics || 'bar'} onChange={e => handleChartType('demographics', e.target.value)} className="border rounded px-2 py-1 ml-2">
            {chartTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={ageGenderData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="ageGroup" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="Male" stackId="a" fill="#0088FE" />
            <Bar dataKey="Female" stackId="a" fill="#FF6F91" />
            <Bar dataKey="Other" stackId="a" fill="#A28FD0" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Village-wise Health Map (Bar Chart) */}
      <div className="bg-gray-50 text-gray-700 px-4 py-2 rounded">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold">Village-wise Disease Count</span>
          <select value={chartType.village || 'bar'} onChange={e => handleChartType('village', e.target.value)} className="border rounded px-2 py-1 ml-2">
            {chartTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={villageDiseaseData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="village" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#00C49F" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Weight vs Height Scatter Plot (BMI) */}
      <div className="bg-gray-50 text-gray-700 px-4 py-2 rounded">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold">BMI Analysis: Weight vs Height</span>
          <select value={chartType.bmi || 'scatter'} onChange={e => handleChartType('bmi', e.target.value)} className="border rounded px-2 py-1 ml-2">
            <option value="scatter">Scatter</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          {bmiData.length > 0 ? (
            <ScatterChart>
              <CartesianGrid />
              <XAxis dataKey="height" name="Height (cm)" />
              <YAxis dataKey="weight" name="Weight (kg)" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Legend />
              <Scatter name="BMI" data={bmiData} fill="#FFBB28" />
            </ScatterChart>
          ) : (
            <div className="flex items-center justify-center w-full h-full text-gray-500">No valid BMI data available.</div>
          )}
        </ResponsiveContainer>
      </div>
      {/* Pie chart for disease distribution in selected village */}
      {showVillagePie && villagePieData.length > 0 && (
        <div className="bg-gray-50 text-gray-700 px-4 py-2 rounded">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold">Disease Distribution in {filters.village}</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={villagePieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {villagePieData.map((entry, idx) => <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default VisualizationPanel; 