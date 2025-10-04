import React, { createContext, useContext, useState } from 'react';

const CsvDataContext = createContext();

export function CsvDataProvider({ children }) {
  const [csvData, setCsvData] = useState([]);
  const [remappedData, setRemappedData] = useState([]);
  const [fileName, setFileName] = useState('');
  const [columnMap, setColumnMap] = useState({});

  return (
    <CsvDataContext.Provider value={{ csvData, setCsvData, remappedData, setRemappedData, fileName, setFileName, columnMap, setColumnMap }}>
      {children}
    </CsvDataContext.Provider>
  );
}

export function useCsvData() {
  return useContext(CsvDataContext);
} 