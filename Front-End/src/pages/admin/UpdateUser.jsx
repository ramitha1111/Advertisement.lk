import React, { useState, useEffect } from 'react';
import { getUserById, updateUser } from "../../api/userApi.js";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

const UpdateUser = () => {
    const { id: userId } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        username: '',
        role: 'user',
        phone: '',
        profileImage: null,
        coverImage: null
    });

    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingUser, setLoadingUser] = useState(true);
    const [profileImagePreview, setProfileImagePreview] = useState(null);
    const [coverImagePreview, setCoverImagePreview] = useState(null);
    const [error, setError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [changePassword, setChangePassword] = useState(false);

    const { token } = useSelector((state) => state.auth);

    // Fetch user data on component mount
    useEffect(() => {
        const fetchUserData = async () => {
            setLoadingUser(true);
            try {
                console.log(userId, token)
                const response = await getUserById(userId, token);
                const userData = response.data;
                setCurrentUser(userData);
                setUser({
                    firstName: userData.firstName || '',
                    lastName: userData.lastName || '',
                    email: userData.email || '',
                    username: userData.username || '',
                    role: userData.role || 'user',
                    phone: userData.phone || '',
                    password: '',
                    confirmPassword: '',
                    profileImage: userData.profileImage || null,
                    coverImage: userData.coverImage || null
                });

                // Set image previews if available
                if (userData.profileImageUrl) {
                    setProfileImagePreview(userData.profileImageUrl);
                }

                if (userData.coverImageUrl) {
                    setCoverImagePreview(userData.coverImageUrl);
                }

            } catch (err) {
                console.error("Failed to fetch user:", err);
                setError("Failed to load user data. Please try again later.");
            } finally {
                setLoadingUser(false);
            }
        };

        if (userId) {
            fetchUserData();
        }
    }, [userId, token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prev => ({ ...prev, [name]: value }));

        // If changing password or confirm password, validate passwords match
        if ((name === 'password' || name === 'confirmPassword') && changePassword) {
            const password = name === 'password' ? value : user.password;
            const confirmPassword = name === 'confirmPassword' ? value : user.confirmPassword;

            if (password && confirmPassword && password !== confirmPassword) {
                setPasswordError('Passwords do not match');
            } else {
                setPasswordError('');
            }
        }
    };

    const handlePhoneChange = (value) => {
        setUser(prev => ({ ...prev, phone: value }));
    };

    const handleProfileImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check if the file is an image
            if (!file.type.startsWith('image/')) {
                setError('Profile image must be an image file (JPEG, PNG, etc.)');
                return;
            }

            setUser(prev => ({ ...prev, profileImage: file }));
            setProfileImagePreview(URL.createObjectURL(file));
        }
    };

    const handleCoverImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check if the file is an image
            if (!file.type.startsWith('image/')) {
                setError('Cover image must be an image file (JPEG, PNG, etc.)');
                return;
            }

            setUser(prev => ({ ...prev, coverImage: file }));
            setCoverImagePreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveProfileImage = () => {
        if (profileImagePreview && !currentUser?.profileImageUrl) {
            URL.revokeObjectURL(profileImagePreview);
        }
        setUser(prev => ({ ...prev, profileImage: null }));
        setProfileImagePreview(null);
    };

    const handleRemoveCoverImage = () => {
        if (coverImagePreview && !currentUser?.coverImageUrl) {
            URL.revokeObjectURL(coverImagePreview);
        }
        setUser(prev => ({ ...prev, coverImage: null }));
        setCoverImagePreview(null);
    };

    const handlePasswordCheckbox = (e) => {
        setChangePassword(e.target.checked);
        if (!e.target.checked) {
            setUser(prev => ({
                ...prev,
                password: '',
                confirmPassword: ''
            }));
            setPasswordError('');
        }
    };

    const validateForm = () => {
        // Check required fields
        if (!user.firstName || !user.lastName || !user.email || !user.username || !user.role) {
            setError('Please fill in all required fields');
            return false;
        }

        // Check email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(user.email)) {
            setError('Please enter a valid email address');
            return false;
        }

        // Check password fields if changing password
        if (changePassword) {
            if (!user.password || !user.confirmPassword) {
                setError('Please enter both password fields');
                return false;
            }

            // Check passwords match
            if (user.password !== user.confirmPassword) {
                setPasswordError('Passwords do not match');
                setError('Passwords do not match');
                return false;
            }

            // Check password strength (at least 8 characters with letters and numbers)
            const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
            if (!passwordRegex.test(user.password)) {
                setError('Password must be at least 8 characters and contain both letters and numbers');
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError('');

        const formData = new FormData();

        // Add text fields
        formData.append('firstName', user.firstName);
        formData.append('lastName', user.lastName);
        formData.append('email', user.email);
        formData.append('username', user.username);
        formData.append('role', user.role);

        // Add password if changing
        if (changePassword && user.password) {
            formData.append('password', user.password);
        }

        // Add optional fields if provided
        if (user.phone) {
            formData.append('phone', user.phone);
        }

        // Add images if provided
        if (user.profileImage) {
            formData.append('profileImage', user.profileImage);
        }

        if (user.coverImage) {
            formData.append('coverImage', user.coverImage);
        }

        try {
            const response = await updateUser(userId, formData, token);
            console.log('User updated:', response);
            alert('User has been updated successfully!');

            // Navigate back or refresh data
            navigate('/admin/dashboard?section=users-admin');

        } catch (error) {
            console.error('Error updating user:', error);
            setError(error.response?.data?.message || 'Failed to update user. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loadingUser) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center">
                    <svg className="animate-spin h-12 w-12 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="mt-3 text-gray-700 dark:text-gray-300">Loading user data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-900 py-12 md:py-16 lg:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 border-b pb-3">Update User</h2>

                {error && (
                    <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* First Name and Last Name */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                First Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={user.firstName}
                                onChange={handleChange}
                                placeholder="Enter first name"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Last Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={user.lastName}
                                onChange={handleChange}
                                placeholder="Enter last name"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                                required
                            />
                        </div>
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
                            placeholder="Choose a username"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={user.email}
                            onChange={handleChange}
                            placeholder="example@domain.com"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                            required
                        />
                    </div>

                    {/* Change Password Checkbox */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="changePassword"
                            checked={changePassword}
                            onChange={handlePasswordCheckbox}
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                        <label htmlFor="changePassword" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                            Change Password
                        </label>
                    </div>

                    {/* Password and Confirm Password (only if change password is checked) */}
                    {changePassword && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    New Password <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={user.password}
                                    onChange={handleChange}
                                    placeholder="Enter new password"
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                                    required={changePassword}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Password must be at least 8 characters and contain both letters and numbers
                                </p>
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Confirm New Password <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={user.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm new password"
                                    className={`w-full px-4 py-2 border ${passwordError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white`}
                                    required={changePassword}
                                />
                                {passwordError && (
                                    <p className="text-xs text-red-500 mt-1">{passwordError}</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Role */}
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

                    {/* Phone Number with Flag Selection */}
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Phone Number <span className="text-gray-500 text-xs">(optional)</span>
                        </label>
                        <PhoneInput
                            country={'us'}
                            value={user.phone}
                            onChange={handlePhoneChange}
                            inputProps={{
                                id: 'phone',
                                name: 'phone',
                                className: 'w-full px-4 py-2 pl-12 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white'
                            }}
                            containerClass="w-full"
                            buttonClass="dark:bg-gray-700"
                            dropdownClass="dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    {/* Profile Image */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Profile Image <span className="text-gray-500 text-xs">(optional)</span>
                        </label>
                        <div className="flex items-center justify-center w-full">
                            {!profileImagePreview ? (
                                <label htmlFor="profileImage" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                        </svg>
                                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            PNG, JPG or GIF (MAX. 2MB)
                                        </p>
                                    </div>
                                    <input
                                        id="profileImage"
                                        name="profileImage"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleProfileImageChange}
                                    />
                                </label>
                            ) : (
                                <div className="relative">
                                    <img
                                        src={profileImagePreview}
                                        alt="Profile Preview"
                                        className="max-h-64 rounded-lg object-contain"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemoveProfileImage}
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

                    {/* Cover Image */}
                    {/* <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Cover Image <span className="text-gray-500 text-xs">(optional)</span>
                    </label>
                    <div className="flex items-center justify-center w-full">
                        {!coverImagePreview ? (
                            <label htmlFor="coverImage" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg className="w-8 h-8 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                    </svg>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Upload a cover image
                                    </p>
                                </div>
                                <input 
                                    id="coverImage" 
                                    name="coverImage" 
                                    type="file" 
                                    accept="image/*"
                                    className="hidden" 
                                    onChange={handleCoverImageChange} 
                                />
                            </label>
                        ) : (
                            <div className="relative w-full">
                                <img 
                                    src={coverImagePreview} 
                                    alt="Cover Preview" 
                                    className="h-32 w-full object-cover rounded-lg" 
                                />
                                <button
                                    type="button"
                                    onClick={handleRemoveCoverImage}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                </div> */}

                    {/* Submit and Cancel buttons */}
                    <div className="flex justify-end space-x-4 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate('/users')}
                            className="px-6 py-3 rounded-md text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 font-medium"
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