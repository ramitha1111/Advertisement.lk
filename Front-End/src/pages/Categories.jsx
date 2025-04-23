import React, { useState, useEffect } from 'react';
import { getAllCategories, deleteCategory } from '../api/CategoryApi';
import CategoryCard from '../components/CategoryCard';
import { useSelector } from 'react-redux';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user, token } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const data = await getAllCategories();
                setCategories(data);
                setError('');
            } catch (err) {
                console.error('Error fetching categories:', err);
                setError('Failed to load categories. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const handleDeleteCategory = async (id) => {
        try {
            await deleteCategory(id, token);
            // Filter out the deleted category from state
            setCategories(categories.filter(category => category._id !== id));
        } catch (error) {
            console.error('Error deleting category:', error);
            setError('Failed to delete category. Please try again.');
        }
    };

    const isAdmin = user && user.role === 'admin';

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-900 py-12 md:py-16 lg:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Categories</h1>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        <p>{error}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {categories.length > 0 ? (
                        categories.map((category) => (
                            <CategoryCard
                                key={category._id}
                                category={category}
                                isAdmin={isAdmin}
                                onDelete={handleDeleteCategory}
                            />
                        ))
                    ) : (
                        <div className="col-span-full text-center text-gray-500 dark:text-gray-400 py-10">
                            <p className="text-lg mb-2">No categories found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Categories;