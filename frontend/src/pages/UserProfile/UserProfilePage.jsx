import SearchInput from '@/components/SearchInput';
import UserPostMasonryGrid from './UserPostMasonryGrid';
import { useDataContext } from '@/hooks/useDataContext';
import { Loader2, Settings } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserProfilePage = () => {
  const { userData } = useDataContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        <div className="relative ml-4" ref={menuRef}>
          <img
            src={userData?.profilePic}
            alt="Profile"
            className="w-8 h-8 lg:w-16 lg:h-16 rounded-full cursor-pointer"
            onClick={() => setMenuOpen((open) => !open)}
          />
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate('/profile/edit');
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Settings className="w-4 h-4 mr-2" />
                Edit Profile
              </button>
            </div>
          )}
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
