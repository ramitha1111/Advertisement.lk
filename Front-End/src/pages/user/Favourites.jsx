import React, { useState } from 'react';
import { Trash2, Eye } from 'lucide-react';

const AdCard = ({ ad, onView, onRemove }) => {
  return (
      <div className="bg-gray-100 dark:bg-gray-700 rounded-lg shadow p-4 flex flex-col justify-between">
        <img
            src={ad.image || 'https://via.placeholder.com/150'}
            alt={ad.title}
            className="w-full h-40 object-cover rounded-md mb-4"
        />
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{ad.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{ad.description}</p>
          <p className="text-sm text-gray-800 dark:text-gray-300 font-medium">Price: ${ad.price}</p>
        </div>
        <div className="mt-4 flex justify-between">
          <button
              onClick={() => onView(ad)}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            <Eye size={16} className="inline-block mr-2" /> View
          </button>
          <button
              onClick={() => onRemove(ad.id)}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            <Trash2 size={16} className="inline-block mr-2" /> Remove
          </button>
        </div>
      </div>
  );
};

const Favourites = () => {
  const [favourites, setFavourites] = useState([
    {
      id: 1,
      title: 'Modern Apartment in City Center',
      description: 'A beautiful apartment located in the heart of the city.',
      price: 1200,
      image: 'https://via.placeholder.com/150',
    },
    {
      id: 2,
      title: 'Cozy Cottage in the Countryside',
      description: 'A peaceful retreat away from the hustle and bustle.',
      price: 800,
      image: 'https://via.placeholder.com/150',
    },
  ]);

  const handleRemove = (id) => {
    setFavourites((prev) => prev.filter((ad) => ad.id !== id));
  };

  const handleView = (ad) => {
    console.log('Viewing ad:', ad);
    // Navigate or show modal, etc.
  };

  return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Favourite Advertisements</h2>
        {favourites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favourites.map((ad) => (
                  <AdCard key={ad.id} ad={ad} onRemove={handleRemove} onView={handleView} />
              ))}
            </div>
        ) : (
            <p className="text-gray-600 dark:text-gray-400">You have no favorite advertisements.</p>
        )}
      </div>
  );
};

export default Favourites;
