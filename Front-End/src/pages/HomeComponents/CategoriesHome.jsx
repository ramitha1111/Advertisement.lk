import React, { useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import {
    ShoppingBag,
    Sparkles,
    Home,
    Smartphone,
    Briefcase,
    ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CategoryTile = ({ icon: Icon, title, onClick }) => {
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
    const navigate = useNavigate(); // Hook for navigation
    const categories = [
        { title: 'Fashion', icon: ShoppingBag, path: '/category/fashion' },
        { title: 'Health & Beauty', icon: Sparkles, path: '/category/health-beauty' },
        { title: 'Real Estate', icon: Home, path: '/category/real-estate' },
        { title: 'Electronics', icon: Smartphone, path: '/category/electronics' },
        { title: 'Jobs', icon: Briefcase, path: '/category/jobs' },
    ];

    const handleNavigation = (path) => {
        console.log(`Navigating to: ${path}`);
        navigate(path)
    };

    return (
        <div className="py-6 lg:py-4 bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4 lg:px-2">
                <h2 className="text-5xl font-bold text-gray-800 dark:text-white mb-3 text-center pt-5 pb-6">
                    Explore Categories
                </h2>

                {/* Flex layout with fixed tile sizes and center alignment */}
                <div className="flex flex-wrap justify-center gap-4 sm:gap-4">
                    {categories.map((category) => (
                        <ScrollAnimatedSection key={category.title}>
                            <CategoryTile
                                icon={category.icon}
                                title={category.title}
                                onClick={() => handleNavigation(category.path)}
                            />
                        </ScrollAnimatedSection>
                    ))}
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
