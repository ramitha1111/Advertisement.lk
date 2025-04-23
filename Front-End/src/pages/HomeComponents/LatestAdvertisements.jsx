import React, { useState, useEffect } from 'react'
import { Loader } from 'lucide-react'
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

    const priceRangeOptions = [
        { label: 'Any Price', value: '' },
        { label: 'Under Rs. 5,000', value: '0,5000' },
        { label: 'Rs. 5,000 - Rs. 15,000', value: '5000,15000' },
        { label: 'Rs. 15,000 - Rs. 50,000', value: '15000,50000' },
        { label: 'Over Rs. 50,000', value: '50000,9999999' }
    ]

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setLoading(true)
                const [adsData, categoriesData] = await Promise.all([
                    getAllAdvertisements(),
                    getAllCategories()
                ])
                const latestAds = adsData
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 9)

                setAdvertisements(latestAds)
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

    const handleSearch = async (e) => {
        e.preventDefault()

        try {
            setLoading(true)
            let results

            if (!searchQuery.trim()) {
                if (selectedCategory || selectedLocation !== 'All Locations' || selectedPriceRange) {
                    results = await applyFilters()
                } else {
                    results = await getAllAdvertisements()
                }
            } else {
                results = await getAdvertisementsBySearch(searchQuery)
            }

            setAdvertisements(results.advertisements)
        } catch (err) {
            setError('No advertisements found!')
            setAdvertisements([])
            console.error('Error searching advertisements:', err)
        } finally {
            setLoading(false)
        }
    }

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

    const handleCategoryChange = async (categoryId) => {
        setSelectedCategory(categoryId)
        await updateFilters(categoryId, selectedLocation, selectedPriceRange)
    }

    const handleLocationChange = async (location) => {
        setSelectedLocation(location)
        await updateFilters(selectedCategory, location, selectedPriceRange)
    }

    const handlePriceRangeChange = async (priceRange) => {
        setSelectedPriceRange(priceRange)
        await updateFilters(selectedCategory, selectedLocation, priceRange)
    }

    const updateFilters = async (category, location, priceRange) => {
        try {
            setLoading(true)

            if (!category && (location === 'All Locations' || !location) && !priceRange) {
                const adsData = await getAllAdvertisements()
                setAdvertisements(adsData)
            } else if (category && (location === 'All Locations' || !location) && !priceRange) {
                const adsData = await getAdvertisementsByCategory(category)
                setAdvertisements(adsData)
            } else {
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

            {loading ? (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center">
                    <div className="flex items-center justify-center">
                        <Loader className="h-8 w-8 text-primary animate-spin" />
                        <span className="ml-2 text-gray-700 dark:text-gray-300">Loading advertisements...</span>
                    </div>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    {advertisements.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-lg text-gray-700 dark:text-gray-300">
                                No advertisements found. Try adjusting your search criteria.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {advertisements
                                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                .slice(0, 9)
                                .map((ad) => (
                                    <AdvertisementCard key={ad._id} ad={ad} />
                                ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default LatestAdvertisements;
