import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from '../components/Header';
import Dashboard from '../pages/user/Dashboard';
import ProtectedRoutes from './ProtectedRoutes';

const UserRoutes = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/dashboard" element={<ProtectedRoutes element={<Dashboard />} />} />
      </Routes>
    </>
  );
};

export default UserRoutes;
