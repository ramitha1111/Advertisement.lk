import React, {useEffect} from 'react';
import HeroSection from "./HomeComponents/HeroSection.jsx";
import Categories from "./HomeComponents/CategoriesHome.jsx";
import LatestAdvertisements from "./HomeComponents/LatestAdvertisements.jsx";

const Home = () => {
    const title = 'Home - Advertisements.lk';
    useEffect(() => {
        document.title = title;
    }, [title]);

    return (
        <>
            <HeroSection/>
            <Categories/>
            <LatestAdvertisements/>
        </>
    );
};

export default Home;
