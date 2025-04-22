import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCategoryById, deleteCategory } from '../../api/CategoryApi';
import { useSelector } from 'react-redux';
import ConfirmationDialog from '../../components/ConfirmationDialog';

const CategoryAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
  const { user, token } = useSelector((state) => state.auth);
  const isAdmin = user && user.role === 'admin';

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const data = await getCategoryById(id);
        setCategory(data);
        setError('');
      } catch (err) {
        console.error('Error fetching category:', err);
        setError('Failed to load category. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  const handleDelete = () => {
    setShowConfirmDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteCategory(id, token);
      navigate('/admin/categories');
    } catch (error) {
      console.error('Error deleting category:', error);
      setError('Failed to delete category. Please try again.');
    } finally {
      setShowConfirmDialog(false);
    }
  };

  const cancelDelete = () => {
    setShowConfirmDialog(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>{error}</p>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-gray-600 dark:text-gray-400">Category not found</p>
        <Link to="/admin/categories" className="mt-4 inline-block text-primary hover:underline">
          Back to Categories
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 py-12 md:py-16 lg:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{category.name}</h1>
        <div className="flex space-x-3">
          {isAdmin && (
            <>
              <Link 
                to={`/admin/update-category/${category._id}`}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary"
              >
                Update
              </Link>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      {/* Category Image */}
      {category.categoryImage && (
        <div className="mb-6">
          <img 
            src={category.categoryImage} 
            alt={category.name} 
            className="w-full max-h-64 object-cover rounded-lg" 
          />
        </div>
      )}

      {/* Category Details */}
      <div className="space-y-4">
        {/* Subcategories */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Subcategories</h2>
          
          {category.subcategories && category.subcategories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {category.subcategories.map(subcategory => (
                <div 
                  key={subcategory._id}
                  className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm"
                >
                  <h3 className="font-medium text-gray-800 dark:text-white">{subcategory.name}</h3>
                  {subcategory.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {subcategory.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No subcategories found</p>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <ConfirmationDialog
          isOpen={showConfirmDialog}
          title="Delete Category"
          message={`Are you sure you want to delete "${category.name}"? This action cannot be undone and will also remove all associated subcategories.`}
          confirmLabel="Delete"
          cancelLabel="Cancel"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          confirmButtonClass="bg-red-600 hover:bg-red-700"
        />
      )}
    </div>
    </div>
  );
};

export default CategoryAdmin;