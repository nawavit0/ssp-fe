import React, { createContext, useContext } from 'react';
export const DeviceContext = createContext({ device: {} });

export function DeviceProvider({ device, children }) {
  return (
    <DeviceContext.Provider value={device}>{children}</DeviceContext.Provider>
  );
}

export function useDeviceContext() {
  return useContext(DeviceContext);
}
