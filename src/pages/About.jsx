import React from 'react';
import { motion } from 'framer-motion';
import aboutImg from '../assets/about.jfif';
import './About.css';

const About = () => {
    return (
        <div className="about-page container">
            <div className="about-header">
                <motion.h1
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    We Are<br />2ndStreet
                </motion.h1>
            </div>

            <div className="about-content">
                <motion.div
                    className="about-image"
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                >
                    <img src={aboutImg} alt="Fashion Editorial" />
                </motion.div>

                <div className="about-text">
                    <motion.h2
                        initial={{ y: 30, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        The Essence of Minimalism
                    </motion.h2>
                    <motion.p
                        initial={{ y: 30, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        2ndStreet is not just a brand; it's a philosophy. Born from the desire to strip away the unnecessary, we curate collections that speak to the modern individual who values quality over quantity.
                    </motion.p>
                    <motion.p
                        initial={{ y: 30, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                    >
                        Our designs are rooted in the belief that true luxury lies in simplicity. Every piece is crafted with precision, ensuring that it not only looks good but feels exceptional.
                    </motion.p>
                </div>
            </div>
        </div>
    );
};

export default About;
