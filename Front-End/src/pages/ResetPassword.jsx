import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../axios'
import { motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'

export default function ResetPassword() {
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [passwordErrors, setPasswordErrors] = useState({
        length: true,
        uppercase: true,
        number: true,
        special: true,
        match: true
    })
    const [showValidation, setShowValidation] = useState(false)
    const navigate = useNavigate()
    const { token } = useParams()
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible)
    }

    // Check password requirements whenever password changes
    useEffect(() => {
        validatePassword(newPassword)
        if (confirmPassword) {
            setPasswordErrors(prev => ({
                ...prev,
                match: newPassword === confirmPassword
            }))
        }
    }, [newPassword, confirmPassword])

    const validatePassword = (password) => {
        const errors = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*]/.test(password),
            match: confirmPassword ? password === confirmPassword : true
        }
        
        setPasswordErrors(errors)
        return Object.values(errors).every(Boolean)
    }

    const isPasswordValid = () => {
        return Object.values(passwordErrors).every(Boolean)
    }

    const handlePasswordReset = async (e) => {
        e.preventDefault()
        
        setShowValidation(true)
        
        if (!isPasswordValid()) {
            return
        }

        setLoading(true)
        setError('')
        setMessage('')

        try {
            const response = await api.post(`/auth/reset-password`, { token, newPassword })
            setMessage(response.data.message)
            setTimeout(() => {
                navigate('/login')
            }, 2000)
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data.error || 'Error resetting password')
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
                delayChildren: 0.2,
            }
        }
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5 },
        }
    }

    return (
        <div className="flex items-center justify-center bg-white dark:bg-gray-900 transition-colors duration-300">
            <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md px-6 py-8 flex flex-col"
            >
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
                                Please enter a new password below
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

                            <form onSubmit={handlePasswordReset}>
                                <motion.div variants={itemVariants} className="mb-4 relative">
                                    <input
                                        type={isPasswordVisible ? 'text' : 'password'}
                                        placeholder="New Password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className={`w-full p-3 rounded-md border ${
                                            showValidation && !isPasswordValid()
                                            ? 'border-red-400 focus:ring-red-400'
                                            : 'border-gray-300 dark:border-gray-700 focus:ring-primary'
                                        } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2`}
                                        onFocus={() => setShowValidation(true)}
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-300"
                                    >
                                        {isPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </motion.div>

                                <motion.div variants={itemVariants} className="mb-4 relative">
                                    <input
                                        type={isPasswordVisible ? 'text' : 'password'}
                                        placeholder="Confirm New Password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className={`w-full p-3 rounded-md border ${
                                            showValidation && confirmPassword && !passwordErrors.match
                                            ? 'border-red-400 focus:ring-red-400'
                                            : 'border-gray-300 dark:border-gray-700 focus:ring-primary'
                                        } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2`}
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-300"
                                    >
                                        {isPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </motion.div>

                                {showValidation && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="mb-4 text-left bg-gray-100 dark:bg-gray-800 p-3 rounded-md"
                                    >
                                        <p className="font-medium text-sm mb-2 text-gray-700 dark:text-gray-300">Password must have:</p>
                                        <ul className="space-y-1 text-sm">
                                            <li className={`flex items-center ${passwordErrors.length ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                                <span className="mr-2">{passwordErrors.length ? '✓' : '✗'}</span>
                                                At least 8 characters
                                            </li>
                                            <li className={`flex items-center ${passwordErrors.uppercase ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                                <span className="mr-2">{passwordErrors.uppercase ? '✓' : '✗'}</span>
                                                At least one uppercase letter
                                            </li>
                                            <li className={`flex items-center ${passwordErrors.number ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                                <span className="mr-2">{passwordErrors.number ? '✓' : '✗'}</span>
                                                At least one number
                                            </li>
                                            <li className={`flex items-center ${passwordErrors.special ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                                <span className="mr-2">{passwordErrors.special ? '✓' : '✗'}</span>
                                                At least one special character (!@#$%^&*)
                                            </li>
                                            {confirmPassword && (
                                                <li className={`flex items-center ${passwordErrors.match ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                                    <span className="mr-2">{passwordErrors.match ? '✓' : '✗'}</span>
                                                    Passwords match
                                                </li>
                                            )}
                                        </ul>
                                    </motion.div>
                                )}

                                <motion.div variants={itemVariants} className="mb-4">
                                    <motion.button
                                        type="submit"
                                        disabled={loading || !isPasswordValid()}
                                        whileHover={{ scale: loading ? 1 : 1.02 }}
                                        whileTap={{ scale: loading ? 1 : 0.98 }}
                                        className="w-full rounded-md bg-primary px-4 py-3 text-base font-semibold text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 disabled:cursor-not-allowed transition"
                                    >
                                        {loading ? 'Resetting...' : 'Reset Password'}
                                    </motion.button>
                                </motion.div>

                                <motion.div variants={itemVariants} className="text-center">
                                    <a 
                                        href="/login" 
                                        className="text-sm text-primary hover:text-primary/80 font-medium"
                                    >
                                        Back to login
                                    </a>
                                </motion.div>
                            </form>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    )
}