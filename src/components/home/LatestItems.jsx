import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_URL } from '../../config';
import './LatestItems.css';

const LatestItems = () => {
    const [products, setProducts] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [itemsPerView, setItemsPerView] = useState(4);

    // Determine items per view based on screen size
    useEffect(() => {
        const updateItemsPerView = () => {
            if (window.innerWidth < 768) {
                setItemsPerView(2);
            } else if (window.innerWidth < 1024) {
                setItemsPerView(2);
            } else if (window.innerWidth < 1440) {
                setItemsPerView(3);
            } else {
                setItemsPerView(4);
            }
        };

        updateItemsPerView();
        window.addEventListener('resize', updateItemsPerView);
        return () => window.removeEventListener('resize', updateItemsPerView);
    }, []);

    // Fetch latest products
    useEffect(() => {
        const fetchLatestProducts = async () => {
            try {
                const response = await fetch(`${API_URL}/api/products`);
                if (!response.ok) throw new Error('Failed to fetch products');

                const data = await response.json();
                // Get the 8 most recent products
                const latestProducts = data.slice(0, 8);
                setProducts(latestProducts);
            } catch (error) {
                console.error('Error fetching latest products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLatestProducts();
    }, []);

    const maxIndex = Math.max(0, products.length - itemsPerView);

    const handlePrev = () => {
        setCurrentIndex((prev) => Math.max(0, prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
    };

    // Swipe handlers for mobile
    const handleDragEnd = (event, info) => {
        const threshold = 50;
        if (info.offset.x > threshold) {
            handlePrev();
        } else if (info.offset.x < -threshold) {
            handleNext();
        }
    };

    if (loading) {
        return (
            <section className="latest-items-section">
                <div className="container">
                    <div className="latest-items-header">
                        <h2>Loading...</h2>
                    </div>
                </div>
            </section>
        );
    }

    if (products.length === 0) {
        return null;
    }

    return (
        <section className="latest-items-section">
            <div className="container">
                <motion.div
                    className="latest-items-header"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2>Latest Arrivals</h2>
                    <p>Discover our newest additions to the collection</p>
                </motion.div>

                <div className="latest-items-carousel">
                    {/* Navigation Arrows */}
                    <button
                        className="carousel-nav carousel-nav-left"
                        onClick={handlePrev}
                        disabled={currentIndex === 0}
                        aria-label="Previous items"
                    >
                        <ChevronLeft size={24} strokeWidth={1.5} />
                    </button>

                    <button
                        className="carousel-nav carousel-nav-right"
                        onClick={handleNext}
                        disabled={currentIndex >= maxIndex}
                        aria-label="Next items"
                    >
                        <ChevronRight size={24} strokeWidth={1.5} />
                    </button>

                    {/* Carousel Track */}
                    <div className="carousel-container">
                        <motion.div
                            className="carousel-track"
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.1}
                            onDragEnd={handleDragEnd}
                            animate={{
                                x: `-${currentIndex * (100 / itemsPerView)}%`
                            }}
                            transition={{
                                type: 'spring',
                                stiffness: 300,
                                damping: 30
                            }}
                            style={{
                                width: `${(products.length / itemsPerView) * 100}%`
                            }}
                        >
                            {products.map((product) => (
                                <motion.div
                                    key={product._id || product.id}
                                    className="carousel-item"
                                    style={{
                                        width: `${100 / products.length}%`
                                    }}
                                    whileHover={{ y: -10 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Link to={`/product/${product._id || product.id}`} className="product-link">
                                        <div className="product-image-container">
                                            <img
                                                src={product.images?.[0] || product.image}
                                                alt={product.name}
                                                className="product-image"
                                            />
                                            <div className="product-overlay">
                                                <span className="view-details">View Details</span>
                                            </div>
                                        </div>
                                        <div className="product-info">
                                            <h3 className="product-name">{product.name}</h3>
                                            <div className="product-price">
                                                {product.discountPrice && product.discountPrice < product.regularPrice ? (
                                                    <>
                                                        <span className="price-regular">₹{product.regularPrice}</span>
                                                        <span className="price-discount">₹{product.discountPrice}</span>
                                                    </>
                                                ) : (
                                                    <span className="price">₹{product.regularPrice}</span>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Pagination Dots */}
                    <div className="carousel-dots">
                        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                            <button
                                key={index}
                                className={`carousel-dot ${currentIndex === index ? 'active' : ''}`}
                                onClick={() => setCurrentIndex(index)}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LatestItems;
