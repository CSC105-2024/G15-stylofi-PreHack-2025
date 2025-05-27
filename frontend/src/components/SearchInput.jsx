import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { useDataContext } from '@/hooks/useDataContext';

const SearchInput = () => {
  const { searchQuery, setSearchQuery, selectedTag, setSelectedTag } = useDataContext();

  return (
    <div className="flex items-center justify-center sticky gap-2 w-full">
      <div className="relative flex-1">
        <Search className="w-4 h-4 absolute left-2 top-3 text-text dark:text-text" />
        <Input
          type="search"
          placeholder="Search"
          className="w-full h-10 pl-8 bg-input-background ring-primary border-0"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {selectedTag && (
        <div className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
          <span className="text-sm font-medium">#{selectedTag}</span>
          <button
            onClick={() => setSelectedTag(null)}
            className="ml-1 text-blue-600 hover:text-blue-800 cursor-pointer"
            aria-label="Clear tag filter"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchInput;
