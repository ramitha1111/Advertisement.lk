import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { submitPayment } from '../../api/paymentApi';

const Payment = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const token = useSelector((state) => state.auth.token);

  const orderId = localStorage.getItem('orderId');
  const clientSecret = localStorage.getItem('clientSecret');
  const paymentId = '';

  const handlePayment = async () => {
    setLoading(true);
    setMessage('');

    try {
      const payload = {
        paymentId,
        orderId,
      };

      await submitPayment(payload, token);

      navigate(`/user/payment-success`);
    } catch (error) {
      setMessage(error.message || 'Payment failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded shadow-md max-w-md mx-auto mt-10 bg-white">
      <h2 className="text-xl font-bold mb-4">Complete Payment</h2>
      <p>Order ID: {orderId}</p>
      <p>Payment ID: {paymentId}</p>

      <button
        onClick={handlePayment}
        disabled={loading}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {loading ? 'Processing...' : 'Verify & Pay'}
      </button>

      {message && (
        <div className="mt-4 text-center text-sm text-green-600">
          {message}
        </div>
      )}
    </div>
  );
};

export default Payment;
