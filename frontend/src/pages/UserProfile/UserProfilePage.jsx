import SearchInput from '@/components/SearchInput';
import { useNavigate } from 'react-router-dom';
import UserPostMasonryGrid from './UserPostMasonryGrid';
import { useFetch } from '@/hooks/useFetch';
import { useEffect, useState } from 'react';

const UserProfilePage = () => {
  const navigate = useNavigate();
  const { fetchUserData } = useFetch();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetchUserData();
      setUserData(res.data);
    };
    fetchData();
  }, [setUserData]);

  console.log(userData);
  console.log(userData?.username);

  return (
    <>
      <div className="sticky top-0 z-99 bg-white mt-2 p-2 flex justify-center items-center">
        <SearchInput />
        <img
          src="/images/sample-1.jpg"
          alt=""
          className="ml-4 w-8 h-8 lg:w-12 lg:h-12 rounded-full cursor-pointer"
          onClick={() => navigate('/profile')}
        />
      </div>
      <div className="max-w-6xl mx-auto py-8">
        <div className="flex items-center justify-between gap-2 mb-6">
          <h1 className="text-3xl font-bold">My StyIdeas</h1>
          <h1 className="text-3xl font-bold">{userData?.username}</h1>
        </div>
        <UserPostMasonryGrid />
      </div>
    </>
  );
};

export default UserProfilePage;
