import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDataContext } from '@/hooks/useDataContext';
import FormField from '@/components/FormField';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { clearAuthData } from '@/services/auth';
import { useFetch } from '@/hooks/useFetch';
import { Loader2, Eye, EyeOff } from 'lucide-react';

const EditUserAccount = () => {
  const { userData, setUserData, reloadUserData } = useDataContext();
  const { fetchUserData } = useFetch();
  const [username, setUsername] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [previewPic, setPreviewPic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!userData);
  const fileInputRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    if (userData) {
      setUsername(userData.username || '');
      setProfilePic(userData.profilePic);
      setPreviewPic(userData.profilePic);
      setInitialLoading(false);
    } else {
      const loadUserData = async () => {
        try {
          await reloadUserData();
        } catch (error) {
          console.error('Failed to load user data:', error);
          toast.error('Failed to load profile data');
          navigate('/profile');
        } finally {
          setInitialLoading(false);
        }
      };

      loadUserData();
    }
  }, [userData, reloadUserData, navigate]);

  const handlePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setPreviewPic(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      if (username) {
        formData.append('username', username);
      }

      if (oldPassword && newPassword) {
        formData.append('oldPassword', oldPassword);
        formData.append('newPassword', newPassword);
      }

      if (profilePic instanceof File) {
        formData.append('profilePic', profilePic);
      }

      const res = await api.put('/auth/update', formData);

      if (res.data.success) {
        const updated = await fetchUserData();
        setUserData(updated.data);
        toast.success('Profile updated!');

        if (oldPassword && newPassword) {
          await clearAuthData();
          toast.success('Please login with your new password');
          navigate('/signin');
        } else {
          setTimeout(() => {
            navigate('/profile');
          }, 100);
        }
      } else {
        toast.error(res.data.msg || 'Update failed');
      }
    } catch (err) {
      console.error('Update error:', err);
      toast.error(err.response?.data?.msg || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-white items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="mt-2 text-gray-500">Loading profile data...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <h2 className="text-2xl font-bold mt-8 ml-12">Edit Profile</h2>
      <div className="flex flex-1 items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-xl p-10 flex flex-col items-center gap-6 w-[400px] mt-8 mb-8"
        >
          <div className="flex flex-col items-center">
            <img
              src={previewPic || '/default-avatar.png'}
              alt="Profile Preview"
              className="w-36 h-36 rounded-full object-cover mb-2 border-2 border-gray-200"
              onClick={() => fileInputRef.current.click()}
              style={{ cursor: 'pointer' }}
            />
            <Input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handlePicChange}
              className="hidden"
            />
            <span className="text-xs text-gray-500">Click image to change</span>
          </div>
          <FormField
            id="username"
            label={null}
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
          <div className="relative w-80">
            <Input
              type={showOldPassword ? 'text' : 'password'}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Old Password"
              className="bg-input-background w-full h-12 border-0 rounded-xl ring-primary selection:text-white pr-10"
            />
            <button
              type="button"
              onClick={() => setShowOldPassword(!showOldPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div className="relative w-80">
            <Input
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              className="bg-input-background w-full h-12 border-0 rounded-xl ring-primary selection:text-white pr-10"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div className="flex gap-4 mt-2 w-full justify-center">
            <Button
              type="button"
              variant="secondary"
              className="w-36 bg-gray-400 text-white hover:bg-gray-500"
              onClick={() => navigate('/profile')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-36 bg-indigo-500 hover:bg-indigo-600 text-white"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserAccount;
