'use client'

import React, { useState, useEffect } from 'react'
import { 
  Trophy, 
  Users, 
  Globe, 
  CheckCircle, 
  MessageSquare, 
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Star
} from 'lucide-react'

const About = () => {
  // For scroll animations if needed
  const [isVisible, setIsVisible] = useState({
    hero: false,
    stats: false,
    mission: false,
    team: false,
    testimonials: false
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
    
    const sections = ['hero', 'stats', 'mission', 'team', 'testimonials']
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

  const testimonials = [
    {
      name: 'Dinesh Kumar',
      role: 'Small Business Owner',
      content: 'Advertisements.lk transformed my business. I was able to reach customers from across Sri Lanka that I never would have found otherwise.',
      rating: 5
    },
    {
      name: 'Priyanka Mendis',
      role: 'Regular User',
      content: 'I have both bought and sold on this platform and the experience has always been smooth. The team is responsive whenever I have questions.',
      rating: 5
    },
    {
      name: 'Asif Mohammed',
      role: 'Electronics Retailer',
      content: 'The targeted advertising options have helped me find the exact customers I am looking for. My sales have increased by 40% since joining.',
      rating: 4
    }
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
          <div className="bg-gradient-to-r from-orange-100 to-orange-50 dark:from-gray-800 dark:to-gray-900 opacity-30 dark:opacity-60 absolute inset-0"></div>
        </div>
        
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            About <span className="text-black dark:text-white">ADvertise</span>
            <span className="text-primary">ments.lk</span>
          </h1>
          <p className="text-lg sm:text-xl max-w-3xl mx-auto text-gray-700 dark:text-gray-300">
            Sri Lanka's premier online marketplace, connecting buyers and sellers across the nation since 2015. Our platform enables safe, convenient trading for individuals and businesses.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section 
        id="stats" 
        className={`py-16 bg-gray-50 dark:bg-gray-800 transition-transform duration-1000 ${isVisible.stats ? 'translate-y-0' : 'translate-y-10'}`}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight">Trusted by thousands across Sri Lanka</h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                We've grown from a small startup to Sri Lanka's #1 marketplace
              </p>
            </div>
            <dl className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-3 rounded-full bg-orange-100 dark:bg-gray-800 mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <dt className="text-4xl font-bold text-gray-900 dark:text-white">500K+</dt>
                <dd className="mt-2 text-base text-gray-600 dark:text-gray-400">Active Users</dd>
              </div>
              <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-3 rounded-full bg-orange-100 dark:bg-gray-800 mb-4">
                  <Globe className="h-8 w-8 text-primary" />
                </div>
                <dt className="text-4xl font-bold text-gray-900 dark:text-white">25+</dt>
                <dd className="mt-2 text-base text-gray-600 dark:text-gray-400">Districts Covered</dd>
              </div>
              <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-3 rounded-full bg-orange-100 dark:bg-gray-800 mb-4">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <dt className="text-4xl font-bold text-gray-900 dark:text-white">1.2M+</dt>
                <dd className="mt-2 text-base text-gray-600 dark:text-gray-400">Completed Transactions</dd>
              </div>
              <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-3 rounded-full bg-orange-100 dark:bg-gray-800 mb-4">
                  <Trophy className="h-8 w-8 text-primary" />
                </div>
                <dt className="text-4xl font-bold text-gray-900 dark:text-white">8</dt>
                <dd className="mt-2 text-base text-gray-600 dark:text-gray-400">Industry Awards</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section 
        id="mission" 
        className={`py-16 transition-opacity duration-1000 ${isVisible.mission ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold tracking-tight mb-6">Our Mission & Vision</h2>
                <p className="mb-4 text-gray-700 dark:text-gray-300">
                  At Advertisements.lk, we're on a mission to create Sri Lanka's most trusted and convenient marketplace where anyone can buy, sell, and find exactly what they're looking for.
                </p>
                <p className="mb-4 text-gray-700 dark:text-gray-300">
                  We envision a platform that not only facilitates transactions but also empowers small businesses, entrepreneurs, and everyday Sri Lankans to participate in the digital economy.
                </p>
                <p className="mb-6 text-gray-700 dark:text-gray-300">
                  Our commitment to security, user satisfaction, and continuous improvement guides everything we do, from feature development to customer support.
                </p>
              </div>
              <div>
                <h2 className="text-3xl font-bold tracking-tight mb-6">Our Values</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mr-3 mt-1" />
                    <p className="text-gray-700 dark:text-gray-300">Creating a safe marketplace with verified users and secure payment options</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mr-3 mt-1" />
                    <p className="text-gray-700 dark:text-gray-300">Supporting local businesses through targeted advertising solutions</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mr-3 mt-1" />
                    <p className="text-gray-700 dark:text-gray-300">Building innovative tools to improve the buying and selling experience</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section 
        id="testimonials" 
        className={`py-16 bg-gray-50 dark:bg-gray-800 transition-opacity duration-1000 ${isVisible.testimonials ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight">What Our Users Say</h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                Discover why thousands choose Advertisements.lk every day
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 italic">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-3">
                      <span className="text-lg font-bold">{testimonial.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h4 className="font-bold">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default About