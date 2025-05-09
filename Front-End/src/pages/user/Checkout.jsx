import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { CreditCard, AlertCircle, ArrowLeft, Package, Calendar, Briefcase } from 'lucide-react'
import { submitCheckout } from '../../api/checkoutApi'

const Checkout = () => {
    const navigate = useNavigate()
    const advertisementId = localStorage.getItem('advertisementId');
    const packageId = localStorage.getItem('packageId');
    const price = localStorage.getItem('price');
    const packageName = localStorage.getItem('packageName');
    const { token } = useSelector((state) => state.auth);

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        companyName: '',
        country: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        zip: '',
        phone: '',
        email: '',
        advertisementId,
        packageId,
        packageName,
        amount: price
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        console.log('Form Data:', formData)
        setLoading(true)
        setError(null)

        try {
            const result = await submitCheckout(formData, token);
            console.log('Order Created:', result);

            localStorage.setItem('orderId', result.orderId);
            localStorage.setItem('clientSecret', result.clientSecret);

            navigate(`/user/payment`)
        } catch (err) {
            setError(err.message || 'Checkout failed');
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-600 dark:text-gray-400 hover:text-primary mb-6"
            >
                <ArrowLeft size={18} className="mr-2" />
                Back to Advertisement
            </button>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Checkout</h1>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                    <div className="flex">
                        <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Package details and order summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Package Details</h2>
                        </div>
                        <div className="p-6">
                            <div className="flex items-start mb-4">
                                <Package className="h-5 w-5 text-primary mr-3 mt-0.5" />
                                <div>
                                    <h3 className="font-medium text-gray-900 dark:text-white">{packageName || 'Advertisement Package'}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        ID: {packageId?.substring(0, 8) || 'N/A'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start mb-4">
                                <Briefcase className="h-5 w-5 text-primary mr-3 mt-0.5" />
                                <div>
                                    <h3 className="font-medium text-gray-900 dark:text-white">Advertisement</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        ID: {advertisementId?.substring(0, 8) || 'N/A'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <Calendar className="h-5 w-5 text-primary mr-3 mt-0.5" />
                                <div>
                                    <h3 className="font-medium text-gray-900 dark:text-white">Order Date</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {new Date().toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Order Summary</h2>
                        </div>
                        <div className="p-6">
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-600 dark:text-gray-400">Package Price</span>
                                <span className="text-gray-900 dark:text-white">${price || '0.00'}</span>
                            </div>
                            {/* <div className="flex justify-between mb-2">
                                <span className="text-gray-600 dark:text-gray-400">Tax</span>
                                <span className="text-gray-900 dark:text-white">$0.00</span>
                            </div> */}
                            <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>
                            <div className="flex justify-between font-semibold">
                                <span className="text-gray-900 dark:text-white">Total</span>
                                <span className="text-primary text-lg">${price || '0.00'}</span>
                            </div>
                            <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                                <p>By proceeding to payment, you agree to our <a href="/terms" className="text-primary hover:underline">Terms of Service</a> and <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Billing details form */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Billing Details</h2>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            First Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Last Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
                                        />
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Company Name (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        id="companyName"
                                        name="companyName"
                                        value={formData.companyName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
                                    />
                                </div>

                                <div className="mb-6">
                                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Country *
                                    </label>
                                    <input
                                        type="text"
                                        id="country"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
                                    />
                                </div>

                                <div className="mb-6">
                                    <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Street Address *
                                    </label>
                                    <input
                                        type="text"
                                        id="addressLine1"
                                        name="addressLine1"
                                        placeholder="House number and street name"
                                        value={formData.addressLine1}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary mb-3"
                                    />
                                    <input
                                        type="text"
                                        id="addressLine2"
                                        name="addressLine2"
                                        placeholder="Apartment, suite, unit, etc. (optional)"
                                        value={formData.addressLine2}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                    <div>
                                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Town / City *
                                        </label>
                                        <input
                                            type="text"
                                            id="city"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="state" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            State / Province *
                                        </label>
                                        <input
                                            type="text"
                                            id="state"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="zip" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Postal Code *
                                        </label>
                                        <input
                                            type="text"
                                            id="zip"
                                            name="zip"
                                            value={formData.zip}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Phone *
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
                                        />
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className={`w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    >
                                        {loading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <CreditCard className="mr-2 h-5 w-5" />
                                                Proceed to Payment
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Checkout