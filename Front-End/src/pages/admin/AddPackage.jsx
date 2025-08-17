import React, { useState } from 'react';
import { ArrowLeft, Plus, X, Save } from 'lucide-react';
import {Link, useNavigate} from "react-router-dom";
const token = localStorage.getItem('token');

const AddPackage = () => {
    const navigate = useNavigate();

    const [packageData, setPackageData] = useState({
        name: '',
        price: 0,
        duration: 30,
        features: []
    });

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [newFeature, setNewFeature] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setPackageData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : name === 'price' || name === 'duration' ? Number(value) : value
        }));
    };

    const handleAddFeature = (e) => {
        e.preventDefault();
        if (newFeature.trim()) {
            setPackageData(prev => ({
                ...prev,
                features: [...prev.features, newFeature.trim()]
            }));
            setNewFeature('');
        }
    };

    const handleRemoveFeature = (index) => {
        setPackageData(prev => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            const response = await fetch('http://localhost:3000/api/packages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(packageData),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            // Navigate back to packages page on success
            navigate('/admin/dashboard?section=packages-admin');
        } catch (err) {
            setError(err.message);
            console.error('Failed to create package:', err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <Link to={`/admin/dashboard?section=packages-admin`} className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to packages
                </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-md max-w-3xl mx-auto">
                <div className="bg-gray-50 dark:bg-gray-900 p-6 border-b border-gray-200 dark:border-gray-700">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Package</h1>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
                            <p className="font-medium">Error</p>
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Package Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Package Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={packageData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        {/* Price */}
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Price (LKR)
                            </label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                value={packageData.price}
                                onChange={handleChange}
                                required
                                min="0"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        {/* Duration */}
                        <div>
                            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Duration (days)
                            </label>
                            <input
                                type="number"
                                id="duration"
                                name="duration"
                                value={packageData.duration}
                                onChange={handleChange}
                                required
                                min="1"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        {/* Status */}
                        {/*
                        <div className="flex items-center">
                            <div className="flex h-full items-center">
                                <label className="relative inline-flex items-center cursor-pointer mt-6">
                                    <input
                                        type="checkbox"
                                        name="isActive"
                                        checked={packageData.isActive}
                                        onChange={handleChange}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/50 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                                    <span className="ms-3 text-sm font-medium text-gray-700 dark:text-gray-300">Active</span>
                                </label>
                            </div>
                        </div>
                        */}
                    </div>


                    {/* Features */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Features
                        </label>

                        <ul className="mb-4 space-y-2">
                            {packageData.features.map((feature, index) => (
                                <li key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                                    <span className="text-gray-800 dark:text-gray-200">{feature}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveFeature(index)}
                                        className="text-red-500 hover:text-red-700 focus:outline-none"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </li>
                            ))}
                            {packageData.features.length === 0 && (
                                <li className="text-center p-4 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-md">
                                    No features added yet. Add some features to make your package more attractive.
                                </li>
                            )}
                        </ul>

                        <div className="flex">
                            <input
                                type="text"
                                value={newFeature}
                                onChange={(e) => setNewFeature(e.target.value)}
                                placeholder="Add a new feature"
                                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                            />
                            <button
                                type="button"
                                onClick={handleAddFeature}
                                className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-r-md hover:bg-gray-200 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            >
                                <Plus className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3">
                        <Link
                            to={`/admin/dashboard?section=packages-admin`}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center px-4 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Create Package
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPackage;
