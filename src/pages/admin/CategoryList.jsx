import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Trash2, Edit, ArrowLeft } from 'lucide-react';
import './Admin.css';

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [editId, setEditId] = useState(null);
    const [editName, setEditName] = useState('');
    const navigate = useNavigate();

    const userInfo = React.useMemo(() => JSON.parse(localStorage.getItem('adminInfo')), []);

    useEffect(() => {
        if (!userInfo) {
            navigate('/admin/login');
            return;
        }
        fetchCategories();
    }, [navigate, userInfo]);

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/categories');
            const data = await res.json();
            setCategories(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
                body: JSON.stringify({ name }),
            });

            if (res.ok) {
                setName('');
                fetchCategories();
            } else {
                alert('Failed to create category');
            }
        } catch (err) {
            alert('Error creating category');
        }
    };

    const deleteHandler = async (e, id) => {
        e.preventDefault();
        e.stopPropagation();

        if (!id) {
            alert('Cannot delete: Invalid ID');
            return;
        }

        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                const res = await fetch(`/api/categories/${id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                });

                if (res.ok) {
                    fetchCategories();
                } else {
                    const data = await res.json();
                    alert(data.message || 'Failed to delete category');
                }
            } catch (err) {
                console.error('Delete error:', err);
                alert('Error deleting category');
            }
        }
    };

    const editHandler = (cat) => {
        setEditId(cat._id);
        setEditName(cat.name);
    };

    const updateHandler = async (id) => {
        try {
            const res = await fetch(`/api/categories/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
                body: JSON.stringify({ name: editName }),
            });

            if (res.ok) {
                setEditId(null);
                fetchCategories();
            } else {
                alert('Failed to update category');
            }
        } catch (err) {
            alert('Error updating category');
        }
    };

    return (
        <div className="admin-container">
            <div className="admin-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link to="/admin/dashboard" className="action-btn">
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 className="admin-title">Categories</h1>
                </div>
            </div>

            <div className="admin-page-grid">
                {/* Add Form */}
                <div className="admin-form" style={{ height: 'fit-content', margin: 0 }}>
                    <h3>Add Category</h3>
                    <form onSubmit={submitHandler}>
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
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
                                    <th>NAME</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((cat) => (
                                    <tr key={cat._id}>
                                        <td>
                                            {editId === cat._id ? (
                                                <input
                                                    type="text"
                                                    value={editName}
                                                    onChange={(e) => setEditName(e.target.value)}
                                                    className="admin-input"
                                                    style={{ marginBottom: 0 }}
                                                />
                                            ) : (
                                                cat.name
                                            )}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                {editId === cat._id ? (
                                                    <button
                                                        className="action-btn edit"
                                                        onClick={() => updateHandler(cat._id)}
                                                    >
                                                        Save
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="action-btn edit"
                                                        onClick={() => editHandler(cat)}
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                )}
                                                <button
                                                    className="action-btn delete"
                                                    onClick={(e) => deleteHandler(e, cat._id)}
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

export default CategoryList;
