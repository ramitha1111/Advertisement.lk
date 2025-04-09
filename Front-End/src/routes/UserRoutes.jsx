import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from '../components/Header';
import Dashboard from '../pages/users/Dashboard';

const ProtectedRoute = ({ element }) => {
  const { token } = useSelector((state) => state.auth);
  
  if (!token) {
    // If the user is not authenticated, redirect to login
    return <Navigate to="/login" />;
  }

  return element;
};

const UserRoutes = () => {
  return (
    <>
      <Header />
      <Routes>
        {/* Protecting the Dashboard Route */}
        <Route path="/users/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
      </Routes>
    </>
  );
};

export default UserRoutes;
