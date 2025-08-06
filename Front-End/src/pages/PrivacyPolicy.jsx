'use client'

import React, { useState, useEffect } from 'react'
import {
  Shield,
  Eye,
  Lock,
  Database,
  UserCheck,
  Mail,
  Phone,
  Globe,
  AlertTriangle,
  CheckCircle,
  FileText,
  Users
} from 'lucide-react'

const PrivacyPolicy = () => {
  const title = 'Privacy Policy - Advertisements.lk';
  useEffect(() => {
    document.title = title;
  }, [title]);

  const [isVisible, setIsVisible] = useState({
    hero: false,
    collection: false,
    usage: false,
    sharing: false,
    security: false,
    rights: false,
    contact: false
  })

  useEffect(() => {
    const observerOptions = {
      threshold: 0.2
    }

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.id]: true
          }))
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    const sections = ['hero', 'collection', 'usage', 'sharing', 'security', 'rights', 'contact']
    sections.forEach(section => {
      const element = document.getElementById(section)
      if (element) observer.observe(element)
    })

    return () => {
      sections.forEach(section => {
        const element = document.getElementById(section)
        if (element) observer.unobserve(element)
      })
    }
  }, [])

  const dataTypes = [
    {
      icon: <UserCheck className="h-6 w-6 text-primary" />,
      title: "Personal Information",
      items: ["Name, email address, phone number", "Profile information and preferences", "Account credentials and settings"]
    },
    {
      icon: <FileText className="h-6 w-6 text-primary" />,
      title: "Advertisement Data",
      items: ["Listing details, descriptions, and images", "Pricing and category information", "Boost package purchases and transactions"]
    },
    {
      icon: <Globe className="h-6 w-6 text-primary" />,
      title: "Usage Information",
      items: ["Device information and IP address", "Browsing behavior and search queries", "Location data (if enabled)"]
    }
  ]

  const dataUsage = [
    "Provide and maintain our marketplace platform",
    "Process advertisements and boost package purchases", 
    "Communicate with users about their listings and account",
    "Improve our services through analytics and user feedback",
    "Prevent fraud and ensure platform security",
    "Send promotional emails (with consent)"
  ]

  const userRights = [
    "Access your personal data we hold",
    "Correct inaccurate or incomplete information",
    "Request deletion of your data",
    "Withdraw consent for marketing communications",
    "Data portability for your advertisements",
    "Object to processing for legitimate interests"
  ]

  return (
    <main className="pt-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Hero Section */}
      <section
        id="hero"
        className={`relative px-6 py-24 sm:py-32 lg:px-8 overflow-hidden transition-opacity duration-1000 ${isVisible.hero ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="absolute inset-0 -z-10">
          <div className="bg-white dark:bg-gray-900 bg-opacity-90 dark:bg-opacity-90 absolute inset-0"></div>
          <div className="bg-gradient-to-r from-blue-100 to-blue-50 dark:from-gray-800 dark:to-gray-900 opacity-30 dark:opacity-60 absolute inset-0"></div>
        </div>

        <div className="mx-auto max-w-7xl text-center">
          <div className="flex justify-center mb-6">
            <Shield className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            Privacy Policy
          </h1>
          <p className="text-lg sm:text-xl max-w-3xl mx-auto text-gray-700 dark:text-gray-300">
            Your privacy is important to us. This policy explains how Advertisements.lk collects, uses, and protects your personal information.
          </p>
          <div className="mt-8 text-sm text-gray-600 dark:text-gray-400">
            <p>Last updated: January 2025</p>
          </div>
        </div>
      </section>

      {/* Data Collection */}
      <section
        id="collection"
        className={`py-16 transition-transform duration-1000 ${isVisible.collection ? 'translate-y-0' : 'translate-y-10'}`}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight">Information We Collect</h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                We collect information to provide you with the best marketplace experience
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {dataTypes.map((type, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center mb-4">
                    {type.icon}
                    <h3 className="ml-3 text-xl font-semibold">{type.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {type.items.map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mr-2 mt-1" />
                        <span className="text-gray-600 dark:text-gray-400">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How We Use Data */}
      <section
        id="usage"
        className={`py-16 bg-gray-50 dark:bg-gray-800 transition-opacity duration-1000 ${isVisible.usage ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight">How We Use Your Information</h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                We use your data responsibly to enhance your experience on our platform
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dataUsage.map((usage, index) => (
                <div key={index} className="flex items-start bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <Database className="h-6 w-6 text-primary flex-shrink-0 mr-4 mt-1" />
                  <p className="text-gray-700 dark:text-gray-300">{usage}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Data Sharing */}
      <section
        id="sharing"
        className={`py-16 transition-transform duration-1000 ${isVisible.sharing ? 'translate-y-0' : 'translate-y-10'}`}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold tracking-tight mb-8">Data Sharing and Disclosure</h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Users className="h-6 w-6 text-primary mr-2" />
                    We Share Information With:
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mr-2 mt-1" />
                      <span className="text-gray-600 dark:text-gray-400">Other users (for advertisements and communications)</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mr-2 mt-1" />
                      <span className="text-gray-600 dark:text-gray-400">Payment processors (for boost package purchases)</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mr-2 mt-1" />
                      <span className="text-gray-600 dark:text-gray-400">Service providers (hosting, analytics, customer support)</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <AlertTriangle className="h-6 w-6 text-amber-500 mr-2" />
                    We Never:
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-red-500 flex-shrink-0 mr-2 mt-1" />
                      <span className="text-gray-600 dark:text-gray-400">Sell your personal data to third parties</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-red-500 flex-shrink-0 mr-2 mt-1" />
                      <span className="text-gray-600 dark:text-gray-400">Share data without your consent (except as required by law)</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-red-500 flex-shrink-0 mr-2 mt-1" />
                      <span className="text-gray-600 dark:text-gray-400">Use your data for purposes not described in this policy</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security */}
      <section
        id="security"
        className={`py-16 bg-gray-50 dark:bg-gray-800 transition-opacity duration-1000 ${isVisible.security ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-8">Data Security</h2>
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
              <Lock className="h-16 w-16 text-primary mx-auto mb-6" />
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                We implement industry-standard security measures to protect your personal information, including encryption, secure servers, and regular security audits.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="bg-blue-100 dark:bg-gray-800 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <Lock className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-2">Encrypted Data</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">All sensitive data is encrypted in transit and at rest</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-100 dark:bg-gray-800 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-2">Secure Servers</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Protected by firewalls and intrusion detection systems</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-100 dark:bg-gray-800 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <Eye className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-2">Regular Audits</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Continuous monitoring and security assessments</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Your Rights */}
      <section
        id="rights"
        className={`py-16 transition-transform duration-1000 ${isVisible.rights ? 'translate-y-0' : 'translate-y-10'}`}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold tracking-tight mb-8">Your Privacy Rights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userRights.map((right, index) => (
                <div key={index} className="flex items-start bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mr-4 mt-1" />
                  <p className="text-gray-700 dark:text-gray-300">{right}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                To exercise any of these rights, please contact us using the information below.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section
        id="contact"
        className={`py-16 bg-gray-50 dark:bg-gray-800 transition-opacity duration-1000 ${isVisible.contact ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-8">Contact Us</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              If you have any questions about this Privacy Policy or our data practices, please reach out to us.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <Mail className="h-8 w-8 text-primary mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Email</h4>
                <p className="text-gray-600 dark:text-gray-400">privacy@advertisements.lk</p>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <Phone className="h-8 w-8 text-primary mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Phone</h4>
                <p className="text-gray-600 dark:text-gray-400">+94 11 234 5678</p>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <FileText className="h-8 w-8 text-primary mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Address</h4>
                <p className="text-gray-600 dark:text-gray-400">Colombo, Sri Lanka</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default PrivacyPolicy