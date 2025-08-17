import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { createAdvertisement } from "../../api/advertisementApi.js";
import { getAllCategories } from "../../api/categoryApi.js";
import { useSelector } from "react-redux";

const AddAdvertisement = () => {
    const [ad, setAd] = useState({
        title: '',
        description: '',
        price: '',
        location: '',
        videoUrl: '',
        categoryId: '',
        subcategoryId: '',
        featuredImage: '',
        images: []
    });

    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [featuredImagePreview, setFeaturedImagePreview] = useState(null);
    const [imagesPreviews, setImagesPreviews] = useState([]);
    const [error, setError] = useState('');
    
    const { token } = useSelector((state) => state.auth);

    // Fetch categories on component mount
    useEffect(() => {
        const getCategories = async () => {
            try {
                const response = await getAllCategories();
                setCategories(response);
            } catch (err) {
                console.error("Failed to fetch categories:", err);
                setError("Failed to load categories. Please try again later.");
            }
        };
        
        getCategories();
    }, []);

    // Update subcategories when category changes
    useEffect(() => {
        if (ad.categoryId) {
            const selectedCategory = categories.find(category => category._id === ad.categoryId);
            if (selectedCategory && selectedCategory.subcategories) {
                setSubcategories(selectedCategory.subcategories);
            } else {
                setSubcategories([]);
            }
            setAd(prev => ({ ...prev, subcategoryId: '' }));
        }
    }, [ad.categoryId, categories]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAd(prev => ({ ...prev, [name]: value }));
    };

    const handleDescriptionChange = (value) => {
        setAd(prev => ({ ...prev, description: value }));
    };

    const handleFeaturedImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check the file size
            if (file.size > 1 * 1024 * 1024) { // 1MB limit
                setError('Featured image must be less than 1MB');
                return;
            }

            // Check if the file is an image
            if (!file.type.startsWith('image/')) {
                setError('Featured image must be an image file (JPEG, PNG, etc.)');
                return;
            }
            
            setAd(prev => ({ ...prev, featuredImage: file }));
            setFeaturedImagePreview(URL.createObjectURL(file));
        }
    };

    const handleImagesChange = (e) => {
        const newFiles = Array.from(e.target.files);
        const currentImages = ad.images || [];
      
        // Combine existing and new files
        const combinedFiles = [...currentImages, ...newFiles];
      
        if (combinedFiles.length > 5) {
          setError('You can upload a maximum of 5 images');
          return;
        }
      
        // Check all are images
        const allImages = combinedFiles.every(file => file.type.startsWith('image/'));
        if (!allImages) {
          setError('All files must be images (JPEG, PNG, etc.)');
          return;
        }
      
        setAd(prev => ({ ...prev, images: combinedFiles }));
      
        // Generate previews
        const previews = combinedFiles.map(file => URL.createObjectURL(file));
        setImagesPreviews(previews);
      
        setError('');
      };
      

    const handleRemoveImage = (index) => {
        // Create new arrays without the image at the specified index
        const newImages = [...ad.images];
        newImages.splice(index, 1);
        
        const newPreviews = [...imagesPreviews];
        URL.revokeObjectURL(newPreviews[index]); // Clean up the URL object
        newPreviews.splice(index, 1);
        
        setAd(prev => ({ ...prev, images: newImages }));
        setImagesPreviews(newPreviews);
    };

    const handleRemoveFeaturedImage = () => {
        if (featuredImagePreview) {
            URL.revokeObjectURL(featuredImagePreview);
        }
        setAd(prev => ({ ...prev, featuredImage: null }));
        setFeaturedImagePreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate form
        if (!ad.title || !ad.description || !ad.price || !ad.location || 
            !ad.categoryId || !ad.subcategoryId) {
            setError('Please fill in all required fields');
            return;
        }
        
        setLoading(true);
        setError('');
        
        const formData = new FormData();
        
        // Add text fields
        formData.append('title', ad.title);
        formData.append('description', ad.description);
        formData.append('price', ad.price);
        formData.append('location', ad.location);
        formData.append('videoUrl', ad.videoUrl || '');
        formData.append('categoryId', ad.categoryId);
        formData.append('subcategoryId', ad.subcategoryId);
        
        // Add featured image
        formData.append('featuredImage', ad.featuredImage || '');
        
        // Add additional images
        ad.images.forEach(image => {
            formData.append('images', image);
        });
        
        try {
            const response = await createAdvertisement(formData, token);
            console.log('Advertisement created:', response);
            alert('Your advertisement has been created successfully!');
            
            // Reset form
            setAd({
                title: '',
                description: '',
                price: '',
                location: '',
                videoUrl: '',
                categoryId: '',
                subcategoryId: '',
                featuredImage: null,
                images: []
            });
            setFeaturedImagePreview(null);
            setImagesPreviews([]);
            
        } catch (error) {
            console.error('Error creating advertisement:', error);
            setError(error.response?.data?.message || 'Failed to create advertisement. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 border-b pb-3">Create New Advertisement</h2>
            
            {error && (
                <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <p>{error}</p>
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={ad.title}
                        onChange={handleChange}
                        placeholder="Enter a catchy title for your advertisement"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                        required
                    />
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Description <span className="text-red-500">*</span>
                    </label>
                    <ReactQuill
                        value={ad.description}
                        onChange={handleDescriptionChange}
                        className="bg-white dark:bg-gray-700 dark:text-white"
                        placeholder="Describe your item in detail"
                    />
                </div>

                {/* Price */}
                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Price <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            LKR
                        </span>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={ad.price}
                            onChange={handleChange}
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                            className="w-full pl-7 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                            required
                        />
                    </div>
                </div>

                {/* Category and Subcategory */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Category <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="category"
                            name="categoryId"
                            value={ad.categoryId}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                            required
                        >
                            <option value="">Select a category</option>
                            {categories.map(category => (
                                <option key={category._id} value={category._id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Subcategory <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="subcategory"
                            name="subcategoryId"
                            value={ad.subcategoryId}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                            disabled={!ad.categoryId}
                            required
                        >
                            <option value="">Select a subcategory</option>
                            {subcategories.map(subcategory => (
                                <option key={subcategory._id} value={subcategory._id}>
                                    {subcategory.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Location */}
                <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Location <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        value={ad.location}
                        onChange={handleChange}
                        placeholder="City, State or Region"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                        required
                    />
                </div>

                {/* Video URL */}
                <div>
                    <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Video URL <span className="text-gray-500 text-xs">(optional)</span>
                    </label>
                    <input
                        type="url"
                        id="videoUrl"
                        name="videoUrl"
                        value={ad.videoUrl}
                        onChange={handleChange}
                        placeholder="https://youtube.com/watch?v=..."
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                    />
                </div>

                {/* Featured Image */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Featured Image
                    </label>
                    <div className="flex items-center justify-center w-full">
                        {!featuredImagePreview ? (
                            <label htmlFor="featuredImage" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                    </svg>
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        PNG, JPG or GIF (MAX. 2MB)
                                    </p>
                                </div>
                                <input 
                                    id="featuredImage" 
                                    name="featuredImage" 
                                    type="file" 
                                    accept="image/*"
                                    className="hidden" 
                                    onChange={handleFeaturedImageChange} 
                                />
                            </label>
                        ) : (
                            <div className="relative">
                                <img 
                                    src={featuredImagePreview} 
                                    alt="Featured Preview" 
                                    className="max-h-64 rounded-lg object-contain" 
                                />
                                <button
                                    type="button"
                                    onClick={handleRemoveFeaturedImage}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Additional Images */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Additional Images <span className="text-gray-500 text-xs">(max 5)</span>
                    </label>
                    <div className="flex flex-col items-center justify-center w-full">
                        <label htmlFor="images" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg className="w-8 h-8 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                </svg>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Upload up to 5 more images
                                </p>
                            </div>
                            <input 
                                id="images" 
                                name="images" 
                                type="file" 
                                multiple
                                accept="image/*"
                                className="hidden" 
                                onChange={handleImagesChange} 
                            />
                        </label>
                        
                        {imagesPreviews.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-4 w-full">
                                {imagesPreviews.map((preview, index) => (
                                    <div key={index} className="relative">
                                        <img 
                                            src={preview} 
                                            alt={`Preview ${index + 1}`} 
                                            className="h-24 w-full object-cover rounded-lg" 
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(index)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Submit button */}
                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-6 py-3 rounded-md text-white font-medium ${
                            loading 
                                ? "bg-gray-400 cursor-not-allowed" 
                                : "bg-primary hover:bg-primary/90"
                        }`}
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creating...
                            </>
                        ) : (
                            "Create Advertisement"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddAdvertisement;