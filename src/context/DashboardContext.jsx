import React, { createContext, useContext, useState, useCallback } from 'react';

const DashboardContext = createContext();

export const useDashboard = () => useContext(DashboardContext);

export const DashboardProvider = ({ children }) => {
  const [lastUpdated, setLastUpdated] = useState(Date.now());

  const refreshDashboard = useCallback(() => {
    setLastUpdated(Date.now());
  }, []);

  return (
    <DashboardContext.Provider value={{ lastUpdated, refreshDashboard }}>
      {children}
    </DashboardContext.Provider>
  );
};