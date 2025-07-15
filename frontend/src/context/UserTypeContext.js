import React, { createContext, useState, useEffect } from 'react';

export const UserTypeContext = createContext();

export const UserTypeProvider = ({ children }) => {
  const [userType, setUserType] = useState('Retailer');

  useEffect(() => {
    const storedType = localStorage.getItem('userType');
    if (storedType) setUserType(storedType);
  }, []);

  useEffect(() => {
    localStorage.setItem('userType', userType);
  }, [userType]);

  return (
    <UserTypeContext.Provider value={{ userType, setUserType }}>
      {children}
    </UserTypeContext.Provider>
  );
};
