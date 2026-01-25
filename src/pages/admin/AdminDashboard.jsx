import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Folder, LogOut } from 'lucide-react';
import './Admin.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));

    const logoutHandler = () => {
        localStorage.removeItem('adminInfo');
        navigate('/admin/login');
    };

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h1 className="admin-title">Dashboard</h1>
                <div className="admin-user">
                    <span>Welcome, {adminInfo?.username}</span>
                    <button onClick={logoutHandler} className="action-btn" style={{ marginLeft: '1rem' }}>
                        <LogOut size={20} />
                    </button>
                </div>
            </div>

            <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                <Link to="/admin/products" className="dashboard-card" style={{
                    padding: '2rem',
                    background: 'white',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem'
                }}>
                    <Package size={48} />
                    <h3>Manage Products</h3>
                    <p>Add, edit, or delete products</p>
                </Link>

                <Link to="/admin/categories" className="dashboard-card" style={{
                    padding: '2rem',
                    background: 'white',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem'
                }}>
                    <Folder size={48} />
                    <h3>Manage Categories</h3>
                    <p>Create and organize categories</p>
                </Link>

                <Link to="/admin/subcategories" className="dashboard-card" style={{
                    padding: '2rem',
                    background: 'white',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem'
                }}>
                    <Folder size={48} />
                    <h3>Manage Subcategories</h3>
                    <p>Create and organize subcategories</p>
                </Link>

                <Link to="/admin/fits" className="dashboard-card" style={{
                    padding: '2rem',
                    background: 'white',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem'
                }}>
                    <Package size={48} />
                    <h3>Manage Fits</h3>
                    <p>Create fits for categories</p>
                </Link>

                <Link to="/admin/users" className="dashboard-card" style={{
                    padding: '2rem',
                    background: 'white',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem'
                }}>
                    <Package size={48} />
                    <h3>Manage Users</h3>
                    <p>View and block users</p>
                </Link>
            </div>
        </div>
    );
};

export default AdminDashboard;
