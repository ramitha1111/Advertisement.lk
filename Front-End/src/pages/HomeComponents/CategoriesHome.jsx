import React, {useCallback, useEffect, useRef, useState} from 'react';
import {motion, useAnimation, useInView} from 'framer-motion';
import {ArrowRight, ChevronLeft, ChevronRight} from 'lucide-react';
import {useNavigate} from 'react-router-dom';
import api from '../../axios';

const CategoryTile = ({category, onClick, index}) => {
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
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5, delay: index * 0.1}}
            whileHover={{scale: 1.05}}
            className="relative group cursor-pointer flex-shrink-0 w-[280px] sm:w-[320px] md:w-[340px] lg:w-[360px] mt-2 mb-2"
            onClick={onClick}
        >
            <div className="relative w-full h-48 sm:h-56 lg:h-64 rounded-2xl overflow-hidden shadow-lg">
                {/* Category Image with loading state */}
                {category.categoryImage && !imageError ? (
                    <>
                        {/* Skeleton loader while image loads */}
                        {!imageLoaded && (
                            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse"/>
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
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"/>
                    </>
                ) : (
                    /* Fallback when no image or image error */
                    <div
                        className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600 dark:from-orange-500 dark:to-orange-700 flex items-center justify-center">
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
                        initial={{opacity: 0, x: -20}}
                        animate={{opacity: 1, x: 0}}
                        transition={{delay: 0.2}}
                    >
                        <span className="text-white/90 text-sm group-hover:text-white transition-colors">
                            Browse ads
                        </span>
                        <div
                            className="bg-white/20 backdrop-blur-sm rounded-full p-2 group-hover:bg-white/30 transition-all">
                            <ArrowRight className="h-5 w-5 text-white"/>
                        </div>
                    </motion.div>
                </div>

                {/* Hover effect overlay */}
                <div
                    className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
            </div>
        </motion.div>
    );
};

const ScrollAnimatedSection = ({children}) => {
    const controls = useAnimation();
    const ref = useRef(null);
    const inView = useInView(ref, {once: false, amount: 0.2});

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
                visible: {opacity: 1, y: 0},
                hidden: {opacity: 0, y: 30}
            }}
            transition={{duration: 0.4}}
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
    const containerRef = useRef(null);
    const [showArrows, setShowArrows] = useState(false);
    const [isScrolling, setIsScrolling] = useState(false);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    useEffect(() => {
        fetchHomepageCategories();
    }, []);

    const fetchHomepageCategories = async () => {
        try {
            const response = await api.get('/site-settings/homepage-categories');
            console.log('Homepage categories:', response.data);
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching homepage categories:', error);
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };

    // Check if scrolling is needed and update scroll indicators
    const checkScroll = useCallback(() => {
        if (scrollContainerRef.current && containerRef.current) {
            const scrollContainer = scrollContainerRef.current;
            const scrollWidth = scrollContainer.scrollWidth;
            const containerWidth = scrollContainer.offsetWidth;
            const scrollLeft = scrollContainer.scrollLeft;

            setShowArrows(scrollWidth > containerWidth);
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - containerWidth - 10);
        }
    }, []);

    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, [categories, checkScroll]);

    const handleNavigation = (categoryId) => {
        navigate(`/categories/${categoryId}`);
    };

    const scrollToIndex = (index) => {
        if (scrollContainerRef.current && !isScrolling) {
            setIsScrolling(true);
            const container = scrollContainerRef.current;
            const tiles = container.querySelectorAll('.category-tile');

            if (tiles[index]) {
                const tileLeft = tiles[index].offsetLeft;
                const containerWidth = container.offsetWidth;
                const tileWidth = tiles[index].offsetWidth;

                // Center the tile in view with some padding
                const scrollPosition = tileLeft - (containerWidth / 2) + (tileWidth / 2);

                container.scrollTo({
                    left: scrollPosition,
                    behavior: 'smooth'
                });
            }

            setCurrentIndex(index);

            setTimeout(() => {
                setIsScrolling(false);
                checkScroll();
            }, 500);
        }
    };

    const handlePrevious = () => {
        const newIndex = Math.max(0, currentIndex - 1);
        scrollToIndex(newIndex);
    };

    const handleNext = () => {
        const newIndex = Math.min(categories.length - 1, currentIndex + 1);
        scrollToIndex(newIndex);
    };

    const handleScroll = () => {
        if (scrollContainerRef.current && !isScrolling) {
            const container = scrollContainerRef.current;
            const scrollLeft = container.scrollLeft;
            const tiles = container.querySelectorAll('.category-tile');

            let closestIndex = 0;
            let closestDistance = Infinity;

            tiles.forEach((tile, index) => {
                const tileCenter = tile.offsetLeft + (tile.offsetWidth / 2);
                const containerCenter = scrollLeft + (container.offsetWidth / 2);
                const distance = Math.abs(tileCenter - containerCenter);

                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestIndex = index;
                }
            });

            setCurrentIndex(closestIndex);
            checkScroll();
        }
    };

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, [isScrolling]);

    if (loading) {
        return (
            <div className="py-12 lg:py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4 lg:px-8">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-8 text-center">
                        Explore Categories
                    </h2>
                    <div className="flex justify-center">
                        <div
                            className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
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
        <div className="py-12 lg:py-16 bg-gray-50 dark:bg-gray-900 overflow-hidden">
            <div className="container mx-auto px-4 lg:px-8">
                <ScrollAnimatedSection>
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-10 text-center">
                        Explore Categories
                    </h2>
                </ScrollAnimatedSection>

                {/* Categories Carousel Container */}
                <div className="relative" ref={containerRef}>
                    {/* Left Navigation Arrow - Positioned outside the carousel */}
                    {showArrows && (
                        <button
                            onClick={handlePrevious}
                            className={`absolute left-0 xl:-left-16 top-1/2 -translate-y-1/2 z-20 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-3 shadow-lg transition-all ${
                                !canScrollLeft ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            disabled={!canScrollLeft}
                            aria-label="Previous category"
                        >
                            <ChevronLeft className="h-6 w-6 text-gray-800 dark:text-gray-200"/>
                        </button>
                    )}

                    {/* Right Navigation Arrow - Positioned outside the carousel */}
                    {showArrows && (
                        <button
                            onClick={handleNext}
                            className={`absolute right-0 xl:-right-16 top-1/2 -translate-y-1/2 z-20 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-3 shadow-lg transition-all ${
                                !canScrollRight ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            disabled={!canScrollRight}
                            aria-label="Next category"
                        >
                            <ChevronRight className="h-6 w-6 text-gray-800 dark:text-gray-200"/>
                        </button>
                    )}

                    {/* Scrollable Categories Container with padding for arrows */}
                    <div className="px-12 xl:px-0">
                        <div
                            ref={scrollContainerRef}
                            className={`overflow-x-auto scrollbar-hide scroll-smooth ${
                                !showArrows ? 'flex justify-center' : ''
                            }`}
                            style={{
                                scrollbarWidth: 'none',
                                msOverflowStyle: 'none',
                                WebkitOverflowScrolling: 'touch'
                            }}
                        >
                            <div className={`flex gap-6 ${!showArrows ? 'mx-auto' : ''} pb-2`}>
                                {categories.map((category, index) => (
                                    <div key={category._id} className="category-tile">
                                        <CategoryTile
                                            category={category}
                                            index={index}
                                            onClick={() => handleNavigation(category._id)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation dots */}
                {showArrows && (
                    <div className="flex justify-center mt-8 space-x-2">
                        {categories.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => scrollToIndex(index)}
                                className={`transition-all duration-300 ${
                                    index === currentIndex
                                        ? 'w-8 h-2 bg-orange-500 rounded-full'
                                        : 'w-2 h-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 rounded-full'
                                }`}
                                aria-label={`Go to category ${index + 1}`}
                            />
                        ))}
                    </div>
                )}

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