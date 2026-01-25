import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cart, setCart] = useState([]);

    // Load cart from local storage on mount (optional, or per user)
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => {
        if (!user) {
            throw new Error('Please login to add to cart');
        }

        setCart(prev => {
            const existing = prev.find(item => item._id === product._id);
            if (existing) {
                return prev.map(item =>
                    item._id === product._id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId) => {
        setCart(prev => prev.filter(item => item._id !== productId));
    };

    const clearCart = () => setCart([]);

    const cartTotal = cart.reduce((total, item) => {
        const price = item.discountPrice || item.regularPrice || item.price || 0;
        return total + (price * item.quantity);
    }, 0);

    const orderViaWhatsApp = () => {
        if (cart.length === 0) return;

        const phoneNumber = "9048376099"; // Updated to use the correct number found in ProductDetails
        let message = `Hello, I would like to place an order:%0A%0A`;

        cart.forEach((item, index) => {
            const price = item.discountPrice || item.regularPrice || item.price;
            const modelName = typeof item.fit === 'object' ? item.fit?.name : (item.fit || 'Standard');
            const productId = item.productId || item._id;

            message += `${index + 1}. *Item:* ${item.name}%0A`;
            message += `   *Model:* ${modelName}%0A`;
            message += `   *Number:* ${productId}%0A`;
            if (item.selectedSize) message += `   *Size:* ${item.selectedSize}%0A`;
            message += `   *Qty:* ${item.quantity}%0A`;
            message += `   *Price:* ₹${price}%0A%0A`;
        });

        message += `*Total:* ₹${cartTotal}%0A%0APlease confirm availability.`;

        window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    };

    const value = {
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        cartTotal,
        orderViaWhatsApp
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
