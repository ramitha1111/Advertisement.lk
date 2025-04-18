import api from '../axios';

export const submitCheckout = async (data, token) => {
  try {
    const response = await api.post('/checkout', data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Checkout API Error:', error);
    throw error.response?.data || { message: 'Something went wrong during checkout' };
  }
};
