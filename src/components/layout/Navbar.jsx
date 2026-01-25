import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../../assets/logo.png';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      <motion.nav
        className={`navbar ${isScrolled ? 'scrolled' : ''}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="container navbar-container">
          <div className="navbar-left">
            <Link to="/" className="navbar-logo-link">
              <img src={logo} alt="2ndStreet" className="navbar-logo-img" />
            </Link>
          </div>

          <div className="navbar-center desktop-only">
            <Link to="/shop" className="nav-link">Shop</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
          </div>

          <div className="navbar-right">
            {/* <button className="icon-btn" aria-label="Search">
              <Search size={20} strokeWidth={1.5} />
            </button> */}

            <Link to="/cart" className="icon-btn" aria-label="Cart">
              <ShoppingBag size={20} strokeWidth={1.5} />
              {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
            </Link>

            {user ? (
              <div className="user-menu desktop-only">
                <button onClick={handleLogout} className="nav-link" style={{ fontSize: '0.8rem', border: 'none', background: 'none', cursor: 'pointer' }}>
                  LOGOUT
                </button>
                {/* Could add a profile icon or name here */}
              </div>
            ) : (
              <Link to="/login" className="icon-btn" aria-label="Login">
                <User size={20} strokeWidth={1.5} />
              </Link>
            )}

            <button className="icon-btn mobile-only" onClick={toggleMenu} aria-label="Menu">
              <Menu size={20} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="mobile-menu-header">
              <button className="icon-btn" onClick={toggleMenu}>
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>
            <div className="mobile-menu-links">
              {['Home', 'Shop', 'About', 'Contact'].map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * index + 0.2 }}
                >
                  <Link
                    to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                    className="mobile-nav-link"
                    onClick={toggleMenu}
                  >
                    {item}
                  </Link>
                </motion.div>
              ))}

              {!user ? (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <Link to="/login" className="mobile-nav-link" onClick={toggleMenu}>LOGIN / SIGNUP</Link>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <button onClick={() => { handleLogout(); toggleMenu(); }} className="mobile-nav-link" style={{ textAlign: 'left' }}>
                    LOGOUT
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
