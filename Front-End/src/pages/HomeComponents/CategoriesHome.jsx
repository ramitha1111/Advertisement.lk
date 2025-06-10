import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import {
    ShoppingBag,
    Sparkles,
    Home,
    Smartphone,
    Briefcase,
    ArrowRight,
    Car,
    Sofa,
    Heart,
    Wrench,
    Book
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CategoryTile = ({ icon: Icon, title, categoryId, onClick }) => {
    return (
        <div className="max-w-[180px] min-w-[180px] max-h-[180px] min-h-[180px] bg-white hover:bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg border border-gray-100 dark:border-gray-700 flex flex-col justify-center items-center p-2 transition-all duration-500">
            {/* Icon */}
            <div className="mb-2">
                <Icon className="h-14 w-14 text-orange-600 dark:text-orange-400" strokeWidth={1.5} />
            </div>

            {/* Title */}
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 text-center mb-2 mt-1">
                {title}
            </h3>

            {/* Button */}
            <motion.button
                onClick={onClick}
                className="inline-flex items-center justify-center w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <ArrowRight className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </motion.button>
        </div>
    );
};

const ScrollAnimatedSection = ({ children }) => {
    const controls = useAnimation();
    const ref = useRef(null);
    const inView = useInView(ref, { once: false, amount: 0.2 });

    useEffect(() => {
        if (inView) {
            controls.start('visible');
        } else {
            controls.start('hidden');
        }
    }, [controls, inView]);

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={{
                visible: { opacity: 1, y: 0 },
                hidden: { opacity: 0, y: 30 }
            }}
            transition={{ duration: 0.4 }}
        >
            {children}
        </motion.div>
    );
};

const Categories = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // Expanded icon mapping for more categories
    const iconMap = {
        'Fashion': ShoppingBag,
        'Health & Beauty': Sparkles,
        'Real Estate': Home,
        'Electronics': Smartphone,
        'Jobs': Briefcase,
        'Vehicles': Car,
        'Cars': Car,
        'Furniture': Sofa,
        'Home & Garden': Home,
        'Health': Heart,
        'Services': Wrench,
        'Education': Book,
        'Books': Book,
        // Add more mappings as needed
    };

    // Fallback icon
    const defaultIcon = ShoppingBag;

    useEffect(() => {
        fetchHomepageCategories();
    }, []);

    const fetchHomepageCategories = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/site-settings/homepage-categories`);

            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }

            const data = await response.json();
            console.log('Homepage categories:', data); // Debug log

            // The data should already be sorted by order from the backend
            setCategories(data);
        } catch (error) {
            console.error('Error fetching homepage categories:', error);
            // Show empty state instead of fallback categories
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };

    const handleNavigation = (categoryId) => {
        console.log(`Navigating to category: ${categoryId}`);
        navigate(`/categories/${categoryId}`);
    };

    // Get icon for category - check various possible matches
    const getIconForCategory = (categoryName) => {
        // Direct match
        if (iconMap[categoryName]) {
            return iconMap[categoryName];
        }

        // Case-insensitive match
        const lowerName = categoryName.toLowerCase();
        for (const [key, icon] of Object.entries(iconMap)) {
            if (key.toLowerCase() === lowerName) {
                return icon;
            }
        }

        // Partial match
        for (const [key, icon] of Object.entries(iconMap)) {
            if (lowerName.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerName)) {
                return icon;
            }
        }

        return defaultIcon;
    };

    if (loading) {
        return (
            <div className="my-12 py-6 lg:py-4 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-4 lg:px-2">
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-3 text-center pt-5 pb-6">
                        Explore Categories
                    </h2>
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
                    </div>
                </div>
            </div>
        );
    }

    // Don't show the section if no categories are selected
    if (categories.length === 0) {
        return null;
    }

    return (
        <div className="my-12 py-6 lg:py-4 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4 lg:px-2">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-3 text-center pt-5 pb-6">
                    Explore Categories
                </h2>

                {/* Flex layout with fixed tile sizes and center alignment */}
                <div className="flex flex-wrap justify-center gap-4 sm:gap-4">
                    {categories.map((category, index) => {
                        const Icon = getIconForCategory(category.name);
                        return (
                            <ScrollAnimatedSection key={category._id}>
                                <CategoryTile
                                    icon={Icon}
                                    title={category.name}
                                    categoryId={category._id}
                                    onClick={() => handleNavigation(category._id)}
                                />
                            </ScrollAnimatedSection>
                        );
                    })}
                </div>

                <div className="text-center mt-6 mb-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Discover some great stuff & services you're looking for
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Categories;
