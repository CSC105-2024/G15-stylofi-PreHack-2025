import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const SearchInput = () => {
  return (
    <div className="relative">
      <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-text dark:text-text" />
      <Input
        type="search"
        placeholder="Search"
        className="w-full pl-8 bg-input-background ring-primary"
      />
    </div>
  );
};

export default SearchInput;
