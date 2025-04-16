// components/PageWrapper.js
import { motion } from 'framer-motion'

const PageWrapper = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}  // Start with zero opacity
      animate={{ opacity: 1 }}   // Fade in to full opacity
      exit={{ opacity: 0 }}      // Fade out when exiting
      transition={{ duration: 0.5, ease: 'easeInOut' }}  // Transition duration and easing
    >
      {children}
    </motion.div>
  )
}

export default PageWrapper
