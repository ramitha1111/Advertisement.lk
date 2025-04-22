// GoogleCallback.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/authSlice';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const userParam = urlParams.get('user');
    
    if (token && userParam) {
      try {
        const decodedUser = JSON.parse(decodeURIComponent(userParam));
        
        // Use consistent key names across application
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(decodedUser));
        localStorage.setItem('userId', decodedUser._id);

        console.log(localStorage.getItem('userId'));
        // Update Redux state
        dispatch(loginSuccess({ token: token, user: decodedUser }));
        
        // Redirect to dashboard with leading slash
        navigate('/');
      } catch (err) {
        console.error('Error processing login data:', err);
        setError('Failed to process login data');
      }
    } else {
      setError('Authentication information missing');
    }
    
    setLoading(false);
  }, [navigate, dispatch]);

  return (
    <div className="google-callback-container">
      {loading ? (
        <p>Processing your login...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <p>Login successful! Redirecting...</p>
      )}
    </div>
  );
};

export default GoogleCallback;