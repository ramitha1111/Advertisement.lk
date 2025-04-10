import { useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../axios'
import { motion } from 'framer-motion'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')
    try {
      const response = await api.post('/auth/forgot-password', { email })
      setMessage(response.data.message)
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.error || 'Error sending password reset email')
      } else {
        setError('An error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Left Side - Form */}
      <motion.div 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full lg:w-2/5 px-6 py-6 flex flex-col"
      >
        <header className="py-4 sticky top-0 z-10 bg-gray-50 dark:bg-gray-900">
          <div className="flex justify-between items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/" className="h-10 w-10 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary hover:border-primary dark:hover:border-primary transition-colors">
                <ChevronLeft className="h-5 w-5" />
              </Link>
            </motion.div>
          </div>
        </header>

        <div className="flex-1 flex flex-col justify-center">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-md mx-auto text-center"
          >
            <motion.div variants={itemVariants} className="mb-6">
              <a href="/" className="text-3xl font-bold tracking-tight">
                <span className="text-black dark:text-white">ADvertise</span>
                <span className="text-primary">ments.lk</span>
              </a>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reset your password</h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Enter your email to receive an OTP for password reset.
              </p>
            </motion.div>

            <motion.div variants={containerVariants} className="mt-8">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 text-sm rounded"
                >
                  {error}
                </motion.div>
              )}

              {message && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 text-sm rounded"
                >
                  {message}
                </motion.div>
              )}

              <form onSubmit={handleForgotPassword}>
                <motion.div variants={itemVariants} className="mb-4">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 text-sm border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </motion.div>

                <motion.div variants={itemVariants} className="mb-4">
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full rounded-md bg-primary px-4 py-2 text-base font-semibold text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 transition"
                  >
                    {loading ? 'Sending OTP...' : 'Send OTP'}
                  </motion.button>
                </motion.div>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Image */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="hidden lg:block w-full lg:w-3/5 relative"
      >
        <div className="absolute inset-0">
          <img
            src="./assets/login-image.jpg"
            alt="Reset Password"
            className="w-full h-full object-cover"
          />
        </div>
      </motion.div>
    </div>
  )
}
