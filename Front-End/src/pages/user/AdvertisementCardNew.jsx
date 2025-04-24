'use client'

import React from 'react'
import PropTypes from 'prop-types'
import { Edit, ImageIcon, Trash2, MapPin } from 'lucide-react'

const AdvertisementCard = ({ item, onEdit, onDelete }) => {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow p-5 space-y-5 border border-gray-100 dark:border-gray-700">
            {/* Image */}
            <div className="relative h-56 bg-gradient-to-tr from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-xl overflow-hidden flex items-center justify-center">
                {item?.featuredImage ? (
                    <img
                        src={item?.featuredImage}
                        alt={item?.title}
                        className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                    />
                ) : (
                    <ImageIcon className="text-gray-400 dark:text-gray-500 w-14 h-14" />
                )}
            </div>

            {/* Content */}
            <div className="space-y-2">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                    {item?.title}
                </h3>


                <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-semibold text-lg text-primary">
                        Rs. {item?.price?.toLocaleString()}
                    </span>
                    <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{item?.location}</span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="pt-4 flex justify-end gap-4 border-t border-gray-200 dark:border-gray-700 mt-2">
                <button
                    onClick={onEdit}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary border-2 border-primary rounded-lg hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                    <Edit size={16} />
                    Edit
                </button>
                <button
                    onClick={onDelete}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                    <Trash2 size={16} />
                    Delete
                </button>
            </div>
        </div>
    )
}

AdvertisementCard.propTypes = {
    item: PropTypes.shape({
        featuredImage: PropTypes.string,
        title: PropTypes.string.isRequired,
        description: PropTypes.string,
        price: PropTypes.number.isRequired,
        location: PropTypes.string,
    }).isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
}

export default AdvertisementCard
