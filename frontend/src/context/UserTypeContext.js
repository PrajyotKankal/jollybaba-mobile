// src/context/UserTypeContext.js
import React, { createContext, useState, useEffect } from 'react';

export const UserTypeContext = createContext();

export const UserTypeProvider = ({ children }) => {
  // Default to 'Retail' mode
  const [userType, setUserType] = useState('Retail');

  useEffect(() => {
    const stored = localStorage.getItem('userType');
    if (stored) {
      setUserType(stored);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('userType', userType);
  }, [userType]);

  // Helper to toggle between Retail and Dealer
  const toggleUserType = () => {
    setUserType(prev => (prev === 'Retail' ? 'Dealer' : 'Retail'));
  };

  return (
    <UserTypeContext.Provider value={{ userType, setUserType, toggleUserType }}>
      {children}
    </UserTypeContext.Provider>
  );
};
