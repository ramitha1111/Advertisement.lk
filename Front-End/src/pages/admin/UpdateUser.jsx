import React, { useState, useEffect } from 'react';
import { updateUser, getUserById } from "../../api/userApi";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";

const UpdateUser = () => {
    const [user, setUser] = useState({
        firstname: '',
        lastname: '',
        username: '',
        email: '',
        role: 'user',
        phoneNumber: '',
        profileImage: null,
        coverImage: null
    });

    const [profileImagePreview, setProfileImagePreview] = useState(null);
    const [coverImagePreview, setCoverImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const userId = searchParams.get('id');

    const { token } = useSelector((state) => state.auth);

    // Fetch user details when component mounts
    useEffect(() => {
        const getUserDetails = async () => {
            try {
                setFetchLoading(true);
                const response = await getUserById(userId, token);
                const userData = response.data;
                
                setUser({
                    firstname: userData.firstname || '',
                    lastname: userData.lastname || '',
                    username: userData.username || '',
                    email: userData.email || '',
                    role: userData.role || 'user',
                    phoneNumber: userData.phoneNumber || '',
                    profileImage: null,
                    coverImage: null
                });
                
                // Set image previews if available
                if (userData.profileImage) {
                    setProfileImagePreview(userData.profileImage);
                }
                
                if (userData.coverImage) {
                    setCoverImagePreview(userData.coverImage);
                }
                
            } catch (err) {
                setError('Failed to fetch user details. Please try again.');
                console.error('Error fetching user details:', err);
            } finally {
                setFetchLoading(false);
            }
        };

        if (userId) {
            getUserDetails();
        }
    }, [userId, token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setError('');
        setUser(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e, imageType) => {
        const file = e.target.files[0];
        if (file) {
            // Check if the file is an image
            if (!file.type.startsWith('image/')) {
                setError('File must be an image (JPEG, PNG, etc.)');
                return;
            }

            if (file.size > 1024 * 1024) { // 1MB
                setError('Image size should not exceed 1MB');
                return;
            }

            if (imageType === 'profile') {
                setUser(prev => ({ ...prev, profileImage: file }));
                setProfileImagePreview(URL.createObjectURL(file));
            } else if (imageType === 'cover') {
                setUser(prev => ({ ...prev, coverImage: file }));
                setCoverImagePreview(URL.createObjectURL(file));
            }
        }
    };

    const handleRemoveImage = (imageType) => {
        if (imageType === 'profile') {
            if (profileImagePreview && profileImagePreview.startsWith('blob:')) {
                URL.revokeObjectURL(profileImagePreview);
            }
            setUser(prev => ({ ...prev, profileImage: null }));
            setProfileImagePreview(null);
        } else if (imageType === 'cover') {
            if (coverImagePreview && coverImagePreview.startsWith('blob:')) {
                URL.revokeObjectURL(coverImagePreview);
            }
            setUser(prev => ({ ...prev, coverImage: null }));
            setCoverImagePreview(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        if (!user.firstname || !user.lastname || !user.username) {
            setError('Please fill in all required fields');
            return;
        }

        // Validate phone number format (optional)
        if (user.phoneNumber && !/^\d{10}$/.test(user.phoneNumber)) {
            setError('Phone number should be 10 digits');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        const formData = new FormData();

        // Add text fields
        formData.append('firstname', user.firstname);
        formData.append('lastname', user.lastname);
        formData.append('username', user.username);
        formData.append('role', user.role);
        if (user.phoneNumber) {
            formData.append('phoneNumber', user.phoneNumber);
        }

        // Add images if they exist
        if (user.profileImage) {
            formData.append('profileImage', user.profileImage);
        }
        
        if (user.coverImage) {
            formData.append('coverImage', user.coverImage);
        }

        try {
            await updateUser(userId, formData, token);
            setSuccess('User has been updated successfully!');
            
            // Navigate back to users list after success
            setTimeout(() => {
                navigate('/admin/dashboard?section=users');
            }, 2000);

        } catch (error) {
            console.error('Error updating user:', error);
            setError(error.response?.data?.message || 'Failed to update user. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (fetchLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-900 py-12 md:py-16 lg:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 border-b pb-3">Edit User</h2>

                {error && (
                    <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        <p>{error}</p>
                    </div>
                )}

                {success && (
                    <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                        <p>{success}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* First Name */}
                        <div>
                            <label htmlFor="firstname" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                First Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="firstname"
                                name="firstname"
                                value={user.firstname}
                                onChange={handleChange}
                                placeholder="Enter first name"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                                required
                            />
                        </div>

                        {/* Last Name */}
                        <div>
                            <label htmlFor="lastname" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Last Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="lastname"
                                name="lastname"
                                value={user.lastname}
                                onChange={handleChange}
                                placeholder="Enter last name"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                                required
                            />
                        </div>

                        {/* Username */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Username <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={user.username}
                                onChange={handleChange}
                                placeholder="Enter username"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                                required
                            />
                        </div>

                        {/* Email (read-only) */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={user.email}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-100 dark:bg-gray-600 dark:text-gray-300 cursor-not-allowed"
                                disabled
                            />
                        </div>

                        {/* Role Selection */}
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Role <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="role"
                                name="role"
                                value={user.role}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                                required
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Phone Number
                            </label>
                            <input
                                type="text"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={user.phoneNumber}
                                onChange={handleChange}
                                placeholder="Enter phone number (10 digits)"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Profile Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Profile Image
                        </label>
                        <div className="flex items-center justify-center w-full">
                            {!profileImagePreview ? (
                                <label htmlFor="profileImage" className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                        </svg>
                                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            PNG, JPG or SVG (MAX. 1MB)
                                        </p>
                                    </div>
                                    <input
                                        id="profileImage"
                                        name="profileImage"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleImageChange(e, 'profile')}
                                    />
                                </label>
                            ) : (
                                <div className="relative">
                                    <img
                                        src={profileImagePreview}
                                        alt="Profile Image Preview"
                                        className="max-h-40 rounded-lg object-contain"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage('profile')}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Cover Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Cover Image
                        </label>
                        <div className="flex items-center justify-center w-full">
                            {!coverImagePreview ? (
                                <label htmlFor="coverImage" className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                        </svg>
                                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            PNG, JPG or SVG (MAX. 1MB)
                                        </p>
                                    </div>
                                    <input
                                        id="coverImage"
                                        name="coverImage"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleImageChange(e, 'cover')}
                                    />
                                </label>
                            ) : (
                                <div className="relative">
                                    <img
                                        src={coverImagePreview}
                                        alt="Cover Image Preview"
                                        className="max-h-40 rounded-lg object-contain"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage('cover')}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Submit button */}
                    <div className="flex justify-end pt-4">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/dashboard?section=users')}
                            className="mr-4 px-6 py-3 rounded-md text-gray-700 dark:text-gray-300 font-medium border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-6 py-3 rounded-md text-white font-medium ${loading
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-primary hover:bg-primary/90"
                                }`}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Updating...
                                </>
                            ) : (
                                "Update User"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateUser;