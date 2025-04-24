'use client';

import {useCallback, useEffect, useState} from 'react';
import AdvertisementCard from './MyAdvertisement.jsx';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import { getAdvertisementsByUser } from '../../api/advertisementApi.js';

import {useDispatch} from "react-redux";
import useAdvertisement from "../../hooks/useAdvertisement.js";
import EditAdvertisement from "./EditeAdvertisement.jsx";

const MyAdvertisements = () => {
    const navigate = useNavigate();
    const { user, token } = useAuth();
    const {fetchAdvertisement,clearAdvertisements} = useAdvertisement();
    const [isLoading, setIsLoading] = useState(true);
    const [advertisementData, setAdvertisementData] = useState([]);
    const dispatch = useDispatch();

    // Redirect to login if user is not authenticated
    useEffect(() => {
        if (!user || !token) {
            navigate('/login');
        }
    }, [user, token, navigate]);

    // Fetch advertisements created by the current user








        const fetchAdvertisementsData =useCallback (async (user,token) => {
            setIsLoading(true);
            try {
                if (token) {
                    const data = await getAdvertisementsByUser(user.id,token);
                    setAdvertisementData(data || []);
                    console.log('Fetched advertisements:', data);
                    dispatch(fetchAdvertisement( { advertisementData: data|| [] }));

                }
            } catch (error) {
                console.error('Error fetching advertisements:', error);
            } finally {
                setIsLoading(false);
            }
        }, [dispatch]);
    useEffect(() => {
        if (user?.id && token) {
            fetchAdvertisementsData(user,token);
        }

    }, [user, token, fetchAdvertisementsData]);

    const handleEdit = (item) => (
       navigate(<EditAdvertisement
           item={item}
       />)
    );

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
            {advertisementData?.length > 0 ? (
                advertisementData?.map((item) => (
                    <AdvertisementCard
                        Key={item?._doc._id}
                        item={item._doc}
                        onEdit={() => handleEdit(item?._doc)}
                        onDelete={() => handleDelete(item?._doc)}
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
