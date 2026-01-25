import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImage from '../../assets/WhatsApp Image 2026-01-23 at 12.13.49 AM.jpeg';
import './Hero.css';

const Hero = () => {
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 500], [0, 150]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    return (
        <section className="hero">
            <div className="hero-background">
                <motion.div
                    className="hero-image-container"
                    style={{ y }}
                >
                    <img
                        src={heroImage}
                        alt="Luxury Fashion"
                        className="hero-image"
                    />
                    <div className="hero-overlay"></div>
                </motion.div>
            </div>

            <motion.div
                className="container hero-content"
                style={{ opacity }}
            >
                <div className="hero-text">
                    <motion.h1
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                    >
                    </motion.h1>

                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                    >
                        
                    </motion.p>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                    >
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
};

export default Hero;
