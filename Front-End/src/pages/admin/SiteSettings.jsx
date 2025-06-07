import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const SiteSettings = () => {
  const [activeTab, setActiveTab] = useState('logo');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Logo settings state
  const [logoSettings, setLogoSettings] = useState({
    currentLogo: null,
    newLogo: null,
    logoPreview: null
  });
  
  // Categories state (for future implementation)
  const [categoriesSettings, setCategoriesSettings] = useState({
    categories: [],
    newCategory: {
      name: '',
      subcategories: [],
      features: [],
      categoryImage: null
    }
  });

  const { token } = useSelector((state) => state.auth);
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  
  useEffect(() => {
    fetchCurrentSettings();
  }, []);

  const fetchCurrentSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/api/site-settings`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setLogoSettings(prev => ({
          ...prev,
          currentLogo: data.logo
        }));
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError('Failed to load current settings');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        setError('Please upload a valid image file (JPEG, PNG, GIF)');
        return;
      }

      // Validate file size (2MB max)
      const maxSize = 2 * 1024 * 1024;
      if (file.size > maxSize) {
        setError('File size must be less than 2MB');
        return;
      }

      setLogoSettings(prev => ({
        ...prev,
        newLogo: file,
        logoPreview: URL.createObjectURL(file)
      }));
      setError('');
    }
  };

  const handleLogoSubmit = async (e) => {
    e.preventDefault();
    
    if (!logoSettings.newLogo) {
      setError('Please select a logo to upload');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const formData = new FormData();
      formData.append('logo', logoSettings.newLogo);

      const response = await fetch(`${BASE_URL}/api/site-settings/logo`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Logo updated successfully!');
        setLogoSettings(prev => ({
          ...prev,
          currentLogo: data.logo,
          newLogo: null,
          logoPreview: null
        }));
        // Clear file input
        document.getElementById('logo-upload').value = '';
      } else {
        setError(data.message || 'Failed to update logo');
      }
    } catch (err) {
      console.error('Error updating logo:', err);
      setError('Failed to update logo. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  const renderLogoTab = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Current Logo</h3>
        {logoSettings.currentLogo ? (
          <div className="flex items-center space-x-4">
            <img 
              src={logoSettings.currentLogo} 
              alt="Current Logo" 
              className="h-16 w-auto object-contain bg-white p-2 rounded border"
            />
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p>Current website logo</p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No logo currently set</p>
        )}
      </div>

      <form onSubmit={handleLogoSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Upload New Logo
          </label>
          <input
            id="logo-upload"
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="block w-full text-sm text-gray-500 dark:text-gray-400
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-medium
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100
                      dark:file:bg-blue-900 dark:file:text-blue-300"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Supported formats: JPEG, PNG, GIF. Max size: 2MB
          </p>
        </div>

        {logoSettings.logoPreview && (
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Preview</h4>
            <img 
              src={logoSettings.logoPreview} 
              alt="Logo Preview" 
              className="h-16 w-auto object-contain bg-white p-2 rounded border"
            />
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading || !logoSettings.newLogo}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
                     disabled:opacity-50 disabled:cursor-not-allowed
                     dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            {loading ? 'Updating...' : 'Update Logo'}
          </button>
          
          {logoSettings.logoPreview && (
            <button
              type="button"
              onClick={() => {
                setLogoSettings(prev => ({
                  ...prev,
                  newLogo: null,
                  logoPreview: null
                }));
                document.getElementById('logo-upload').value = '';
                clearMessages();
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );

  const renderCategoriesTab = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              Categories Management - Coming Soon
            </h3>
            <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
              <p>Category management features will be implemented here. This will include:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Add, edit, and delete categories</li>
                <li>Manage subcategories and features</li>
                <li>Upload category images</li>
                <li>Reorder categories</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading && activeTab === 'logo' && !logoSettings.currentLogo) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Site Settings</h1>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex justify-between items-center">
          <p>{error}</p>
          <button onClick={clearMessages} className="text-red-700 hover:text-red-900">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 flex justify-between items-center">
          <p>{success}</p>
          <button onClick={clearMessages} className="text-green-700 hover:text-green-900">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('logo')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'logo'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Logo Settings
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'categories'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Categories
            <span className="ml-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
              Coming Soon
            </span>
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'logo' && renderLogoTab()}
        {activeTab === 'categories' && renderCategoriesTab()}
      </div>
    </div>
  );
};

export default SiteSettings;