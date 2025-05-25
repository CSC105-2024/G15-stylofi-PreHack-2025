import { DataContext } from '@/contexts/DataContext';
import { useContext } from 'react';

export const useDataContext = () => {
  const context = useContext(DataContext);

  if (!context) {
    throw new Error('useDataContext must be used within a DataContextProvider');
  }

  return context;
};
