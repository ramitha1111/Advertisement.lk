'use client'

import React, { useState, useEffect } from 'react'
import { 
  Search, 
  Filter, 
  ChevronDown, 
  Loader
} from 'lucide-react'
import { 
  getAllAdvertisements, 
  getAdvertisementsByCategory,
  getAdvertisementsBySearch,
  getAdvertisementsByFilter
} from '../api/advertisementApi.js'
import { getAllCategories } from '../api/categoryApi'
import AdvertisementCard from '../components/AdvertisementCard'

const Advertisements = () => {
  const [advertisements, setAdvertisements] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('All Locations')
  const [selectedPriceRange, setSelectedPriceRange] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // Location options for Sri Lanka
  const locationOptions = [
    'All Locations',
    'Colombo',
    'Kandy',
    'Galle',
    'Jaffna',
    'Negombo',
    'Batticaloa',
    'Trincomalee',
    'Anuradhapura',
    'Matara'
  ]

  // Price range options
  const priceRangeOptions = [
    { label: 'Any Price', value: '' },
    { label: 'Under Rs. 5,000', value: '0,5000' },
    { label: 'Rs. 5,000 - Rs. 15,000', value: '5000,15000' },
    { label: 'Rs. 15,000 - Rs. 50,000', value: '15000,50000' },
    { label: 'Over Rs. 50,000', value: '50000,9999999' }
  ]

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
    
    try {
      setLoading(true)
      let results
      
      if (!searchQuery.trim()) {
        // If search is empty, fetch all ads or apply other filters
        if (selectedCategory || selectedLocation !== 'All Locations' || selectedPriceRange) {
          results = await applyFilters()
        } else {
          results = await getAllAdvertisements()
        }
      } else {
        // Search by query
        results = await getAdvertisementsBySearch(searchQuery)
      }
      
      setAdvertisements(results.advertisements)
      console.log(results)
    } catch (err) {
      setError('No advertisements found!')
      setAdvertisements([])
      console.error('Error searching advertisements:', err)
    } finally {
      setLoading(false)
    }
  }

  // Apply all filters
  const applyFilters = async () => {
    const category = selectedCategory || ''
    const location = selectedLocation !== 'All Locations' ? selectedLocation : ''
    const priceRange = selectedPriceRange || ''
    
    try {
      return await getAdvertisementsByFilter(category, location, priceRange)
    } catch (error) {
      console.error('Error applying filters:', error)
      setError('Failed to filter advertisements. Please try again later.')
      return []
    }
  }

  // Handle category filter change
  const handleCategoryChange = async (categoryId) => {
    setSelectedCategory(categoryId)
    await updateFilters(categoryId, selectedLocation, selectedPriceRange)
  }
  
  // Handle location filter change
  const handleLocationChange = async (location) => {
    setSelectedLocation(location)
    await updateFilters(selectedCategory, location, selectedPriceRange)
  }
  
  // Handle price range filter change
  const handlePriceRangeChange = async (priceRange) => {
    setSelectedPriceRange(priceRange)
    await updateFilters(selectedCategory, selectedLocation, priceRange)
  }
  
  // Update filters and fetch filtered results
  const updateFilters = async (category, location, priceRange) => {
    try {
      setLoading(true)
      console.log('Updating filters:', { category, location, priceRange })
      
      if (!category && (location === 'All Locations' || !location) && !priceRange) {
        // No filters applied, get all ads
        const adsData = await getAllAdvertisements()
        setAdvertisements(adsData)
      } else if (category && (location === 'All Locations' || !location) && !priceRange) {
        // Only category filter applied
        const adsData = await getAdvertisementsByCategory(category)
        setAdvertisements(adsData)
      } else {
        // Multiple filters applied
        const categoryParam = category || ''
        const locationParam = (location === 'All Locations' || !location) ? '' : location
        const priceRangeParam = priceRange || ''
        
        const adsData = await getAdvertisementsByFilter(categoryParam, locationParam, priceRangeParam)
        setAdvertisements(adsData)
      }
    } catch (err) {
      setError('No advertisements found!')
      console.error('Error updating filters:', err)
    } finally {
      setLoading(false)
    }
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
              
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Location
                </label>
                <select
                  id="location"
                  value={selectedLocation}
                  onChange={(e) => handleLocationChange(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                >
                  {locationOptions.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Price Range
                </label>
                <select
                  id="price"
                  value={selectedPriceRange}
                  onChange={(e) => handlePriceRangeChange(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                >
                  {priceRangeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
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
            {advertisements.slice().reverse().map((ad) => (
              <AdvertisementCard 
                key={ad._id} 
                ad={ad} 
              />
            ))}
          </div>
        )}

        {/* Pagination
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
        )} */}
      </div>
    </div>
  )
}

export default Advertisements