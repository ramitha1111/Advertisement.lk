import React, { useState } from 'react'



//import React, { useState } from 'react';
import { Trash2, Eye } from 'lucide-react';

const Favourites = () => {
  // Sample data for favorite ads
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

  // Remove a favorite ad
  const handleRemove = (id) => {
    setFavourites((prev) => prev.filter((ad) => ad.id !== id));
  };
  const FavouriteCard=({ favourites }) => {
    return(
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Favourite Advertisements</h2>
          {Array.isArray(favourites)&&favourites.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favourites.map((ad) => (
                    <div key={ad.id} className="bg-gray-100 dark:bg-gray-700 rounded-lg shadow p-4">
                      <img
                          src={ad.image}
                          alt={ad.title}
                          className="w-full h-40 object-cover rounded-md mb-4"
                      />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{ad.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{ad.description}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <strong>Price:</strong> ${ad.price}
                      </p>
                      <div className="mt-4 flex justify-between">
                        <button
                            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                        >
                          <Eye size={16} className="inline-block mr-2" /> View
                        </button>
                        <button
                            onClick={() => handleRemove(ad.id)}
                            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                        >
                          <Trash2 size={16} className="inline-block mr-2" /> Remove
                        </button>
                      </div>
                    </div>
                ))}
              </div>
    ): (
              <p className="text-gray-600 dark:text-gray-400">You have no favorite advertisements.</p>
          )}
        </div>
    );
  }

  return (
    <FavouriteCard
        ad={favourites}
        onRemove={handleRemove}
    />
    );
  
      
      
      
      
};

export default Favourites;
  


