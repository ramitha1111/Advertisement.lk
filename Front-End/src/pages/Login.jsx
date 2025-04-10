import { useState, useEffect } from 'react'
import { Switch } from '@headlessui/react'
import { Moon, Sun, ChevronLeft } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { loginSuccess } from '../store/authSlice'
import { useNavigate, Link } from 'react-router-dom'
import api from '../axios'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await api.post('/auth/login', { email, password });
      const data = response.data

      dispatch(loginSuccess({ token: data.token, user: data.user }))
      navigate('/user/dashboard')
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
    setLoading(true);
    setError('');

    try {
      // Redirect to Google OAuth endpoint
      window.location.href = `${api.defaults.baseURL}/auth/google`;
    } catch (error) {
      setError('Google login failed');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Left side - Sign in form */}
      <div className="w-full lg:w-2/5 flex flex-col px-4 xs:px-4 sm:px-4 lg:px-3">
        {/* Header with back button and toggle */}
        <header className="py-4 sticky top-0 z-10 bg-gray-50 dark:bg-gray-900">
          <div className="flex justify-between items-center">
            <Link to="/" className="h-10 w-10 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary hover:border-primary dark:hover:border-primary transition-colors">
              <ChevronLeft className="h-5 w-5" />
            </Link>
            {/* <Switch
              checked={darkMode}
              onChange={setDarkMode}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 dark:bg-gray-700"
            >
              <span className="sr-only">Toggle dark mode</span>
              <span
                className={`${
                  darkMode ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full transition bg-white dark:bg-gray-200 flex items-center justify-center`}
              >
                {darkMode ? (
                  <Moon className="h-4 w-4 text-gray-800" />
                ) : (
                  <Sun className="h-4 w-4 text-yellow-500" />
                )}
              </span>
            </Switch> */}
          </div>
        </header>

        {/* Login form content */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="mx-auto w-full">
            <div className="flex justify-center items-center mb-6">
              <a href="/" className="text-3xl font-bold tracking-tight">
                <span className="text-black dark:text-white">ADvertise</span>
                <span className="text-primary">ments.lk</span>
              </a>
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white text-center">
              Sign in to your account
            </h2>
            <p className="mt-2 text-base text-gray-600 dark:text-gray-400 text-center">
              Not a member?{' '}
              <a href="/register" className="text-primary hover:text-primary/90">
                Register now
              </a>
            </p>
          </div>

          <div className="mt-6 mx-auto w-full max-w-lg">
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 text-base rounded">
                {error}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleLogin}>
              <div>
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
                    className="block w-full rounded-md border-0 p-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:bg-gray-800 text-base"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-base font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <a
                    href='/reset-password'
                    className="text-sm font-medium text-primary hover:text-primary/90"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full rounded-md border-0 p-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:bg-gray-800 text-base"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-700 dark:bg-gray-800"
                />
                <label htmlFor="remember-me" className="ml-3 block text-sm text-gray-700 dark:text-gray-300">
                  Remember me
                </label>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full justify-center rounded-md bg-primary px-4 py-2 text-base font-semibold leading-6 text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-70"
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
            </form>

            <div className="mt-5">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-700" />
                </div>
                <div className="relative flex justify-center text-base font-medium leading-6">
                  <span className="bg-gray-50 dark:bg-gray-900 px-3 text-gray-500 dark:text-gray-400">Or continue with</span>
                </div>
              </div>

              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-4 rounded-md bg-white dark:bg-gray-800 px-4 py-2 text-base font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Google
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:block w-3/5 relative">
        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800">
          <img
            src="./assets/login-image.jpg"
            alt="login"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  )
}