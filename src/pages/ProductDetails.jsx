import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { API_URL } from '../config';
import { ArrowLeft, MessageCircle, Share2, ShieldCheck, Truck } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './ProductDetails.css';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState('');

    const { addToCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    // WhatsApp Number
    const WHATSAPP_NUMBER = "9048376099";

    const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
    const [isZoomed, setIsZoomed] = useState(false);

    const handleMouseMove = (e) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.pageX - left - window.scrollX) / width) * 100;
        const y = ((e.pageY - top - window.scrollY) / height) * 100;
        setZoomPos({ x, y });
    };

    const handleMouseEnter = () => setIsZoomed(true);
    const handleMouseLeave = () => setIsZoomed(false);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${API_URL}/products/${id}`);
                if (!res.ok) throw new Error('Product not found');
                const data = await res.json();
                setProduct(data);

                // Fetch recommendations
                const allRes = await fetch(`${API_URL}/products`);
                const allData = await allRes.json();

                const fitId = typeof data.fit === 'object' ? data.fit?._id : data.fit;
                let similar = [];
                if (fitId) {
                    similar = allData.filter(p => {
                        const pFitId = typeof p.fit === 'object' ? p.fit?._id : p.fit;
                        return pFitId === fitId && (p._id || p.id) !== (data._id || data.id);
                    });
                }

                if (similar.length === 0 && data.category) {
                    const catId = typeof data.category === 'object' ? data.category?._id : data.category;
                    similar = allData.filter(p => {
                        const pCatId = typeof p.category === 'object' ? p.category?._id : p.category;
                        return pCatId === catId && (p._id || p.id) !== (data._id || data.id);
                    });
                }

                setRelatedProducts(similar.slice(0, 4));
            } catch (err) {
                console.error("Error fetching details:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
        window.scrollTo(0, 0);
    }, [id]);

    const handleWhatsAppBuy = () => {
        if (!product) return;
        if (product.sizes && product.sizes.length > 0 && !selectedSize) {
            alert('Please select a size first');
            return;
        }

        const categoryName = typeof product.category === 'object' ? product.category?.name : 'N/A';
        const modelName = typeof product.fit === 'object' ? product.fit?.name : (product.fit || 'Standard');
        const price = product.discountPrice || product.regularPrice;

        const message = `Hi, I'm interested in ordering:
*Item:* ${product.name}
*Price:* ₹${price}
*Model:* ${modelName}
*Category:* ${categoryName}
${selectedSize ? `*Size:* ${selectedSize}\n` : ''}*Link:* ${window.location.href}

Is this item available for order?`;

        const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    const handleAddToCart = () => {
        if (!product) return;
        if (product.sizes && product.sizes.length > 0 && !selectedSize) {
            alert('Please select a size first');
            return;
        }

        if (!user) {
            navigate('/login');
            return;
        }

        const productToAdd = {
            ...product,
            selectedSize: selectedSize
        };

        addToCart(productToAdd);
        alert('Item added to cart!');
    };

    if (loading) return <div className="product-details-container loading"><div className="loading-spinner"></div></div>;
    if (error) return <div className="product-details-container error"><p>Error: {error}</p><Link to="/shop" className="back-link">Back to Shop</Link></div>;
    if (!product) return null;

    const images = product.images && product.images.length > 0 ? product.images : [product.image];

    return (
        <div className="product-details-page">
            <div className="container">
                <Link to="/shop" className="back-nav">
                    <ArrowLeft size={20} />
                    <span>Back to Shop</span>
                </Link>

                <div className="product-details-grid">
                    <div className="product-gallery">
                        <motion.div
                            className="main-image-container"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            onMouseMove={handleMouseMove}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            style={{ overflow: 'hidden', cursor: 'zoom-in' }}
                        >
                            <img
                                src={images[selectedImage]}
                                alt={product.name}
                                className="main-image"
                                style={{
                                    transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                                    transform: isZoomed ? 'scale(2)' : 'scale(1)',
                                    transition: isZoomed ? 'none' : 'transform 0.3s ease'
                                }}
                            />
                        </motion.div>
                        {images.length > 1 && (
                            <div className="thumbnail-list">
                                {images.map((img, index) => (
                                    <button
                                        key={index}
                                        className={`thumbnail-btn ${selectedImage === index ? 'active' : ''}`}
                                        onClick={() => setSelectedImage(index)}
                                    >
                                        <img src={img} alt={`View ${index + 1}`} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <motion.div
                        className="product-info-section"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="product-header">
                            <span className="product-subtitle">
                                {typeof product.category === 'object' ? product.category?.name : product.category}
                            </span>
                            <h1 className="product-title">{product.name}</h1>

                            <div className="product-model-info" style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--color-gray-600)' }}>
                                <div style={{ marginBottom: '0.25rem' }}>
                                    <strong>Fit:</strong> {typeof product.fit === 'object' ? product.fit?.name : (product.fit || 'Standard')}
                                </div>

                            </div>

                            <div className="product-price-container">
                                {product.discountPrice ? (
                                    <>
                                        <span className="current-price">₹{product.discountPrice}</span>
                                        <span className="original-price">₹{product.regularPrice}</span>
                                    </>
                                ) : (
                                    <span className="current-price">₹{product.regularPrice}</span>
                                )}
                            </div>
                        </div>

                        <div className="product-description">
                            <p>{product.description}</p>
                        </div>

                        {product.sizes && product.sizes.length > 0 && (
                            <div className="product-options">
                                <label>Select Size</label>
                                <div className="size-grid">
                                    {product.sizes.map(size => (
                                        <div
                                            key={size}
                                            className={`size-badge ${selectedSize === size ? 'active' : ''}`}
                                            onClick={() => setSelectedSize(size)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {size}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="product-actions" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <button className="add-to-cart-btn-large" onClick={handleAddToCart} style={{
                                flex: 1,
                                padding: '1rem',
                                background: 'var(--color-black)',
                                color: 'white',
                                border: 'none',
                                textTransform: 'uppercase',
                                fontWeight: '700',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem'
                            }}>
                                <span>ADD TO BAG</span>
                            </button>
                            <button className="whatsapp-btn" onClick={handleWhatsAppBuy} style={{ flex: 1 }}>
                                <MessageCircle size={20} />
                                <span>Buy on WhatsApp</span>
                            </button>
                        </div>

                        <div className="product-meta">
                            <div className="meta-item">
                                <Truck size={18} />
                                <span style={{ marginLeft: '0.5rem' }}>Free shipping </span>
                            </div>
                            <div className="meta-item">
                                <ShieldCheck size={18} />
                                <span style={{ marginLeft: '0.5rem' }}>Quality guarantee</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {relatedProducts.length > 0 && (
                    <div className="related-products-section">
                        <h2 className="section-title">You May Also Like</h2>
                        <div className="product-grid">
                            {relatedProducts.map(p => (
                                <ProductCard key={p._id || p.id} product={p} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetails;
