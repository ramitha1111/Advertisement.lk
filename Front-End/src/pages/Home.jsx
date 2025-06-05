import React, {useEffect} from 'react';
import HeroSection from "./HomeComponents/HeroSection.jsx";
import Categories from "./HomeComponents/CategoriesHome.jsx";
import LatestAdvertisements from "./HomeComponents/LatestAdvertisements.jsx";
import NewHeroSection from "./HomeComponents/NewHeroSection.jsx";
import NewHeroSection2 from "./HomeComponents/NewHeroSection2.jsx";

const Home = () => {
    const title = 'Home - Advertisements.lk';
    useEffect(() => {
        document.title = title;
    }, [title]);

    return (
        <>
            <HeroSection/>
            <NewHeroSection/>
            <NewHeroSection2/>
            <Categories/>
            <LatestAdvertisements/>
        </>
    );
};

export default Home;
