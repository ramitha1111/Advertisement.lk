'use client'

import React, { useState, useEffect } from 'react'
import { 
  Search, 
  Filter, 
  ChevronDown, 
  Map, 
  Heart, 
  MessageCircle, 
  Tag,
  Loader
} from 'lucide-react'
import { 
  getAllAdvertisements, 
  getAdvertisementsByCategory,
  searchAdvertisements
} from '../api/advertisementApi'
import { getAllCategories } from '../api/categoryApi'

const Advertisements = () => {
  const [advertisements, setAdvertisements] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // Load all advertisements and categories when the component mounts
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true)
        const [adsData, categoriesData] = await Promise.all([
          getAllAdvertisements(),
          getAllCategories()
        ])
        setAdvertisements(adsData)
        setCategories(categoriesData)
      } catch (err) {
        setError('Failed to load data. Please try again later.')
        console.error('Error fetching initial data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchInitialData()
  }, [])

  // Handle search form submission
  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) {
      // If search is empty, fetch all ads
      try {
        setLoading(true)
        const adsData = await getAllAdvertisements()
        setAdvertisements(adsData)
      } catch (err) {
        setError('Failed to load advertisements. Please try again later.')
        console.error('Error fetching advertisements:', err)
      } finally {
        setLoading(false)
      }
      return
    }

    try {
      setLoading(true)
      const results = await searchAdvertisements(searchQuery)
      setAdvertisements(results)
    } catch (err) {
      setError('Failed to search advertisements. Please try again later.')
      console.error('Error searching advertisements:', err)
    } finally {
      setLoading(false)
    }
  }

  // Handle category filter change
  const handleCategoryChange = async (categoryId) => {
    setSelectedCategory(categoryId)
    try {
      setLoading(true)
      if (!categoryId) {
        // If no category selected, fetch all ads
        const adsData = await getAllAdvertisements()
        setAdvertisements(adsData)
      } else {
        // Fetch ads by selected category
        const adsData = await getAdvertisementsByCategory(categoryId)
        setAdvertisements(adsData)
      }
    } catch (err) {
      setError('Failed to filter advertisements. Please try again later.')
      console.error('Error filtering advertisements:', err)
    } finally {
      setLoading(false)
    }
  }

  // Toggle favorites (would need to be expanded with actual functionality)
  const toggleFavorite = (adId) => {
    console.log(`Toggling favorite for ad ${adId}`)
    // Would need implementation with your API
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Page header */}
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Advertisements</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Browse through our listings and find what you're looking for
          </p>
        </div>
      </div>

      {/* Search and filters section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex items-center">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md leading-5 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Search advertisements..."
              />
            </div>
            <button
              type="submit"
              className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="ml-2 inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
              <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </form>

          {/* Filter options */}
          {showFilters && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Category
                </label>
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Additional filter options could be added here */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Location
                </label>
                <select
                  id="location"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                >
                  <option>All Locations</option>
                  <option>Colombo</option>
                  <option>Kandy</option>
                  <option>Galle</option>
                  <option>Jaffna</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Price Range
                </label>
                <select
                  id="price"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                >
                  <option>Any Price</option>
                  <option>Under Rs. 5,000</option>
                  <option>Rs. 5,000 - Rs. 15,000</option>
                  <option>Rs. 15,000 - Rs. 50,000</option>
                  <option>Over Rs. 50,000</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700 dark:text-red-400">
                  {error}
                </p>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {!loading && advertisements.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-700 dark:text-gray-300">
              No advertisements found. Try adjusting your search criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {advertisements.map((ad) => (
              <div 
                key={ad._id} 
                className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden transition-all hover:shadow-lg"
              >
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
                  <button 
                    onClick={() => toggleFavorite(ad._id)} 
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-white dark:bg-gray-800 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Heart className={`h-5 w-5 ${ad.isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                  </button>
                </div>
                
                {/* Ad Content */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300">
                      {ad.category ? ad.category.name : 'Uncategorized'}
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
                    href={`/advertisements/${ad._id}`}
                    className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80"
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Contact
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination could be added here */}
        {!loading && advertisements.length > 0 && (
          <div className="mt-8 flex justify-center">
            <nav className="inline-flex rounded-md shadow-sm">
              <a href="#" className="px-3 py-2 rounded-l-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                Previous
              </a>
              <a href="#" className="px-3 py-2 border-t border-b border-gray-300 dark:border-gray-700 bg-primary text-white">
                1
              </a>
              <a href="#" className="px-3 py-2 border-t border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                2
              </a>
              <a href="#" className="px-3 py-2 border-t border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                3
              </a>
              <a href="#" className="px-3 py-2 rounded-r-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                Next
              </a>
            </nav>
          </div>
        )}
      </div>
    </div>
  )
}

export default Advertisements