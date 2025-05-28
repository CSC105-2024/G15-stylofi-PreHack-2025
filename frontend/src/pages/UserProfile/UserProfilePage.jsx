import SearchInput from '@/components/SearchInput';
import UserPostMasonryGrid from './UserPostMasonryGrid';
import { useDataContext } from '@/hooks/useDataContext';

const UserProfilePage = () => {
  const { userData } = useDataContext();

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
        <div className="ml-4 border-3 border-primary rounded-full">
          <img
            src={userData?.profilePic}
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
