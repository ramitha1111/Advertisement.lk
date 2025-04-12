'use client'

import { React, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  User,
  Settings,
  FileText,
  ShoppingBag,
  Package,
  Bell,
  Edit,
  Grid,
  ChevronRight,
  Plus,
  Heart
} from 'lucide-react'
import useAuth from '../../hooks/useAuth'

const UserDashboard = () => {
  const { isLoggedIn, user } = useAuth() // Get login status and user data
  const dispatch = useDispatch()

  // Get active tab from Redux store (you'll need to create this slice)
  const activeTab = useSelector((state) => state.userDashboard.activeTab)

  // Effect to load specific section based on URL or other parameters
  useEffect(() => {
    // Example: Reading section from URL query parameter
    const urlParams = new URLSearchParams(window.location.search)
    const section = urlParams.get('section')

    // If section exists in URL, update the active tab
    if (section) {
      dispatch({ type: 'userDashboard/setActiveTab', payload: section })
    }
  }, [dispatch])

  // Mock data - replace with actual data fetching in your implementation
  const mockUser = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+94 77 123 4567',
    location: 'Colombo, Sri Lanka',
    memberSince: 'Jan 2023',
    avatar: '/api/placeholder/150/150',
    activeAds: 5,
    expiredAds: 2,
    pendingAds: 1,
    totalAds: 8
  }

  const mockStats = {
    favoriteAds: 12,
    completedOrders: 5,
    pendingOrders: 2
  }

  // Redirect if not logged in - you may want to handle this at a router level instead
  if (!isLoggedIn) {
    // In a real app, you might redirect to login page
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <User size={48} className="text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300">
          Please log in to access your dashboard
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-md">
          You need to be logged in to view your dashboard, manage your ads, and track your orders.
        </p>
        <a
          href="/login"
          className="mt-6 px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-md"
        >
          Log In
        </a>
      </div>
    )
  }

  const userData = user || mockUser // Use real user data or mock data

  // Handle tab change
  const handleTabChange = (tab) => {
    dispatch({ type: 'userDashboard/setActiveTab', payload: tab })
  }

  // Rendering different content based on the active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'add-new-ad':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Post a New Ad</h2>
            <p className="text-gray-600 dark:text-gray-400">This feature will be implemented in a separate component.</p>
          </div>
        )
      case 'my-ads':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">My Ads</h2>
            <p className="text-gray-600 dark:text-gray-400">This feature will be implemented in a separate component.</p>
          </div>
        )
      case 'favourites':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">My Favourites</h2>
            <p className="text-gray-600 dark:text-gray-400">This feature will be implemented in a separate component.</p>
          </div>
        )
      case 'my-orders':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">My Orders</h2>
            <p className="text-gray-600 dark:text-gray-400">This feature will be implemented in a separate component.</p>
          </div>
        )
      case 'settings':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Account Settings</h2>
            <p className="text-gray-600 dark:text-gray-400">This feature will be implemented in a separate component.</p>
          </div>
        )
      default:
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Dashboard Overview</h2>
            <p className="text-gray-600 dark:text-gray-400">Welcome to your dashboard. Select a tab to get started.</p>
          </div>
        )
    }
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Page heading and user info with larger profile image */}
        {/* Page heading and user info with larger profile image */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-8">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col md:flex-row">
              {/* Profile image with better aligned edit button */}
              <div className="relative flex-shrink-0">
                <img
                  src={userData.avatar}
                  alt="User Avatar"
                  className="h-32 w-32 rounded-full object-cover border-4 border-white dark:border-gray-700"
                />
                <button className="absolute bottom-2 right-2 bg-primary text-white p-2 rounded-full shadow">
                  <Edit size={16} />
                </button>
              </div>

              {/* User details section */}
              <div className="md:flex-1 md:ml-6 mt-4 md:mt-0">
                {/* Name next to image */}
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{userData.name}</h1>

                {/* Details under the name */}
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center mb-2">
                    <Bell size={16} className="mr-2" />
                    <span>Member since {userData.memberSince}</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <User size={16} className="mr-2" />
                    <span>{userData.location}</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <Mail size={16} className="mr-2" />
                    <span>{userData.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone size={16} className="mr-2" />
                    <span>{userData.phone}</span>
                  </div>
                </div>
              </div>

              {/* Wider ad stats column */}
              <div className="md:w-64 mt-6 md:mt-0 md:ml-6">
                <div className="space-y-4">
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <div className="flex items-center">
                      <FileText size={18} className="text-green-600 dark:text-green-400" />
                      <h3 className="text-green-600 dark:text-green-400 ml-2 font-medium">Active Ads</h3>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{userData.activeAds}</p>
                  </div>

                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                    <div className="flex items-center">
                      <FileText size={18} className="text-red-600 dark:text-red-400" />
                      <h3 className="text-red-600 dark:text-red-400 ml-2 font-medium">Expired Ads</h3>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{userData.expiredAds}</p>
                  </div>

                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                    <div className="flex items-center">
                      <Bell size={18} className="text-yellow-600 dark:text-yellow-400" />
                      <h3 className="text-yellow-600 dark:text-yellow-400 ml-2 font-medium">Pending Ads</h3>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{userData.pendingAds}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard navigation tabs - Updated with new tab structure */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
              <button
                onClick={() => handleTabChange('add-new-ad')}
                className={`${activeTab === 'add-new-ad'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <Plus size={16} className="mr-2" /> Add New Ad
              </button>
              <button
                onClick={() => handleTabChange('my-ads')}
                className={`${activeTab === 'my-ads'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <FileText size={16} className="mr-2" /> My Ads
              </button>
              <button
                onClick={() => handleTabChange('favourites')}
                className={`${activeTab === 'favourites'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <Heart size={16} className="mr-2" /> Favourites
              </button>
              <button
                onClick={() => handleTabChange('my-orders')}
                className={`${activeTab === 'my-orders'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <ShoppingBag size={16} className="mr-2" /> My Orders
              </button>
              <button
                onClick={() => handleTabChange('settings')}
                className={`${activeTab === 'settings'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <Settings size={16} className="mr-2" /> Settings
              </button>
            </nav>
          </div>
        </div>

        {/* Main content area */}
        {renderContent()}
      </div>
    </div>
  )
}

// Custom icon components
function Phone(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size || 24}
      height={props.size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    </svg>
  );
}

function Mail(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size || 24}
      height={props.size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <rect x="2" y="4" width="20" height="16" rx="2"></rect>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
    </svg>
  );
}

export default UserDashboard