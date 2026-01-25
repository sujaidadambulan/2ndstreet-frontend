import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import About from './pages/About';
import Contact from './pages/Contact';

// Admin Imports
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductList from './pages/admin/ProductList';
import AddProduct from './pages/admin/AddProduct';
import EditProduct from './pages/admin/EditProduct';
import CategoryList from './pages/admin/CategoryList';
import SubcategoryList from './pages/admin/SubcategoryList';
import FitList from './pages/admin/FitList';
import UserList from './pages/admin/UserList';
import NotFound from './pages/NotFound';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Cart from './pages/Cart';
import PrivateRoute from './components/admin/PrivateRoute';

import Preloader from './components/ui/Preloader';
import './App.css';

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <Router>
                    <Preloader />
                    <Layout>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/shop" element={<Shop />} />
                            <Route path="/product/:id" element={<ProductDetails />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />
                            <Route path="/cart" element={<Cart />} />

                            {/* Admin Routes */}
                            <Route path="/admin/login" element={<AdminLogin />} />

                            <Route path="" element={<PrivateRoute />}>
                                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                                <Route path="/admin/products" element={<ProductList />} />
                                <Route path="/admin/product/add" element={<AddProduct />} />
                                <Route path="/admin/product/edit/:id" element={<EditProduct />} />
                                <Route path="/admin/categories" element={<CategoryList />} />
                                <Route path="/admin/subcategories" element={<SubcategoryList />} />
                                <Route path="/admin/fits" element={<FitList />} />
                                <Route path="/admin/users" element={<UserList />} />
                            </Route>

                            {/* Catch All */}
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </Layout>
                </Router>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;
