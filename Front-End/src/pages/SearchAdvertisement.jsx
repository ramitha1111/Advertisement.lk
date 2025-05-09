'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { 
  Search, 
  Filter, 
  ChevronDown, 
  Loader,
  ArrowLeft
} from 'lucide-react'
import { 
  getAdvertisementsBySearch,
  getAdvertisementsByFilter
} from '../api/advertisementApi.js'
import { getAllCategories } from '../api/categoryApi'
import AdvertisementCard from '../components/AdvertisementCard'
import { Link } from 'react-router-dom'

const SearchAdvertisement = () => {
  const { keyword } = useParams()
  const searchParams = useSearchParams()[0]
  const searchQuery = keyword || searchParams.get('q') || ''
  
  const [advertisements, setAdvertisements] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updatedSearchQuery, setUpdatedSearchQuery] = useState(searchQuery)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('All Locations')
  const [selectedPriceRange, setSelectedPriceRange] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [resultCount, setResultCount] = useState(0)

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

  // Load search results and categories when the component mounts or search params change
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getAllCategories()
        setCategories(categoriesData)
      } catch (err) {
        console.error('Error fetching categories:', err)
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery) return

      try {
        setLoading(true)
        setError(null)
        setUpdatedSearchQuery(searchQuery)

        const results = await getAdvertisementsBySearch(searchQuery)
        if (results && results.advertisements) {
          setAdvertisements(results.advertisements)
          setResultCount(results.advertisements.length)
        } else {
          setAdvertisements([])
          setResultCount(0)
        }
      } catch (err) {
        setError('Error fetching search results. Please try again.')
        console.error('Error searching advertisements:', err)
        setAdvertisements([])
        setResultCount(0)
      } finally {
        setLoading(false)
      }
    }

    fetchSearchResults()
  }, [searchQuery])

  // Handle search form submission
  const handleSearch = async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      setError(null)
      
      // Navigate programmatically or replace the current URL with the new search
      window.history.pushState({}, '', `/search/${encodeURIComponent(updatedSearchQuery)}`)
      
      const results = await getAdvertisementsBySearch(updatedSearchQuery)
      if (results && results.advertisements) {
        setAdvertisements(results.advertisements)
        setResultCount(results.advertisements.length)
      } else {
        setAdvertisements([])
        setResultCount(0)
        setError('No advertisements found!')
      }
    } catch (err) {
      setError('Error searching advertisements. Please try again.')
      console.error('Error searching advertisements:', err)
      setAdvertisements([])
      setResultCount(0)
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
      setLoading(true)
      setError(null)
      
      // Apply filters along with search query
      const results = await getAdvertisementsByFilter(
        category, 
        location, 
        priceRange, 
        updatedSearchQuery
      )
      
      if (results && results.advertisements) {
        setAdvertisements(results.advertisements)
        setResultCount(results.advertisements.length)
      } else {
        setAdvertisements([])
        setResultCount(0)
        setError('No advertisements found for the selected filters!')
      }
    } catch (error) {
      console.error('Error applying filters:', error)
      setError('Failed to filter advertisements. Please try again later.')
      setAdvertisements([])
      setResultCount(0)
    } finally {
      setLoading(false)
    }
  }

  // Handle category filter change
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId)
  }
  
  // Handle location filter change
  const handleLocationChange = (location) => {
    setSelectedLocation(location)
  }
  
  // Handle price range filter change
  const handlePriceRangeChange = (priceRange) => {
    setSelectedPriceRange(priceRange)
  }
  
  // Apply filters when filter button is clicked
  const handleApplyFilters = () => {
    applyFilters()
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Page header */}
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center">
            <Link to="/advertisements" className="mr-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Search Results
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {searchQuery ? `Results for "${searchQuery}"` : 'Browse advertisements'}
                {!loading && ` (${resultCount} found)`}
              </p>
            </div>
          </div>
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
                value={updatedSearchQuery}
                onChange={(e) => setUpdatedSearchQuery(e.target.value)}
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
            {/* <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="ml-2 inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
              <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button> */}
          </form>
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
      </div>
    </div>
  )
}

export default SearchAdvertisement