import React from 'react';
import PropTypes from 'prop-types';
import { CheckCircle, ShoppingBag, Eye, Edit, Trash2, ChevronDown } from 'lucide-react';

const PackageCard = ({ 
  packageData, 
  advertisementId, 
  onSelectPackage,
  isRecommended = false,
  isAdmin = false,
  isSelected = false,
  onViewPackage,
  onUpdatePackage,
  onDeletePackage
}) => {
  const { _id, name, price, duration, features, isActive } = packageData;

  const handleBuyNow = () => {
    // Call the parent component's function to handle package selection
    onSelectPackage({
      packageId: _id,
      packageName: name,
      advertisementId,
      price
    }, true); // true indicates proceed to checkout
  };

  const handleSelectPackage = () => {
    onSelectPackage({
      packageId: _id,
      packageName: name,
      advertisementId,
      price
    }, false); // false indicates just selection, no checkout
  };

  return (
    <div className={`relative rounded-xl border ${
      isSelected 
        ? 'border-primary border-2 shadow-lg ring-2 ring-primary ring-opacity-50' 
        : isRecommended 
          ? 'border-primary shadow-md' 
          : 'border-gray-200 dark:border-gray-700'
    } overflow-hidden bg-white dark:bg-gray-800 transition-all hover:shadow-md`}>
      {/* Selected badge */}
      {isSelected && (
        <div className="absolute top-3 right-3 bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg z-10">
          <CheckCircle className="h-5 w-5" />
        </div>
      )}
      
      {/* Recommended badge */}
      {isRecommended && !isSelected && (
        <div className="absolute top-0 right-0">
          <div className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
            RECOMMENDED
          </div>
        </div>
      )}

      {/* Package header */}
      <div className={`p-6 text-center ${
        isSelected 
          ? 'bg-primary/20' 
          : isRecommended 
            ? 'bg-primary/10' 
            : 'bg-gray-50 dark:bg-gray-900'
      }`}>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{name}</h3>
        <div className="mt-4 flex items-baseline justify-center">
          <span className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Rs. {price}
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {duration} days duration
        </p>
      </div>

      {/* Features list with collapsible behavior for mobile */}
      <div className="px-6 pt-6 pb-8">
        <div className="mb-4">
          <details className="group md:open">
            <summary className="flex justify-between items-center cursor-pointer list-none md:hidden">
              <span className="font-medium text-gray-700 dark:text-gray-300">Features</span>
              <ChevronDown className="h-5 w-5 text-gray-500 group-open:rotate-180 transition-transform" />
            </summary>
            <ul className="space-y-4 mt-4">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
          </details>
          
          {/* Always visible on larger screens */}
          <ul className="space-y-4 hidden md:block">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <CheckCircle className="h-5 w-5 flex-shrink-0 text-primary" />
                <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Admin actions */}
        {isAdmin && (
          <div className="flex space-x-2 mb-4">
            <button
              onClick={() => onViewPackage(_id)}
              className="flex-1 flex items-center justify-center rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-3 py-2 text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </button>
            <button
              onClick={() => onUpdatePackage(_id)}
              className="flex-1 flex items-center justify-center rounded-md bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 px-3 py-2 text-sm font-medium hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
            >
              <Edit className="h-4 w-4 mr-1" />
              Update
            </button>
            <button
              onClick={() => onDeletePackage(_id)}
              className="flex-1 flex items-center justify-center rounded-md bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-3 py-2 text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </button>
          </div>
        )}
        
        {/* Action buttons - Select and Buy Now */}
        <div className={`${isSelected ? "grid grid-cols-1" : "grid grid-cols-1"} gap-3`}>
          {!isSelected ? (
            <button
              onClick={handleSelectPackage}
              disabled={!isActive}
              className={`flex w-full items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors
                ${isActive 
                  ? 'bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white'
                  : 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'}`}
            >
              Select Package
            </button>
          ) : (
            <button
              onClick={handleBuyNow}
              disabled={!isActive}
              className={`flex w-full items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors
                ${isActive 
                  ? 'bg-primary hover:bg-primary/90 text-white'
                  : 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'}`}
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              Buy Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

PackageCard.propTypes = {
  packageData: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    duration: PropTypes.number.isRequired,
    features: PropTypes.arrayOf(PropTypes.string).isRequired,
    isActive: PropTypes.bool.isRequired,
  }).isRequired,
  advertisementId: PropTypes.string.isRequired,
  onSelectPackage: PropTypes.func.isRequired,
  isRecommended: PropTypes.bool,
  isAdmin: PropTypes.bool,
  isSelected: PropTypes.bool,
  onViewPackage: PropTypes.func,
  onUpdatePackage: PropTypes.func,
  onDeletePackage: PropTypes.func,
};


export default PackageCard;