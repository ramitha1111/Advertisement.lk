import React, { useState, useEffect } from 'react';
import { getCategoryById, updateCategory } from "../../api/categoryApi";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const UpdateCategory = () => {
    const [category, setCategory] = useState({
        name: '',
        categoryImage: null,
        subcategories: [{ name: '' }],
        features: [],
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const { id: categoryId } = useParams();

    console.log('categoryId', categoryId)

    const { token } = useSelector((state) => state.auth);

    // Fetch category data on component mount
    useEffect(() => {
        const fetchCategoryData = async () => {
            try {
                setFetchLoading(true);
                console.log('a')
                const response = await getCategoryById(categoryId);
                console.log('Fetched category:', response);
                setCategory({
                    name: response.name,
                    categoryImage: null, // We can't set the file directly from the API
                    subcategories: response.subcategories.length > 0 
                        ? response.subcategories 
                        : [{ name: '' }],
                    features: response.features || []
                });
                
                // Set image preview from the fetched image URL
                if (response.categoryImage) {
                    setImagePreview(response.categoryImage);
                }
                
                setFetchLoading(false);
            } catch (error) {
                console.error('Error fetching category:', error);
                setError('Failed to load category data. Please try again.');
                setFetchLoading(false);
            }
        };

        if (categoryId) {
            fetchCategoryData();
        }
    }, [categoryId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setError('');
        setCategory(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check if the file is an image
            if (!file.type.startsWith('image/')) {
                setError('File must be an image (JPEG, PNG, etc.)');
                return;
            }

            if (file.size > 1024 * 1024) { // 1MB
                setError('Image size should not exceed 1MB');
                return;
            }

            setCategory(prev => ({ ...prev, categoryImage: file }));
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveImage = () => {
        if (imagePreview && !imagePreview.startsWith('http')) {
            URL.revokeObjectURL(imagePreview);
        }
        setCategory(prev => ({ ...prev, categoryImage: null }));
        setImagePreview(null);
    };

    const handleSubcategoryChange = (index, e) => {
        const { value } = e.target;
        const updatedSubcategories = [...category.subcategories];
        updatedSubcategories[index].name = value;
        setCategory(prev => ({
            ...prev,
            subcategories: updatedSubcategories
        }));
    };

    const addSubcategory = () => {
        const lastSub = category.subcategories[category.subcategories.length - 1];
        if (!lastSub.name.trim()) {
            setError('Please fill the last subcategory before adding a new one.');
            return;
        }
        setError('');
        setCategory(prev => ({
            ...prev,
            subcategories: [...prev.subcategories, { name: '' }]
        }));
    };
    
    const removeSubcategory = (index) => {
        const updatedSubcategories = [...category.subcategories];
        updatedSubcategories.splice(index, 1);
        setCategory(prev => ({ ...prev, subcategories: updatedSubcategories }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        if (!category.name) {
            setError('Please fill in all required fields');
            return;
        }

        // If no image is selected and no existing image, show error
        if (!category.categoryImage && !imagePreview) {
            setError('Please upload an image for the category');
            return;
        }

        // Validate subcategories - ensure all have names
        const validSubcategories = category.subcategories.filter(sub => sub.name.trim());
        if (validSubcategories.length === 0) {
            setError('Please add at least one subcategory');
            return;
        }

        // Check if any subcategory is empty
        const emptySubcategories = category.subcategories.filter(sub => !sub.name.trim());
        if (emptySubcategories.length > 0) {
            setError('Please fill in all subcategory fields or remove empty ones');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        const formData = new FormData();

        // Add text fields
        formData.append('name', category.name);

        // Add image only if a new one is selected
        if (category.categoryImage) {
            formData.append('categoryImage', category.categoryImage);
        }

        // Filter out any empty subcategories 
        const cleanedSubcategories = category.subcategories
            .filter(sub => sub.name.trim())
            .map(sub => ({ name: sub.name.trim(), _id: sub._id })); // Preserve subcategory IDs if they exist

        // Add subcategories as JSON string
        formData.append('subcategories', JSON.stringify(cleanedSubcategories));

        try {
            const response = await updateCategory(categoryId, formData, token);
            console.log('Category updated:', response);
            setSuccess('Category has been updated successfully!');
            
            // Navigate after success
            setTimeout(() => {
                navigate('/admin/dashboard?section=categories-admin');
            }, 1500);

        } catch (error) {
            console.error('Error updating category:', error);
            setError(error.response?.data?.message || 'Failed to update category. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (fetchLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                <span className="ml-3">Loading category data...</span>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-900 py-12 md:py-16 lg:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 border-b pb-3">Update Category</h2>

                {error && (
                    <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        <p>{error}</p>
                    </div>
                )}

                {success && (
                    <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                        <p>{success}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Category Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={category.name}
                            onChange={handleChange}
                            placeholder="Enter category name"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                            required
                        />
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Category Image <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center justify-center w-full">
                            {!imagePreview ? (
                                <label htmlFor="image" className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                        </svg>
                                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            PNG, JPG or SVG (MAX. 1MB)
                                        </p>
                                    </div>
                                    <input
                                        id="image"
                                        name="image"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />
                                </label>
                            ) : (
                                <div className="relative">
                                    <img
                                        src={imagePreview}
                                        alt="Image Preview"
                                        className="max-h-40 rounded-lg object-contain"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
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

                    {/* Subcategories Section */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Subcategories <span className="text-red-500">*</span>
                            </label>
                            <button
                                type="button"
                                onClick={addSubcategory}
                                className="px-3 py-1 bg-primary text-white rounded-md flex items-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                                Add Subcategory
                            </button>
                        </div>

                        <div className="space-y-4">
                            {category.subcategories.map((subcategory, index) => (
                                <div key={index} className="p-4 border border-gray-300 dark:border-gray-600 rounded-md">
                                    <div className="flex justify-between items-center mb-3">
                                        <h4 className="font-medium">Subcategory #{index + 1}</h4>
                                        {category.subcategories.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeSubcategory(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        <div>
                                            <label htmlFor={`subcategoryName${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id={`subcategoryName${index}`}
                                                name="name"
                                                value={subcategory.name}
                                                onChange={(e) => handleSubcategoryChange(index, e)}
                                                placeholder="Enter subcategory name"
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Submit button */}
                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-6 py-3 rounded-md text-white font-medium ${loading
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
                                    Updating...
                                </>
                            ) : (
                                "Update Category"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateCategory;