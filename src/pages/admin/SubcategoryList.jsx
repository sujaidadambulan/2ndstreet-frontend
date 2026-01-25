import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../../config';
import { Trash2, Edit, ArrowLeft } from 'lucide-react';
import './Admin.css';

const SubcategoryList = () => {
    const [subcategories, setSubcategories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [categoryId, setCategoryId] = useState('');

    // Edit State
    const [editId, setEditId] = useState(null);
    const [editName, setEditName] = useState('');
    const [editCategory, setEditCategory] = useState('');

    const navigate = useNavigate();

    const userInfo = React.useMemo(() => JSON.parse(localStorage.getItem('adminInfo')), []);

    useEffect(() => {
        if (!userInfo) {
            navigate('/admin/login');
            return;
        }
        fetchData();
    }, [navigate, userInfo]);

    const fetchData = async () => {
        try {
            const [catRes, subRes] = await Promise.all([
                fetch(`${API_URL}/categories`),
                fetch(`${API_URL}/subcategories`)
            ]);

            const catData = await catRes.json();
            const subData = await subRes.json();

            setCategories(catData);
            setSubcategories(subData);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/subcategories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
                body: JSON.stringify({ name, category: categoryId }),
            });

            if (res.ok) {
                setName('');
                setCategoryId('');
                fetchData();
            } else {
                alert('Failed to create subcategory');
            }
        } catch (err) {
            alert('Error creating subcategory');
        }
    };

    const deleteHandler = async (e, id) => {
        e.preventDefault();
        e.stopPropagation();

        if (window.confirm('Are you sure you want to delete this subcategory?')) {
            try {
                const res = await fetch(`${API_URL}/subcategories/${id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                });

                if (res.ok) {
                    fetchData();
                } else {
                    const data = await res.json();
                    alert(data.message || 'Failed to delete subcategory');
                }
            } catch (err) {
                alert('Error deleting subcategory');
            }
        }
    };

    const editHandler = (sub) => {
        setEditId(sub._id);
        setEditName(sub.name);
        setEditCategory(sub.category?._id || sub.category);
    };

    const updateHandler = async (id) => {
        try {
            const res = await fetch(`${API_URL}/subcategories/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
                body: JSON.stringify({ name: editName, category: editCategory }),
            });

            if (res.ok) {
                setEditId(null);
                fetchData();
            } else {
                alert('Failed to update subcategory');
            }
        } catch (err) {
            alert('Error updating subcategory');
        }
    };

    return (
        <div className="admin-container">
            <div className="admin-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link to="/admin/dashboard" className="action-btn">
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 className="admin-title">Subcategories</h1>
                </div>
            </div>

            <div className="admin-page-grid">
                {/* Add Form */}
                <div className="admin-form" style={{ height: 'fit-content', margin: 0 }}>
                    <h3>Add Subcategory</h3>
                    <form onSubmit={submitHandler}>
                        <div className="form-group">
                            <label>Parent Category</label>
                            <select
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Subcategory Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder="e.g. Hoodies"
                            />
                        </div>
                        <button type="submit" className="admin-btn">Create</button>
                    </form>
                </div>

                {/* List */}
                <div className="admin-table-container">
                    {loading ? (
                        <div className="loading-spinner"></div>
                    ) : (
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>SUBCATEGORY</th>
                                    <th>PARENT CATEGORY</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subcategories.map((sub) => (
                                    <tr key={sub._id}>
                                        <td>
                                            {editId === sub._id ? (
                                                <input
                                                    type="text"
                                                    value={editName}
                                                    onChange={(e) => setEditName(e.target.value)}
                                                    className="admin-input"
                                                    style={{ marginBottom: 0 }}
                                                />
                                            ) : (
                                                sub.name
                                            )}
                                        </td>
                                        <td>
                                            {editId === sub._id ? (
                                                <select
                                                    value={editCategory}
                                                    onChange={(e) => setEditCategory(e.target.value)}
                                                    className="admin-input"
                                                    style={{ marginBottom: 0 }}
                                                >
                                                    {categories.map(cat => (
                                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                sub.category?.name || 'N/A'
                                            )}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                {editId === sub._id ? (
                                                    <button
                                                        className="action-btn edit"
                                                        onClick={() => updateHandler(sub._id)}
                                                    >
                                                        Save
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="action-btn edit"
                                                        onClick={() => editHandler(sub)}
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                )}
                                                <button
                                                    className="action-btn delete"
                                                    onClick={(e) => deleteHandler(e, sub._id)}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SubcategoryList;
