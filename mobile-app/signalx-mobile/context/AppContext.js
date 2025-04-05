import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [reports, setReports] = useState([]);
  const [trustScore, setTrustScore] = useState(100);
  const [emergencyAlerts, setEmergencyAlerts] = useState([]);

  const addReport = (report) => {
    setReports([...reports, report]);
  };

  const updateTrustScore = (points) => {
    setTrustScore(Math.max(0, Math.min(100, trustScore + points)));
  };

  const addEmergencyAlert = (alert) => {
    setEmergencyAlerts([...emergencyAlerts, alert]);
  };

  return (
    <AppContext.Provider
      value={{
        reports,
        addReport,
        trustScore,
        updateTrustScore,
        emergencyAlerts,
        addEmergencyAlert,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};