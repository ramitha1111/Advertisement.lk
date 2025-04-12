'use client'

import { React, useState } from 'react'

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
  Plus
} from 'lucide-react'
import useAuth from '../../hooks/useAuth'

const Dashboard = () => {
  const { isLoggedIn, user } = useAuth() // Get login status and user data
  const [activeTab, setActiveTab] = useState('overview')

  // Mock data - replace with actual data fetching in your implementation
  const mockUser = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+94 77 123 4567',
    location: 'Colombo, Sri Lanka',
    memberSince: 'Jan 2023',
    avatar: '/api/placeholder/100/100'
  }

  const mockStats = {
    activeAds: 5,
    expiredAds: 2,
    pendingAds: 1,
    activePackages: 2
  }

  const mockAds = [
    { id: 1, title: 'Toyota Corolla 2020', category: 'Vehicles', status: 'Active', views: 234, date: '2025-03-15' },
    { id: 2, title: 'iPhone 14 Pro Max', category: 'Electronics', status: 'Active', views: 156, date: '2025-03-20' },
    { id: 3, title: 'Luxury Apartment for Rent', category: 'Property', status: 'Active', views: 89, date: '2025-03-25' }
  ]

  const mockPackages = [
    { id: 1, name: 'Premium Package', status: 'Active', expiresOn: '2025-06-15', adsLeft: 10 },
    { id: 2, name: 'Featured Listings', status: 'Active', expiresOn: '2025-05-10', adsLeft: 3 }
  ]

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
          You need to be logged in to view your dashboard, manage your ads, and track your packages.
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

  // Rendering different content based on the active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Active Ads</h3>
                  <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                    <FileText size={20} className="text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{mockStats.activeAds}</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Expired Ads</h3>
                  <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full">
                    <FileText size={20} className="text-red-600 dark:text-red-400" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{mockStats.expiredAds}</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Pending Ads</h3>
                  <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-full">
                    <Bell size={20} className="text-yellow-600 dark:text-yellow-400" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{mockStats.pendingAds}</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Active Packages</h3>
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                    <Package size={20} className="text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{mockStats.activePackages}</p>
              </div>
            </div>

            {/* Recent Ads */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Ads</h2>
                <a href="/my-ads" className="text-primary hover:text-primary/90 text-sm font-medium flex items-center">
                  View all <ChevronRight size={16} className="ml-1" />
                </a>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Title
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Category
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Views
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {mockAds.map((ad) => (
                      <tr key={ad.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{ad.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 dark:text-gray-400">{ad.category}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                            {ad.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {ad.views}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {ad.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Active Packages */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Active Packages</h2>
                <a href="/my-packages" className="text-primary hover:text-primary/90 text-sm font-medium flex items-center">
                  View all <ChevronRight size={16} className="ml-1" />
                </a>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Package
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Expires On
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Ads Left
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {mockPackages.map((pkg) => (
                      <tr key={pkg.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{pkg.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                            {pkg.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {pkg.expiresOn}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {pkg.adsLeft}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )
      case 'profile':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Profile Edit</h2>
            <p className="text-gray-600 dark:text-gray-400">Profile edit functionality will be implemented later.</p>
          </div>
        )
      case 'orders':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">My Orders</h2>
            <p className="text-gray-600 dark:text-gray-400">Orders view functionality will be implemented later.</p>
          </div>
        )
      case 'packages':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">My Packages</h2>
            <p className="text-gray-600 dark:text-gray-400">Packages functionality will be implemented later.</p>
          </div>
        )
      case 'ads':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">My Ads</h2>
            <p className="text-gray-600 dark:text-gray-400">Ads management functionality will be implemented later.</p>
          </div>
        )
      default:
        return <div>Unknown tab</div>
    }
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Page heading and user info */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-8">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center">
                <div className="relative">
                  <img
                    src={userData.avatar}
                    alt="User Avatar"
                    className="h-20 w-20 rounded-full object-cover border-4 border-white dark:border-gray-700"
                  />
                  <button className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full">
                    <Edit size={16} />
                  </button>
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{userData.name}</h1>
                  <div className="mt-1 flex flex-col sm:flex-row sm:items-center text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center">
                      <Bell size={14} className="mr-1" /> Member since {userData.memberSince}
                    </span>
                    <span className="sm:ml-4 mt-1 sm:mt-0 flex items-center">
                      <User size={14} className="mr-1" /> {userData.location}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 sm:mt-0">
                <a
                  href="/post-ad"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <Plus size={16} className="mr-2" />
                  Post New Ad
                </a>
              </div>
            </div>

            <div className="mt-6 sm:mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                      <User size={20} className="text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                    <p className="text-sm text-gray-900 dark:text-white">{userData.email}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                      <Phone size={20} className="text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</p>
                    <p className="text-sm text-gray-900 dark:text-white">{userData.phone}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
                      <Grid size={20} className="text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Ads</p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {mockStats.activeAds + mockStats.expiredAds + mockStats.pendingAds}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard navigation tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('overview')}
                className={`${activeTab === 'overview'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`${activeTab === 'profile'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`${activeTab === 'orders'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                My Orders
              </button>
              <button
                onClick={() => setActiveTab('packages')}
                className={`${activeTab === 'packages'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                My Packages
              </button>
              <button
                onClick={() => setActiveTab('ads')}
                className={`${activeTab === 'ads'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                My Ads
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

// Need to import Phone for the profile section
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

export default Dashboard