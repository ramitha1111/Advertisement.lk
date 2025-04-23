import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Lock, Shield, Upload, Camera, Trash2 } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { getUserById, updateUser, deleteUser } from '../../api/userApi';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useDispatch } from 'react-redux';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import { logout } from '../../store/authSlice'


const Settings = () => {
  const { token } = useAuth();
  const [activeSection, setActiveSection] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem('userId');
  const dispatch = useDispatch();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Form state for profile details
  const [profile, setProfile] = useState({});

  const [profileImagePreview, setProfileImagePreview] = useState();
  const [coverImagePreview, setCoverImagePreview] = useState();
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [coverImageFile, setCoverImageFile] = useState(null);

  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      console.log('userId ' + userId)
      const response = await getUserById(userId, token);
      const userDetails = response.data;
      console.log('data' + userDetails)

      setProfile({
        firstName: userDetails.firstName || '',
        lastName: userDetails.lastName || '',
        email: userDetails.email || '',
        phone: userDetails.phone || '',
        location: userDetails.location || '',
        profileImage: userDetails.profileImage || '',
        coverImage: userDetails.coverImage || ''
      });

      setProfileImagePreview(userDetails.profileImage || '');
      setCoverImagePreview(userDetails.coverImage || '');
      setLoading(false);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to fetch user data');
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (value) => {
    setProfile(prev => ({ ...prev, phone: value }));
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImageFile(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImageFile(file);
      setCoverImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();

      // Add text fields
      formData.append('firstName', profile.firstName);
      formData.append('lastName', profile.lastName);
      formData.append('phone', profile.phone);
      formData.append('location', profile.location);

      // Add image files if they exist
      if (profileImageFile) {
        formData.append('profileImage', profileImageFile);
      }

      if (coverImageFile) {
        formData.append('coverImage', coverImageFile);
      }

      await updateUser(userId, formData, token);
      setLoading(false);
      alert('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      setLoading(false);
    }
  };

  const handleDeleteAccount = async (userId) => {
    try {
      setLoading(true);
      const deleteResponse = await deleteUser(userId, token);
      if (deleteResponse.status === 200) {
        alert('Account deleted successfully!');
        dispatch(logout());
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete account');
      setLoading(false);
    }
  };

  const handleDelete = () => {
    setShowConfirmDialog(true);
  };

  const confirmDelete = () => {
    handleDeleteAccount(userId);
    setShowConfirmDialog(false);
  };

  const cancelDelete = () => {
    setShowConfirmDialog(false);
  };

  const navigateToChangePassword = () => {
    window.location.href = '/forgot-password';
  };

  const navigateToChangeEmail = () => {
    window.location.href = '/change-email';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="md:flex">
        {/* Settings navigation */}
        <div className="md:w-64 border-r border-gray-200 dark:border-gray-700">
          <nav className="p-4 space-y-1">
            <button
              onClick={() => setActiveSection('profile')}
              className={`w-full flex items-center px-4 py-3 text-sm rounded-md ${activeSection === 'profile'
                ? 'bg-primary/10 text-primary'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
            >
              <User size={18} className="mr-3" />
              Profile Information
            </button>

            <button
              onClick={() => setActiveSection('security')}
              className={`w-full flex items-center px-4 py-3 text-sm rounded-md ${activeSection === 'security'
                ? 'bg-primary/10 text-primary'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
            >
              <Lock size={18} className="mr-3" />
              Security
            </button>

            <button
              onClick={() => setActiveSection('privacy')}
              className={`w-full flex items-center px-4 py-3 text-sm rounded-md ${activeSection === 'privacy'
                ? 'bg-primary/10 text-primary'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
            >
              <Shield size={18} className="mr-3" />
              Privacy
            </button>
          </nav>
        </div>

        {/* Profile Section */}
        <div className="p-6 flex-1">
          {activeSection === 'profile' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Profile Information</h2>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {/* Cover Image */}
                  <div className="relative h-40 bg-gray-100 dark:bg-gray-700 rounded-lg mb-8">
                    {coverImagePreview && (
                      <img
                        src={coverImagePreview}
                        alt="Cover"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    )}
                    <label
                      htmlFor="coverImage"
                      className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 p-2 rounded-full shadow cursor-pointer"
                    >
                      <Camera size={20} className="text-gray-700 dark:text-gray-300" />
                    </label>
                    <input
                      type="file"
                      id="coverImage"
                      name="coverImage"
                      onChange={handleCoverImageChange}
                      className="hidden"
                      accept="image/*"
                    />
                  </div>

                  {/* Profile Image */}
                  <div className="flex justify-center -mt-16 mb-4">
                    <div className="relative">
                      <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700">
                        {profileImagePreview ? (
                          <img
                            src={profileImagePreview}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-300 dark:bg-gray-600">
                            <User size={36} className="text-gray-500 dark:text-gray-400" />
                          </div>
                        )}
                      </div>
                      <label
                        htmlFor="profileImage"
                        className="absolute bottom-0 right-0 bg-white dark:bg-gray-800 p-1 rounded-full shadow cursor-pointer"
                      >
                        <Camera size={16} className="text-gray-700 dark:text-gray-300" />
                      </label>
                      <input
                        type="file"
                        id="profileImage"
                        name="profileImage"
                        onChange={handleProfileImageChange}
                        className="hidden"
                        accept="image/*"
                      />
                    </div>
                  </div>

                  {/* Name Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={profile.firstName}
                        onChange={handleProfileChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={profile.lastName}
                        onChange={handleProfileChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Email - Read Only */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={profile.email}
                      readOnly
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-50 dark:bg-gray-600 dark:text-gray-300"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      To change your email, use the Security tab
                    </p>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone Number *
                    </label>
                    <PhoneInput
                      country={'lk'}
                      value={profile.phone}
                      onChange={handlePhoneChange}
                      inputProps={{
                        name: 'phone',
                        required: true,
                        className: 'w-full px-4 py-2 pl-12 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white',
                      }}
                      containerClass="phone-input"
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={profile.location}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-md disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Security Section */}
          {activeSection === 'security' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Security Settings</h2>

              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Change Password</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Update your password regularly to keep your account secure.
                  </p>
                  <button
                    onClick={navigateToChangePassword}
                    className="px-6 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-white rounded-md"
                  >
                    Change Password
                  </button>
                </div>

                {/* <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Update Email Address</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Change your email address. You'll need to verify your new email.
                  </p>
                  <button
                    onClick={navigateToChangeEmail}
                    className="px-6 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-white rounded-md"
                  >
                    Change Email
                  </button>
                </div> */}
              </div>
            </div>
          )}

          {/* Privacy Section */}
          {activeSection === 'privacy' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Privacy Settings</h2>

              <div className="bg-red-50 dark:bg-gray-700 border border-red-200 dark:border-red-800 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-red-800 dark:text-red-400 mb-3">Delete Account</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center disabled:opacity-50"
                >
                  <Trash2 size={18} className="mr-2" />
                  {loading ? 'Processing...' : 'Delete My Account'}
                </button>
              </div>
            </div>
          )}

          {/* Confirmation Dialog */}
          {showConfirmDialog && (
            <ConfirmationDialog
              isOpen={showConfirmDialog}
              title="Delete Account"
              message={`Are you sure you want to delete your account? This action cannot be undone.`}
              confirmLabel="Delete"
              cancelLabel="Cancel"
              onConfirm={confirmDelete}
              onCancel={cancelDelete}
              confirmButtonClass="bg-red-600 hover:bg-red-700"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;