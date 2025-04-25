import React, {useCallback, useEffect, useState} from 'react';
import AdvertisementCard from "../../components/AdvertisementCard.jsx";
import {getAllFavourites} from "../../api/favouriteApi.js";
import useAdvertisement from "../../hooks/useAdvertisement.js";
import useAuth from "../../hooks/useAuth.js";
import {getAdvertisementById} from "../../api/advertisementApi.js";



const Favourites = () => {
  const {user,token}=useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [advertisementdata, setAdvertisementData] = useState([]);
  const fetchAdvertisementsFavoriteData =useCallback (async (user,token) => {
    setIsLoading(true);
    try {
      if (token && user?.id) {
        const data = await getAllFavourites(token,user.id);
        const favouritesData = data.data[0]?.advertisementId || [];
        console.log('Fetched advertisements:', data.data[0].advertisementId);
        const result = await Promise.all(
            favouritesData.map(async (value) => {
                const genData = await getAdvertisementById(value);
                return genData;
            })
            );
            setAdvertisementData(result);
      }
    } catch (error) {
      console.error('Error fetching advertisements:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, token]);
  useEffect(() => {

      fetchAdvertisementsFavoriteData(user,token)




  }, [fetchAdvertisementsFavoriteData]);
  useEffect(() => {
    console.log('Fetched advertisement data:', advertisementdata);
  }, [advertisementdata]);


  const handleRemove = (id) => {
   setAdvertisementData((prev) => prev.filter((ad) => ad.id !== id));
  };

  const handleView = (ad) => {
    console.log('Viewing ad:', ad);
    // Navigate or show modal, etc.
  };

  return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Favourite Advertisements</h2>

        {isLoading? (
            <p className="text-gray-600 dark:text-gray-400">Loading....</p>
        ) : advertisementdata.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {advertisementdata.map((advertisement) => (
                  <AdvertisementCard key={advertisement.id} ad={advertisement} onRemove={handleRemove} onView={handleView} />
              ))}
            </div>
        ) : (
            <p className="text-gray-600 dark:text-gray-400">You have no favorite advertisements.</p>
        )}
      </div>
  );
};

export default Favourites;
