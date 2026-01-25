import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ui/ProductCard';
import { Filter, X } from 'lucide-react';
import './Shop.css';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [fits, setFits] = useState([]);

    // Filter State
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubcategory, setSelectedSubcategory] = useState('');
    const [selectedFit, setSelectedFit] = useState('');
    const [selectedSize, setSelectedSize] = useState('');

    // UI State
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch all necessary data in parallel
                const [catsRes, subRes, fitRes, prodsRes] = await Promise.all([
                    fetch('/api/categories'),
                    fetch('/api/subcategories'),
                    fetch('/api/fits'),
                    fetch('/api/products')
                ]);

                if (!catsRes.ok || !prodsRes.ok) throw new Error('Failed to fetch data');

                const catsData = await catsRes.json();
                const subData = await subRes.json();
                const fitData = await fitRes.json();
                const prodsData = await prodsRes.json();

                setCategories(catsData);
                setSubcategories(subData);
                setFits(fitData);
                setProducts(prodsData);
            } catch (err) {
                console.error('Error fetching shop data:', err);
                setError('Failed to load products. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Dependent Filter Options logic
    const filteredSubcategories = selectedCategory
        ? subcategories.filter(s => (s.category?._id || s.category) === selectedCategory)
        : []; // Only show subcats if cat selected, or show all? usually showing valid ones is better.
    // Logic decision: If no category selected, show no subcategories to enforce hierarchy? 
    // Or show all? Let's show all if no category selected for flexibility, OR strict hierarchy.
    // Strict hierarchy (Cat -> Sub -> Fit) is cleaner.

    const displaySubcategories = selectedCategory
        ? filteredSubcategories
        : subcategories;

    const filteredFits = selectedSubcategory
        ? fits.filter(f => (f.subcategory?._id || f.subcategory) === selectedSubcategory)
        : [];

    const displayFits = selectedSubcategory
        ? filteredFits
        : fits;

    // Filter Logic
    const filteredProducts = products.filter(product => {
        // Category Filter
        if (selectedCategory) {
            const productCatId = typeof product.category === 'object' ? product.category?._id : product.category;
            if (productCatId !== selectedCategory) return false;
        }

        // Subcategory Filter
        if (selectedSubcategory) {
            const productSubId = typeof product.subcategory === 'object' ? product.subcategory?._id : product.subcategory;
            if (productSubId !== selectedSubcategory) return false;
        }

        // Fit Filter
        if (selectedFit) {
            const productFitId = typeof product.fit === 'object' ? product.fit?._id : product.fit;
            if (productFitId !== selectedFit) return false;
        }

        // Size Filter (Optional simple implementation)
        if (selectedSize) {
            // Assuming product.sizes is array of strings e.g. ["S", "M"]
            if (!product.sizes || !product.sizes.includes(selectedSize)) return false;
        }

        return true;
    });

    // Reset child filters when parent changes
    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
        setSelectedSubcategory('');
        setSelectedFit('');
    };

    const handleSubcategoryChange = (e) => {
        setSelectedSubcategory(e.target.value);
        setSelectedFit('');
    };

    const clearFilters = () => {
        setSelectedCategory('');
        setSelectedSubcategory('');
        setSelectedFit('');
        setSelectedSize('');
    };

    if (loading) return <div className="shop-page-wrapper loading"><div className="loading-spinner"></div></div>;
    if (error) return <div className="shop-page-wrapper error"><p>{error}</p></div>;

    return (
        <div className="shop-page-wrapper">
            <div className="container">
                <div className="shop-header">
                    <button
                        className="mobile-filter-toggle"
                        onClick={() => setShowMobileFilters(!showMobileFilters)}
                    >
                        <Filter size={20} /> FILTERS
                    </button>
                </div>

                <div className="shop-layout">
                    {/* Mobile Filter Overlay */}
                    <div
                        className={`mobile-filter-overlay ${showMobileFilters ? 'active' : ''}`}
                        onClick={() => setShowMobileFilters(false)}
                    />

                    {/* Filters Sidebar */}
                    <aside className={`shop-filters ${showMobileFilters ? 'active' : ''}`}>
                        <div className="filter-header-mobile">
                            <h3>FILTERS</h3>
                            <button onClick={() => setShowMobileFilters(false)}><X size={24} /></button>
                        </div>

                        <div className="filter-group">
                            <label>Category</label>
                            <div className="custom-select-wrapper">
                                <select value={selectedCategory} onChange={handleCategoryChange}>
                                    <option value="">All Categories</option>
                                    {categories.map(cat => (
                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="filter-group">
                            <label>Subcategory</label>
                            <div className="custom-select-wrapper">
                                <select
                                    value={selectedSubcategory}
                                    onChange={handleSubcategoryChange}
                                    disabled={!selectedCategory && displaySubcategories.length > 20}
                                >
                                    <option value="">All Subcategories</option>
                                    {displaySubcategories.map(sub => (
                                        <option key={sub._id} value={sub._id}>{sub.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="filter-group">
                            <label>Fit</label>
                            <div className="custom-select-wrapper">
                                <select
                                    value={selectedFit}
                                    onChange={(e) => setSelectedFit(e.target.value)}
                                    disabled={!selectedSubcategory && displayFits.length > 50}
                                >
                                    <option value="">All Fits</option>
                                    {displayFits.map(fit => (
                                        <option key={fit._id} value={fit._id}>{fit.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="filter-group">
                            <label>Size</label>
                            <div className="custom-select-wrapper">
                                <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
                                    <option value="">All Sizes</option>
                                    {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                                        <option key={size} value={size}>{size}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <button className="clear-filters-btn" onClick={clearFilters}>
                            CLEAR FILTERS
                        </button>
                    </aside>

                    {/* Product Grid */}
                    <div className="product-grid-container">
                        {filteredProducts.length === 0 ? (
                            <div className="no-products">
                                <p>No products found matching your filters.</p>
                                <button className="clear-filters-btn inline" onClick={clearFilters}>Clear Filters</button>
                            </div>
                        ) : (
                            <div className="product-grid">
                                {filteredProducts.map(product => (
                                    <ProductCard key={product._id || product.id} product={product} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shop;
