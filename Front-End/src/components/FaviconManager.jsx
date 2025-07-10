// Front-End/src/components/FaviconManager.jsx
import {useEffect} from 'react';
import {getPublicSettings} from '../api/siteSettingsApi';

const FaviconManager = () => {
    useEffect(() => {
        const updateFavicon = async () => {
            try {
                const settings = await getPublicSettings();

                if (settings.favicon) {
                    // Update existing favicon
                    const favicon = document.querySelector('link[rel="icon"]');
                    if (favicon) {
                        favicon.href = settings.favicon;
                    } else {
                        // Create favicon link if it doesn't exist
                        const newFavicon = document.createElement('link');
                        newFavicon.rel = 'icon';
                        newFavicon.type = 'image/x-icon';
                        newFavicon.href = settings.favicon;
                        document.head.appendChild(newFavicon);
                    }

                    // Also update any apple-touch-icon if exists
                    const appleTouchIcon = document.querySelector('link[rel="apple-touch-icon"]');
                    if (appleTouchIcon) {
                        appleTouchIcon.href = settings.favicon;
                    }
                }

                // Update document title if logoAlt is available
                if (settings.logoAlt && settings.logoAlt !== 'Site Logo') {
                    document.title = `${document.title.split(' - ')[0]} - ${settings.logoAlt}`;
                }
            } catch (error) {
                console.error('Error updating favicon:', error);
                // Fallback to default favicon
                const favicon = document.querySelector('link[rel="icon"]');
                if (favicon) {
                    favicon.href = '/favicon.ico';
                }
            }
        };

        updateFavicon();
    }, []);

    return null; // This component doesn't render anything
};

export default FaviconManager;

// -------------------------------------------
// Front-End/src/App.jsx - Add FaviconManager to App component
// Add this import and component to your existing App.jsx

/* Update your App.jsx to include:

import FaviconManager from './components/FaviconManager'

// Then add <FaviconManager /> inside your App component's main element:

const App = () => {
  // ... existing code

  return (
    <main className="bg-white dark:bg-gray-900 text-black dark:text-white">
      <FaviconManager />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/*" element={<PublicRoutes />} />
          <Route path="/user/*" element={<UserRoutes />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </AnimatePresence>
    </main>
  )
}

*/