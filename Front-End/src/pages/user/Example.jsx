'use client';

import { useEffect, useState } from 'react';
import AdvertisementCard from './MyAdvertisement.jsx';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import { getAdvertisementsByUserId } from '../../api/advertisementApi.js';
import { useDispatch } from 'react-redux';
import useAdvertisement from '../../hooks/useAdvertisement.js';

const MyAdvertisements = () => {
    const navigate = useNavigate();
    const { user, token } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [advertisementData, setAdvertisementData] = useState([]);
    const { fetchAdvertisement, clearAdvertisement } = useAdvertisement();
    const dispatch = useDispatch();

    // 检查用户是否已登录
    useEffect(() => {
        if (!user || !token) {
            navigate('/login'); // 如果未登录，重定向到登录页面
        }
    }, [user, token, navigate]);

    // 加载广告数据
    useEffect(() => {
        const fetchAdvertisementsData = async () => {
            setIsLoading(true);
            try {
                if (user?.id && token) {
                    const data = await getAdvertisementsByUserId(token);
                    setAdvertisementData(data.data);
                    dispatch(fetchAdvertisement({ advertisementData: data.data }));
                }
            } catch (error) {
                console.error('Error fetching advertisements:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (user?.id && token) {
            fetchAdvertisementsData();
        }
    }, [user?.id, token, dispatch, fetchAdvertisement]);

    // 编辑广告
    const handleEdit = (id) => {
        navigate(`/edit_advertisement/${id}`);
    };

    // 删除广告
    const handleDelete = (id) => {
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {advertisementData.map((ad) => (
                <AdvertisementCard
                    key={ad.id}
                    ad={ad}
                    onEdit={() => handleEdit(ad.id)}
                    onDelete={() => handleDelete(ad.id)}
                />
            ))}
        </div>
    );
};

export default MyAdvertisements;