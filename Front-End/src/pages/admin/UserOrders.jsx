import React, { useState, useEffect } from 'react';
import { getUserOrders } from '../../api/orderApi';
import { useSelector } from 'react-redux';
import OrderCard from '../../components/OrderCard'
import { useParams } from 'react-router-dom';

const UserOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const { token } = useSelector((state) => state.auth);
    const { userId } = useParams()

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const data = await getUserOrders(userId, token);
                setOrders(data);
                setError('');
            } catch (err) {
                console.error('Error fetching orders:', err);
                setError('Failed to load your orders. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchOrders();
        }
    }, [userId, token]);

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
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Orders for the user</h1>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">
                        View and manage orders for the user.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        <p>{error}</p>
                    </div>
                )}

                <div className="space-y-4">
                    {orders.length > 0 ? (
                        orders.map((order) => (
                            <OrderCard key={order._id} order={order} />
                        ))
                    ) : (
                        <div className="text-center text-gray-500 dark:text-gray-400 py-10">
                            <p className="text-lg mb-2">User hasn't placed any orders yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserOrders;