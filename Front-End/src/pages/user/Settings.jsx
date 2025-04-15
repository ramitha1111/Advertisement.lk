import React, { useState } from 'react'
import { User, Mail, Phone, Lock, Bell, Shield } from 'lucide-react'
import useAuth from '../../hooks/useAuth'

const Settings = () => {
  const { user } = useAuth()
  const [activeSection, setActiveSection] = useState('profile')
  
  // Form state for profile details
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || ''
  })
  
  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfile(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    // Submit logic would go here
    alert('Profile updated successfully!')
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="md:flex">
        {/* Settings navigation */}
        <div className="md:w-64 border-r border-gray-200 dark:border-gray-700">
          <nav className="p-4 space-y-1">
            <button
              onClick={() => setActiveSection('profile')}
              className={`w-full flex items-center px-4 py-3 text-sm rounded-md ${
                activeSection === 'profile' 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <User size={18} className="mr-3" />
              Profile Information
            </button>
            
            <button
              onClick={() => setActiveSection('security')}
              className={`w-full flex items-center px-4 py-3 text-sm rounded-md ${
                activeSection === 'security' 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Lock size={18} className="mr-3" />
              Security
            </button>
            
            <button
              onClick={() => setActiveSection('notifications')}
              className={`w-full flex items-center px-4 py-3 text-sm rounded-md ${
                activeSection === 'notifications' 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Bell size={18} className="mr-3" />
              Notifications
            </button>
            
            <button
              onClick={() => setActiveSection('privacy')}
              className={`w-full flex items-center px-4 py-3 text-sm rounded-md ${
                activeSection === 'privacy' 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Shield size={18} className="mr-3" />
              Privacy
            </button>
          </nav>
        </div>
        
        {/* Settings content */}
        <div className="p-6 flex-1">
          {activeSection === 'profile' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Profile Information</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={profile.name}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={profile.email}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={profile.phone}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={profile.location}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-md"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
          
          {activeSection === 'security' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Security Settings</h2>
              <p className="text-gray-600 dark:text-gray-400">Security settings content will be displayed here.</p>
            </div>
          )}
          
          {activeSection === 'notifications' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Notification Preferences</h2>
              <p className="text-gray-600 dark:text-gray-400">Notification settings content will be displayed here.</p>
            </div>
          )}
          
          {activeSection === 'privacy' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Privacy Settings</h2>
              <p className="text-gray-600 dark:text-gray-400">Privacy settings content will be displayed here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Settings