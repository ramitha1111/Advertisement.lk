'use client'

import React, {useEffect, useState} from 'react'
import { sendMessage } from '../api/contactApi'
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  CheckCircle,
  AlertCircle,
  User,
  MessageSquare
} from 'lucide-react'

const Contact = () => {
  const title = 'Contact Us - Advertisements.lk';
  useEffect(() => {
    document.title = title;
  }, [title]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const [loading, setLoading] = useState(false)
  const [submitStatus, setSubmitStatus] = useState({
    submitted: false,
    success: false,
    message: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await sendMessage(formData)

      setSubmitStatus({
        submitted: true,
        success: true,
        message: response.message || 'Message sent successfully!'
      })

      // Reset form on success
      setFormData({
        name: '',
        email: '',
        message: ''
      })

    } catch (error) {
      setSubmitStatus({
        submitted: true,
        success: false,
        message: error.response?.data?.error || 'Failed to send message. Please try again.'
      })
    } finally {
      setLoading(false)

      // Auto-clear status message after 5 seconds
      setTimeout(() => {
        setSubmitStatus(prev => ({
          ...prev,
          submitted: false
        }))
      }, 5000)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-900 py-12 md:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Contact Us
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Have questions or feedback? We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information with Map */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            {/* Map */}
            <div className="h-64 bg-gray-200 dark:bg-gray-700 relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126743.58585959923!2d79.8211859697004!3d6.921831531017279!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae253d10f7a7003%3A0x320b2e4d32d3838d!2sColombo%2C%20Sri%20Lanka!5e0!3m2!1sen!2sus!4v1650126281830!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Office Location"
              ></iframe>
            </div>

            {/* Contact Info */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Get In Touch
              </h3>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary bg-opacity-10 text-primary">
                      <MapPin className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-base font-medium text-gray-900 dark:text-white">
                      Our Office
                    </h4>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      123 Main Street, Colombo 03, Sri Lanka
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary bg-opacity-10 text-primary">
                      <Phone className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-base font-medium text-gray-900 dark:text-white">
                      Phone Number
                    </h4>
                    <a href="tel:+94115555555" className="mt-1 text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary block">
                      +94 11 555 5555
                    </a>
                    <a href="tel:+94115555556" className="mt-1 text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary block">
                      +94 11 555 5556
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary bg-opacity-10 text-primary">
                      <Mail className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-base font-medium text-gray-900 dark:text-white">
                      Email Address
                    </h4>
                    <a href="mailto:support@advertisements.lk" className="mt-1 text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary block">
                      support@advertisements.lk
                    </a>
                    <a href="mailto:info@advertisements.lk" className="mt-1 text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary block">
                      info@advertisements.lk
                    </a>
                  </div>
                </div>

                {/* Social Media */}
                <div className="pt-4">
                  <h4 className="text-base font-medium text-gray-900 dark:text-white mb-3">
                    Follow Us
                  </h4>
                  <div className="flex space-x-3">
                    <a href="#" className="w-10 h-10 flex items-center justify-center bg-blue-500 rounded-full text-white hover:bg-blue-600 transition-colors">
                      <Facebook size={18} />
                    </a>
                    <a href="#" className="w-10 h-10 flex items-center justify-center bg-sky-500 rounded-full text-white hover:bg-sky-600 transition-colors">
                      <Twitter size={18} />
                    </a>
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
          </div>

          {/* Contact Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-6 md:p-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Send Us a Message
              </h3>

              {submitStatus.submitted && (
                <div className={`mb-6 rounded-md p-4 ${
                  submitStatus.success 
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200' 
                    : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
                }`}>
                  <div className="flex">
                    <div className="flex-shrink-0">
                      {submitStatus.success ? (
                        <CheckCircle className="h-5 w-5 text-green-400" aria-hidden="true" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">
                        {submitStatus.message}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="block w-full mt-2 mb-4 rounded-md border-gray-300 dark:border-gray-700 pl-10 pt-4 pb-4 focus:border-primary focus:ring-primary dark:bg-gray-900 dark:text-white sm:text-sm"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full mt-2 mb-4 rounded-md border-gray-300 dark:border-gray-700 pl-10 pt-4 pb-4 focus:border-primary focus:ring-primary dark:bg-gray-900 dark:text-white sm:text-sm"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Your Message
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex pl-3 pt-5">
                      <MessageSquare className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className="block w-full rounded-md mt-2 mb-4  border-gray-300 dark:border-gray-700 pl-10 pt-4 pb-4 focus:border-primary focus:ring-primary dark:bg-gray-900 dark:text-white sm:text-sm"
                      placeholder="Type your message here..."
                      required
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="relative overflow-hidden group w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    <span className="relative z-10 flex items-center">
                      {loading ? 'Sending...' : 'Send Message'}
                      <Send size={16} className="ml-2" />
                    </span>
                    <span className="absolute inset-0 bg-orange-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
