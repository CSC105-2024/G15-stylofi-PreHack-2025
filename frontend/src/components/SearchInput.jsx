import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const SearchInput = () => {
  return (
    <>
      <div className="flex items-center justify-center sticky">
        <Search className="w-4 h-4 absolute left-2 top-3 text-text dark:text-text" />
        <Input
          type="search"
          placeholder="Search"
          className="w-256 h-10 pl-8 bg-input-background ring-primary border-0"
        />
      </div>
    </>
  );
};

export default SearchInput;
