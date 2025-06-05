import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NewHeroSection() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [isVisible, setIsVisible] = useState(false);

    // Categories with navigation
    const categories = [
        { name: "Real Estate", query: "Real Estate" },
        { name: "Houses", query: "Houses" },
        { name: "Birds", query: "Birds" },
        { name: "Cats", query: "Cats" }
    ];

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigate(`/search-advertisements/${searchQuery.trim()}`);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const handleCategoryClick = (query) => {
        navigate(`/search-advertisements/${query}`);
    };

    return (
        <div className="relative w-full min-h-[80vh] overflow-hidden bg-gradient-to-r from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center">
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="flex flex-col items-center justify-center text-center">
                    {/* Animated heading */}
                    <h1
                        className={`text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 max-w-3xl transition-all duration-700 transform ${
                            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                        }`}
                    >
            <span className="text-gray-900 dark:text-white block">
              Find Anything
            </span>
                        <span className="text-gray-900 dark:text-white">
              Around <span className="text-orange-500">You.</span>
            </span>
                    </h1>

                    {/* Search section */}
                    <div
                        className={`w-full max-w-2xl bg-white dark:bg-gray-700 rounded-lg shadow-md p-1 mb-6 transition-all duration-1000 delay-150 ${
                            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                        }`}
                    >
                        <div className="flex flex-col sm:flex-row gap-1">
                            <div className="relative flex-1">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                                    <Search size={20} />
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    className="pl-12 pr-4 py-4 w-full bg-transparent border-0 focus:ring-0 text-lg placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
                                    placeholder="I'm looking for..."
                                />
                            </div>
                            <button
                                onClick={handleSearch}
                                className="bg-orange-500 hover:bg-orange-600 text-white py-4 px-6 rounded-md font-medium text-lg transition-all duration-300 flex items-center justify-center transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                            >
                                <Search size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Categories */}
                    <div
                        className={`flex flex-wrap justify-center gap-3 max-w-2xl transition-all duration-1000 delay-300 ${
                            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                        }`}
                    >
                        {categories.map((category, index) => (
                            <button
                                key={index}
                                onClick={() => handleCategoryClick(category.query)}
                                className="px-4 py-2 bg-white dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Background animation */}
            <div className="absolute inset-0 overflow-hidden z-0">
                {[...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-orange-500/10 dark:bg-orange-400/10"
                        style={{
                            width: `${Math.random() * 20 + 5}px`,
                            height: `${Math.random() * 20 + 5}px`,
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animation: `float ${Math.random() * 12 + 8}s ease-in-out infinite`,
                            animationDelay: `${Math.random() * 5}s`
                        }}
                    />
                ))}
            </div>

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0) translateX(0); }
                    25% { transform: translateY(-20px) translateX(10px); }
                    50% { transform: translateY(10px) translateX(-15px); }
                    75% { transform: translateY(-15px) translateX(-10px); }
                }
            `}</style>
        </div>
    );
}
