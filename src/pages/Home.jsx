import React from 'react';
import Hero from '../components/home/Hero';
import LatestItems from '../components/home/LatestItems';
import Featured from '../components/home/Featured';

const Home = () => {
    return (
        <>
            <Hero />
            <LatestItems />
            <Featured />
        </>
    );
};

export default Home;
