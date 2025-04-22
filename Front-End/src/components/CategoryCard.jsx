import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import ConfirmationDialog from './ConfimationDialog';

const CategoryCard = ({ category, isAdmin, onDelete }) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleDelete = () => {
    setShowConfirmDialog(true);
  };

  const confirmDelete = () => {
    onDelete(category._id);
    setShowConfirmDialog(false);
  };

  const cancelDelete = () => {
    setShowConfirmDialog(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {/* Category Image */}
      <div className="w-full h-40 bg-gray-300 dark:bg-gray-700 relative">
        {category.categoryImage ? (
          <img 
            src={category.categoryImage} 
            alt={category.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-200 dark:bg-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      {/* Category Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">{category.name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
          {category.subcategories?.length || 0} Subcategories
        </p>

        {/* Admin Actions */}
        {isAdmin && (
          <div className="flex justify-between mt-4">
            <Link 
              to={`/admin/category-admin/${category._id}`} 
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm"
            >
              View
            </Link>
            <Link 
              to={`/admin/update-category/${category._id}`} 
              className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 font-medium text-sm"
            >
              Update
            </Link>
            <button 
              onClick={handleDelete}
              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium text-sm"
            >
              Delete
            </button>
          </div>
        )}
        
        <div className="flex justify-between mt-4">
            <Link 
              to={`/categories/${category.name}`} 
              className="bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded w-full text-center"
            >
              View Advertisements
            </Link>
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
  );
};

CategoryCard.propTypes = {
  category: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    categoryImage: PropTypes.string,
    subcategories: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  isAdmin: PropTypes.bool.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default CategoryCard;