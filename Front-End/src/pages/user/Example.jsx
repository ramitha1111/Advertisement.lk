'use client';

import { useEffect, useState } from 'react';
import AdvertisementCard from './MyAdvertisement.jsx';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import { getAdvertisementsByUser } from '../../api/advertisementApi.js';
import { useDispatch } from 'react-redux';
import useAdvertisement from '../../hooks/useAdvertisement.js';

const MyAdvertisements = () => {
    const navigate = useNavigate();
    const { user, token } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [advertisementData, setAdvertisementData] = useState([]);
    const { fetchAdvertisement } = useAdvertisement();
    const dispatch = useDispatch();

    // Redirect to login if user is not authenticated
    useEffect(() => {
        if (!user || !token) {
            navigate('/login');
        }
    }, [user, token, navigate]);

    // Fetch advertisements created by the current user
    useEffect(() => {
        const fetchAdvertisementsData = async () => {
            setIsLoading(true);
            try {
                if (token) {
                    const data = await getAdvertisementsByUser(token);
                    setAdvertisementData(data || []);
                    console.log('User ID:',data);
                    dispatch(fetchAdvertisement({ advertisementData: data || [] }));
                }
            } catch (error) {
                console.error('Error fetching advertisements:', error);
                alert('Failed to load advertisements. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        if (user?.id && token) {
            fetchAdvertisementsData();
        }

    }, [user?.id, token, dispatch, fetchAdvertisement]);

    const handleEdit = (id) => {
        navigate(`/edit_advertisement/${id}`);
    };

    const handleDelete = (id) => {
        // TODO: Replace alert with actual delete functionality
        alert(`Delete ad with ID: ${id}`);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="loader">Loading...</div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {advertisementData.length > 0 ? (
                advertisementData.map((ad) => (
                    <AdvertisementCard
                        key={ad.id}
                        ad={ad}
                        onEdit={() => handleEdit(ad.id)}
                        onDelete={() => handleDelete(ad.id)}
                    />
                ))
            ) : (
                <div className="col-span-full text-center text-gray-500">
                    No advertisements found.
                </div>
            )}
        </div>
    );
};

export default MyAdvertisements;
