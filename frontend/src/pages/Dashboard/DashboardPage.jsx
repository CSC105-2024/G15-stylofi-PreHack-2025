import MasonryGrid from '@/components/MasonryGrid';
import SearchInput from '@/components/SearchInput';
import { useNavigate } from 'react-router-dom';
import { useDataContext } from '@/hooks/useDataContext';

const DashboardPage = () => {
  const { userData } = useDataContext();
  const navigate = useNavigate();
  console.log('userData:', userData); // Add this line
  console.log('profilePic:', userData?.profilePic); // Add this line
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
