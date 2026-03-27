import React, { useContext } from 'react';
import AppRoutes from './routes/AppRoutes';
import { ThemeContext } from './context/ThemeContext';
import { DashboardProvider } from './context/DashboardContext';

function AppWrapper() {
  const { theme } = useContext(ThemeContext);

  return (
    <div className={`app-container ${theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-gray-100 text-black'}`}>
      <DashboardProvider>
        <AppRoutes />
      </DashboardProvider>
    </div>
  );
}

export default AppWrapper;