import { useState } from 'react'
import axios from 'axios'

// Separate Reset Password Popup Component
const ResetPasswordPopup = ({ isOpen, onClose, onSuccess }) => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('input') // input, verifying, newPassword
  const [verificationCode, setVerificationCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const handleRequestReset = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      await axios.post('/api/auth/request-reset', { email })
      setStatus('verifying')
      setMessage('Verification code sent to your email')
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send verification code')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      await axios.post('/api/auth/verify-code', { email, verificationCode })
      setStatus('newPassword')
      setMessage('Code verified. Please set your new password')
    } catch (error) {
      setError(error.response?.data?.message || 'Invalid verification code')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      await axios.post('/api/auth/reset-password', {
        email,
        verificationCode,
        newPassword
      })
      setMessage('Password reset successful')
      setTimeout(() => {
        onSuccess()
        onClose()
      }, 2000)
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X size={20} />
        </button>
        
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          {status === 'input' && 'Reset Password'}
          {status === 'verifying' && 'Verify Email'}
          {status === 'newPassword' && 'Set New Password'}
        </h2>
        
        {message && (
          <div className="mb-4 p-2 bg-green-100 border border-green-400 text-green-700 text-sm rounded">
            {message}
          </div>
        )}
        
        {error && (
          <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 text-sm rounded">
            {error}
          </div>
        )}
        
        {status === 'input' && (
          <form onSubmit={handleRequestReset} className="space-y-4">
            <div>
              <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email address
              </label>
              <input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:text-white text-sm p-2"
                placeholder="name@example.com"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {loading ? 'Sending...' : 'Send Verification Code'}
            </button>
          </form>
        )}
        
        {status === 'verifying' && (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div>
              <label htmlFor="verification-code" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Verification Code
              </label>
              <input
                id="verification-code"
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:text-white text-sm p-2"
                placeholder="Enter code sent to your email"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>
          </form>
        )}
        
        {status === 'newPassword' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                New Password
              </label>
              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:text-white text-sm p-2"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:text-white text-sm p-2"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default ResetPasswordPopup;