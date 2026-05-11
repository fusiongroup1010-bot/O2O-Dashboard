import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';
import { mockData as initialData } from '../mockData';

const DataContext = createContext();
const STORAGE_KEY = 'O2O_DASHBOARD_DATA';

export const DataProvider = ({ children }) => {
  const today = new Date().toISOString().split('T')[0];
  
  // Initialize state from localStorage or default to initialData
  const [allData, setAllData] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved data', e);
      }
    }
    return { [today]: initialData };
  });

  // Default selectedDate to the latest date available in allData
  const [selectedDate, setSelectedDate] = useState(() => {
    const dates = Object.keys(allData).sort();
    return dates.length > 0 ? dates[dates.length - 1] : today;
  });

  // Persist allData to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
  }, [allData]);

  const updateAllData = (newDataByDate) => {
    setAllData(newDataByDate);
    
    // Auto-select the latest date if it's a new import
    const dates = Object.keys(newDataByDate).sort();
    if (dates.length > 0) {
      setSelectedDate(dates[dates.length - 1]);
    }
  };

  const dashboardData = useMemo(() => {
    return allData[selectedDate] || {
      cauHinh: { gmvTarget: 1000, roasMin: 5.5, csResponseMax: 5, safetyStockDays: 3, cancelMax: 15, qrConvMin: 15, adsMax: 60, safetyStockVal: 4500, csRatingMin: 4.5, returnMax: 50 },
      onlineGmv: [],
      onlineRoas: [],
      adsConversion: [],
      inventorySku: [],
      csResponse: [],
      stockSafety: [{ sku: 'Total', current: 0, safety: 0 }],
      orderStatus: [{ status: 'Thành công', value: 0 }, { status: 'Hoàn/Huỷ', value: 0 }],
      offlineTraffic: [],
      qrFunnel: [],
      offlineSales: [],
      skuSampling: [],
      gmvChannel: [],
      alertsLog: [],
      customColumns: {},
      customCharts: []
    };
  }, [allData, selectedDate]);

  return (
    <DataContext.Provider value={{ 
      dashboardData, 
      allData, 
      selectedDate, 
      setSelectedDate, 
      updateAllData 
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DataProvider');
  }
  return context;
};
