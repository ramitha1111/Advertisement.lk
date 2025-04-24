import React, {useCallback, useEffect, useState} from 'react';
import AdvertisementCard from "../../components/AdvertisementCard.jsx";
import {getAllFavourites} from "../../api/favouriteApi.js";
import useAdvertisement from "../../hooks/useAdvertisement.js";
import useAuth from "../../hooks/useAuth.js";
import {useSelector} from "react-redux";



const Favourites = () => {
  const {user,token}=useAuth();
  const{fetchAdvertisement}=useAdvertisement();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const dispatch = useSelector(state => state.advertisement);
  const fetchAdvertisementsFavoriteData =useCallback (async (user,token) => {
    setIsLoading(true);
    try {
      if (token) {
        const data = await getAllFavourites(token,user.id);
        setData(data || []);
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
      fetchAdvertisementsFavoriteData(user,token);
    }

  }, [user, token, fetchAdvertisementsFavoriteData]);


  const handleRemove = (id) => {
   setData((prev) => prev.filter((ad) => ad.id !== id));
  };

  const handleView = (ad) => {
    console.log('Viewing ad:', ad);
    // Navigate or show modal, etc.
  };

  return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Favourite Advertisements</h2>
        {data.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.map((ad) => (
                  <AdvertisementCard key={ad.id} ad={ad} onRemove={handleRemove} onView={handleView} />
              ))}
            </div>
        ) : (
            <p className="text-gray-600 dark:text-gray-400">You have no favorite advertisements.</p>
        )}
      </div>
  );
};

export default Favourites;
