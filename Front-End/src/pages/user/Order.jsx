import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getOrderById } from '../../api/orderApi';
import { useSelector } from 'react-redux';

const Order = () => {

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

    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const { user, token } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const isAdmin = user && user.role === 'admin';

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true);
                const data = await getOrderById(orderId, token);

                // Check if user has access to this order
                if (!isAdmin && data.userId !== user._id) {
                    navigate('/my-orders');
                    return;
                }

                setOrder(data);
                setError('');
            } catch (err) {
                console.error('Error fetching order details:', err);
                setError('Failed to load order details. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId, token, user, isAdmin, navigate]);

    const getStatusClass = (status) => {
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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    <p>{error}</p>
                </div>
                <Link
                    to={isAdmin ? "/admin/orders" : "/my-orders"}
                    className="text-primary hover:text-primary/90"
                >
                    &larr; Back to Orders
                </Link>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="text-center text-gray-500 dark:text-gray-400 py-10">
                    <p className="text-lg mb-2">Order not found</p>
                </div>
                <Link
                    to={isAdmin ? "/admin/orders" : "/my-orders"}
                    className="text-primary hover:text-primary/90"
                >
                    &larr; Back to Orders
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-900 py-12 md:py-16 lg:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-6 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Order Details</h1>
                    <span className={`px-3 py-1 rounded-full text-xs ${getStatusClass(order.paymentStatus)}`}>
                        {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                    </span>
                </div>

                <div className="mb-6">
                    <Link
                        to={isAdmin ? "/admin/orders" : "/my-orders"}
                        className="text-primary hover:text-primary/90 flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Back to Orders
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Order Information</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-300">Order ID:</span>
                                <span className="font-medium text-gray-800 dark:text-white">{order._id}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-300">Package:</span>
                                <span className="font-medium text-gray-800 dark:text-white">{order.packageName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-300">Amount:</span>
                                <span className="font-medium text-gray-800 dark:text-white">${order.amount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-300">Date:</span>
                                <span className="font-medium text-gray-800 dark:text-white">{formatDate(order.createdAt)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-300">Payment Method:</span>
                                <span className="font-medium text-gray-800 dark:text-white capitalize">{order.paymentMethod.replace('_', ' ')}</span>
                            </div>
                            {order.paymentId && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-300">Payment ID:</span>
                                    <span className="font-medium text-gray-800 dark:text-white">{order.paymentId}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Customer Information</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-300">Name:</span>
                                <span className="font-medium text-gray-800 dark:text-white">
                                    {order.userDetails.firstName} {order.userDetails.lastName}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-300">Email:</span>
                                <span className="font-medium text-gray-800 dark:text-white">{order.userDetails.email}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-300">Phone:</span>
                                <span className="font-medium text-gray-800 dark:text-white">{order.userDetails.phone}</span>
                            </div>
                            {order.userDetails.companyName && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-300">Company:</span>
                                    <span className="font-medium text-gray-800 dark:text-white">{order.userDetails.companyName}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Billing Address</h2>
                    <div className="text-gray-700 dark:text-gray-300">
                        <p>{order.userDetails.addressLine1}</p>
                        {order.userDetails.addressLine2 && <p>{order.userDetails.addressLine2}</p>}
                        <p>
                            {order.userDetails.city}, {order.userDetails.state} {order.userDetails.zip}
                        </p>
                        <p>{order.userDetails.country}</p>
                    </div>
                </div>

                {isAdmin && (
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Advertisement Details</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">ID: {order.advertisementId}</p>
                            </div>
                            <Link
                                to={`/advertisement/${order.advertisementId}`}
                                className="bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded"
                            >
                                View Advertisement
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Order;