import api from '../axios';

// Get Order by ID
export const getOrderById = async (orderId, token) => {
    try {
        const response = await api.get(`/orders/${orderId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching order by ID:', error);
        throw error;
    }
};

// Get All Orders (for admin only)
export const getAllOrders = async (token) => {
    try {
        const response = await api.get('/orders', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching all orders:', error);
        throw error;
    }
};

// Get Orders by User ID
export const getUserOrders = async (userId, token) => {
    try {
        const response = await api.get(`/orders/users/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
};
