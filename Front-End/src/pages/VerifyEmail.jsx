import { useState, useEffect } from 'react'
import { ChevronLeft } from 'lucide-react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import api from '../axios'
import useAuth from '../hooks/useAuth'
import { motion } from 'framer-motion'

export default function EmailVerification() {
    const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', ''])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [resendDisabled, setResendDisabled] = useState(false)
    const [countdown, setCountdown] = useState(0)
    const location = useLocation()
    const navigate = useNavigate()
    const { isLoggedIn } = useAuth()
    const email = location.state?.email || ''

    useEffect(() => {
        if (isLoggedIn) {
            // You can add logic here to check if the user has already verified their email
        }
    }, [isLoggedIn, navigate])

    useEffect(() => {
        let timer
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000)
        } else {
            setResendDisabled(false)
        }
        return () => clearTimeout(timer)
    }, [countdown])

    const handleCodeChange = (index, value) => {
        if (value && !/^\d*$/.test(value)) return
        const newCode = [...verificationCode]
        newCode[index] = value
        setVerificationCode(newCode)
        if (value && index < 5) {
            const nextInput = document.getElementById(`code-${index + 1}`)
            if (nextInput) nextInput.focus()
        }
    }

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
            const prevInput = document.getElementById(`code-${index - 1}`)
            if (prevInput) prevInput.focus()
        } else if (e.key === 'ArrowLeft' && index > 0) {
            const prevInput = document.getElementById(`code-${index - 1}`)
            if (prevInput) prevInput.focus()
        } else if (e.key === 'ArrowRight' && index < 5) {
            const nextInput = document.getElementById(`code-${index + 1}`)
            if (nextInput) nextInput.focus()
        }
    }

    const handleVerify = async (e) => {
        e.preventDefault()
        const code = verificationCode.join('')
        if (code.length !== 6) {
            setError('Please enter the complete 6-digit verification code')
            return
        }
        setLoading(true)
        setError('')
        setMessage('')
        try {
            await api.post('/auth/verify-otp', { email, otp: code })
            setMessage('Email verified successfully!')
            setTimeout(() => {
                navigate('/login')
            }, 2000)
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data.message || 'Verification failed')
            } else {
                setError('An error occurred during verification')
            }
        } finally {
            setLoading(false)
        }
    }

    const handleResend = async () => {
        if (resendDisabled) return
        setLoading(true)
        setError('')
        setMessage('')
        try {
            await api.post('/auth/send-otp', { email })
            setMessage('Verification code has been resent to your email')
            setResendDisabled(true)
            setCountdown(60)
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data.message || 'Failed to resend verification code')
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
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Verify your email</h2>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                {email ? <>We've sent a verification code to <span className="font-semibold">{email}</span></> : 'Check your email for a verification code'}
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

                            <form onSubmit={handleVerify}>
                                <motion.div variants={itemVariants} className="flex justify-center gap-2 mb-6">
                                    {verificationCode.map((digit, index) => (
                                        <input
                                            key={index}
                                            id={`code-${index}`}
                                            type="text"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleCodeChange(index, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(index, e)}
                                            className="w-12 h-14 text-center text-xl font-semibold text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-md border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary"
                                        />
                                    ))}
                                </motion.div>

                                <motion.div variants={itemVariants} className="mb-4">
                                    <motion.button
                                        type="submit"
                                        disabled={loading || verificationCode.join('').length !== 6}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full rounded-md bg-primary px-4 py-2 text-base font-semibold text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 transition"
                                    >
                                        {loading ? 'Verifying...' : 'Verify Email'}
                                    </motion.button>
                                </motion.div>

                                <motion.div variants={itemVariants} className="text-sm text-gray-600 dark:text-gray-400">
                                    Didn't receive a code?{' '}
                                    <button
                                        type="button"
                                        onClick={handleResend}
                                        disabled={resendDisabled || loading}
                                        className="text-primary font-medium disabled:opacity-70"
                                    >
                                        {resendDisabled ? `Resend in ${countdown}s` : 'Resend code'}
                                    </button>
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
                        alt="Verification"
                        className="w-full h-full object-cover"
                    />
                </div>
            </motion.div>
        </div>
    )
}
