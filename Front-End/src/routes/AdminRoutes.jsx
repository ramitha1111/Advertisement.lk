import { Routes, Route } from 'react-router-dom';
import Header from '../components/Header';
import Dashboard from '../pages/user/Dashboard';
import ProtectedRoutes from './ProtectedRoutes';

const AdminRoutes = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoutes adminOnly={true}>
              <Dashboard />
            </ProtectedRoutes>
          }
        />
      </Routes>
    </>
  );
};

export default AdminRoutes;
