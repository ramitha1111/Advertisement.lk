'use client'

import React from 'react'
import { Map, MessageCircle } from 'lucide-react'

const AdvertisementCard = ({ ad, categories }) => {
  // Find category name from categories array using ad.categoryId
  const category = categories.find(category => category._id === ad.categoryId)
  const categoryName = category ? category.name : 'Uncategorized'

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden transition-all hover:shadow-lg">
      {/* Ad Image */}
      <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
        {ad.images && ad.images.length > 0 ? (
          <img 
            src={ad.images[0]} 
            alt={ad.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
            No image available
          </div>
        )}
      </div>
      
      {/* Ad Content */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300">
            {categoryName}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(ad.createdAt).toLocaleDateString()}
          </span>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          <a href={`/advertisements/${ad._id}`} className="hover:text-primary">
            {ad.title}
          </a>
        </h3>
        
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-2 line-clamp-2">
          {ad.description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="font-bold text-lg text-primary">
            Rs. {ad.price.toLocaleString()}
          </span>
          <div className="flex items-center text-gray-500 dark:text-gray-400">
            <Map className="h-4 w-4 mr-1" />
            <span className="text-sm">{ad.location}</span>
          </div>
        </div>
      </div>
      
      {/* Ad Footer */}
      <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3 bg-gray-50 dark:bg-gray-800 flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 mr-2">
            {ad.user && ad.user.avatar ? (
              <img 
                src={ad.user.avatar} 
                alt={ad.user.name} 
                className="w-full h-full rounded-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-xs font-medium">{ad.user && ad.user.name ? ad.user.name.charAt(0) : '?'}</span>
              </div>
            )}
          </div>
          <span>{ad.user ? ad.user.name : 'Anonymous'}</span>
        </div>

        <a
          href={`/advertisements?adversitementId=${ad._id}`}
          className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80"
        >
          <MessageCircle className="h-4 w-4 mr-1" />
          View Ad
        </a>
      </div>
    </div>
  )
}

export default AdvertisementCard