'use client'

import { useNavigate } from 'react-router-dom'
import React from 'react'
import PropTypes from 'prop-types'
import { ArrowRight, Map, Edit, Trash2, Eye } from 'lucide-react'

const AdvertisementCard = ({ item, onEdit, onDelete, onToggleStatus, showStatusToggle = false }) => {
    const navigate = useNavigate();
    // No need to find category name as it's now included in the response
    const categoryName = item.categoryId ? item.categoryDetails?.categoryName : 'Uncategorized'

    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
            case 'inactive':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
        }
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden transition-all hover:shadow-lg">
            {/* Ad Image */}
            <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
                {item.featuredImage ? (
                    <img
                        src={item.featuredImage}
                        alt={item.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                        No image available
                    </div>
                )}
            </div>

            {/* Ad Content */}
            <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300">
                            {categoryName}
                        </span>
                        {/* Status Badge */}
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                            {item.status || 'pending'}
                        </span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                </div>

                {/* Status Toggle Switch - Only show if showStatusToggle is true */}
                {showStatusToggle && (item.status === 'active' || item.status === 'pending') && (
                    <div className="flex items-center justify-between mb-3 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {item.status === 'active' ? 'Active' : 'Pending'} → 
                            {item.status === 'active' ? ' Set to Pending' : ' Set to Active'}
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={item.status === 'active'}
                                onChange={() => onToggleStatus && onToggleStatus(item)}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                )}

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {item.title}
                </h3>

                <div className="flex items-center justify-between">
                    <span className="font-bold text-lg text-primary">
                        Rs. {item.price.toLocaleString()}
                    </span>
                    <div className="flex items-center text-gray-500 dark:text-gray-400">
                        <Map className="h-4 w-4 mr-1" />
                        <span className="text-sm">{item.location}</span>
                    </div>
                </div>
            </div>

            {/* Ad Footer */}
            <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3 bg-gray-50 dark:bg-gray-800 flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 mr-2">
                        {item.userId && item.userDetails?.profileImage ? (
                            <img
                                src={item.userDetails?.profileImage}
                                alt={item.userDetails?.username}
                                className="w-full h-full rounded-full"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="text-xs font-medium">{item.userId && item.userDetails?.username ? item.userDetails.username.charAt(0) : '?'}</span>
                            </div>
                        )}
                    </div>
                    <span>{item.userId ? item.userDetails?.username : 'Anonymous'}</span>
                </div>

                <div className="flex space-x-2">
                    <button
                        onClick={() => navigate('/advertisement/' + item._id)}
                        className="inline-flex items-center text-sm font-medium text-green-600 hover:text-yellow-800 dark:text-green-400 dark:hover:text-yellow-300"
                    >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                    </button>
                    <button
                        onClick={onEdit}
                        className="inline-flex items-center text-sm font-medium text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300"
                    >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                    </button>
                    <button
                        onClick={onDelete}
                        className="inline-flex items-center text-sm font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                    </button>
                </div>
            </div>
        </div>
    )
}

AdvertisementCard.propTypes = {
    item: PropTypes.shape({
        categoryId: PropTypes.string,
        categoryDetails: PropTypes.shape({
            categoryName: PropTypes.string,
        }),
        featuredImage: PropTypes.string,
        images: PropTypes.arrayOf(PropTypes.string),
        createdAt: PropTypes.string,
        _id: PropTypes.string,
        title: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        location: PropTypes.string,
        status: PropTypes.string,
        userId: PropTypes.string,
        userDetails: PropTypes.shape({
            profileImage: PropTypes.string,
            username: PropTypes.string,
        }),
    }).isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onToggleStatus: PropTypes.func,
    showStatusToggle: PropTypes.bool,
}

export default AdvertisementCard