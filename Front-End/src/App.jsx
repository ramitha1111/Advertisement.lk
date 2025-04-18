// App.jsx
import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useSelector } from 'react-redux'
import useDarkMode from './hooks/useDarkMode'
import UserRoutes from './routes/UserRoutes'
import AdminRoutes from './routes/AdminRoutes'
import PublicRoutes from './routes/PublicRoutes'
import Dashboard from "./pages/user/UserDashboard.jsx";
import EditAdvertisement from "./pages/user/EditeAdvertisement.jsx";

const App = () => {
  const { token, user } = useSelector((state) => state.auth)
  const location = useLocation()

  useDarkMode()

  return (
    <main className="bg-white dark:bg-gray-900 text-black dark:text-white">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/*" element={<PublicRoutes />} />
          <Route path="/user/*" element={<UserRoutes />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path={"/dashboard"} element={<Dashboard/>}/>
          <Route path={"/edit_advertisement/:id"} element={<EditAdvertisement/>}/>
        </Routes>
      </AnimatePresence>
    </main>
  )
}

export default App
