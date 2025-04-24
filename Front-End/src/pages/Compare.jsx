'use client'

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    X,
    ArrowLeft,
    ChevronDown,
    ChevronUp,
    Check,
    Minus,
    ExternalLink
} from 'lucide-react'
import { getAllCompares, deleteCompare } from '../api/compareApi'
import useAuth from '../hooks/useAuth'
import DOMPurify from 'dompurify'

const Compare = () => {
    const navigate = useNavigate()
    const { isLoggedIn, token } = useAuth()
    const [compareItems, setCompareItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const userId = localStorage.getItem('userId')
    const [expandedSections, setExpandedSections] = useState({
        details: true,
        description: false,
        features: false,
        media: false,
        contact: false
    })

    useEffect(() => {
        // Redirect if not logged in
        if (!isLoggedIn) {
            navigate('/login', { state: { from: '/user/compare' } })
            return
        }

        const fetchCompareItems = async () => {
            try {
                setLoading(true)
                const response = await getAllCompares(userId, token)
                setCompareItems(response || [])
                setLoading(false)
            } catch (err) {
                console.error('Error fetching compare items:', err)
                setError('Failed to load comparison items')
                setLoading(false)
            }
        }

        fetchCompareItems()
    }, [isLoggedIn, token, navigate])
    
const handleRemoveItem = async (adId, userId) => {
    try {
        await deleteCompare(userId, adId, token); // order: userId first, then adId, based on your API
        setCompareItems(prev => prev.filter(item => item._id !== adId));
    } catch (err) {
        console.error('Error removing item from comparison:', err);
    }
};


    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }))
    }

    // Format YouTube URL to embed URL
    const getYoutubeEmbedUrl = (url) => {
        if (!url) return null

        // Handle different YouTube URL formats
        let videoId
        const youtubeRegex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
        const match = url.match(youtubeRegex)

        if (match && match[1]) {
            videoId = match[1]
            return `https://www.youtube.com/embed/${videoId}`
        }

        return null
    }

    // Helper to render table rows
    const renderComparisonRow = (label, key, formatter = null) => {
        return (
            <tr className="border-b border-gray-200 dark:border-gray-700">
                <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{label}</td>
                {compareItems.map((item, index) => {
                    const value = item[key]
                    return (
                        <td key={`${item.advertisementId}-${key}`} className="py-3 px-4 text-gray-700 dark:text-gray-300">
                            {formatter ? formatter(value, item) : value || '—'}
                        </td>
                    )
                })}
                {compareItems.length === 1 && (
                    <td className="py-3 px-4 text-gray-500 dark:text-gray-400 italic">Add another item to compare</td>
                )}
            </tr>
        )
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{error}</h2>
                <button
                    onClick={() => navigate('/')}
                    className="mt-6 px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition"
                >
                    Go to Homepage
                </button>
            </div>
        )
    }

    if (compareItems.length === 0) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">No items to compare</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">Add items to your comparison list to see them side by side.</p>
                    <button
                        onClick={() => navigate('/advertisements')}
                        className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-md transition-colors inline-flex items-center"
                    >
                        <ArrowLeft className="mr-2" size={18} />
                        Browse Advertisements
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white dark:bg-gray-900 py-12 md:py-16 lg:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8">Compare Items</h1>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md  mb-8">
                    {/* Fixed header with images and titles */}
                    <div className="top-20 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-10">
                        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr_1fr] gap-4 md:gap-0">
                            <div className="bg-gray-50 dark:bg-gray-900 p-4 font-semibold text-gray-700 dark:text-gray-300">
                                Products
                            </div>

                            {compareItems.map((item) => (
                                <div key={item.advertisementId} className="p-4 relative bg-white dark:bg-gray-800 rounded-md shadow-sm">
                                    <button
                                        onClick={() => handleRemoveItem(item._id, item.userId)}
                                        className="absolute top-2 right-2 p-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                                        aria-label="Remove from comparison"
                                    >
                                        <X size={18} />
                                    </button>

                                    <div className="h-32 bg-gray-100 dark:bg-gray-700 rounded-md mb-3 overflow-hidden">
                                        {item.featuredImage ? (
                                            <img
                                                src={item.featuredImage}
                                                alt={item.title}
                                                className="w-full h-full object-contain"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                                                No image
                                            </div>
                                        )}
                                    </div>

                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">{item.title}</h3>
                                    <div className="text-primary font-bold">Rs. {item.price?.toLocaleString()}</div>

                                    <a
                                        href={`/advertisements/${item.advertisementId}`}
                                        className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center"
                                    >
                                        View details
                                        <ExternalLink size={14} className="ml-1" />
                                    </a>
                                </div>
                            ))}

                            {compareItems.length === 1 && (
                                <div className="p-4 flex items-center justify-center border border-dashed border-gray-300 dark:border-gray-600 rounded-md">
                                    <div className="text-center text-gray-500 dark:text-gray-400">
                                        <div className="h-32 bg-gray-100 dark:bg-gray-700 rounded-md mb-3 flex items-center justify-center">
                                            <div className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md">
                                                Add another item
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => navigate('/advertisements')}
                                            className="text-primary hover:underline"
                                        >
                                            Browse more ads
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Basic Details Section */}
                    <div className="border-b border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => toggleSection('details')}
                            className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 text-left"
                        >
                            <span className="font-semibold text-gray-900 dark:text-white">Basic Details</span>
                            {expandedSections.details ? (
                                <ChevronUp size={20} className="text-gray-500 dark:text-gray-400" />
                            ) : (
                                <ChevronDown size={20} className="text-gray-500 dark:text-gray-400" />
                            )}
                        </button>

                        {expandedSections.details && (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <tbody>
                                        {/* {renderComparisonRow('Category', 'categoryDetails',
                                            (value) => value?.categoryName || '—')} */}

                                        {renderComparisonRow('Location', 'location')}

                                        {renderComparisonRow('Date Posted', 'createdAt',
                                            (value) => value ? new Date(value).toLocaleDateString() : '—')}

                                        {renderComparisonRow('Boosted', 'isBoosted',
                                            (value) => value === 1 ?
                                                <Check size={18} className="text-green-500" /> :
                                                <Minus size={18} className="text-gray-400" />)}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Description Section */}
                    <div className="border-b border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => toggleSection('description')}
                            className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 text-left"
                        >
                            <span className="font-semibold text-gray-900 dark:text-white">Description</span>
                            {expandedSections.description ? (
                                <ChevronUp size={20} className="text-gray-500 dark:text-gray-400" />
                            ) : (
                                <ChevronDown size={20} className="text-gray-500 dark:text-gray-400" />
                            )}
                        </button>

                        {expandedSections.description && (
                            <div className="grid grid-cols-[1fr_1fr] md:grid-cols-[1fr_1fr] gap-0">
                                {compareItems.map((item) => (
                                    <div
                                        key={`${item.advertisementId}-desc`}
                                        className="p-4 border-r border-gray-200 dark:border-gray-700 last:border-r-0"
                                    >
                                        <div
                                            className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 text-sm"
                                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.description || '<p>No description provided</p>') }}
                                        />
                                    </div>
                                ))}

                                {compareItems.length === 1 && (
                                    <div className="p-4 text-gray-500 dark:text-gray-400 italic">
                                        Add another item to compare
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Features Section */}
                    {/* <div className="border-b border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => toggleSection('features')}
                            className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 text-left"
                        >
                            <span className="font-semibold text-gray-900 dark:text-white">Features</span>
                            {expandedSections.features ? (
                                <ChevronUp size={20} className="text-gray-500 dark:text-gray-400" />
                            ) : (
                                <ChevronDown size={20} className="text-gray-500 dark:text-gray-400" />
                            )}
                        </button>

                        {expandedSections.features && (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <tbody> */}
                    {/* Dynamically render features if available in the items */}
                    {/* {compareItems.some(item => item.features) ? (
                                            Object.keys(compareItems[0]?.features || {}).map(featureKey => (
                                                renderComparisonRow(
                                                    featureKey.charAt(0).toUpperCase() + featureKey.slice(1).replace(/([A-Z])/g, ' $1'),
                                                    `features.${featureKey}`,
                                                    (value) => value || '—'
                                                )
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={compareItems.length + 1} className="py-3 px-4 text-center text-gray-500 dark:text-gray-400">
                                                    No feature information available
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div> */}

                    {/* Media Section (Images/Videos) */}
                    <div className="border-b border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => toggleSection('media')}
                            className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 text-left"
                        >
                            <span className="font-semibold text-gray-900 dark:text-white">Media</span>
                            {expandedSections.media ? (
                                <ChevronUp size={20} className="text-gray-500 dark:text-gray-400" />
                            ) : (
                                <ChevronDown size={20} className="text-gray-500 dark:text-gray-400" />
                            )}
                        </button>

                        {expandedSections.media && (
                            <div className="grid grid-cols-[1fr_1fr] md:grid-cols-[1fr_1fr] gap-0">
                                {compareItems.map((item) => (
                                    <div
                                        key={`${item.advertisementId}-media`}
                                        className="p-4 border-r border-gray-200 dark:border-gray-700 last:border-r-0"
                                    >
                                        {/* Video */}
                                        {item.videoUrl && getYoutubeEmbedUrl(item.videoUrl) && (
                                            <div className="mb-4">
                                                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Video</h4>
                                                <div className="aspect-video rounded overflow-hidden bg-gray-100 dark:bg-gray-700">
                                                    <iframe
                                                        src={getYoutubeEmbedUrl(item.videoUrl)}
                                                        className="w-full h-full"
                                                        frameBorder="0"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                        title={`Video for ${item.title}`}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Images */}
                                        {(item.images && item.images.length > 0) ? (
                                            <div>
                                                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Images</h4>
                                                <div className="grid grid-cols-3 gap-2">
                                                    {[item.featuredImage, ...(item.images || [])].filter(Boolean).map((img, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="aspect-square rounded overflow-hidden bg-gray-100 dark:bg-gray-700"
                                                        >
                                                            <img
                                                                src={img}
                                                                alt={`${item.title} - image ${idx + 1}`}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-gray-500 dark:text-gray-400">No additional images</div>
                                        )}
                                    </div>
                                ))}

                                {compareItems.length === 1 && (
                                    <div className="p-4 text-gray-500 dark:text-gray-400 italic">
                                        Add another item to compare
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Contact Section */}
                    <div>
                        <button
                            onClick={() => toggleSection('contact')}
                            className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 text-left"
                        >
                            <span className="font-semibold text-gray-900 dark:text-white">Advertiser Details</span>
                            {expandedSections.contact ? (
                                <ChevronUp size={20} className="text-gray-500 dark:text-gray-400" />
                            ) : (
                                <ChevronDown size={20} className="text-gray-500 dark:text-gray-400" />
                            )}
                        </button>

                        {expandedSections.contact && (
                            <div className="grid grid-cols-[1fr_1fr] md:grid-cols-[1fr_1fr] gap-0">
                                {compareItems.map((item) => (
                                    <div
                                        key={`${item.advertisementId}-contact`}
                                        className="p-4 border-r border-gray-200 dark:border-gray-700 last:border-r-0"
                                    >
                                        {item.advertiser ? (
                                            <div>
                                                <div className="flex items-center mb-3">
                                                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden mr-3">
                                                        {item.advertiser.profileImage ? (
                                                            <img
                                                                src={item.advertiser.profileImage}
                                                                alt={item.advertiser.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                                                                {item.advertiser.name?.charAt(0).toUpperCase() || '?'}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium text-gray-900 dark:text-white">{item.advertiser.name || 'Unknown'}</h4>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            Member since {item.advertiser.createdAt ? new Date(item.advertiser.createdAt).toLocaleDateString() : '—'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="space-y-2 text-sm">
                                                    {item.advertiser.phone && (
                                                        <p className="flex items-center text-gray-700 dark:text-gray-300">
                                                            <span className="font-medium mr-2">Phone:</span>
                                                            {item.advertiser.phone}
                                                        </p>
                                                    )}

                                                    {item.advertiser.email && (
                                                        <p className="flex items-center text-gray-700 dark:text-gray-300">
                                                            <span className="font-medium mr-2">Email:</span>
                                                            {item.advertiser.email}
                                                        </p>
                                                    )}

                                                    {item.advertiser.location && (
                                                        <p className="flex items-center text-gray-700 dark:text-gray-300">
                                                            <span className="font-medium mr-2">Location:</span>
                                                            {item.advertiser.location}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-gray-500 dark:text-gray-400">No advertiser details available</div>
                                        )}
                                    </div>
                                ))}

                                {compareItems.length === 1 && (
                                    <div className="p-4 text-gray-500 dark:text-gray-400 italic">
                                        Add another item to compare
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-center mt-8">
                    <button
                        onClick={() => navigate('/advertisements')}
                        className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-md transition-colors inline-flex items-center"
                    >
                        <ArrowLeft className="mr-2" size={18} />
                        Back to Advertisements
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Compare