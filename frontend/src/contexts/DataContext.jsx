import { createContext, useState } from 'react';

export const DataContext = createContext();

export const DataContextProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = data
    ? data.filter((post) => {
        const matchesSearch =
          searchQuery === '' ||
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.description?.toLowerCase().includes(searchQuery.toLowerCase());

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
        selectedTag,
        setSelectedTag,
        searchQuery,
        setSearchQuery,
        filteredData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
