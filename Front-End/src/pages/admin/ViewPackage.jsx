import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowLeft } from 'lucide-react';

const ViewPackage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [packageData, setPackageData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPackage = async () => {
            if (!id) return;

            try {
                setLoading(true);
                const response = await fetch(`http://localhost:3000/api/packages/${id}`);

                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }

                const data = await response.json();
                setPackageData(data);
            } catch (err) {
                setError(err.message);
                console.error('Failed to fetch package:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPackage();
    }, [id]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    if (error || !packageData) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
                    <p className="font-medium">Error loading package</p>
                    <p className="text-sm">{error || 'Package not found'}</p>
                    <Link to={`/admin/dashboard?section=packages-admin`} className="mt-4 inline-flex items-center text-red-700 hover:text-red-800">
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back to packages
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <Link to={`/admin/dashboard?section=packages-admin`} className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to packages
                </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-md max-w-3xl mx-auto">
                {/* Package header */}
                <div className="bg-gray-50 dark:bg-gray-900 p-6 text-center border-b border-gray-200 dark:border-gray-700">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{packageData.name}</h1>
                    <div className="mt-4 flex items-baseline justify-center">
            <span className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Rs. {packageData.price}
            </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {packageData.duration} days duration
                    </p>
                    <div className={`mt-3 inline-flex items-center ${packageData.isActive ? 'text-green-600' : 'text-red-600'}`}>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                packageData.isActive
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              {packageData.isActive ? 'Active' : 'Inactive'}
            </span>
                    </div>
                </div>

                {/* Package details */}
                <div className="p-6">
                    <div className="mb-6">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Features</h2>
                        <ul className="space-y-4">
                            {packageData.features.map((feature, index) => (
                                <li key={index} className="flex items-start">
                                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-primary" />
                                    <span className="ml-3 text-gray-700 dark:text-gray-300">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Additional Details */}
                    <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Created At</h3>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                    {new Date(packageData.createdAt).toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</h3>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                    {new Date(packageData.updatedAt).toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Package ID</h3>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white">{packageData._id}</p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-8 flex justify-end">
                        <Link
                            to={`/admin/update-package/${packageData._id}`}
                            className="inline-flex items-center px-4 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-medium rounded-md"
                        >
                            Edit Package
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewPackage;
