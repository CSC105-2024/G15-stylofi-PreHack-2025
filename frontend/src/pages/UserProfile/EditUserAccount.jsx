import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDataContext } from '@/hooks/useDataContext';
import FormField from '@/components/FormField';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { clearAuthData } from '@/services/auth';
import { useFetch } from '@/hooks/useFetch';

const EditUserAccount = () => {
  const { userData, setUserData } = useDataContext();
  const { fetchUserData } = useFetch();
  const [username, setUsername] = useState(userData?.username || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [profilePic, setProfilePic] = useState(userData?.profilePic || '');
  const [previewPic, setPreviewPic] = useState(userData?.profilePic || '');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();
  const navigate = useNavigate();

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
          <Input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Old Password"
            className="bg-input-background w-80 h-12 border-0 rounded-xl ring-primary selection:text-white"
          />
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password"
            className="bg-input-background w-80 h-12 border-0 rounded-xl ring-primary selection:text-white"
          />
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
