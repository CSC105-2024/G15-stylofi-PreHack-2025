import MasonryGrid from '@/components/MasonryGrid';
import SearchInput from '@/components/SearchInput';
import { useNavigate } from 'react-router-dom';
import { useDataContext } from '@/hooks/useDataContext';
import { Loader2, User, Settings } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const DashboardPage = () => {
  const { userData } = useDataContext();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
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
            className="w-8 h-8 lg:w-12 lg:h-12 rounded-full cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          />
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
              <button
                onClick={() => {
                  navigate('/profile');
                  setIsMenuOpen(false);
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <User className="w-4 h-4 mr-2" />
                View Profile
              </button>
              <button
                onClick={() => {
                  navigate('/profile/edit');
                  setIsMenuOpen(false);
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
      <MasonryGrid />
    </>
  );
};

export default DashboardPage;
