import React from 'react';
import {motion} from 'framer-motion';

// Card component for each category
const CategoryCard = ({icon, title}) => {
    return (
        <div className="flex flex-col items-center py-4">
            <div className="h-20 flex items-center justify-center mb-2">
                {icon}
            </div>
            <h3 className="text-base font-medium text-gray-800 dark:text-gray-200 mb-3">
                {title}
            </h3>
            <motion.div
                className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-50 dark:bg-gray-800"
                whileHover={{scale: 1.1}}
                transition={{duration: 0.2}}
            >
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-blue-500 dark:stroke-blue-400"
                >
                    <path
                        d="M4 9H14M14 9L9 4M14 9L9 14"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </motion.div>
        </div>
    );
};

const Categories = () => {
    // Categories data array
    const categories = [
        {
            id: 1,
            title: "Fashion",
            icon: (
                <svg width="96" height="96" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"
                     className="stroke-gray-800 dark:stroke-gray-200">
                    <path d="M26 11C26 8.24 23.76 6 21 6C18.24 6 16 8.24 16 11" strokeWidth="1.5"
                          strokeLinecap="round"/>
                    <path d="M13 16H29L27 28H15L13 16Z" strokeWidth="1.5"/>
                    <rect x="16" y="21" width="10" height="7" strokeWidth="1.5" rx="1"/>
                </svg>
            )
        },
        {
            id: 2,
            title: "Health & Beauty",
            icon: (
                <svg width="96" height="96" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"
                     className="stroke-gray-800 dark:stroke-gray-200">
                    <path d="M19 10C19 7.24 16.76 5 14 5C11.24 5 9 7.24 9 10" strokeWidth="1.5" strokeLinecap="round"/>
                    <rect x="12" y="12" width="3" height="14" rx="1.5" strokeWidth="1.5"/>
                    <path d="M21 14H30L28 22H25" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <rect x="25" y="14" width="3" height="18" rx="1.5" strokeWidth="1.5"/>
                </svg>
            )
        },
        {
            id: 3,
            title: "Real Estate",
            icon: (
                <svg width="96" height="96" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"
                     className="stroke-gray-800 dark:stroke-gray-200">
                    <path d="M33 20L21 11L9 20" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 19V30H30V19" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="27" cy="19" r="5" strokeWidth="1.5"/>
                    <path d="M27 16V19H30" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            )
        },
        {
            id: 4,
            title: "Electronics",
            icon: (
                <svg width="96" height="96" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"
                     className="stroke-gray-800 dark:stroke-gray-200">
                    <rect x="10" y="11" width="18" height="14" rx="1" strokeWidth="1.5"/>
                    <rect x="28" y="14" width="8" height="10" rx="1" strokeWidth="1.5"/>
                    <path d="M20 25V30" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M15 30H25" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
            )
        },
        {
            id: 5,
            title: "Jobs",
            icon: (
                <svg width="96" height="96" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"
                     className="stroke-gray-800 dark:stroke-gray-200">
                    <rect x="11" y="14" width="24" height="18" rx="1" strokeWidth="1.5"/>
                    <path d="M17 14V9H29V14" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M15 22H19" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M27 22H31" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
            )
        }
    ];

    return (
        <div className="py-8 bg-white dark:bg-gray-900">
            <div className="max-w-6xl mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {categories.map((category) => (
                        <CategoryCard
                            key={category.id}
                            icon={category.icon}
                            title={category.title}
                        />
                    ))}
                </div>

                <div className="mt-8 text-center">
                    <p className="text-sm flex items-center justify-center text-orange-500 dark:text-orange-400">
                        Discover some great stuff & services you're looking for
                        <motion.span
                            className="inline-block ml-2"
                            animate={{x: [0, 5, 0]}}
                            transition={{repeat: Infinity, duration: 1.5}}
                        >
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 18 18"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="stroke-orange-500 dark:stroke-orange-400"
                            >
                                <path
                                    d="M3 9H15M15 9L9 3M15 9L9 15"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </motion.span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Categories;
