import { Routes, Route, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Unauthorized from '../pages/Unauthorized';
import GoogleCallback from '../googleLogin/GoogleCallback';

const PublicRoutes = () => {
  const location = useLocation();

  // Hide Header only on /login
  const hideHeaderPaths = ['/login'];
  const shouldHideHeader = hideHeaderPaths.includes(location.pathname);

  return (
    <>
      {!shouldHideHeader && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/google/callback" element={<GoogleCallback />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </>
  );
};

export default PublicRoutes;
