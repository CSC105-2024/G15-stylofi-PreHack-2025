import { createContext, useState, useEffect } from 'react';
import { useFetch } from '@/hooks/useFetch';

export const DataContext = createContext();

export const DataContextProvider = ({ children }) => {
  const { fetchUserData } = useFetch();
  const [data, setData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Add this function to reload user data
  const reloadUserData = async () => {
    const res = await fetchUserData();
    setUserData(res.data);
  };

  useEffect(() => {
    // Check for auth timestamp changes
    const handleStorageChange = () => {
      reloadUserData();
    };

    // Initial load
    reloadUserData();

    // Listen for storage events (auth changes)
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const filteredData = data
    ? data.filter((post) => {
        const matchesSearch =
          searchQuery === '' ||
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.tags?.some((tag) => tag.name.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesTag =
          selectedTag === null ||
          post.tags?.some((tag) => tag.name.toLowerCase() === selectedTag.toLowerCase());

        return matchesSearch && matchesTag;
      })
    : null;

  return (
    <DataContext.Provider
      value={{
        data,
        setData,
        userData,
        setUserData,
        selectedTag,
        setSelectedTag,
        searchQuery,
        setSearchQuery,
        filteredData,
        reloadUserData, // Export this function so it can be called after login
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
