'use client'

import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  User,
  Plus,
  Moon,
  Sun,
  Menu,
  X,
  LogIn,
  UserPlus,
  Heart,
  Settings,
  FileText,
  ShoppingBag,
  LogOut,
  Package,
  Book,
  Bell,
  Facebook,
  Twitter,
  Linkedin,
  Instagram
} from 'lucide-react'
import { toggleTheme } from '../store/themeSlice'
import { logout } from '../store/authSlice'
import useAuth from '../hooks/useAuth';
import {
  Dialog,
  Popover,
  PopoverButton,
  PopoverPanel,
} from '@headlessui/react'
import GoogleTranslate from './GoogleTranslate'

const Header = () => {
  const isDark = useSelector((state) => state.theme.isDark)
  const dispatch = useDispatch()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [headerHeight, setHeaderHeight] = useState(0)
  const headerRef = React.useRef(null)
  const { isLoggedIn, isAdmin } = useAuth() // Get login and admin status from useAuth hook

  // Calculate and set header height
  useEffect(() => {
    if (headerRef.current) {
      const height = headerRef.current.offsetHeight
      setHeaderHeight(height)
      document.body.style.paddingTop = `${height}px`
    }

    // Recalculate on window resize
    const handleResize = () => {
      if (headerRef.current) {
        const height = headerRef.current.offsetHeight
        setHeaderHeight(height)
        document.body.style.paddingTop = `${height}px`
      }
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      document.body.style.paddingTop = '0px'
    }
  }, [])

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [isDark])

  // Prevent body scrolling when menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [mobileMenuOpen])

  // Handle logout
  const handleLogout = () => {
    dispatch(logout())
  }

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Ads', href: '/advertisements' },
    { name: 'Categories', href: '/categories' }
  ]

  const guestOptions = [
    { name: 'Log In', href: '/login', icon: LogIn },
    { name: 'Register', href: '/register', icon: UserPlus },
  ]

  const userOptions = [
    { name: 'My Ads', href: '/user/dashboard?section=my-ads', icon: FileText },
    { name: 'My Orders', href: '/user/dashboard?section=my-orders', icon: ShoppingBag },
    { name: 'Settings', href: '/user/dashboard?section=settings', icon: Settings },
    { name: 'Favorites', href: '/user/dashboard?section=favourites', icon: Heart },
    //{ name: 'Notifications', href: '/notifications', icon: Bell }
  ]

  const adminOptions = [
    { name: 'Ads', href: '/admin/dashboard?section=advertisements-admin', icon: FileText },
    { name: 'Categories', href: '/admin/dashboard?section=categories-admin', icon: Book },
    { name: 'Orders', href: '/admin/dashboard?section=orders-admin', icon: ShoppingBag },
    { name: 'Users', href: '/admin/dashboard?section=users-admin', icon: User },
    { name: 'Packages', href: '/admin/dashboard?section=packages-admin', icon: Package },
    { name: 'Settings', href: '/admin/dashboard?section=settings-admin', icon: Settings },
    //{ name: 'Notifications', href: '/notifications', icon: Bell }
  ]

  return (
    <header ref={headerRef} className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-md border-b border-gray-200 dark:border-gray-700 z-50">
      {/* Top bar */}
      <div className="hidden md:block bg-gray-100 dark:bg-gray-800 py-2">
        {/* <GoogleTranslate /> */}
        <div className="mx-auto max-w-7xl px-8">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">Sri Lanka's #1 Marketplace</span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="mailto:support@advertisements.lk" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary">
                support@advertisements.lk
              </a>
              <div className="flex items-center space-x-2">
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary">
                  <Facebook size={16} className="stroke-2" />
                </a>
                {/* <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary">
                  <Twitter size={16} className="stroke-2" />
                </a> */}
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary">
                  <Linkedin size={16} className="stroke-2" />
                </a>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary">
                  <Instagram size={16} className="stroke-2" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 xl:px-8">
        {/* Logo */}
        <div className="flex xl:flex-1">
          <a href="/" className="text-2xl font-bold tracking-tight">
            <span className="text-black dark:text-white">ADvertise</span>
            <span className="text-primary">ments.lk</span>
          </a>
        </div>

        {/* Mobile menu button - show when width < 1280px (xl breakpoint) */}
        <div className="flex xl:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-300"
          >
            <span className="sr-only">Open main menu</span>
            <Menu className="size-6 stroke-2" aria-hidden="true" />
          </button>
        </div>

        {/* Desktop navigation - hidden until width >= 1280px (xl breakpoint) */}
        <div className="hidden xl:flex xl:gap-x-10">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm/6 font-semibold text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Desktop right section - hidden until width >= 1280px (xl breakpoint) */}
        <div className="hidden xl:flex xl:flex-1 xl:justify-end xl:items-center xl:space-x-4">
          {/* Theme toggle */}
          <button
            onClick={() => dispatch(toggleTheme())}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            title="Toggle Theme"
          >
            {isDark ?
              <Sun size={20} className="text-yellow-400 stroke-2" /> :
              <Moon size={20} className="text-gray-800 stroke-2" />
            }
          </button>
          {/* User dropdown - changes based on auth state */}
          <Popover className="relative group">
            {({ open }) => (
              <>
                {isLoggedIn ? (
                  <PopoverButton className="flex items-center gap-x-1 text-sm/6 font-semibold text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:border-primary hover:text-primary dark:hover:text-primary dark:hover:border-primary px-4 py-2 rounded-md transition-colors">
                    <User size={20} className="mr-2 stroke-2" />
                    <span>My Account</span>
                  </PopoverButton>
                ) : (
                  <PopoverButton className="flex items-center gap-x-1 text-sm/6 font-semibold text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:border-primary hover:text-primary dark:hover:text-primary dark:hover:border-primary px-4 py-2 rounded-md transition-colors">
                    <User size={20} className="mr-2 stroke-2" />
                    <span>Guest</span>
                  </PopoverButton>
                )}

                <div className="group relative">
                  <PopoverPanel
                    static
                    className="absolute right-0 top-full z-10 mt-0 w-screen max-w-xs overflow-hidden rounded-3xl bg-white dark:bg-gray-800 shadow-lg ring-1 ring-gray-900/5 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 invisible group-hover:visible duration-200 ease-out transition-all"
                  >
                    <div className="p-4">
                      {isLoggedIn ? (
                        isAdmin ? (
                          <>
                            {/* Admin Options */}
                            {adminOptions.map((option) => (
                              <div
                                key={option.name}
                                className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm/6 hover:bg-gray-50 dark:hover:bg-gray-700"
                              >
                                <div className="flex size-10 flex-none items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-900 group-hover:bg-white dark:group-hover:bg-gray-800">
                                  <option.icon className="size-5 text-gray-600 dark:text-gray-400 group-hover:text-primary" />
                                </div>
                                <div className="flex-auto">
                                  <a href={option.href} className="block font-semibold text-gray-900 dark:text-white">
                                    {option.name}
                                    <span className="absolute inset-0" />
                                  </a>
                                </div>
                              </div>
                            ))}

                            {/* Logout */}
                            <div className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm/6 hover:bg-gray-50 dark:hover:bg-gray-700">
                              <div className="flex size-10 flex-none items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-900 group-hover:bg-white dark:group-hover:bg-gray-800">
                                <LogOut className="size-5 text-gray-600 dark:text-gray-400 group-hover:text-primary" />
                              </div>
                              <div className="flex-auto">
                                <button
                                  onClick={handleLogout}
                                  className="block w-full text-left font-semibold text-gray-900 dark:text-white"
                                >
                                  Logout
                                  <span className="absolute inset-0" />
                                </button>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            {/* User Options */}
                            {userOptions.map((option) => (
                              <div
                                key={option.name}
                                className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm/6 hover:bg-gray-50 dark:hover:bg-gray-700"
                              >
                                <div className="flex size-10 flex-none items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-900 group-hover:bg-white dark:group-hover:bg-gray-800">
                                  <option.icon className="size-5 text-gray-600 dark:text-gray-400 group-hover:text-primary" />
                                </div>
                                <div className="flex-auto">
                                  <a href={option.href} className="block font-semibold text-gray-900 dark:text-white">
                                    {option.name}
                                    <span className="absolute inset-0" />
                                  </a>
                                </div>
                              </div>
                            ))}

                            {/* Logout */}
                            <div className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm/6 hover:bg-gray-50 dark:hover:bg-gray-700">
                              <div className="flex size-10 flex-none items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-900 group-hover:bg-white dark:group-hover:bg-gray-800">
                                <LogOut className="size-5 text-gray-600 dark:text-gray-400 group-hover:text-primary" />
                              </div>
                              <div className="flex-auto">
                                <button
                                  onClick={handleLogout}
                                  className="block w-full text-left font-semibold text-gray-900 dark:text-white"
                                >
                                  Logout
                                  <span className="absolute inset-0" />
                                </button>
                              </div>
                            </div>
                          </>
                        )
                      ) : (
                        <>
                          {/* Guest Options */}
                          {guestOptions.map((option) => (
                            <div
                              key={option.name}
                              className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm/6 hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                              <div className="flex size-10 flex-none items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-900 group-hover:bg-white dark:group-hover:bg-gray-800">
                                <option.icon className="size-5 text-gray-600 dark:text-gray-400 group-hover:text-primary" />
                              </div>
                              <div className="flex-auto">
                                <a href={option.href} className="block font-semibold text-gray-900 dark:text-white">
                                  {option.name}
                                  <span className="absolute inset-0" />
                                </a>
                              </div>
                            </div>
                          ))}
                        </>
                      )}

                    </div>
                  </PopoverPanel>
                </div>
              </>
            )}
          </Popover>

          {/* Post Ad Button */}
          <a
            href="/user/dashboard?section=add-new-ad"
            className="relative overflow-hidden group bg-primary hover:bg-primary/90 border border-primary dark:border-primary hover:border-primary text-white dark:hover:border-primary/90 px-6 py-2 rounded-md flex items-center"
          >
            <span className="relative z-10 flex items-center font-medium">
              Post Your Ad
              <Plus size={20} className="ml-2 stroke-2" />
            </span>
            <span className="absolute inset-0 bg-orange-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></span>
          </a>
        </div>
      </nav>

      {/* Mobile menu - using xl instead of lg */}
      <Dialog as="div" className="xl:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-100 bg-black bg-opacity-50" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white dark:bg-gray-900 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="/" className="text-xl font-bold tracking-tight">
              <span className="text-black dark:text-white">ADvertise</span>
              <span className="text-primary">ments.lk</span>
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-gray-300"
            >
              <span className="sr-only">Close menu</span>
              <X className="size-6 stroke-2" aria-hidden="true" />
            </button>
          </div>

          {/* Post Ad button in mobile - full width */}
          <div className="mt-6">
            <a
              href="/user/dashboard?section=add-new-ad"
              className="relative overflow-hidden group bg-primary text-white px-4 py-2 rounded-md flex items-center justify-center w-full"
            >
              <span className="relative z-10 flex items-center font-medium">
                Post Your Ad
                <Plus size={20} className="ml-2 stroke-2" />
              </span>
              <span className="absolute inset-0 bg-orange-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></span>
            </a>
          </div>

          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10 dark:divide-gray-700">
              {/* Navigation links */}
              <div className="space-y-2 py-6">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    {link.name}
                  </a>
                ))}
              </div>

              {/* User options based on auth state */}
              <div className="py-6">
                {isLoggedIn ? (
                  <>
                    {(isAdmin ? adminOptions : userOptions).map((option) => (
                      <a
                        key={option.name}
                        href={option.href}
                        className="-mx-3 flex items-center rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <option.icon className="mr-3 size-5 text-gray-600 dark:text-gray-400" />
                        {option.name}
                      </a>
                    ))}

                    <button
                      onClick={handleLogout}
                      className="-mx-3 flex w-full items-center rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <LogOut className="mr-3 size-5 text-gray-600 dark:text-gray-400" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    {guestOptions.map((option) => (
                      <a
                        key={option.name}
                        href={option.href}
                        className="-mx-3 flex items-center rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <option.icon className="mr-3 size-5 text-gray-600 dark:text-gray-400" />
                        {option.name}
                      </a>
                    ))}
                  </>
                )}

              </div>

              {/* Theme Toggle */}
              <div className="py-6">
                <button
                  onClick={() => dispatch(toggleTheme())}
                  className="flex items-center space-x-2 text-gray-900 dark:text-gray-300"
                >
                  {isDark ?
                    <><Sun size={20} className="text-yellow-400 stroke-2" /> <span>Light Mode</span></> :
                    <><Moon size={20} className="text-gray-800 stroke-2" /> <span>Dark Mode</span></>
                  }
                </button>
              </div>

              {/* Contact/social section with improved icons */}
              <div className="pt-6">
                <div className="text-gray-600 dark:text-gray-400 font-medium">Email Address</div>
                <a href="mailto:support@advertisements.lk" className="text-primary">
                  support@advertisements.lk
                </a>

                {/* Social Media Icons */}
                <div className="mt-4 mb-12 flex items-center space-x-3">
                  <a href="#" className="w-10 h-10 flex items-center justify-center bg-blue-500 rounded-full text-white hover:bg-blue-600 transition-colors">
                    <Facebook size={18} />
                  </a>
                  {/* <a href="#" className="w-10 h-10 flex items-center justify-center bg-sky-500 rounded-full text-white hover:bg-sky-600 transition-colors">
                    <Twitter size={18} />
                  </a> */}
                  <a href="#" className="w-10 h-10 flex items-center justify-center bg-blue-700 rounded-full text-white hover:bg-blue-800 transition-colors">
                    <Linkedin size={18} />
                  </a>
                  <a href="#" className="w-10 h-10 flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white hover:from-purple-600 hover:to-pink-600 transition-colors">
                    <Instagram size={18} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  )
}

export default Header
