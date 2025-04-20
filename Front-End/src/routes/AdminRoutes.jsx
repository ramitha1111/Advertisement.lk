import { Routes, Route } from 'react-router-dom';
import Header from '../components/Header';
import ProtectedRoutes from './ProtectedRoutes';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AddCategory from '../pages/admin/AddCategory';
import UpdateCategory from '../pages/admin/UpdateCategory';
import AddPackage from '../pages/admin/AddPackage';
import UpdatePackage from '../pages/admin/UpdatePackage';
import AddUser from '../pages/admin/AddUser';
import UpdateUser from '../pages/admin/UpdateUser';
import Order from '../pages/admin/Order';
import OrdersAdmin from '../pages/admin/OrdersAdmin';
import Footer from '../components/Footer';

const AdminRoutes = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoutes adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/add-category"
          element={
            <ProtectedRoutes adminOnly={true}>
              <AddCategory />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/update-category"
          element={
            <ProtectedRoutes adminOnly={true}>
              <UpdateCategory />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/add-package"
          element={
            <ProtectedRoutes adminOnly={true}>
              <AddPackage />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/update-package"
          element={
            <ProtectedRoutes adminOnly={true}>
              <UpdatePackage />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/add-user"
          element={
            <ProtectedRoutes adminOnly={true}>
              <AddUser />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/update-user"
          element={
            <ProtectedRoutes adminOnly={true}>
              <UpdateUser />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/order"
          element={
            <ProtectedRoutes adminOnly={true}>
              <Order />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoutes adminOnly={true}>
              <OrdersAdmin />
            </ProtectedRoutes>
          }
        />
      </Routes>
      <Footer />
    </>
  );
};

export default AdminRoutes;
