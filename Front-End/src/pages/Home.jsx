import React from 'react';
import HeroSection from "./HomeComponents/HeroSection.jsx";
import Categories from "./HomeComponents/CategoriesHome.jsx";
import LatestAdvertisements from "./HomeComponents/LatestAdvertisements.jsx";

const Home = () => {
    return (
        <>
            <HeroSection/>
            <Categories/>
            <LatestAdvertisements/>
        </>
    );
};

export default Home;
