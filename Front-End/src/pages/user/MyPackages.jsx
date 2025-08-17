import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Package } from 'lucide-react';
import { getAdvertisementsByUser } from '../../api/advertisementApi.js';
import useAuth from '../../hooks/useAuth';
import { useEffect, useState } from 'react';

const MyPackages = () => {
    const [advertisements, setAdvertisements] = useState([])
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { token } = useAuth()
    const userId = localStorage.getItem('userId')

    // Fetch Advertisements from API
    useEffect(() => {
        const fetchAdvertisements = async () => {
            try {
                setLoading(true)
                console.log(userId)
                const data = await getAdvertisementsByUser(userId, token)
                const filteredAds = data.filter(ad => ad.packageId); // keep ads that have a packageId
                setAdvertisements(filteredAds);
                setLoading(false)
            } catch (err) {
                setError('Failed to load advertisements. Please try again later.')
                setLoading(false)
                console.error('Error fetching advertisements:', err)
            }
        }

        fetchAdvertisements()
    }, [])

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleBoostAgain = (ad) => {
        localStorage.setItem('packageId', ad.packageDetails.packageId)
        localStorage.setItem('packageName', ad.packageDetails.packageName)
        localStorage.setItem('price', ad.packageDetails.price)
        localStorage.setItem('advertisementId', ad._id)
        navigate(`/user/checkout`);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h1 className="text-xl font-bold mb-6">My Packages</h1>

            {advertisements && advertisements.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {advertisements.map((ad) => (
                        <div key={ad._id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold mb-4 truncate">{ad.title}</h2>

                            <div className="flex items-center text-gray-600 dark:text-gray-300 mb-3">
                                <Calendar size={18} className="mr-2" />
                                <span>Expires: {formatDate(ad.boostedUntil)}</span>
                            </div>

                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                                <div className="flex items-start mb-3">
                                    <Package size={18} className="mr-2 mt-1 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-medium">{ad.packageDetails?.packageName || 'Standard Package'}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {ad.packageDetails?.duration || 0} days - LKR{ad.packageDetails?.price || 0}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => handleBoostAgain(ad)}
                                className="w-full mt-4 bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-md transition-colors"
                            >
                                Boost Again
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400 text-lg">You don't have any active packages.</p>
                </div>
            )}
        </div>
    );
};

export default MyPackages;