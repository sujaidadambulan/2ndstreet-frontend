import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import img1 from '../../assets/The Reimagined Standard _ トゥモローランド 公式通販.jfif';
import img2 from '../../assets/IMG_6747.PNG';
import img3 from '../../assets/homeimg1.jfif';
import './Featured.css';

const Featured = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Featured collections - each slide contains all 3 images
    const slides = [
        {
            id: 1,
            title: 'Where What',
            subtitle: 'You Like',
            images: [
                { src: img1, title: 'Denim Collection', link: '/shop' },
                { src: img2, title: 'T-Shirt Collection', link: '/shop' },
                { src: img3, title: 'Jeans Collection', link: '/shop' }
            ]
        },
        // You can add more slide groups here in the future
    ];

    // Autoplay functionality
    useEffect(() => {
        if (slides.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(interval);
    }, [slides.length]);

    const handlePrev = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const handleNext = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const currentSlideData = slides[currentSlide];

    return (
        <section className="featured-section">
            <div className="container">
                <div className="featured-header">
                    <motion.h2
                        key={currentSlide}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                    >
                        {currentSlideData.title}<br />{currentSlideData.subtitle}
                    </motion.h2>
                </div>

                <div className="featured-slider-container">
                    {/* Navigation Arrows - Only show if multiple slides */}
                    {slides.length > 1 && (
                        <>
                            <button
                                className="featured-nav featured-nav-left"
                                onClick={handlePrev}
                                aria-label="Previous slide"
                            >
                                <ChevronLeft size={28} strokeWidth={1.5} />
                            </button>

                            <button
                                className="featured-nav featured-nav-right"
                                onClick={handleNext}
                                aria-label="Next slide"
                            >
                                <ChevronRight size={28} strokeWidth={1.5} />
                            </button>
                        </>
                    )}

                    {/* Slider Track - All 3 images slide together */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentSlide}
                            className="featured-grid"
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        >
                            {/* Large featured item */}
                            <motion.div
                                className="featured-item large"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.1 }}
                            >
                                <img
                                    src={currentSlideData.images[0].src}
                                    alt={currentSlideData.images[0].title}
                                />
                                <div className="featured-info">
                                    <h3>{currentSlideData.images[0].title}</h3>
                                    <Link to={currentSlideData.images[0].link}>Shop Now</Link>
                                </div>
                            </motion.div>

                            {/* Column with 2 smaller items */}
                            <div className="featured-column">
                                <motion.div
                                    className="featured-item"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                >
                                    <img
                                        src={currentSlideData.images[1].src}
                                        alt={currentSlideData.images[1].title}
                                    />
                                    <div className="featured-info">
                                        <h3>{currentSlideData.images[1].title}</h3>
                                        <Link to={currentSlideData.images[1].link}>Explore</Link>
                                    </div>
                                </motion.div>

                                <motion.div
                                    className="featured-item"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.3 }}
                                >
                                    <img
                                        src={currentSlideData.images[2].src}
                                        alt={currentSlideData.images[2].title}
                                    />
                                    <div className="featured-info">
                                        <h3>{currentSlideData.images[2].title}</h3>
                                        <Link to={currentSlideData.images[2].link}>View All</Link>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Pagination Dots - Only show if multiple slides */}
                    {slides.length > 1 && (
                        <div className="featured-dots">
                            {slides.map((_, index) => (
                                <button
                                    key={index}
                                    className={`featured-dot ${currentSlide === index ? 'active' : ''}`}
                                    onClick={() => setCurrentSlide(index)}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Featured;
