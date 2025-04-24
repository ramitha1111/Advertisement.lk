'use client';

import { useCallback, useEffect, useState } from 'react';
import AdvertisementCard from './AdvertisementCardNew.jsx';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import { deleteAdvertisement, getAdvertisementsByUser } from '../../api/advertisementApi.js';

import { useDispatch } from "react-redux";
import useAdvertisement from "../../hooks/useAdvertisement.js";
import ConfirmationDialog from '../../components/ConfirmationDialog.jsx';

const MyAdvertisements = () => {
    const navigate = useNavigate();
    const { user, token } = useAuth();
    const { fetchAdvertisement, clearAdvertisements } = useAdvertisement();
    const [isLoading, setIsLoading] = useState(true);
    const [advertisementData, setAdvertisementData] = useState([]);
    const dispatch = useDispatch();
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [error, setError] = useState('');

    // Redirect to login if user is not authenticated
    useEffect(() => {
        if (!user || !token) {
            navigate('/login');
        }
    }, [user, token, navigate]);
    
    const confirmDelete = async () => {
        try {
            if (!selectedItemId) return;
            
            await deleteAdvertisement(selectedItemId, token);
            // Refresh the advertisements list after deletion
            fetchAdvertisementsData(user, token);
            setError('');
        } catch (error) {
            console.error('Error deleting ad:', error);
            setError('Failed to delete ad. Please try again.');
        } finally {
            setShowConfirmDialog(false);
            setSelectedItemId(null);
        }
    };
    
    const cancelDelete = () => {
        setShowConfirmDialog(false);
        setSelectedItemId(null);
    };

    // Fetch advertisements created by the current user
    const fetchAdvertisementsData = useCallback(async (user, token) => {
        setIsLoading(true);
        try {
            if (token) {
                const data = await getAdvertisementsByUser(user.id, token);
                setAdvertisementData(data || []);
                console.log('Fetched advertisements:', data);
                dispatch(fetchAdvertisement({ advertisementData: data || [] }));
            }
        } catch (error) {
            console.error('Error fetching advertisements:', error);
        } finally {
            setIsLoading(false);
        }
    }, [dispatch]);
    
    useEffect(() => {
        if (user?.id && token) {
            fetchAdvertisementsData(user, token);
        }
    }, [user, token, fetchAdvertisementsData]);

    const handleEdit = (item) => {
        navigate('../../user/update-advertisement/' + item._id);
    };

    const handleDelete = (item) => {
        setSelectedItemId(item._id);
        setShowConfirmDialog(true);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="loader">Loading...</div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h1 className="text-xl font-bold mb-6">My Advertisements</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <p>{error}</p>
                </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                {advertisementData && advertisementData.length > 0 ? (
                    advertisementData.map((item) => {
                        const ad = item?._doc || item; // fallback if not using ._doc
                        return (
                            <AdvertisementCard
                                key={ad._id}
                                item={ad}
                                onEdit={() => handleEdit(ad)}
                                onDelete={() => handleDelete(ad)}
                            />
                        );
                    })
                ) : (
                    <div className="col-span-full text-center text-gray-500">
                        No advertisements found.
                    </div>
                )}
            </div>

            {/* Confirmation Dialog */}
            {showConfirmDialog && (
                <ConfirmationDialog
                    isOpen={showConfirmDialog}
                    title="Delete Advertisement"
                    message="Are you sure you want to delete this ad? This action cannot be undone."
                    confirmLabel="Delete"
                    cancelLabel="Cancel"
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                    confirmButtonClass="bg-red-600 hover:bg-red-700"
                />
            )}
        </div>
    );
};

export default MyAdvertisements;