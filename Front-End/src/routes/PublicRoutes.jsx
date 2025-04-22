// routes/PublicRoutes.jsx
import { Routes, Route, useLocation } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import VerifyEmail from '../pages/VerifyEmail'
import ForgotPassword from '../pages/ForgotPassword'
import ResetPassword from '../pages/ResetPassword'
import Unauthorized from '../pages/Unauthorized'
import GoogleCallback from '../googleLogin/GoogleCallback'
import PageWrapper from '../components/PageWrapper'
import NotFound from '../pages/NotFound'
import Contact from '../pages/Contact'
import About from '../pages/About'
import Advertisements from '../pages/Advertisements'
import Categories from '../pages/Categories'
import AdsByCategory from '../pages/AdsByCategory'

const PublicRoutes = () => {
  const location = useLocation()

  // Hide Header only on /login
  const hideHeaderPaths = ['/login', '/register', '/google/callback', '/verify-email', '/forgot-password']
  const shouldHideHeader = hideHeaderPaths.includes(location.pathname)

  return (
    <>
      {!shouldHideHeader && <Header />}
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
        <Route path="/verify-email" element={<PageWrapper><VerifyEmail /></PageWrapper>} />
        <Route path="/forgot-password" element={<PageWrapper><ForgotPassword /></PageWrapper>} />
        <Route path="/reset-password" element={<PageWrapper><ResetPassword /></PageWrapper>} />
        <Route path="/reset-password/:token" element={<PageWrapper><ResetPassword /></PageWrapper>} />
        <Route path="/google/callback" element={<PageWrapper><GoogleCallback /></PageWrapper>} />
        <Route path="/unauthorized" element={<PageWrapper><Unauthorized /></PageWrapper>} />
        <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
        <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
        <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
        <Route path="/advertisements" element={<PageWrapper><Advertisements /></PageWrapper>} />
        <Route path="/categories" element={<PageWrapper><Categories /></PageWrapper>} />
        <Route path="/categories/:id" element={<PageWrapper><AdsByCategory /></PageWrapper>} />
        {/* Add other public routes here */}
      </Routes>
      {!shouldHideHeader && <Footer />}
    </>
  )
}

export default PublicRoutes
