import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ShieldCheck, Clock, Award, AlertCircle, CheckCircle } from 'lucide-react'
import PackageCard from '../../components/PackageCard'
import { getAllPackages, deletePackage } from '../../api/packageApi'
import useAuth from '../../hooks/useAuth'

const SelectPackage = () => {
  const navigate = useNavigate()
  const { id: advertisementId } = useParams()
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedPackage, setSelectedPackage] = useState(null)
  const { isAdmin, token } = useAuth() // Get admin status and token from useAuth hook

  // Fetch packages from API
  useEffect(() => {
    console.log(advertisementId)
    const fetchPackages = async () => {
      try {
        setLoading(true)
        const data = await getAllPackages()
        setPackages(data)
        setLoading(false)
      } catch (err) {
        setError('Failed to load packages. Please try again later.')
        setLoading(false)
        console.error('Error fetching packages:', err)
      }
    }

    fetchPackages()
  }, [])

  const handleSelectPackage = (packageDetails, proceedToCheckout) => {
    // Store selected package state
    setSelectedPackage(packageDetails.packageId)
    
    if (proceedToCheckout) {
      // Store package details in localStorage and redirect to checkout
      localStorage.setItem('packageId', packageDetails.packageId)
      localStorage.setItem('packageName', packageDetails.packageName)
      localStorage.setItem('price', packageDetails.price)
      localStorage.setItem('advertisementId', advertisementId)
      navigate('/user/checkout')
    }
  }

  // Admin handlers
  const handleViewPackage = (packageId) => {
    navigate(`/admin/packages/${packageId}`)
  }

  const handleUpdatePackage = (packageId) => {
    navigate(`/admin/packages/edit/${packageId}`)
  }

  const handleDeletePackage = async (packageId) => {
    if (window.confirm('Are you sure you want to delete this package? This action cannot be undone.')) {
      try {
        await deletePackage(packageId, token)
        // Refresh packages after deletion
        const updatedPackages = await getAllPackages()
        setPackages(updatedPackages)
        alert('Package deleted successfully')
      } catch (err) {
        alert('Failed to delete package')
        console.error('Error deleting package:', err)
      }
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (packages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <AlertCircle className="h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Packages Available</h2>
        <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-6">
          There are currently no promotion packages available. Please try again later.
        </p>
        <button 
          onClick={() => navigate(-1)}
          className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90"
        >
          Go Back
        </button>
      </div>
    )
  }

  const findRecommendedPackage = (packages) => {
    // Find middle package for recommendation if there are 3 or more packages
    if (packages.length >= 3) {
      return Math.floor(packages.length / 2)
    }
    // Otherwise recommend the highest price package
    return packages.reduce((maxIndex, pkg, currentIndex, arr) => {
      return pkg.price > arr[maxIndex].price ? currentIndex : maxIndex
    }, 0)
  }

  const recommendedIndex = findRecommendedPackage(packages)

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back button */}
        <div className="mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Advertisement
          </button>
        </div>
        
        {/* Page header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Select a Promotion Package</h1>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
            Choose the right package to boost your advertisement visibility
          </p>
          {selectedPackage && (
            <div className="mt-4 bg-primary/10 p-2 inline-flex items-center rounded">
              <CheckCircle className="h-5 w-5 text-primary mr-2" />
              <span className="text-primary font-medium">Package selected! Click "Buy Now" to continue</span>
            </div>
          )}
        </div>
        
        {/* Benefits section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-12">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Why Promote Your Advertisement?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Increased Visibility</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Get more views and engagement for your advertisement</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Faster Results</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Sell your items or services more quickly</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Higher Quality Inquiries</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Attract more serious and qualified buyers</p>
              </div>
            </div>
          </div>
        </div>

        {/* Packages grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <PackageCard 
              key={pkg._id}
              packageData={pkg}
              advertisementId={advertisementId}
              onSelectPackage={handleSelectPackage}
              isRecommended={index === recommendedIndex}
              isAdmin={isAdmin}
              isSelected={selectedPackage === pkg._id}
              onViewPackage={handleViewPackage}
              onUpdatePackage={handleUpdatePackage}
              onDeletePackage={handleDeletePackage}
            />
          ))}
        </div>
        
        {/* Additional information */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Need Help Choosing?</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Contact our customer support team at <a href="mailto:support@advertisements.lk" className="text-primary hover:underline">support@advertisements.lk</a> for assistance in selecting the right package for your needs.
          </p>
        </div>
      </div>
    </div>
  )
}

export default SelectPackage