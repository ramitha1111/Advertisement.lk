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

const CategoryTile = ({ icon: Icon, title, onClick }) => {
    return (
        <div className="aspect-square bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg border border-gray-100 dark:border-gray-700 flex flex-col">
            {/* Icon with minimal spacing */}
            <div className="flex justify-center items-center h-1/2 pt-4 xl:pt-1">
                <Icon className="h-12 w-12 text-blue-600 dark:text-blue-400" strokeWidth={1.5} />
            </div>

            {/* Title directly below icon with minimal gap */}
            <div className="text-center px-2">
                <h3 className="text-sm font-medium text-gray-800 dark:text-gray-100">{title}</h3>
            </div>

            {/* Button at bottom with minimal spacing */}
            <div className="flex justify-center items-end flex-grow pb-4">
                <motion.button
                    onClick={onClick}
                    className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <ArrowRight className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </motion.button>
            </div>
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
    const categories = [
        { title: 'Fashion', icon: ShoppingBag, path: '/category/fashion' },
        { title: 'Health & Beauty', icon: Sparkles, path: '/category/health-beauty' },
        { title: 'Real Estate', icon: Home, path: '/category/real-estate' },
        { title: 'Electronics', icon: Smartphone, path: '/category/electronics' },
        { title: 'Jobs', icon: Briefcase, path: '/category/jobs' },
    ];

    const handleNavigation = (path) => {
        console.log(`Navigating to: ${path}`);
    };

    return (
        <div className="py-6 lg:py-4 bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4 lg:px-2">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3 text-center">
                    Explore Categories
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-2">
                    {categories.map((category, index) => (
                        <ScrollAnimatedSection key={category.title}>
                            <CategoryTile
                                icon={category.icon}
                                title={category.title}
                                onClick={() => handleNavigation(category.path)}
                            />
                        </ScrollAnimatedSection>
                    ))}
                </div>

                <div className="text-center mt-3 lg:mt-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Discover some great stuff & services you're looking for
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Categories;
