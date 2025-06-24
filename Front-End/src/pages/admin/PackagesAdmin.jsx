import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import PackageCard from '../../components/PackageCard';
import {useNavigate} from "react-router-dom";
import ConfirmationDialog from '../../components/ConfirmationDialog';
const token = localStorage.getItem('token');
import { getAllPackages, deletePackage } from '../../api/packageApi';

const PackagesAdmin = () => {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Add states for confirmation dialog
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [packageToDelete, setPackageToDelete] = useState(null);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                setLoading(true);
                const response = await getAllPackages(token);

                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }

                const data = await response.json();
                setPackages(data);
            } catch (err) {
                setError(err.message);
                console.error('Failed to fetch packages:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPackages();
    }, []);

    const handleViewPackage = (packageId) => {
        console.log('Viewing package:', packageId);
        // Implement view logic or navigation
        navigate(`/admin/view-package/${packageId}`);

    };

    const handleUpdatePackage = (packageId) => {
        console.log('Updating package:', packageId);
        // Implement update logic or navigation
        navigate(`/admin/update-package/${packageId}`)
    };

    // Modified delete handler to open confirmation dialog
    const handleDeletePackage = (packageId) => {
        // Find the package to delete to display its name in the confirmation
        const packageToDelete = packages.find(pkg => pkg._id === packageId);
        setPackageToDelete(packageToDelete);
        setIsConfirmDialogOpen(true);
    };

    // New method to handle confirmed deletion
    const confirmDeletePackage = async () => {
        if (!packageToDelete) return;

        try {
            const response = await deletePackage(packageToDelete._id, token);

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            // Remove package from state after successful deletion
            setPackages(packages.filter(pkg => pkg._id !== packageToDelete._id));

            // Close dialog and reset packageToDelete
            setIsConfirmDialogOpen(false);
            setPackageToDelete(null);
        } catch (err) {
            console.error('Failed to delete package:', err);
            // You could set an error state here to display in the UI
            alert('Failed to delete the package. Please try again.');
            setIsConfirmDialogOpen(false);
        }
    };

    // Cancel deletion
    const cancelDeletePackage = () => {
        setIsConfirmDialogOpen(false);
        setPackageToDelete(null);
    };

    const handleCreatePackage = () => {
        // Navigate to package creation page or open a modal
        console.log('Creating a new package');
        navigate("/admin/add-package")
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
                    <p className="font-medium">Error loading packages</p>
                    <p className="text-sm">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Packages</h1>
                <button
                    onClick={handleCreatePackage}
                    className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md flex items-center"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Add New Package
                </button>
            </div>

            {packages.length === 0 ? (
                <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-6 text-center">
                    <p className="text-gray-500 dark:text-gray-400">No packages found. Create your first package to get started.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {packages.map((pkg) => (
                        <PackageCard
                            key={pkg._id}
                            packageData={pkg}
                            advertisementId="admin-view" // You might want to change this for your specific use case
                            isAdmin={true}
                            onSelectPackage={() => {}} // Not needed for admin view
                            onViewPackage={handleViewPackage}
                            onUpdatePackage={handleUpdatePackage}
                            onDeletePackage={handleDeletePackage}
                        />
                    ))}
                </div>
            )}

            {/* Confirmation Dialog */}
            <ConfirmationDialog
                isOpen={isConfirmDialogOpen}
                title="Delete Package"
                message={packageToDelete ? `Are you sure you want to delete "${packageToDelete.name}"? This action cannot be undone.` : "Are you sure you want to delete this package?"}
                confirmLabel="Delete"
                cancelLabel="Cancel"
                onConfirm={confirmDeletePackage}
                onCancel={cancelDeletePackage}
                confirmButtonClass="bg-red-600 hover:bg-red-700"
            />
        </div>
    );
};

export default PackagesAdmin;
