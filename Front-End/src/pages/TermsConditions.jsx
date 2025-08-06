'use client'

import React, { useState, useEffect } from 'react'
import {
  FileText,
  Shield,
  AlertTriangle,
  DollarSign,
  Users,
  Gavel,
  CheckCircle,
  XCircle,
  Eye,
  MessageSquare,
  CreditCard,
  Ban
} from 'lucide-react'

const TermsConditions = () => {
  const title = 'Terms and Conditions - Advertisements.lk';
  useEffect(() => {
    document.title = title;
  }, [title]);

  const [isVisible, setIsVisible] = useState({
    hero: false,
    acceptance: false,
    services: false,
    accounts: false,
    listings: false,
    payments: false,
    prohibited: false,
    liability: false,
    termination: false,
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

    const sections = ['hero', 'acceptance', 'services', 'accounts', 'listings', 'payments', 'prohibited', 'liability', 'termination', 'contact']
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

  const prohibitedItems = [
    "Illegal goods or services",
    "Stolen or counterfeit items", 
    "Adult content or services",
    "Weapons, drugs, or hazardous materials",
    "Items violating intellectual property rights",
    "Misleading or false advertisements",
    "Pyramid schemes or multi-level marketing",
    "Items requiring special licenses without proper documentation"
  ]

  const userResponsibilities = [
    "Provide accurate and truthful information in listings",
    "Maintain the security of your account credentials",
    "Respond to buyer inquiries in a timely manner",
    "Honor transactions and agreements made through the platform",
    "Report suspicious or fraudulent activity",
    "Respect other users and communicate professionally"
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
          <div className="bg-gradient-to-r from-green-100 to-green-50 dark:from-gray-800 dark:to-gray-900 opacity-30 dark:opacity-60 absolute inset-0"></div>
        </div>

        <div className="mx-auto max-w-7xl text-center">
          <div className="flex justify-center mb-6">
            <Gavel className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            Terms and Conditions
          </h1>
          <p className="text-lg sm:text-xl max-w-3xl mx-auto text-gray-700 dark:text-gray-300">
            Please read these terms carefully before using Advertisements.lk. By accessing our platform, you agree to be bound by these terms.
          </p>
          <div className="mt-8 text-sm text-gray-600 dark:text-gray-400">
            <p>Last updated: January 2025</p>
          </div>
        </div>
      </section>

      {/* Acceptance */}
      <section
        id="acceptance"
        className={`py-16 transition-transform duration-1000 ${isVisible.acceptance ? 'translate-y-0' : 'translate-y-10'}`}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold tracking-tight mb-8">Acceptance of Terms</h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
              <div className="flex items-start mb-6">
                <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mr-4 mt-1" />
                <div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    By creating an account, posting advertisements, or using any services on Advertisements.lk, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    These terms constitute a legally binding agreement between you and Advertisements.lk. If you do not agree with any part of these terms, you must not use our platform.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    We reserve the right to modify these terms at any time. Changes will be effective upon posting, and continued use of the platform constitutes acceptance of the modified terms.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section
        id="services"
        className={`py-16 bg-gray-50 dark:bg-gray-800 transition-opacity duration-1000 ${isVisible.services ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold tracking-tight mb-8">Our Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center mb-4">
                  <FileText className="h-6 w-6 text-primary mr-3" />
                  <h3 className="text-xl font-semibold">Advertisement Platform</h3>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mr-2 mt-1" />
                    <span className="text-gray-600 dark:text-gray-400">Post and manage classified advertisements</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mr-2 mt-1" />
                    <span className="text-gray-600 dark:text-gray-400">Search and browse listings across categories</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mr-2 mt-1" />
                    <span className="text-gray-600 dark:text-gray-400">Connect buyers with sellers</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center mb-4">
                  <DollarSign className="h-6 w-6 text-primary mr-3" />
                  <h3 className="text-xl font-semibold">Boost Packages</h3>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mr-2 mt-1" />
                    <span className="text-gray-600 dark:text-gray-400">Premium advertisement placement</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mr-2 mt-1" />
                    <span className="text-gray-600 dark:text-gray-400">Increased visibility and reach</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mr-2 mt-1" />
                    <span className="text-gray-600 dark:text-gray-400">Featured listing benefits</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* User Accounts */}
      <section
        id="accounts"
        className={`py-16 transition-transform duration-1000 ${isVisible.accounts ? 'translate-y-0' : 'translate-y-10'}`}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold tracking-tight mb-8">User Accounts and Responsibilities</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Users className="h-6 w-6 text-primary mr-2" />
                  Account Requirements
                </h3>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mr-2 mt-1" />
                      <span className="text-gray-600 dark:text-gray-400">Must be 18 years or older to create an account</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mr-2 mt-1" />
                      <span className="text-gray-600 dark:text-gray-400">Provide accurate and complete information</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mr-2 mt-1" />
                      <span className="text-gray-600 dark:text-gray-400">One account per person or business entity</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mr-2 mt-1" />
                      <span className="text-gray-600 dark:text-gray-400">Keep login credentials secure and confidential</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Shield className="h-6 w-6 text-primary mr-2" />
                  Your Responsibilities
                </h3>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <ul className="space-y-3">
                    {userResponsibilities.slice(0, 4).map((responsibility, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mr-2 mt-1" />
                        <span className="text-gray-600 dark:text-gray-400">{responsibility}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Listing Rules */}
      <section
        id="listings"
        className={`py-16 bg-gray-50 dark:bg-gray-800 transition-opacity duration-1000 ${isVisible.listings ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold tracking-tight mb-8">Advertisement Listing Rules</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center text-green-600 dark:text-green-400">
                  <CheckCircle className="h-6 w-6 mr-2" />
                  Allowed Content
                </h3>
                <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mr-2 mt-1" />
                      <span className="text-gray-600 dark:text-gray-400">Legal goods and services</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mr-2 mt-1" />
                      <span className="text-gray-600 dark:text-gray-400">Accurate descriptions and pricing</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mr-2 mt-1" />
                      <span className="text-gray-600 dark:text-gray-400">Authentic photographs of items</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mr-2 mt-1" />
                      <span className="text-gray-600 dark:text-gray-400">Items you legally own or have authority to sell</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center text-red-600 dark:text-red-400">
                  <Ban className="h-6 w-6 mr-2" />
                  Prohibited Content
                </h3>
                <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <ul className="space-y-3">
                    {prohibitedItems.slice(0, 4).map((item, index) => (
                      <li key={index} className="flex items-start">
                        <XCircle className="h-4 w-4 text-red-500 flex-shrink-0 mr-2 mt-1" />
                        <span className="text-gray-600 dark:text-gray-400">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6">
                <div className="flex items-start">
                  <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">Important Notice</h4>
                    <p className="text-amber-700 dark:text-amber-300">
                      Advertisements.lk reserves the right to remove any listing that violates these terms or Sri Lankan law. 
                      Repeated violations may result in account suspension or termination.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Payments */}
      <section
        id="payments"
        className={`py-16 transition-transform duration-1000 ${isVisible.payments ? 'translate-y-0' : 'translate-y-10'}`}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold tracking-tight mb-8">Payment Terms</h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <CreditCard className="h-6 w-6 text-primary mr-2" />
                    Boost Packages
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mr-2 mt-1" />
                      <span className="text-gray-600 dark:text-gray-400">All payments are processed securely through approved payment gateways</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mr-2 mt-1" />
                      <span className="text-gray-600 dark:text-gray-400">Boost packages are non-refundable once activated</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mr-2 mt-1" />
                      <span className="text-gray-600 dark:text-gray-400">Prices are subject to change with 30 days notice</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Users className="h-6 w-6 text-primary mr-2" />
                    User Transactions
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mr-2 mt-1" />
                      <span className="text-gray-600 dark:text-gray-400">Advertisements.lk is not party to transactions between users</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mr-2 mt-1" />
                      <span className="text-gray-600 dark:text-gray-400">Users are responsible for their own payment arrangements</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mr-2 mt-1" />
                      <span className="text-gray-600 dark:text-gray-400">We recommend secure payment methods and meeting in safe locations</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Liability */}
      <section
        id="liability"
        className={`py-16 bg-gray-50 dark:bg-gray-800 transition-opacity duration-1000 ${isVisible.liability ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold tracking-tight mb-8">Limitation of Liability</h2>
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
              <div className="flex items-start mb-6">
                <Shield className="h-8 w-8 text-primary flex-shrink-0 mr-4 mt-1" />
                <div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Advertisements.lk serves as a platform connecting buyers and sellers. We do not guarantee the accuracy, quality, safety, or legality of items or services listed by users.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Users engage in transactions at their own risk. We strongly recommend verifying items and meeting in safe, public locations for exchanges.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    To the maximum extent permitted by law, Advertisements.lk shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use of our platform.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Termination */}
      <section
        id="termination"
        className={`py-16 transition-transform duration-1000 ${isVisible.termination ? 'translate-y-0' : 'translate-y-10'}`}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold tracking-tight mb-8">Account Termination</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Users className="h-6 w-6 text-primary mr-2" />
                  User-Initiated Termination
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  You may terminate your account at any time by contacting our support team. Upon termination:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mr-2 mt-1" />
                    <span className="text-gray-600 dark:text-gray-400">Active listings will be removed</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mr-2 mt-1" />
                    <span className="text-gray-600 dark:text-gray-400">Account data will be deleted per our Privacy Policy</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <AlertTriangle className="h-6 w-6 text-amber-500 mr-2" />
                  Platform-Initiated Termination
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  We reserve the right to suspend or terminate accounts for:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <XCircle className="h-4 w-4 text-red-500 flex-shrink-0 mr-2 mt-1" />
                    <span className="text-gray-600 dark:text-gray-400">Violation of these terms</span>
                  </li>
                  <li className="flex items-start">
                    <XCircle className="h-4 w-4 text-red-500 flex-shrink-0 mr-2 mt-1" />
                    <span className="text-gray-600 dark:text-gray-400">Fraudulent or illegal activity</span>
                  </li>
                  <li className="flex items-start">
                    <XCircle className="h-4 w-4 text-red-500 flex-shrink-0 mr-2 mt-1" />
                    <span className="text-gray-600 dark:text-gray-400">Abuse of other users</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section
        id="contact"
        className={`py-16 transition-opacity duration-1000 ${isVisible.contact ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-8">Questions About These Terms?</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              If you have any questions about these Terms and Conditions, please contact our legal team.
            </p>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="text-center">
                  <MessageSquare className="h-8 w-8 text-primary mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">Legal Inquiries</h4>
                  <p className="text-gray-600 dark:text-gray-400">legal@advertisements.lk</p>
                </div>
                <div className="text-center">
                  <FileText className="h-8 w-8 text-primary mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">General Support</h4>
                  <p className="text-gray-600 dark:text-gray-400">support@advertisements.lk</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default TermsConditions