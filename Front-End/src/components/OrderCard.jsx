import React from 'react';
import { Link } from 'react-router-dom';

const OrderCard = ({ order, isAdmin = false }) => {

    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'failed':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4 border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row justify-between">
                <div className="mb-4 md:mb-0">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                        {order.packageName}
                    </h3>
                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                        <p>Order ID: <span className="font-medium">{order._id}</span></p>
                        <p>Date: <span className="font-medium">{formatDate(order.createdAt)}</span></p>
                        <p>Amount: <span className="font-medium">LKR {order.amount.toFixed(2)}</span></p>
                        {isAdmin && (
                            <p>Customer: <span className="font-medium">{order.userDetails?.firstName} {order.userDetails?.lastName}</span></p>
                        )}
                    </div>
                </div>

                <div className="flex flex-col justify-between">
                    <div className="flex items-center mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs ${getStatusBadgeClass(order.paymentStatus)}`}>
                            {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                        </span>
                    </div>

                    <Link
                        to={`/user/order/${order._id}`}
                        className="bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded text-center text-sm"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderCard;