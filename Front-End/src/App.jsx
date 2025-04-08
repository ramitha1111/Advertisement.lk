import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UserRoutes from './routes/UserRoutes';
import AdminRoutes from './routes/AdminRoutes';
import PublicRoutes from './routes/PublicRoutes';
import { useSelector } from 'react-redux';

const App = () => {
  const { token, user } = useSelector((state) => state.auth);

  return (
    <main className=" min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      <Routes>
        {/* Public Routes */}
        <Route path="/*" element={<PublicRoutes />} />

        {/* Protected User Routes */}
        {token && <Route path="/user/*" element={<UserRoutes />} />}

        {/* Admin Routes */}
        {token && user?.role === 'admin' && (
          <Route path="/admin/*" element={<AdminRoutes />} />
        )}
      </Routes>
    </main>
  );
};

export default App;
