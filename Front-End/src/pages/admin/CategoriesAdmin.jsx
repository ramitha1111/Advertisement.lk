import React, { useState, useEffect } from 'react';
import { getAllCategories, deleteCategory } from '../../api/categoryApi';
import CategoryCard from '../../components/CategoryCard';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const CategoriesAdmin = () => {
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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Category Management</h1>
        {isAdmin && (
          <Link 
            to="/admin/add-category" 
            className="bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Add New Category
          </Link>
        )}
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
            {isAdmin && (
              <p>Click "Add New Category" to create your first category</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesAdmin;