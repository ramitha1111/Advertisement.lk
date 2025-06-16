import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CategoryTile = ({ category, onClick, index }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    // Function to get initials for fallback
    const getInitials = (name) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="relative group cursor-pointer flex-shrink-0 w-full sm:w-80 lg:w-[calc(33.333%-1rem)]"
            onClick={onClick}
        >
            <div className="relative w-full h-48 sm:h-56 lg:h-64 rounded-2xl overflow-hidden shadow-lg">
                {/* Category Image with loading state */}
                {category.categoryImage && !imageError ? (
                    <>
                        {/* Skeleton loader while image loads */}
                        {!imageLoaded && (
                            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
                        )}

                        <img
                            src={category.categoryImage}
                            alt={category.name}
                            className={`w-full h-full object-cover transition-opacity duration-300 ${
                                imageLoaded ? 'opacity-100' : 'opacity-0'
                            }`}
                            onLoad={() => setImageLoaded(true)}
                            onError={() => setImageError(true)}
                        />

                        {/* Dark overlay for better text visibility */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    </>
                ) : (
                    /* Fallback when no image or image error */
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600 dark:from-orange-500 dark:to-orange-700 flex items-center justify-center">
                        <span className="text-4xl sm:text-5xl font-bold text-white/20">
                            {getInitials(category.name)}
                        </span>
                    </div>
                )}

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-5">
                    {/* Category Name */}
                    <h3 className="text-white text-xl sm:text-2xl font-bold mb-2 drop-shadow-lg">
                        {category.name}
                    </h3>

                    {/* Subcategories count */}
                    {category.subcategories && category.subcategories.length > 0 && (
                        <p className="text-white/80 text-sm mb-3">
                            {category.subcategories.length} subcategories
                        </p>
                    )}

                    {/* Arrow button */}
                    <motion.div
                        className="flex items-center justify-between"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <span className="text-white/90 text-sm group-hover:text-white transition-colors">
                            Browse ads
                        </span>
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 group-hover:bg-white/30 transition-all">
                            <ArrowRight className="h-5 w-5 text-white" />
                        </div>
                    </motion.div>
                </div>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
        </motion.div>
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
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        fetchHomepageCategories();
    }, []);

    const fetchHomepageCategories = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/site-settings/homepage-categories`);

            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }

            const data = await response.json();
            console.log('Homepage categories:', data);
            setCategories(data);
        } catch (error) {
            console.error('Error fetching homepage categories:', error);
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };

    const handleNavigation = (categoryId) => {
        navigate(`/categories/${categoryId}`);
    };

    const scrollToIndex = (index) => {
        if (scrollContainerRef.current) {
            const scrollAmount = index * 320; // Approximate width of each tile
            scrollContainerRef.current.scrollTo({
                left: scrollAmount,
                behavior: 'smooth'
            });
            setCurrentIndex(index);
        }
    };

    const handlePrevious = () => {
        const newIndex = Math.max(0, currentIndex - 1);
        scrollToIndex(newIndex);
    };

    const handleNext = () => {
        const maxIndex = Math.max(0, categories.length - 3); // Show 3 items at a time
        const newIndex = Math.min(maxIndex, currentIndex + 1);
        scrollToIndex(newIndex);
    };

    if (loading) {
        return (
            <div className="py-12 lg:py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4 lg:px-8">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-8 text-center">
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

    const showNavigation = categories.length > 3;

    return (
        <div className="py-12 lg:py-16 bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4 lg:px-8">
                <ScrollAnimatedSection>
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-10 text-center">
                        Explore Categories
                    </h2>
                </ScrollAnimatedSection>

                {/* Categories Carousel Container */}
                <div className="relative max-w-7xl mx-auto">
                    {/* Left Navigation Arrow */}
                    {showNavigation && (
                        <button
                            onClick={handlePrevious}
                            className={`absolute -left-12 lg:-left-16 top-1/2 -translate-y-1/2 z-10 bg-orange-200 hover:bg-orange-300 rounded-full p-3 shadow-lg transition-all ${
                                currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            disabled={currentIndex === 0}
                        >
                            <ChevronLeft className="h-6 w-6 text-orange-800" />
                        </button>
                    )}

                    {/* Right Navigation Arrow */}
                    {showNavigation && (
                        <button
                            onClick={handleNext}
                            className={`absolute -right-12 lg:-right-16 top-1/2 -translate-y-1/2 z-10 bg-orange-200 hover:bg-orange-300 rounded-full p-3 shadow-lg transition-all ${
                                currentIndex >= categories.length - 3 ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            disabled={currentIndex >= categories.length - 3}
                        >
                            <ChevronRight className="h-6 w-6 text-orange-800" />
                        </button>
                    )}

                    {/* Scrollable Categories Container */}
                    <div
                        ref={scrollContainerRef}
                        className="overflow-x-auto scrollbar-hide"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        <div className="flex gap-6 pb-4 justify-center">
                            {categories.map((category, index) => (
                                <CategoryTile
                                    key={category._id}
                                    category={category}
                                    index={index}
                                    onClick={() => handleNavigation(category._id)}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Navigation dots */}
                <div className="flex justify-center mt-8 space-x-2">
                    {categories.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => scrollToIndex(index)}
                            className={`h-2 rounded-full transition-all duration-300 ${
                                index === currentIndex
                                    ? 'w-8 bg-orange-500'
                                    : 'w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
                            }`}
                        />
                    ))}
                </div>

                {/* Bottom text */}
                <p className="text-center text-gray-600 dark:text-gray-400 mt-8 text-lg">
                    Discover some great stuff & services you're looking for
                </p>
            </div>

            {/* Custom CSS to hide scrollbar */}
            <style jsx>{`
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
};

export default Categories;