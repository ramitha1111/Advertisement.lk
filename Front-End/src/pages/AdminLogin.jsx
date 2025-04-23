import { useState, useEffect } from 'react'
import { Switch } from '@headlessui/react'
import { Moon, Sun, ChevronLeft } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { loginSuccess } from '../store/authSlice'
import { useNavigate, Link } from 'react-router-dom'
import api from '../axios'
import useAuth from '../hooks/useAuth' // Import your useAuth hook
import { motion } from 'framer-motion' // Note: You'll need to install framer-motion
import { Eye, EyeOff } from 'lucide-react' // Import Eye and EyeOff icons

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isLoggedIn } = useAuth() // Use the hook to check authentication status
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/')
    }
  }, [isLoggedIn, navigate])

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await api.post('/auth/login', { email, password })
      const data = response.data

      // Check if the email is verified
      if (data.emailVerified === 'false') {
        // Send OTP if email is not verified
        await api.post('/auth/send-otp', { email })
        navigate('/verify-email', { state: { email } })
        return
      }

      // Proceed with login if email is verified
      dispatch(loginSuccess({ token: data.token, user: data.user }))
      navigate('/admin/dashboard')
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message || 'Login failed')
      } else {
        setError('An error occurred during login')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError('')

    try {
      // Redirect to Google OAuth endpoint
      window.location.href = `${api.defaults.baseURL}/auth/google`
    } catch (error) {
      setError('Google login failed')
      setLoading(false)
    }
  }


  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Left side - Sign in form */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full lg:w-2/5 flex flex-col px-4 xs:px-4 sm:px-4 lg:px-3"
      >
        {/* Header with back button */}
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
            {/* Theme toggle switch could go here */}
          </div>
        </header>

        {/* Login form content */}
        <div className="flex-1 flex flex-col justify-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mx-auto w-full"
          >
            <motion.div
              variants={itemVariants}
              className="flex justify-center items-center mb-6"
            >
              <a href="/" className="text-3xl font-bold tracking-tight">
                <span className="text-black dark:text-white">ADvertise</span>
                <span className="text-primary">ments.lk</span>
              </a>
            </motion.div>

            <motion.h2
              variants={itemVariants}
              className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white text-center"
            >
              Sign in to your account
            </motion.h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mt-6 mx-auto w-full max-w-lg"
          >
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 text-base rounded"
              >
                {error}
              </motion.div>
            )}

            <form className="space-y-5" onSubmit={handleLogin}>
              <motion.div variants={itemVariants}>
                <label htmlFor="email" className="block text-base font-medium text-gray-700 dark:text-gray-300">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="block w-full rounded-md border-0 p-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:bg-gray-800 text-base transition-all duration-200"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-base font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <a
                    href="/forgot-password"
                    className="text-sm font-medium text-primary hover:text-primary/90"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={isPasswordVisible ? 'text' : 'password'} // Toggle between text and password type
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full rounded-md border-0 p-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:bg-gray-800 text-base transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-300"
                  >
                    {isPasswordVisible ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </motion.div>

              {/* <motion.div variants={itemVariants} className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-700 dark:bg-gray-800"
                />
                <label htmlFor="remember-me" className="ml-3 block text-sm text-gray-700 dark:text-gray-300">
                  Remember me
                </label>
              </motion.div> */}

              <motion.div variants={itemVariants}>
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex w-full justify-center rounded-md bg-primary px-4 mt-10 py-2 text-base font-semibold leading-6 text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-70 transition-all duration-200"
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </motion.button>
              </motion.div>
            </form>
          </motion.div>
        </div>
      </motion.div>

      {/* Right side - Image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="hidden lg:block w-3/5 relative"
      >
        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800">
          <img
            src="./src/assets/login-image.jpg"
            alt="login"
            className="h-full w-full object-cover"
          />
        </div>
      </motion.div>
    </div>
  )
}