import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NewHeroSection() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [isVisible, setIsVisible] = useState(false);

    const categories = [
        { name: "Real Estate", query: "Real Estate" },
        { name: "Houses", query: "Houses" },
        { name: "Birds", query: "Birds" },
        { name: "Cats", query: "Cats" },
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
        <div className="relative w-full min-h-[80vh] bg-gradient-to-r from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center overflow-hidden">
            {/* Main content */}
            <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-gray-800 dark:text-white">
                <h1
                    className={`text-5xl md:text-6xl lg:text-7xl font-bold mb-6 transition-all duration-700 transform ${
                        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                    }`}
                >
                    Advertisement.lk: <span className="text-orange-500">Your Next Find Awaits</span>
                </h1>

                <div
                    className={`w-full bg-white bg-opacity-90 dark:bg-gray-800 dark:bg-opacity-70 rounded-xl shadow-lg p-2 mb-8 transition-all duration-1000 delay-150 ${
                        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                    }`}
                >
                    <div className="flex flex-col sm:flex-row gap-2">
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-orange-500 pointer-events-none">
                                <Search size={24} />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="pl-14 pr-4 py-4 w-full bg-transparent border border-orange-500/50 rounded-lg text-orange-600 placeholder-orange-400 focus:outline-none focus:border-orange-600/75 transition-colors duration-300"
                                placeholder="Search items, categories, or locations..."
                            />
                        </div>
                        <button
                            onClick={handleSearch}
                            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 px-6 rounded-lg text-lg transition-transform duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                        >
                            Search
                        </button>
                    </div>
                </div>

                <div
                    className={`flex flex-wrap justify-center gap-4 max-w-3xl mx-auto transition-all duration-1000 delay-300 ${
                        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                    }`}
                >
                    {categories.map((category, index) => (
                        <button
                            key={index}
                            onClick={() => handleCategoryClick(category.query)}
                            className="px-5 py-3 bg-transparent border border-orange-500/50 hover:bg-orange-500 hover:text-white hover:border-orange-500 rounded-full text-orange-500 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            </div>

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0) translateX(0); }
                    25% { transform: translateY(-15px) translateX(8px); }
                    50% { transform: translateY(8px) translateX(-12px); }
                    75% { transform: translateY(-10px) translateX(-6px); }
                }
            `}</style>
        </div>
    );
}
