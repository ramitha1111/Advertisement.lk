import React, { useState, useEffect } from 'react';
import { getUserById, deleteUser } from "../../api/userApi";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import defaultAvatar from "../../assets/blank-profile-picture.jpg";

const ViewUser = () => {
    const { id: userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const { token } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            try {
                const response = await getUserById(userId, token);
                setUser(response.data);
            } catch (err) {
                console.error("Failed to fetch user:", err);
                setError("Failed to load user data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchUserData();
        }
    }, [userId, token]);

    const handleUpdate = () => {
        navigate(`/admin/update-user/${userId}`);
    };

    const handleOrders = () => {
        navigate(`/admin/user-orders/${userId}`);
    };

    const handleDelete = async () => {
        if (!deleteConfirm) {
            setDeleteConfirm(true);
            return;
        }

        setDeleting(true);
        try {
            await deleteUser(userId, token);
            alert('User has been deleted successfully!');
            navigate('/admin/dashboard?section=users-admin');
        } catch (err) {
            console.error("Failed to delete user:", err);
            setError("Failed to delete user. Please try again later.");
            setDeleting(false);
            setDeleteConfirm(false);
        }
    };

    const cancelDelete = () => {
        setDeleteConfirm(false);
    };

    if (loading) {
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

    if (error) {
        return (
            <div className="bg-white dark:bg-gray-900 py-12 md:py-16 lg:py-20">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        <p>{error}</p>
                    </div>
                    <button
                        onClick={() => navigate('/users')}
                        className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                    >
                        Back to Users
                    </button>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="bg-white dark:bg-gray-900 py-12 md:py-16 lg:py-20">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <p className="text-gray-700 dark:text-gray-300">User not found.</p>
                    <button
                        onClick={() => navigate('/users')}
                        className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                    >
                        Back to Users
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-900 py-12 md:py-16 lg:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-6 border-b pb-3">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">User Profile</h2>
                </div>

                {/* Profile header with avatar */}
                <div className="mb-8 flex flex-col items-center sm:flex-row sm:items-start">
                    <div className="mb-4 sm:mb-0 sm:mr-6">
                        <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-white dark:border-gray-800 shadow-md">
                            <img
                                src={user.profileImage || defaultAvatar}
                                alt={`${user.firstName} ${user.lastName}`}
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </div>
                    <div className="text-center sm:text-left">
                        <h1 className="text-2xl mt-2 font-bold text-gray-900 dark:text-white">
                            {user.firstName} {user.lastName}
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400">@{user.username}</p>
                        <div className="mt-2 inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full text-sm font-medium">
                            {user.role === 'admin' ? 'Administrator' : 'User'}
                        </div>
                    </div>
                </div>

                {/* User details */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">User Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</h4>
                            <p className="mt-1 text-md text-gray-900 dark:text-white">
                                {user.firstName} {user.lastName}
                            </p>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Username</h4>
                            <p className="mt-1 text-md text-gray-900 dark:text-white">
                                {user.username}
                            </p>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</h4>
                            <p className="mt-1 text-md text-gray-900 dark:text-white">
                                {user.email}
                            </p>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</h4>
                            <p className="mt-1 text-md text-gray-900 dark:text-white">
                                {user.phone || 'Not provided'}
                            </p>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Role</h4>
                            <p className="mt-1 text-md text-gray-900 dark:text-white">
                                {user.role === 'admin' ? 'Administrator' : 'User'}
                            </p>
                        </div>

                        {/* <div>
                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Member Since</h4>
                            <p className="mt-1 text-md text-gray-900 dark:text-white">
                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                            </p>
                        </div> */}
                    </div>
                </div>

                {/* Action buttons at bottom */}
                <div className="mt-8 flex justify-between">
                    <button
                        onClick={() => navigate('/admin/dashboard?section=users-admin')}
                        className="px-6 py-3 rounded-md text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 font-medium"
                    >
                        Back to Users
                    </button>

                    <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
                        <button
                            onClick={handleOrders}
                            className="px-6 py-3 rounded-md text-white font-medium bg-primary hover:bg-primary/90"
                        >
                            View Orders
                        </button>
                        <button
                            onClick={handleUpdate}
                            className="px-6 py-3 rounded-md text-white font-medium bg-primary hover:bg-primary/90"
                        >
                            Update User
                        </button>

                        {deleteConfirm ? (
                            <div className="flex space-x-2">
                                <button
                                    onClick={cancelDelete}
                                    className="px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                                    disabled={deleting}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                    disabled={deleting}
                                >
                                    {deleting ? 'Deleting...' : 'Confirm'}
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setDeleteConfirm(true)}
                                className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                                Delete
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ViewUser;