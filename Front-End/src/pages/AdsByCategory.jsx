'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Loader } from 'lucide-react'
import { getAdvertisementsByCategory } from '../api/advertisementApi'
import { getCategoryById } from '../api/categoryApi'
import AdvertisementCard from '../components/AdvertisementCard'

const AdsByCategory = () => {
  const [advertisements, setAdvertisements] = useState([])
  const [category, setCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { id } = useParams() // Get the category ID from URL params

  // Load advertisements for the specified category when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch category details and category-specific advertisements in parallel
        const [categoryData, adsData] = await Promise.all([
          getCategoryById(id),
          getAdvertisementsByCategory(id)
        ])
        
        setCategory(categoryData)
        setAdvertisements(adsData)
      } catch (err) {
        console.error('Error fetching category data:', err)
        setError('Failed to load advertisements. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchData()
    }
  }, [id])

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Page header */}
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Loading category...</h1>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {category ? category.name : 'Category not found'}
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Browse all advertisements in this category
              </p>
            </>
          )}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center">
          <div className="flex items-center justify-center">
            <Loader className="h-8 w-8 text-primary animate-spin" />
            <span className="ml-2 text-gray-700 dark:text-gray-300">Loading advertisements...</span>
          </div>
        </div>
      )}

      {/* Advertisement grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!loading && advertisements.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-700 dark:text-gray-300">
              No advertisements found in this category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {advertisements.slice().reverse().map((ad) => (
              <AdvertisementCard key={ad._id} ad={ad} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdsByCategory