import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized';
import UserRoutes from './routes/UserRoutes';
import AdminRoutes from './routes/AdminRoutes';
import { useSelector } from 'react-redux';

const App = () => {
  const { token, user } = useSelector((state) => state.auth); // Check if the user is logged in

  return (
    <>
      <Header />
      <main className="p-4 min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<Home />} />  {/* Public Route: Home */}
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected User Routes - Only available if user is logged in */}
          {token && (
            <Route path="/user/*" element={<UserRoutes />} />
          )}

          {/* Admin Routes - Only available if user is admin */}
          {token && user.role == "admin" && (
            <Route path="/admin/*" element={<AdminRoutes />} />
          )}

        </Routes>
      </main>
    </>
  );
};

export default App;
