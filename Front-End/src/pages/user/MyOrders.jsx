import React, { useState, useEffect } from 'react';
import { getUserOrders } from '../../api/orderApi';
import { useSelector } from 'react-redux';
import OrderCard from '../../components/OrderCard';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { user, token } = useSelector((state) => state.auth);
  const userId = localStorage.getItem('userId')

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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">My Orders</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          View and manage your advertising orders
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
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
            <p className="text-lg mb-2">You haven't placed any orders yet</p>
            <p>Browse our advertising packages to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;