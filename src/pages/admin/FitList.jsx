import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../../config';
import { Trash2, Edit, ArrowLeft } from 'lucide-react';
import './Admin.css';

const FitList = () => {
    const [fits, setFits] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form inputs
    const [name, setName] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubcategory, setSelectedSubcategory] = useState('');

    // Edit inputs
    const [editId, setEditId] = useState(null);
    const [editName, setEditName] = useState('');

    // Derived state for subcategories dropdown
    const filteredSubcategories = subcategories.filter(sub => sub.category?._id === selectedCategory || sub.category === selectedCategory);

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
            const [fitRes, catRes, subRes] = await Promise.all([
                fetch(`${API_URL}/fits`),
                fetch(`${API_URL}/categories`),
                fetch(`${API_URL}/subcategories`)
            ]);

            const fitData = await fitRes.json();
            const catData = await catRes.json();
            const subData = await subRes.json();

            setFits(fitData);
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
            const res = await fetch(`${API_URL}/fits`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
                body: JSON.stringify({ name, subcategory: selectedSubcategory }),
            });

            if (res.ok) {
                setName('');
                // Keep the category/subcategory selection for faster entry
                fetchData();
            } else {
                alert('Failed to create fit');
            }
        } catch (err) {
            alert('Error creating fit');
        }
    };

    const deleteHandler = async (e, id) => {
        e.preventDefault();
        e.stopPropagation();

        if (window.confirm('Are you sure you want to delete this fit?')) {
            try {
                const res = await fetch(`${API_URL}/fits/${id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                });

                if (res.ok) {
                    fetchData();
                } else {
                    const data = await res.json();
                    alert(data.message || 'Failed to delete fit');
                }
            } catch (err) {
                alert('Error deleting fit');
            }
        }
    };

    // Inline edit for name only for simplicity
    const editHandler = (fit) => {
        setEditId(fit._id);
        setEditName(fit.name);
    };

    const updateHandler = async (id) => {
        try {
            // We only update name here. If they want to change parent, they should delete and recreate 
            // or we need a more complex edit modal. For minimal changes: Name update only.
            const res = await fetch(`${API_URL}/fits/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
                body: JSON.stringify({ name: editName }), // Only updating name, keeping same subcategory
            });

            if (res.ok) {
                setEditId(null);
                fetchData();
            } else {
                alert('Failed to update fit');
            }
        } catch (err) {
            alert('Error updating fit');
        }
    };

    return (
        <div className="admin-container">
            <div className="admin-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link to="/admin/dashboard" className="action-btn">
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 className="admin-title">Fits</h1>
                </div>
            </div>

            <div className="admin-page-grid">
                {/* Add Form */}
                <div className="admin-form" style={{ height: 'fit-content', margin: 0 }}>
                    <h3>Add Fit</h3>
                    <form onSubmit={submitHandler}>
                        <div className="form-group">
                            <label>1. Select Category</label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => {
                                    setSelectedCategory(e.target.value);
                                    setSelectedSubcategory(''); // Reset subcategory when category changes
                                }}
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>2. Select Subcategory</label>
                            <select
                                value={selectedSubcategory}
                                onChange={(e) => setSelectedSubcategory(e.target.value)}
                                required
                                disabled={!selectedCategory}
                            >
                                <option value="">Select Subcategory</option>
                                {filteredSubcategories.map(sub => (
                                    <option key={sub._id} value={sub._id}>{sub.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>3. Fit Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder="e.g. Oversized"
                                disabled={!selectedSubcategory}
                            />
                        </div>
                        <button type="submit" className="admin-btn" disabled={!selectedSubcategory}>Create</button>
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
                                    <th>FIT NAME</th>
                                    <th>SUBCATEGORY</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fits.map((fit) => (
                                    <tr key={fit._id}>
                                        <td>
                                            {editId === fit._id ? (
                                                <input
                                                    type="text"
                                                    value={editName}
                                                    onChange={(e) => setEditName(e.target.value)}
                                                    className="admin-input"
                                                    style={{ marginBottom: 0 }}
                                                />
                                            ) : (
                                                fit.name
                                            )}
                                        </td>
                                        <td>
                                            {fit.subcategory?.name || 'N/A'}
                                            {/* Optional: Show Category in tooltip or smaller text */}
                                            {/* <small style={{display: 'block', color: '#888'}}>{fit.subcategory?.category?.name}</small> */}
                                            {/* Note: the subcategory populate might not deep populate category unless requested. */}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                {editId === fit._id ? (
                                                    <button
                                                        className="action-btn edit"
                                                        onClick={() => updateHandler(fit._id)}
                                                    >
                                                        Save
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="action-btn edit"
                                                        onClick={() => editHandler(fit)}
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                )}
                                                <button
                                                    className="action-btn delete"
                                                    onClick={(e) => deleteHandler(e, fit._id)}
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

export default FitList;
