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

const App = () => {
  const themeAvailable = useSelector((state) => !!state.theme)
  const location = useLocation()

  useDarkMode()

  if (!themeAvailable) return null

  return (
    <main className="bg-white dark:bg-gray-900 text-black dark:text-white">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/*" element={<PublicRoutes />} />
          <Route path="/user/*" element={<UserRoutes />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path={"/dashboard"} element={<Dashboard/>}/>

        </Routes>
      </AnimatePresence>
    </main>
  )
}

export default App
