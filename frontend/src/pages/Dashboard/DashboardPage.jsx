import MasonryGrid from '@/components/MasonryGrid';
import SearchInput from '@/components/SearchInput';
import { useNavigate } from 'react-router-dom';
import { useDataContext } from '@/hooks/useDataContext';
import { Loader2 } from 'lucide-react';

const DashboardPage = () => {
  const { userData } = useDataContext();
  const navigate = useNavigate();

  if (!userData)
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <Loader2 className="animate-spin w-12 h-12 text-primary" />
      </div>
    );

  return (
    <>
      <div className="sticky top-0 z-49 bg-white mt-2 p-2 flex justify-center items-center">
        <SearchInput />
        <img
          src={userData?.profilePic}
          alt="Profile"
          className="ml-4 w-8 h-8 lg:w-12 lg:h-12 rounded-full cursor-pointer"
          onClick={() => navigate('/profile')}
        />
      </div>
      <MasonryGrid />
    </>
  );
};

export default DashboardPage;
