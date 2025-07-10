// Front-End/src/components/Footer.jsx - Updated with logo support
'use client'

import React, {useState, useEffect} from 'react'
import {
    Facebook,
    Twitter,
    Linkedin,
    Instagram,
    MapPin,
    Phone,
    Mail,
    ArrowRight
} from 'lucide-react'
import {useSelector} from 'react-redux'
import {getPublicSettings} from '../api/siteSettingsApi'

const Footer = () => {
    const isDark = useSelector((state) => state.theme.isDark)
    const [logoSettings, setLogoSettings] = useState({
        logo: null,
        logoAlt: 'ADvertisements.lk'
    })

    // Fetch logo settings on component mount
    useEffect(() => {
        const fetchLogoSettings = async () => {
            try {
                const settings = await getPublicSettings();
                setLogoSettings({
                    logo: settings.logo,
                    logoAlt: settings.logoAlt || 'ADvertisements.lk'
                });
            } catch (error) {
                console.error('Error fetching logo settings:', error);
                // Use default values if fetch fails
                setLogoSettings({
                    logo: null,
                    logoAlt: 'ADvertisements.lk'
                });
            }
        };

        fetchLogoSettings();
    }, [])

    const mainMenuLinks = [
        {name: 'Home', href: '/'},
        {name: 'About Us', href: '/about'},
        {name: 'Contact Us', href: '/contact'},
        {name: 'Business', href: '/business'},
        {name: 'Categories', href: '/categories'}
    ]

    const supportLinks = [
        {name: 'Privacy Policy', href: '/privacy'},
        {name: 'Terms & Conditions', href: '/terms'},
        {name: 'FAQ', href: '/faq'},
        {name: 'Help Center', href: '/help'},
        {name: 'How to Sell', href: '/how-to-sell'},
    ]

    // Logo component for footer
    const FooterLogo = () => {
        if (logoSettings.logo) {
            return (
                <div className="flex items-center">
                    <img
                        src={logoSettings.logo}
                        alt={logoSettings.logoAlt}
                        className="h-10 w-auto max-w-48 object-contain mr-3"
                    />
                    <div className="text-xl font-bold tracking-tight">
                        <span className="text-black dark:text-white">ADvertise</span>
                        <span className="text-primary">ments.lk</span>
                    </div>
                </div>
            );
        } else {
            // Fallback to text logo
            return (
                <a href="/" className="text-2xl font-bold tracking-tight">
                    <span className="text-black dark:text-white">ADvertise</span>
                    <span className="text-primary">ments.lk</span>
                </a>
            );
        }
    };

    return (
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            {/* Main Footer */}
            <div className="mx-auto max-w-7xl px-4 pt-12 pb-8 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {/* First Column - Logo & Social */}
                    <div className="space-y-6">
                        <div>
                            <FooterLogo/>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Sri Lanka's #1 marketplace for buying and selling goods and services.
                            Find everything you need or sell your items easily.
                        </p>

                        {/* Social Links */}
                        <div className="flex space-x-4">
                            <a href="#"
                               className="w-10 h-10 flex items-center justify-center bg-blue-500 rounded-full text-white hover:bg-blue-600 transition-colors">
                                <Facebook size={18}/>
                            </a>
                            <a href="#"
                               className="w-10 h-10 flex items-center justify-center bg-blue-700 rounded-full text-white hover:bg-blue-800 transition-colors">
                                <Linkedin size={18}/>
                            </a>
                            <a href="#"
                               className="w-10 h-10 flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white hover:from-purple-600 hover:to-pink-600 transition-colors">
                                <Instagram size={18}/>
                            </a>
                        </div>
                    </div>

                    {/* Second Column - Main Menu */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white mb-4">
                            Quick Links
                        </h3>
                        <ul className="space-y-3">
                            {mainMenuLinks.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors flex items-center"
                                    >
                                        <ArrowRight size={14} className="mr-2"/>
                                        <span>{link.name}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Third Column - Support Menu */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white mb-4">
                            Support
                        </h3>
                        <ul className="space-y-3">
                            {supportLinks.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors flex items-center"
                                    >
                                        <ArrowRight size={14} className="mr-2"/>
                                        <span>{link.name}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Fourth Column - Contact */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white mb-4">
                            Contact Us
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <MapPin className="mr-3 h-5 w-5 text-primary flex-shrink-0"/>
                                <span className="text-gray-600 dark:text-gray-400">
                  123 Main Street, Colombo 03, Sri Lanka
                </span>
                            </div>
                            <div className="flex items-center">
                                <Phone className="mr-3 h-5 w-5 text-primary flex-shrink-0"/>
                                <a href="tel:+94115555555"
                                   className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary">
                                    +94 11 555 5555
                                </a>
                            </div>
                            <div className="flex items-center">
                                <Mail className="mr-3 h-5 w-5 text-primary flex-shrink-0"/>
                                <a href="mailto:support@advertisements.lk"
                                   className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary">
                                    support@advertisements.lk
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Footer */}
            <div className="bg-gray-100 dark:bg-gray-800 py-4">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="md:flex md:items-center md:justify-between">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            &copy; {new Date().getFullYear()} ADvertisements.lk. All rights reserved.
                        </div>
                        <div className="mt-4 md:mt-0">
                            <img
                                src="/payment-methods.png"
                                alt="Payment Methods"
                                className="h-6"
                                onError={(e) => {
                                    e.target.style.display = 'none'
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer