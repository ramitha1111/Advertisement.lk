import React from 'react';
import HeroSection from "./HomeComponents/HeroSection.jsx";
import Categories from "./HomeComponents/Categories.jsx";

const Home = () => {
    return (
        <>
            <HeroSection/>
            <Categories/>
            <div className='flex flex-col p-10 w-full bg-gray-100 dark:bg-gray-800'>
                <h1>Welcome to the Home Page</h1>
                <h1>Welcome to the Home Page</h1>
                <h1>Welcome to the Home Page</h1>
                <h1>Welcome to the Home Page</h1>
                <h1>Welcome to the Home Page</h1>
                <h1>Welcome to the Home Page</h1>
                <h1>Welcome to the Home Page</h1>
                <h1>Welcome to the Home Page</h1>
                <h1>Welcome to the Home Page</h1>
            </div>
        </>
    );
};

export default Home;
