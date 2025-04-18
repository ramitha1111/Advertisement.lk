import React from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, ArrowLeft } from 'lucide-react'

const PaymentSuccess = () => {
  const navigate = useNavigate()

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button
        onClick={() => navigate('/user/dashboard')}
        className="flex items-center text-gray-600 dark:text-gray-400 hover:text-primary mb-6"
      >
        <ArrowLeft size={18} className="mr-2" />
        Back to Dashboard
      </button>

      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
        <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Payment Successful
        </h1>

        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Thank you for your purchase! Your advertisement has been boosted successfully. You'll receive a confirmation email shortly.
        </p>

        <button
          onClick={() => navigate('/user/dashboard?section=my-ads')}
          className="inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Go to My Ads
        </button>
      </div>
    </div>
  )
}

export default PaymentSuccess
