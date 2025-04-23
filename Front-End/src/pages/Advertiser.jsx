'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
    User,
    Phone,
    Mail,
    MapPin,
    Calendar,
    ExternalLink,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    MessageCircle
} from 'lucide-react'
import { getAdvertisementsByUser } from '../api/advertisementApi.js'
import useAuth from '../hooks/useAuth'
import AdvertisementCard from '../components/AdvertisementCard'

const Advertiser = () => {
    const { id: userId } = useParams()
    const { token } = useAuth()
    const [advertiser, setAdvertiser] = useState(null)
    const [advertisements, setAdvertisements] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [contactForm, setContactForm] = useState({
        name: '',
        email: '',
        message: ''
    })
    const [activeTab, setActiveTab] = useState('advertisements')

    useEffect(() => {
        const fetchAdvertiserData = async () => {
            try {
                setLoading(true)
                console.log('a')
                const data = await getAdvertisementsByUser(userId, token)

                if (data && data.length > 0 && data[0].userDetails) {
                    setAdvertiser(data[0].userDetails)
                }

                setAdvertisements(data || [])
                setLoading(false)
            } catch (err) {
                console.error('Error fetching advertiser data:', err)
                setError('Failed to load advertiser profile')
                setLoading(false)
            }
        }

        if (userId) {
            fetchAdvertiserData()
        }
    }, [userId, token])

    //   const handleContactSubmit = (e) => {
    //     e.preventDefault()
    //     // Here you would typically send this data to your API
    //     console.log('Contact form submitted:', contactForm)
    //     // Reset form
    //     setContactForm({
    //       name: '',
    //       email: '',
    //       message: ''
    //     })
    //     // Show success message
    //     alert('Message sent successfully!')
    //   }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setContactForm(prev => ({
            ...prev,
            [name]: value
        }))
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (error || !advertiser) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Failed to load advertiser profile</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-4">{error || "Advertiser not found"}</p>
            </div>
        )
    }

    return (
        <div className="bg-white dark:bg-gray-900 py-12 md:py-16 lg:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left column - Advertiser info */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-24">
                            {/* Profile Header */}
                            <div className="flex flex-col items-center mb-6">
                                <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-white dark:border-gray-700 shadow-md">
                                    {advertiser.profileImage ? (
                                        <img
                                            src={advertiser.profileImage}
                                            alt={`${advertiser.firstName} ${advertiser.lastName}`}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                            <User size={48} className="text-gray-500" />
                                        </div>
                                    )}
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
                                    {advertiser.firstName} {advertiser.lastName}
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400 text-center">@{advertiser.username}</p>

                                {/* <div className="mt-4 w-full">
                <div className="flex justify-center space-x-2">
                  <a href="#" className="w-8 h-8 flex items-center justify-center bg-blue-600 rounded-full text-white hover:bg-blue-700 transition-colors">
                    <Facebook size={16} />
                  </a>
                  <a href="#" className="w-8 h-8 flex items-center justify-center bg-sky-500 rounded-full text-white hover:bg-sky-600 transition-colors">
                    <Twitter size={16} />
                  </a>
                  <a href="#" className="w-8 h-8 flex items-center justify-center bg-pink-600 rounded-full text-white hover:bg-pink-700 transition-colors">
                    <Instagram size={16} />
                  </a>
                  <a href="#" className="w-8 h-8 flex items-center justify-center bg-blue-700 rounded-full text-white hover:bg-blue-800 transition-colors">
                    <Linkedin size={16} />
                  </a>
                </div>
              </div> */}
                            </div>

                            {/* Contact Info */}
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">Contact Information</h2>

                                <div className="flex items-center text-gray-700 dark:text-gray-300">
                                    <Phone size={16} className="mr-3" />
                                    <a href={`tel:${advertiser.phone}`} className="hover:text-primary">
                                        {advertiser.phone}
                                    </a>
                                </div>

                                <div className="flex items-center text-gray-700 dark:text-gray-300">
                                    <Mail size={16} className="mr-3" />
                                    <a href={`mailto:${advertiser.email}`} className="hover:text-primary truncate">
                                        {advertiser.email}
                                    </a>
                                </div>

                                {advertiser.location && (
                                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                                        <MapPin size={16} className="mr-3" />
                                        <span>{advertiser.location}</span>
                                    </div>
                                )}

                                {advertiser.website && (
                                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                                        <ExternalLink size={16} className="mr-3" />
                                        <a href={advertiser.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary truncate">
                                            {advertiser.website.replace(/(^\w+:|^)\/\//, '')}
                                        </a>
                                    </div>
                                )}
                            </div>

                            {/* Member since */}
                            {advertiser.createdAt && (
                                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                                        <Calendar size={16} className="mr-2" />
                                        <span>Member since {new Date(advertiser.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right column - Tabs for Ads and Contact */}
                    <div className="lg:col-span-2">
                        {/* Tabs */}
                        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
                            <button
                                className={`px-4 py-2 font-medium text-sm ${activeTab === 'advertisements'
                                        ? 'text-primary border-b-2 border-primary'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                                onClick={() => setActiveTab('advertisements')}
                            >
                                Advertisements ({advertisements.length})
                            </button>
                            {/* <button
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'contact'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
              onClick={() => setActiveTab('contact')}
            >
              Contact
            </button> */}
                        </div>

                        {/* Advertisements Tab */}
                        {activeTab === 'advertisements' && (
                            <>
                                {advertisements.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {advertisements.map(ad => (
                                            <AdvertisementCard key={ad._id} ad={ad} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No advertisements found</h3>
                                        <p className="text-gray-600 dark:text-gray-400">This advertiser hasn't posted any ads yet.</p>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Contact Tab */}
                        {activeTab === 'contact' && (
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                                    <MessageCircle className="mr-2" />
                                    Contact {advertiser.firstName} {advertiser.lastName}
                                </h2>

                                <form onSubmit={handleContactSubmit}>
                                    <div className="mb-4">
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Your Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={contactForm.name}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Your Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={contactForm.email}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>

                                    <div className="mb-6">
                                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Message
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={contactForm.message}
                                            onChange={handleInputChange}
                                            required
                                            rows="6"
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-md transition-colors"
                                    >
                                        Send Message
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Advertiser