import React from "react";
import { Search } from "lucide-react";
import WaveBackground from "./Images/WaveBackground.svg"

export default function HeroSection() {
    return (
        <div className="relative w-full min-h-[80vh] overflow-hidden bg-white">
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
                            Around <span className="text-orange-500">You.</span>
                        </h1>

                        {/* Search Box with higher z-index - centered on smaller screens */}
                        <div className="mt-8 relative z-20 max-w-2xl mx-auto xl:mx-0 xl:pr-12">
                            <div className="flex flex-col sm:flex-row gap-2">
                                <div className="flex-1 relative">
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
                                        className="pl-10 pr-3 py-3 w-full bg-slate-50 dark:bg-slate-700 rounded-md border border-gray-300 dark:border-gray-500 shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 hover:ring-2 hover:ring-orange-200 dark:hover:ring-orange-800"
                                        placeholder="I'm looking for..."
                                    />
                                </div>
                                {/*
                                <div className="flex-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <div className="w-5 h-5 text-gray-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                                <circle cx="12" cy="10" r="3" />
                                            </svg>
                                        </div>
                                    </div>
                                    <input
                                        type="text"
                                        className="pl-10 pr-3 py-3 w-full bg-slate-50 dark:bg-slate-700 rounded-md border border-gray-300 dark:border-gray-500 shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 hover:ring-2 hover:ring-orange-200 dark:hover:ring-orange-800"
                                        placeholder="Location (e.g. Colombo)"
                                    />
                                </div> */}
                                <button
                                    className="bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-md flex items-center justify-center lg:w-12 lg:mr-5"
                                >
                                    <Search size={20} />
                                </button>
                            </div>

                            {/* Popular searches */}
                            <div className="mt-4 text-sm text-gray-600 dark:text-slate-400">
                                <span className="font-medium">What's popular:</span>
                                <span className="ml-2">
                                  <span className="mr-2">Real Estate,</span>
                                  <span className="mr-2">Houses,</span>
                                  <span className="mr-2">Birds,</span>
                                  <span>Cats</span>
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
