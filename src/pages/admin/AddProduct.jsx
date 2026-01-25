import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../../config';
import { ArrowLeft, Upload, X } from 'lucide-react';
import './Admin.css';

const AddProduct = () => {
    const navigate = useNavigate();

    // Form State
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [regularPrice, setRegularPrice] = useState('');
    const [discountPrice, setDiscountPrice] = useState('');
    const [category, setCategory] = useState('');
    const [subcategory, setSubcategory] = useState('');
    const [fit, setFit] = useState('');
    const [sizesInput, setSizesInput] = useState('S, M, L, XL'); // Default sizes
    const [selectedImages, setSelectedImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);

    // Data State
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [fits, setFits] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const userInfo = React.useMemo(() => JSON.parse(localStorage.getItem('adminInfo')), []);

    useEffect(() => {
        if (!userInfo) {
            navigate('/admin/login');
            return;
        }

        const fetchData = async () => {
            try {
                const [catRes, subRes, fitRes] = await Promise.all([
                    fetch(`${API_URL}/categories`),
                    fetch(`${API_URL}/subcategories`),
                    fetch(`${API_URL}/fits`)
                ]);

                const catData = await catRes.json();
                const subData = await subRes.json();
                const fitData = await fitRes.json();

                setCategories(catData);
                setSubcategories(subData);
                setFits(fitData);

            } catch (err) {
                console.error(err);
                setError('Failed to load categories, subcategories or fits');
            }
        };

        fetchData();
    }, [navigate, userInfo]);

    // Filter subcategories based on selected category
    const filteredSubcategories = subcategories.filter(sub =>
        (sub.category?._id || sub.category) === category
    );

    // Filter fits based on selected subcategory
    const filteredFits = fits.filter(f =>
        (f.subcategory?._id || f.subcategory) === subcategory
    );

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        if (selectedImages.length + files.length > 3) {
            setError('You can only upload a maximum of 3 images');
            return;
        }

        setSelectedImages([...selectedImages, ...files]);

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviewImages([...previewImages, ...newPreviews]);
        setError(null);
    };

    const removeImage = (index) => {
        const newSelected = [...selectedImages];
        newSelected.splice(index, 1);
        setSelectedImages(newSelected);

        const newPreviews = [...previewImages];
        URL.revokeObjectURL(newPreviews[index]);
        newPreviews.splice(index, 1);
        setPreviewImages(newPreviews);
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (selectedImages.length === 0) {
            setError('Please select at least one image');
            setLoading(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            formData.append('regularPrice', regularPrice);
            if (discountPrice) formData.append('discountPrice', discountPrice);
            formData.append('category', category);
            formData.append('subcategory', subcategory);
            if (fit) formData.append('fit', fit);

            // Handle sizes
            const sizesArray = sizesInput.split(',').map(s => s.trim()).filter(Boolean);
            formData.append('sizes', JSON.stringify(sizesArray));

            // Append images
            selectedImages.forEach(image => {
                formData.append('images', image);
            });

            const res = await fetch(`${API_URL}/products`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
                body: formData, // fetch automatically sets Content-Type to multipart/form-data
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Failed to create product');
            }

            alert('Product Created Successfully');
            navigate('/admin/products');

        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-container">
            <div className="admin-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link to="/admin/products" className="action-btn">
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 className="admin-title">Add Product</h1>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="admin-table-container" style={{ background: 'transparent', boxShadow: 'none' }}>
                <form onSubmit={submitHandler} className="admin-form">
                    <div className="form-group">
                        <label>Product Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="e.g. Oversized Blazer"
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            placeholder="Product description..."
                            rows={4}
                        />
                    </div>

                    <div className="admin-grid-2">
                        <div className="form-group">
                            <label>Regular Price (₹)</label>
                            <input
                                type="number"
                                value={regularPrice}
                                onChange={(e) => setRegularPrice(e.target.value)}
                                required
                                placeholder="0.00"
                            />
                        </div>
                        <div className="form-group">
                            <label>Discount Price (₹) (Optional)</label>
                            <input
                                type="number"
                                value={discountPrice}
                                onChange={(e) => setDiscountPrice(e.target.value)}
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <div className="admin-grid-3">
                        <div className="form-group">
                            <label>Category</label>
                            <select
                                value={category}
                                onChange={(e) => {
                                    setCategory(e.target.value);
                                    setSubcategory('');
                                    setFit('');
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
                            <label>Subcategory</label>
                            <select
                                value={subcategory}
                                onChange={(e) => {
                                    setSubcategory(e.target.value);
                                    setFit('');
                                }}
                                required
                                disabled={!category}
                            >
                                <option value="">Select Subcategory</option>
                                {filteredSubcategories.map(sub => (
                                    <option key={sub._id} value={sub._id}>{sub.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Fit (Optional)</label>
                            <select
                                value={fit}
                                onChange={(e) => setFit(e.target.value)}
                                disabled={!subcategory}
                            >
                                <option value="">Select Fit</option>
                                {filteredFits.map(f => (
                                    <option key={f._id} value={f._id}>{f.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Sizes (Comma separated)</label>
                        <input
                            type="text"
                            value={sizesInput}
                            onChange={(e) => setSizesInput(e.target.value)}
                            placeholder="S, M, L, XL"
                        />
                    </div>

                    <div className="form-group">
                        <label>Images (Max 3)</label>
                        <div className="file-input-container">
                            <input
                                type="file"
                                id="image-upload"
                                multiple
                                onChange={handleImageChange}
                                accept="image/*"
                                style={{ display: 'none' }}
                            />
                            <label htmlFor="image-upload" className="admin-btn" style={{
                                width: 'auto',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                background: '#eee',
                                color: '#333'
                            }}>
                                <Upload size={18} /> Upload Images
                            </label>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            {previewImages.map((src, index) => (
                                <div key={index} style={{ position: 'relative', width: '100px', height: '133px' }}>
                                    <img
                                        src={src}
                                        alt="Preview"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        style={{
                                            position: 'absolute',
                                            top: '-8px',
                                            right: '-8px',
                                            background: 'red',
                                            color: 'white',
                                            borderRadius: '50%',
                                            border: 'none',
                                            width: '24px',
                                            height: '24px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button type="submit" className="admin-btn" disabled={loading}>
                        {loading ? 'Creating...' : 'Create Product'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;
