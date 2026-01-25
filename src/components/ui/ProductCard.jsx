import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleAddToCart = (e) => {
        e.preventDefault(); // Prevent link navigation
        e.stopPropagation();

        if (!user) {
            navigate('/login');
            return;
        }

        try {
            addToCart(product);
            // Optional: Show toast
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <motion.div
            className="product-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
        >
            <Link to={`/product/${product._id || product.id}`} className="product-card-link">
                <div className="product-image-container">
                    <img
                        src={product.images?.[0] || product.image}
                        alt={product.name}
                        className="product-image"
                    />
                    <img
                        src={product.images?.[1] || product.images?.[0] || product.hoverImage || product.image}
                        alt={product.name}
                        className="product-image-hover"
                    />
                    <button
                        className="add-to-cart-btn"
                        aria-label="Add to Cart"
                        onClick={handleAddToCart}
                    >
                        <Plus size={20} />
                    </button>
                </div>
                <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-category">
                        {typeof product.category === 'object' ? product.category?.name : product.category}
                    </p>
                    <div className="product-price-container">
                        {product.discountPrice ? (
                            <div className="price-flex">
                                <span className="product-price offer-price">₹{product.discountPrice}</span>
                                <span className="product-price regular-price strikethrough">₹{product.regularPrice}</span>
                            </div>
                        ) : (
                            <span className="product-price">₹{product.regularPrice}</span>
                        )}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default ProductCard;
