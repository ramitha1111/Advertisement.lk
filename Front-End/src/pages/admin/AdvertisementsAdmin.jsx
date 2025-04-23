import React, { useState, useEffect } from 'react';
import AdvertisementCard from '../../components/AdvertisementCard';
import { getAllAdvertisements } from '../../api/advertisementApi';

const AdvertisementsAdmin = () => {
  const [advertisements, setAdvertisements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const adsData = await getAllAdvertisements();
        setAdvertisements(adsData);
      } catch (err) {
        setError('Failed to load data. Please try again later.');
        console.error('Error fetching initial data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  return (
    <>
      {/* Advertisement grid */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Advertisement Management</h1>
      </div>
        {(() => {
          if (loading) {
            return <p className="text-center text-gray-500 dark:text-gray-400">Loading advertisements...</p>;
          }
          if (error) {
            return <p className="text-center text-red-500">{error}</p>;
          }
          if (advertisements.length === 0) {
            return (
              <div className="text-center py-12">
                <p className="text-lg text-gray-700 dark:text-gray-300">
                  No advertisements found. Try adjusting your search criteria.
                </p>
              </div>
            );
          }
          return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {advertisements.slice().reverse().map((ad) => (
                <AdvertisementCard key={ad._id} ad={ad} />
              ))}
            </div>
          );
        })()}
      </div>
    </>
  );
};

export default AdvertisementsAdmin;
