import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../../config';
import { Plus, Trash2, Edit, ArrowLeft } from 'lucide-react';
import './Admin.css';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const userInfo = React.useMemo(() => JSON.parse(localStorage.getItem('adminInfo')), []);

    useEffect(() => {
        if (!userInfo) {
            navigate('/admin/login');
            return;
        }
        fetchProducts();
    }, [navigate, userInfo]);

    const fetchProducts = async () => {
        try {
            const res = await fetch(`${API_URL}/products`);
            const data = await res.json();
            setProducts(data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch products');
            setLoading(false);
        }
    };

    const deleteHandler = async (e, id) => {
        e.preventDefault();
        e.stopPropagation();

        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const res = await fetch(`${API_URL}/products/${id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                });

                if (res.ok) {
                    fetchProducts();
                } else {
                    alert('Failed to delete product');
                }
            } catch (err) {
                alert('Error deleting product');
            }
        }
    };

    return (
        <div className="admin-container">
            <div className="admin-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link to="/admin/dashboard" className="action-btn">
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 className="admin-title">Products</h1>
                </div>
                <Link to="/admin/product/add" className="admin-btn" style={{ width: 'auto' }}>
                    <Plus size={20} style={{ marginRight: '0.5rem' }} /> Add Product
                </Link>
            </div>

            {loading ? (
                <div className="loading-spinner"></div>
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : (
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>NAME</th>
                                <th>REGULAR PRICE</th>
                                <th>OFFER PRICE</th>
                                <th>CATEGORY</th>
                                <th>FIT</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product._id}>
                                    <td>{product.productId || product._id.substring(0, 10)}...</td>
                                    <td>{product.name}</td>
                                    <td>₹{product.regularPrice}</td>
                                    <td>{product.discountPrice ? `₹${product.discountPrice}` : '-'}</td>
                                    <td>{typeof product.category === 'object' ? product.category?.name : product.category}</td>
                                    <td>{typeof product.fit === 'object' ? product.fit?.name : (product.fit || 'Standard')}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <Link to={`/admin/product/edit/${product._id}`} className="action-btn edit">
                                                <Edit size={18} />
                                            </Link>
                                            <button
                                                className="action-btn delete"
                                                onClick={(e) => deleteHandler(e, product._id)}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ProductList;
