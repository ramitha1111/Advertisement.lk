import React, { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Add this import
import WaveBackground from "./Images/WaveBackground.svg"

export default function HeroSection() {
    const navigate = useNavigate(); // Use the actual hook
    
    // Replace the mock function with actual navigation
    const Navigate = (path) => {
        navigate(path);
    };

    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const inputRef = useRef(null);
    const suggestionRefs = useRef([]);

    // Sample suggestions - you can replace this with API calls or your own data
    const allSuggestions = [
        "Real Estate in Colombo",
        "Houses for Sale",
        "Apartments for Rent",
        "Birds for Sale",
        "Cats and Kittens",
        "Dogs for Adoption",
        "Cars for Sale",
        "Motorcycles",
        "Mobile Phones",
        "Laptops and Computers",
        "Furniture",
        "Electronics",
        "Jobs in Colombo",
        "Part-time Jobs",
        "Freelance Work",
        "Tutoring Services",
        "Home Services",
        "Repair Services"
    ];

    // Filter suggestions based on search query
    useEffect(() => {
        if (searchQuery.trim() === "") {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        const filtered = allSuggestions.filter(suggestion =>
            suggestion.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 6); // Limit to 6 suggestions

        setSuggestions(filtered);
        setShowSuggestions(filtered.length > 0);
        setSelectedIndex(-1);
    }, [searchQuery]);

    // Handle input change
    const handleInputChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Handle keyboard navigation
    const handleKeyDown = (e) => {
        if (!showSuggestions) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev => 
                    prev < suggestions.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0) {
                    handleSuggestionClick(suggestions[selectedIndex]);
                } else {
                    handleSearch();
                }
                break;
            case 'Escape':
                setShowSuggestions(false);
                setSelectedIndex(-1);
                inputRef.current?.blur();
                break;
        }
    };

    // Handle suggestion click
    const handleSuggestionClick = (suggestion) => {
        setSearchQuery(suggestion);
        setShowSuggestions(false);
        setSelectedIndex(-1);
        Navigate("/search-advertisements/" + encodeURIComponent(suggestion));
    };

    // Handle search
    const handleSearch = () => {
        if (searchQuery.trim()) {
            Navigate("/search-advertisements/" + encodeURIComponent(searchQuery));
            setShowSuggestions(false);
        }
    };

    // Handle input focus
    const handleInputFocus = () => {
        if (suggestions.length > 0) {
            setShowSuggestions(true);
        }
    };

    // Handle click outside to close suggestions
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (inputRef.current && !inputRef.current.contains(event.target)) {
                setShowSuggestions(false);
                setSelectedIndex(-1);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Scroll selected suggestion into view
    useEffect(() => {
        if (selectedIndex >= 0 && suggestionRefs.current[selectedIndex]) {
            suggestionRefs.current[selectedIndex].scrollIntoView({
                block: 'nearest',
                behavior: 'smooth'
            });
        }
    }, [selectedIndex]);
    
    return (
        <div className="relative w-full overflow-hidden bg-white">
            {/* Background wave pattern */}
            <div className="absolute inset-0 z-0 h-full w-full bg-gradient-to-r from-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
                <img className="w-full h-full object-cover dark:invert" src={WaveBackground} alt="WaveBackground.svg"/>
            </div>

            <div className="max-w-7xl mx-auto px-8 py-12 md:py-16 relative">
                <div className="flex flex-col xl:flex-row items-center justify-center min-h-[60vh]">
                    {/* Text and Search - Full width on smaller screens, centered */}
                    <div className="w-full xl:w-1/2 z-10 mx-auto xl:mx-0 text-center xl:text-left">
                        <h1 className="text-5xl md:text-6xl font-bold text-slate-700 dark:text-slate-200 mb-4">
                            Find Anything<br/>
                            Around <span className="text-orange-500">You</span>
                        </h1>

                        {/* Search Box with higher z-index - centered on smaller screens */}
                        <div className="mt-8 relative z-20 max-w-2xl mx-auto xl:mx-0 xl:pr-12">
                            <div className="flex flex-col sm:flex-row gap-2">
                                <div className="flex-1 relative" ref={inputRef}>
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <div className="w-5 h-5 text-gray-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="11" cy="11" r="8" />
                                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                            </svg>
                                        </div>
                                    </div>
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={handleInputChange}
                                        onKeyDown={handleKeyDown}
                                        onFocus={handleInputFocus}
                                        className="pl-10 pr-3 py-3 w-full bg-slate-50 dark:bg-slate-700 rounded-md border border-gray-300 dark:border-gray-500 shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 hover:ring-2 hover:ring-orange-200 dark:hover:ring-orange-800"
                                        placeholder="I'm looking for..."
                                        autoComplete="off"
                                    />
                                    
                                    {/* Suggestions dropdown */}
                                    {showSuggestions && suggestions.length > 0 && (
                                        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto z-50">
                                            {suggestions.map((suggestion, index) => (
                                                <div
                                                    key={index}
                                                    ref={el => suggestionRefs.current[index] = el}
                                                    className={`px-4 py-3 cursor-pointer border-b border-gray-100 dark:border-gray-600 last:border-b-0 transition-colors ${
                                                        index === selectedIndex 
                                                            ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400' 
                                                            : 'hover:bg-gray-50 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200'
                                                    }`}
                                                    onClick={() => handleSuggestionClick(suggestion)}
                                                >
                                                    <div className="flex items-center">
                                                        <Search size={16} className="mr-3 text-gray-400" />
                                                        <span className="text-sm">{suggestion}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                
                                <button
                                    type="button"
                                    onClick={handleSearch}
                                    className="bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-md flex items-center justify-center lg:w-12 lg:mr-5 transition-colors"
                                >
                                    <Search size={20} />
                                </button>
                            </div>

                            {/* Popular searches */}
                            <div className="mt-4 text-sm text-gray-600 dark:text-slate-400">
                                <span className="font-medium">What's popular:</span>
                                <span className="ml-2">
                                    <button 
                                        onClick={() => handleSuggestionClick("Real Estate")}
                                        className="mr-2 hover:text-orange-500 cursor-pointer transition-colors"
                                    >
                                        Real Estate,
                                    </button>
                                    <button 
                                        onClick={() => handleSuggestionClick("Houses")}
                                        className="mr-2 hover:text-orange-500 cursor-pointer transition-colors"
                                    >
                                        Houses,
                                    </button>
                                    <button 
                                        onClick={() => handleSuggestionClick("Birds")}
                                        className="mr-2 hover:text-orange-500 cursor-pointer transition-colors"
                                    >
                                        Birds,
                                    </button>
                                    <button 
                                        onClick={() => handleSuggestionClick("Cats")}
                                        className="hover:text-orange-500 cursor-pointer transition-colors"
                                    >
                                        Cats
                                    </button>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right side - Side by side images - Hidden on screens smaller than 1280px */}
                    <div className="hidden xl:block w-full xl:w-1/2 mt-12 xl:mt-0 relative z-0">
                        <div className="flex justify-center items-center">
                            {/* Image Container with adjusted spacing */}
                            <div className="relative w-full h-[450px] flex justify-center">
                                {/* Left image (Person in car) - adjusted positioning to overlap with search */}
                                <div className="absolute left-0 w-[50%] h-full max-w-xs rounded-lg overflow-hidden shadow-lg transform xl:-rotate-2 -ml-6">
                                    <img
                                        src="https://imgproxy.divecdn.com/WflyY0mKvoCC_NKALx6OER7ag35uerH-CoEd6szyv3o/g:ce/rs:fill:1200:675:1/Z3M6Ly9kaXZlc2l0ZS1zdG9yYWdlL2RpdmVpbWFnZS9HZXR0eUltYWdlcy0xNDQwMTQ5NzIzLmpwZw==.webp"
                                        alt="Person in car"
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Right image (Person with laptop) - adjusted positioning to be closer */}
                                <div className="absolute right-0 w-[50%] h-full max-w-xs rounded-lg overflow-hidden shadow-lg transform xl:rotate-2 -mr-6">
                                    <img
                                        src="https://newpathdigital.com/wp-content/uploads/2021/09/AdobeStock_349411371-1.jpeg"
                                        alt="Person with laptop"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}