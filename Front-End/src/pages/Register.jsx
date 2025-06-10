import { useState, useEffect } from 'react'
import { ChevronLeft, Eye, EyeOff } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { loginSuccess } from '../store/authSlice'
import { useNavigate, Link } from 'react-router-dom'
import api from '../axios'
import useAuth from '../hooks/useAuth'
import { motion } from 'framer-motion'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import loginImage from '../assets/login-image.jpg';

export default function Register() {
    const title = 'Register - Advertisements.lk';
    useEffect(() => {
        document.title = title;
    }, [title]);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [passwordMatch, setPasswordMatch] = useState(true)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { isLoggedIn } = useAuth()
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

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))

        // Check password match when either password field changes
        if (name === 'password' || name === 'confirmPassword') {
            if (name === 'password') {
                setPasswordMatch(value === formData.confirmPassword || formData.confirmPassword === '')
            } else {
                setPasswordMatch(formData.password === value || value === '')
            }
        }
    }

    // Handle phone input change
    const handlePhoneChange = (value) => {
        setFormData(prev => ({ ...prev, phone: value }))
    }

    const validatePassword = (password) => {
        // Regular expression to check for a valid password
        const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
        return passwordRegex.test(password)
    }

    const handleRegister = async (e) => {
        e.preventDefault()

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!validatePassword(formData.password)) {
            setError('Password must contain at least 8 characters, an uppercase letter, a number, and a special character.');
            setPasswordValid(false);
            return;
        }



        setLoading(true)
        setError('')

        try {
            const response = await api.post('/auth/register', {
                firstName: formData.firstName,
                lastName: formData.lastName,
                username: formData.username,
                email: formData.email,
                password: formData.password,
                phone: formData.phone
            })

            const data = response.data

            // Store token and user if returned immediately
            if (data.token && data.user) {
                dispatch(loginSuccess({ token: data.token, user: data.user }))
            }

            // Redirect to email verification page
            navigate('/verify-email', { state: { email: formData.email } })
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data.message || 'Registration failed')
            } else {
                setError('An error occurred during registration')
            }
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleLogin = async () => {
        setLoading(true)
        setError('')

        try {
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
                staggerChildren: 0.08,
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
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            {/* Left side - Register form */}
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
                    </div>
                </header>

                {/* Register form content */}
                <div className="flex-1 flex flex-col justify-center py-6">
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
                            Create your account
                        </motion.h2>
                        <motion.p
                            variants={itemVariants}
                            className="mt-2 text-base text-gray-600 dark:text-gray-400 text-center"
                        >
                            Already have an account?{' '}
                            <a href="/login" className="text-primary hover:text-primary/90">
                                Sign in
                            </a>
                        </motion.p>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="mt-4 mx-auto w-full max-w-lg"
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

                        <form className="space-y-4" onSubmit={handleRegister}>
                            {/* First Name & Last Name */}
                            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
                                {/* First Name */}
                                <div className="w-full">
                                    <label htmlFor="firstName" className="block text-base font-medium text-gray-700 dark:text-gray-300">
                                        First Name
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="firstName"
                                            name="firstName"
                                            type="text"
                                            required
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            placeholder="John"
                                            className="block w-full rounded-md border-0 p-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:bg-gray-800 text-base transition-all duration-200"
                                        />
                                    </div>
                                </div>

                                {/* Last Name */}
                                <div className="w-full">
                                    <label htmlFor="lastName" className="block text-base font-medium text-gray-700 dark:text-gray-300">
                                        Last Name
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="lastName"
                                            name="lastName"
                                            type="text"
                                            required
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            placeholder="Doe"
                                            className="block w-full rounded-md border-0 p-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:bg-gray-800 text-base transition-all duration-200"
                                        />
                                    </div>
                                </div>
                            </motion.div>


                            {/* Username */}
                            <motion.div variants={itemVariants}>
                                <label htmlFor="username" className="block text-base font-medium text-gray-700 dark:text-gray-300">
                                    Username
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        required
                                        value={formData.username}
                                        onChange={handleChange}
                                        placeholder="johndoe123"
                                        className="block w-full rounded-md border-0 p-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:bg-gray-800 text-base transition-all duration-200"
                                    />
                                </div>
                            </motion.div>

                            {/* Email */}
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
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="name@example.com"
                                        className="block w-full rounded-md border-0 p-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:bg-gray-800 text-base transition-all duration-200"
                                    />
                                </div>
                            </motion.div>

                            {/* Phone */}
                            <motion.div variants={itemVariants}>
                                <label htmlFor="phone" className="block text-base font-medium text-gray-700 dark:text-gray-300">
                                    Phone Number
                                </label>
                                <div className="mt-1">
                                    <PhoneInput
                                        country={'lk'}
                                        value={formData.phone}
                                        onChange={handlePhoneChange}
                                        inputClass="!w-full !pl-14 !pr-3 !rounded-md !border-0 !text-gray-900 dark:!text-white !shadow-sm !ring-1 !ring-inset !ring-gray-300 dark:!ring-gray-700 !placeholder:text-gray-400 !focus:ring-2 !focus:ring-inset !focus:ring-primary dark:!bg-gray-800 !text-base !h-12 !transition-all !duration-200"
                                        containerClass="w-full relative"
                                        buttonClass="!absolute !left-0 !top-0 !h-12 !w-12 !border-0 !ring-1 !ring-inset !ring-gray-300 dark:!ring-gray-700 !rounded-l-md dark:!bg-gray-800 z-10"
                                        dropdownClass="!bg-white dark:!bg-gray-800 !text-gray-900 dark:!text-white"
                                        searchClass="!bg-white dark:!bg-gray-800 !text-gray-900 dark:!text-white"
                                    />
                                </div>
                            </motion.div>



                            {/* Password */}
                            <motion.div variants={itemVariants} className="">
                                <label htmlFor="password" className="block text-base font-medium text-gray-700 dark:text-gray-300">
                                    Password
                                </label>
                                <div className="mt-1 relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={isPasswordVisible ? 'text' : 'password'}
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="block w-full rounded-md border-0 p-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:bg-gray-800 text-base transition-all duration-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute right-3 top-3.5 transform text-gray-500 dark:text-gray-300"
                                    >
                                        {isPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </motion.div>

                            {/* Confirm Password */}
                            <motion.div variants={itemVariants}>
                                <label htmlFor="confirmPassword" className="block text-base font-medium text-gray-700 dark:text-gray-300">
                                    Confirm Password
                                </label>
                                <div className="mt-1 relative">
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={isPasswordVisible ? 'text' : 'password'}
                                        required
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className={`block w-full rounded-md border-0 p-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ${!passwordMatch ? 'ring-red-500 focus:ring-red-500' : 'ring-gray-300 dark:ring-gray-700 focus:ring-primary'
                                            } placeholder:text-gray-400 focus:ring-2 focus:ring-inset dark:bg-gray-800 text-base transition-all duration-200`}
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute right-3 top-3.5 transform text-gray-500 dark:text-gray-300"
                                    >
                                        {isPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                    {!passwordMatch && (
                                        <p className="mt-1 text-sm text-red-500">Passwords do not match</p>
                                    )}
                                </div>
                            </motion.div>

                            {/* Register Button */}
                            <motion.div variants={itemVariants} className="pt-2">
                                <motion.button
                                    type="submit"
                                    disabled={loading || !passwordMatch}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex w-full justify-center rounded-md bg-primary px-4 py-2 text-base font-semibold leading-6 text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-70 transition-all duration-200"
                                >
                                    {loading ? 'Creating account...' : 'Create account'}
                                </motion.button>
                            </motion.div>
                        </form>

                        <motion.div variants={containerVariants} className="mt-5">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300 dark:border-gray-700" />
                                </div>
                                <div className="relative flex justify-center text-base font-medium leading-6">
                                    <span className="bg-gray-50 dark:bg-gray-900 px-3 text-gray-500 dark:text-gray-400">Or continue with</span>
                                </div>
                            </div>

                            <motion.div
                                variants={itemVariants}
                                className="mt-4"
                            >
                                <motion.button
                                    type="button"
                                    onClick={handleGoogleLogin}
                                    disabled={loading}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex w-full items-center justify-center gap-4 rounded-md bg-white dark:bg-gray-800 px-4 py-2 text-base font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                                >
                                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    Google
                                </motion.button>
                            </motion.div>
                        </motion.div>
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
                        src={loginImage}
                        alt="register"
                        className="h-full w-full object-cover"
                    />
                </div>
            </motion.div>
        </div>
    )
}
