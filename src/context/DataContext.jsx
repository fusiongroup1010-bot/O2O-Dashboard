import React, { createContext, useState, useContext, useMemo } from 'react';
import { mockData as initialData } from '../mockData';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  // Today's date as default key YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];
  
  const [allData, setAllData] = useState({
    [today]: initialData
  });
  const [selectedDate, setSelectedDate] = useState(today);

  const updateAllData = (newDataByDate) => {
    setAllData(newDataByDate);
    // Auto-select the latest date if current selected date is not in new data
    const dates = Object.keys(newDataByDate);
    if (dates.length > 0 && !newDataByDate[selectedDate]) {
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
      gmvChannel: [],
      alertsLog: []
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
