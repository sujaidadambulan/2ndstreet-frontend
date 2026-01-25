import React, { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import Lenis from 'lenis';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
    const location = useLocation();

    useEffect(() => {
        // Temporarily disabled Lenis smooth scroll to fix double scrollbar issue
        // const lenis = new Lenis({
        //     duration: 1.2,
        //     easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        //     direction: 'vertical',
        //     gestureDirection: 'vertical',
        //     smooth: true,
        //     smoothTouch: false,
        //     touchMultiplier: 2,
        // });

        // function raf(time) {
        //     lenis.raf(time);
        //     requestAnimationFrame(raf);
        // }

        // requestAnimationFrame(raf);

        // return () => {
        //     lenis.destroy();
        // };
    }, []);

    // Scroll to top on route change
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <div className="app-layout">
            <Navbar />
            <main className="main-content">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
