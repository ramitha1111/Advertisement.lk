import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from '../components/Header';
import UserDashboard from '../pages/user/UserDashboard';
import ProtectedRoutes from './ProtectedRoutes';

const UserRoutes = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoutes>
              <UserDashboard />
            </ProtectedRoutes>
          }
        />
      </Routes>
    </>
  );
};

export default UserRoutes;
