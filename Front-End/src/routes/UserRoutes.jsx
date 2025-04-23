import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from '../components/Header';
import UserDashboard from '../pages/user/UserDashboard';
import ProtectedRoutes from './ProtectedRoutes';
import Checkout from '../pages/user/Checkout';
import Payment from '../pages/user/Payment';
import PaymentSuccess from '../pages/user/PaymentSuccess';
import UpdateAdvertisement from '../pages/user/UpdateAdvertisement';
import SelectPackage from '../pages/user/SelectPackage';
import Footer from '../components/Footer';
import AddAdvertisement from "../pages/user/AddAdvertisement";
import Compare from '../pages/Compare'

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
        <Route
          path="/checkout"
          element={
            <ProtectedRoutes>
              <Checkout />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/payment"
          element={
            <ProtectedRoutes>
              <Payment />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/payment-success"
          element={
            <ProtectedRoutes>
              <PaymentSuccess />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/add-advertisement"
          element={
            <ProtectedRoutes>
            <AddAdvertisement />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/update-advertisement/:id"
          element={
            <ProtectedRoutes>
              <UpdateAdvertisement />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/select-package/:id"
          element={
            <ProtectedRoutes>
              <SelectPackage />
            </ProtectedRoutes>
          }
        />
        <Route 
          path="/compare" 
          element={
            <ProtectedRoutes>
              <Compare />
            </ProtectedRoutes>
          } />
      </Routes>
      <Footer />
    </>
  );
};

export default UserRoutes;
