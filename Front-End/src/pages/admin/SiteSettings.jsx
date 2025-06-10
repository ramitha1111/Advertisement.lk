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

  // Categories state - moved to component level
  const [allCategories, setAllCategories] = useState([]);
  const [homepageCategories, setHomepageCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(1);
  const [draggingItem, setDraggingItem] = useState(null);

  const { token } = useSelector((state) => state.auth);
  const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  useEffect(() => {
    fetchCurrentSettings();
    if (activeTab === 'categories') {
      fetchAllCategories();
      fetchHomepageCategories();
    }
  }, [activeTab]);

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

  const fetchAllCategories = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/categories`);
      const data = await response.json();
      setAllCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories');
    }
  };

  const fetchHomepageCategories = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/site-settings/homepage-categories`);
      const data = await response.json();
      setHomepageCategories(data);
    } catch (err) {
      console.error('Error fetching homepage categories:', err);
      setError('Failed to load homepage categories');
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
        const fileInput = document.getElementById('logo-upload');
        if (fileInput) fileInput.value = '';
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

  const handleAddCategory = async () => {
    if (!selectedCategory) {
      setError('Please select a category');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/api/site-settings/homepage-categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          categoryId: selectedCategory,
          order: selectedOrder
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Category added to homepage successfully!');
        await fetchHomepageCategories();
        setSelectedCategory('');
        setSelectedOrder(homepageCategories.length + 2);
      } else {
        setError(data.message || 'Failed to add category');
      }
    } catch (err) {
      console.error('Error adding category:', err);
      setError('Failed to add category. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCategory = async (categoryId) => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/api/site-settings/homepage-categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Category removed from homepage successfully!');
        await fetchHomepageCategories();
      } else {
        setError(data.message || 'Failed to remove category');
      }
    } catch (err) {
      console.error('Error removing category:', err);
      setError('Failed to remove category. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (e, category, index) => {
    setDraggingItem({ category, index });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, dropIndex) => {
    e.preventDefault();
    if (!draggingItem || draggingItem.index === dropIndex) return;

    const newCategories = [...homepageCategories];
    const [removed] = newCategories.splice(draggingItem.index, 1);
    newCategories.splice(dropIndex, 0, removed);

    // Update local state immediately for better UX
    setHomepageCategories(newCategories);

    // Prepare reorder data
    const categoryOrders = newCategories.map((cat, index) => ({
      categoryId: cat._id,
      newOrder: index + 1
    }));

    try {
      const response = await fetch(`${BASE_URL}/api/site-settings/homepage-categories/reorder`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ categoryOrders })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Categories reordered successfully!');
      } else {
        setError(data.message || 'Failed to reorder categories');
        await fetchHomepageCategories(); // Revert on error
      }
    } catch (err) {
      console.error('Error reordering categories:', err);
      setError('Failed to reorder categories');
      await fetchHomepageCategories(); // Revert on error
    } finally {
      setDraggingItem(null);
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
                      const fileInput = document.getElementById('logo-upload');
                      if (fileInput) fileInput.value = '';
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

  const renderCategoriesTab = () => {
    const availableCategories = allCategories.filter(cat =>
        !homepageCategories.some(hCat => hCat._id === cat._id)
    );

    return (
        <div className="space-y-6">
          {/* Current Homepage Categories */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Current Homepage Categories ({homepageCategories.length}/5)
            </h3>

            {homepageCategories.length === 0 ? (
                <div className="bg-gray-50 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    No categories selected for homepage display
                  </p>
                </div>
            ) : (
                <div className="space-y-2">
                  {homepageCategories.map((category, index) => (
                      <div
                          key={category._id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, category, index)}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, index)}
                          className={`flex items-center justify-between p-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg cursor-move hover:shadow-md transition-shadow ${
                              draggingItem?.index === index ? 'opacity-50' : ''
                          }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full font-medium text-sm">
                            {index + 1}
                          </div>
                          {category.categoryImage && (
                              <img
                                  src={category.categoryImage}
                                  alt={category.name}
                                  className="w-12 h-12 object-cover rounded"
                              />
                          )}
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{category.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {category.subcategories?.length || 0} subcategories
                            </p>
                          </div>
                        </div>
                        <button
                            onClick={() => handleRemoveCategory(category._id)}
                            disabled={loading}
                            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                        </button>
                      </div>
                  ))}
                </div>
            )}

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Drag and drop to reorder categories
            </p>
          </div>

          {/* Add New Category */}
          {homepageCategories.length < 5 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Add Category to Homepage
                </h3>

                <div className="flex items-end gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Select Category
                    </label>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={loading || availableCategories.length === 0}
                    >
                      <option value="">Select a category</option>
                      {availableCategories.map(cat => (
                          <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="w-32">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Order
                    </label>
                    <select
                        value={selectedOrder}
                        onChange={(e) => setSelectedOrder(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={loading}
                    >
                      {[1, 2, 3, 4, 5].map(num => (
                          <option key={num} value={num} disabled={homepageCategories.some(cat => cat.order === num)}>
                            {num}
                          </option>
                      ))}
                    </select>
                  </div>

                  <button
                      onClick={handleAddCategory}
                      disabled={loading || !selectedCategory}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700
                         disabled:opacity-50 disabled:cursor-not-allowed
                         dark:bg-blue-500 dark:hover:bg-blue-600"
                  >
                    {loading ? 'Adding...' : 'Add Category'}
                  </button>
                </div>

                {availableCategories.length === 0 && (
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      All categories are already added to the homepage
                    </p>
                )}
              </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
              Instructions
            </h4>
            <ul className="list-disc list-inside text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>You can select up to 5 categories to display on the homepage</li>
              <li>Drag and drop categories to change their display order</li>
              <li>The order number determines the position on the homepage (1 = first)</li>
              <li>Click the trash icon to remove a category from the homepage</li>
            </ul>
          </div>
        </div>
    );
  };

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
