import SearchInput from '@/components/SearchInput';
import UserPostMasonryGrid from './UserPostMasonryGrid';
import { useFetch } from '@/hooks/useFetch';
import { useEffect, useState } from 'react';

const UserProfilePage = () => {
  const { fetchUserData } = useFetch();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetchUserData();
      setUserData(res.data);
    };
    fetchData();
  }, [setUserData]);

  return (
    <>
      <div className="sticky top-0 z-49 bg-white mt-2 p-2 flex justify-center items-center">
        <SearchInput />
        <div className="ml-4 border-3 border-primary rounded-full">
          <img
            src="/images/sample-1.jpg"
            alt=""
            className="p-0.5 w-8 h-8 lg:w-12 lg:h-12 rounded-full cursor-pointer"
          />
        </div>
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
