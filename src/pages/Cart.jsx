import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import './Cart.css';

const Cart = () => {
    const { cart, removeFromCart, cartTotal, orderViaWhatsApp, clearCart } = useCart();
    const { user } = useAuth();

    if (!user) {
        return (
            <div className="cart-page-wrapper">
                <div className="container empty-cart">
                    <h2>Please Login</h2>
                    <p>You need to be logged in to view your cart.</p>
                    <Link to="/login" className="shop-now-btn">Login Now</Link>
                </div>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="cart-page-wrapper">
                <div className="container empty-cart">
                    <h2>Your Bag is Empty</h2>
                    <p>Looks like you haven't added any items yet.</p>
                    <Link to="/shop" className="shop-now-btn">Start Shopping</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page-wrapper">
            <div className="container">
                <h1 className="cart-title">Shopping Bag ({cart.length})</h1>

                <div className="cart-layout">
                    <div className="cart-items">
                        {cart.map((item, index) => (
                            <div key={`${item._id}-${index}`} className="cart-item">
                                <Link to={`/product/${item._id}`} className="cart-item-image">
                                    <img src={item.images?.[0] || item.image} alt={item.name} />
                                </Link>
                                <div className="cart-item-details">
                                    <div className="cart-item-header">
                                        <Link to={`/product/${item._id}`}>
                                            <h3>{item.name}</h3>
                                        </Link>
                                        <button
                                            className="remove-btn"
                                            onClick={() => removeFromCart(item._id)}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                    <p className="cart-item-category">
                                        {typeof item.category === 'object' ? item.category?.name : item.category}
                                    </p>
                                    <div className="cart-item-price-qty">
                                        <div className="cart-item-prices">
                                            {item.discountPrice ? (
                                                <div className="price-flex">
                                                    <span className="price offer-price">₹{item.discountPrice}</span>
                                                    <span className="price regular-price strikethrough" style={{ fontSize: '0.8rem', color: 'var(--color-gray-400)', textDecoration: 'line-through', fontWeight: '400' }}>₹{item.regularPrice}</span>
                                                </div>
                                            ) : (
                                                <span className="price">₹{item.regularPrice || item.price}</span>
                                            )}
                                        </div>
                                        <span className="qty">Qty: {item.quantity}</span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <button className="clear-cart-text" onClick={clearCart}>
                            Clear Shopping Bag
                        </button>
                    </div>

                    <div className="cart-summary">
                        <h2>Order Summary</h2>
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>₹{cartTotal}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping</span>
                            <span>Calculated on WhatsApp</span>
                        </div>
                        <div className="summary-total">
                            <span>Total</span>
                            <span>₹{cartTotal}</span>
                        </div>

                        <button className="whatsapp-order-btn" onClick={orderViaWhatsApp}>
                            ORDER VIA WHATSAPP
                        </button>
                        <p className="whatsapp-note">
                            We process all orders directly via WhatsApp for a personalized experience.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
