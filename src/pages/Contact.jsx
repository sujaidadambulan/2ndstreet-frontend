import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import './Contact.css';

const Contact = () => {
    return (
        <div className="contact-page container">
            <div className="contact-grid">
                <div className="contact-info">
                    <motion.h1
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        Get In Touch
                    </motion.h1>
                    <motion.p
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        Have a question or just want to say hello? We'd love to hear from you.
                    </motion.p>
                    <motion.div
                        className="contact-details"
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        <div>
                            <h3>Email</h3>
                            <p>hello@2ndstreet.com</p>
                        </div>
                        <div>
                            <h3>Phone</h3>
                            <p>+1 (555) 123-4567</p>
                        </div>
                    </motion.div>
                </div>

                <motion.form
                    className="contact-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                >
                    <div className="form-group">
                        <input type="text" placeholder="Name" required />
                    </div>
                    <div className="form-group">
                        <input type="email" placeholder="Email" required />
                    </div>
                    <div className="form-group">
                        <textarea placeholder="Message" rows="4" required></textarea>
                    </div>
                    <button type="submit" className="submit-btn">
                        Send Message <ArrowRight size={20} />
                    </button>
                </motion.form>
            </div>
        </div>
    );
};

export default Contact;
