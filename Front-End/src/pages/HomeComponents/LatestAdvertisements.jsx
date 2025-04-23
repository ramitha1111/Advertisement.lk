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
} from '../../api/advertisementApi'
import { getAllCategories } from '../../api/categoryApi'
import AdvertisementCard from '../../components/AdvertisementCard'

const LatestAdvertisements = () => {
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
                setLoading(true);
                const [adsData, categoriesData] = await Promise.all([
                    getAllAdvertisements(),
                    getAllCategories()
                ]);

                // Sort by createdAt (latest first) and slice first 6 ads
                const latestAds = adsData
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 3);

                setAdvertisements(latestAds);
                setCategories(categoriesData);
            } catch (err) {
                setError('Failed to load data. Please try again later.');
                console.error('Error fetching initial data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []);

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
        <div className="bg-gray-50 dark:bg-gray-900 mb-5">

            <div className="flex justify-center p-4">
                <h1 className="text-5xl font-bold">Latest Ads</h1>
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

export default LatestAdvertisements;
