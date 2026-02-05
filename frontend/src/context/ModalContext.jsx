import React, { createContext, useContext } from 'react';

const ModalContext = createContext();

export const useModal = () => {
  return useContext(ModalContext);
};

export const ModalProvider = ({ children, value }) => {
  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  );
};