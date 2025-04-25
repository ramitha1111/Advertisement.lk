'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import blankFeaturedImage from '../assets/placeholder.jpg'
import ReactPlayer from 'react-player'
import {
    Heart,
    BarChart3,
    Edit,
    Share2,
    MapPin,
    Calendar,
    Eye,
    Phone,
    Mail,
    User,
    Rocket
} from 'lucide-react'
import {
    getAdvertisementById,
} from '../api/advertisementApi.js'
import {
    createFavourite,
    deleteFavourite,
    getAllFavourites,
} from '../api/favouriteApi'
import {
    createCompare,
    deleteCompare,
    getAllCompares
} from '../api/compareApi'
import useAuth from '../hooks/useAuth'
import DOMPurify from 'dompurify'

const Advertisement = () => {
    const userId = localStorage.getItem('userId')
    const { id } = useParams()
    const navigate = useNavigate()
    const { isLoggedIn, user, token } = useAuth()
    const [advertisement, setAdvertisement] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [isFavorite, setIsFavorite] = useState(false)
    const [isCompared, setIsCompared] = useState(false)
    const [showFullImage, setShowFullImage] = useState(null)

    // Check if current user is owner
    const isOwner = isLoggedIn && user?.id === advertisement?.userId

    // Convert YouTube URL to embed URL
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

        return url // Return original if not a YouTube URL
    }

    // Format date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' }
        return new Date(dateString).toLocaleDateString(undefined, options)
    }

    // Fetch advertisement data
    useEffect(() => {
        const fetchAdvertisement = async () => {
            try {
                setLoading(true)
                const data = await getAdvertisementById(id)
                setAdvertisement(data)
                setLoading(false)
            } catch (err) {
                setError('Failed to load advertisement')
                setLoading(false)
                console.error('Error fetching advertisement:', err)
            }
        }

        fetchAdvertisement()
    }, [id])

    // Check if ad is in user's favorites and compares
    useEffect(() => {
        const checkUserInteractions = async () => {
            if (isLoggedIn && token) {
                try {
                    // Check favorites
                    const favoritesResponse = await getAllFavourites(token, userId)
                    const userFavorites = favoritesResponse?.data || []
                    console.log(userFavorites);
                    setIsFavorite(
                        userFavorites.some(fav => fav.advertisementId.includes(id))
                      )

                    // Check compares
                    console.error(userId)
                    const comparesResponse = await getAllCompares(userId, token);
                    setIsCompared(comparesResponse.some(comp => comp._id === id));

                } catch (err) {
                    console.error('Error checking user interactions:', err)
                }
            }
        }

        checkUserInteractions()
    }, [isLoggedIn, token, id])

    // Handle favorite toggle
    const handleFavoriteToggle = async () => {
        if (!isLoggedIn) {
            navigate('/login')
            return
        }

        try {
            if (isFavorite) {
                await deleteFavourite(userId, id, token)
            } else {
                await createFavourite(id, userId, token)
            }
            setIsFavorite(!isFavorite)
        } catch (err) {
            console.error('Error toggling favorite:', err)
        }
    }

    // Handle compare toggle
    const handleCompareToggle = async () => {
        if (!isLoggedIn) {
            navigate('/login')
            return
        }

        try {
            if (isCompared) {
                // Navigate to compare page if already compared
                navigate('/user/compare')
            } else {
                console.log(userId)
                await createCompare({ userId: userId, advertisementId: id }, token)
                setIsCompared(true)
            }
        } catch (err) {
            console.error('Error toggling compare:', err)
        }
    }

    // Handle boost button click
    const handleBoost = () => {
        navigate(`/user/select-package/${id}`)
    }

    // Handle edit button click
    const handleEdit = () => {
        navigate(`/user/update-advertisement/${id}`)
    }

    const handleNavigationToAdvertiser = () => {
        navigate(`/advertiser/${advertisement.userId}`)
    }

    // Share functionality
    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: advertisement.title,
                url: window.location.href
            })
        } else {
            // Fallback - copy to clipboard
            navigator.clipboard.writeText(window.location.href)
                .then(() => alert('Link copied to clipboard!'))
                .catch(err => console.error('Error copying text: ', err))
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (error || !advertisement) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Failed to load advertisement</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-4">{error || "Advertisement not found"}</p>
                <button
                    onClick={() => navigate('/')}
                    className="mt-6 px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition"
                >
                    Go Back Home
                </button>
            </div>
        )
    }

    const {
        title,
        description,
        price,
        location,
        categoryDetails,
        subcategoryId,
        featuredImage,
        images,
        videoUrl,
        views,
        createdAt,
        boostedUntil,
        isBoosted,
        userDetails
    } = advertisement

    // Image modal
    const ImageModal = () => {
        if (!showFullImage) return null

        return (
            <div
                className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
                onClick={() => setShowFullImage(null)}
            >
                <div className="relative max-w-4xl w-full">
                    <button
                        className="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full p-2"
                        onClick={() => setShowFullImage(null)}
                    >
                        X
                    </button>
                    <img
                        src={showFullImage}
                        alt="Full size"
                        className="w-full h-full object-contain"
                    />
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white dark:bg-gray-900 py-12 md:py-16 lg:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <ImageModal />

                {/* Top section with title, actions */}
                <div className="flex flex-col lg:flex-row justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{title}</h1>
                        <div className="flex items-center text-gray-600 dark:text-gray-400 mb-1">
                            <MapPin size={16} className="mr-1" />
                            <span>{location}</span>
                            <span className="mx-2">•</span>
                            <Calendar size={16} className="mr-1" />
                            <span>Posted on {formatDate(createdAt)}</span>
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <Eye size={16} className="mr-1" />
                            {categoryDetails && (
                                <span>Category: {categoryDetails.categoryName}</span>
                            )}
                        </div>
                    </div>

                    <div className="mt-4 lg:mt-0 flex flex-wrap gap-2">
                        {/* Owner actions */}
                        {isOwner && (
                            <>
                                <button
                                    onClick={handleEdit}
                                    className="flex items-center px-4 py-2 border max-h-10 border-gray-300 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                                >
                                    <Edit size={16} className="mr-2" />
                                    Edit Ad
                                </button>

                                {isBoosted ? (
                                    <button
                                        onClick={handleBoost}
                                        className="flex items-center px-4 py-2 max-h-10  bg-primary text-white rounded-md hover:bg-primary"
                                    >
                                        <Rocket size={16} className="mr-2" />
                                        Boost Again
                                        <span className="ml-1 text-xs">(Until {formatDate(boostedUntil)})</span>
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleBoost}
                                        className="flex items-center px-4 py-2 max-h-10  bg-primary text-white rounded-md hover:bg-primary"
                                    >
                                        <Rocket size={16} className="mr-2" />
                                        Boost Ad
                                    </button>
                                )}
                            </>
                        )}

                        {/* Non-owner actions (only for logged in users) */}
                        {isLoggedIn && (
                            <>
                                <button
                                    onClick={handleCompareToggle}
                                    className={`flex items-center px-4 py-2 max-h-10 rounded-md ${isCompared
                                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                                        : 'border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    <BarChart3 size={16} className="mr-2" />
                                    {isCompared ? 'View Comparison' : 'Add to Compare'}
                                </button>

                                <button
                                    onClick={handleFavoriteToggle}
                                    className={`flex items-center px-4 py-2 max-h-10 rounded-md ${isFavorite
                                        ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                                        : 'border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    <Heart size={16} className={`${isFavorite ? 'fill-current' : ''}`} />
                                </button>
                            </>
                        )}

                        {/* Share button (for everyone) */}
                        <button
                            onClick={handleShare}
                            className="flex items-center px-4 py-2 max-h-10 border border-gray-300 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                            <Share2 size={16} className="" />
                        </button>
                    </div>
                </div>

                {/* Main content grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left column - Images and description */}
                    <div className="lg:col-span-2">
                        {/* Featured image */}
                        <div className="mb-6">
                            <div
                                className="w-full rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-pointer"
                                onClick={() => setShowFullImage(featuredImage)}
                            >
                                <img
                                    src={featuredImage || blankFeaturedImage}
                                    alt={title}
                                    className="w-full h-auto object-cover max-h-96"
                                />
                            </div>
                        </div>

                        {/* Video (if available) */}
                        {videoUrl && (
                            <div className="mb-6">
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Video</h3>
                                <div className="w-full aspect-video rounded-lg overflow-hidden">
                                    <ReactPlayer
                                        url={getYoutubeEmbedUrl(videoUrl)}
                                        width="100%"
                                        height="100%"
                                        controls={true}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Description */}
                        <div className="mb-6">
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Description</h3>
                            <div
                                className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300"
                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(description) }}
                            />
                        </div>

                    </div>

                    {/* Right column - Price, seller info */}
                    <div className="lg:col-span-1">
                        {/* Price box */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 sticky top-24">
                            <h2 className="text-3xl font-bold text-primary mb-2">
                                Rs. {price.toLocaleString()}
                            </h2>
                            {isBoosted ? (
                                <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 inline-block px-3 py-1 rounded-full text-sm font-medium mb-4">
                                    <Rocket size={14} className="inline mr-1" />
                                    Boosted
                                </div>
                            ) : null}

                            {/* Seller information */}
                            <div className="mt-8">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Advertiser</h3>

                                <div className="flex items-center mb-3">
                                    <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                                        {userDetails?.profileImage ? (
                                            <img
                                                src={userDetails.profileImage}
                                                alt={`${userDetails.firstName} ${userDetails.lastName}`}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                                <User size={24} className="text-gray-500" />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-white">
                                            {userDetails?.firstName} {userDetails?.lastName}
                                        </h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">@{userDetails?.username}</p>
                                    </div>
                                </div>

                                <div className="space-y-3 mt-4">
                                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                                        <Phone size={16} className="mr-2" />
                                        <a href={`tel:${userDetails?.phone}`} className="hover:text-primary">
                                            {userDetails?.phone}
                                        </a>
                                    </div>
                                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                                        <Mail size={16} className="mr-2" />
                                        <a href={`mailto:${userDetails?.email}`} className="hover:text-primary truncate">
                                            {userDetails?.email}
                                        </a>
                                    </div>
                                </div>

                                <button
                                    onClick={handleNavigationToAdvertiser}
                                    className=" mt-6 px-4 py-2 max-h-10 w-full text-center bg-primary text-white rounded-md hover:bg-primary"
                                >
                                    More Ads from Seller
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Image gallery */}
                {images && images.length > 0 && (
                    <div className="mt-8">
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">More Images</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {[featuredImage, ...images].map((img, index) => (
                                <div
                                    key={index}
                                    className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-pointer hover:opacity-90 transition-opacity"
                                    onClick={() => setShowFullImage(img)}
                                >
                                    <img
                                        src={img}
                                        alt={`${title} - image ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Similar ads section could be added here */}
            </div>
        </div>
    )
}

export default Advertisement