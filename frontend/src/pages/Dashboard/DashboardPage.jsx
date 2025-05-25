import MasonryGrid from '@/components/MasonryGrid';
import SearchInput from '@/components/SearchInput';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const navigate = useNavigate();
  return (
    <>
      {/* <div className="sticky top-0 z-99 bg-white mt-2 p-2 flex justify-center items-center">
        <SearchInput />
        <img
          src="/images/sample-1.jpg"
          alt=""
          className="ml-4 w-8 h-8 lg:w-12 lg:h-12 rounded-full cursor-pointer"
          onClick={() => navigate('/profile')}
        />
      </div> */}
      <MasonryGrid />
    </>
  );
};

export default DashboardPage;
