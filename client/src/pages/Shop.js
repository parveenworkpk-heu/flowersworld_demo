import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, X, ChevronDown, Grid, List } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { formatINR } from '../utils/helpers';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const categories = ['All', 'Roses', 'Lilies', 'Tulips', 'Orchids', 'Sunflowers', 'Mixed', 'Bouquets', 'Gift Sets'];
const sortOptions = [
  { value: 'createdAt-desc', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'ratings-desc', label: 'Popularity' }
];

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('createdAt-desc');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchProducts();
  }, [category, sort, priceRange, currentPage]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category !== 'All') params.append('category', category);
      if (priceRange.min) params.append('minPrice', priceRange.min);
      if (priceRange.max) params.append('maxPrice', priceRange.max);
      params.append('sort', sort.split('-')[0]);
      params.append('order', sort.split('-')[1]);
      params.append('page', currentPage);
      params.append('limit', 12);

      const res = await axios.get(`${API_URL}/products?${params.toString()}`);
      setProducts(res.data.products);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePriceApply = () => {
    setCurrentPage(1);
    fetchProducts();
  };

  return (
    <>
      <Helmet>
        <title>Shop - Flowers World</title>
        <meta name="description" content="Browse our collection of fresh flowers, bouquets, and gift sets." />
      </Helmet>

      <section className="bg-gradient-to-b from-cream to-light py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-4xl font-bold mb-4"
          >
            Our <span className="text-primary">Collection</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600"
          >
            Fresh flowers for every occasion
          </motion.p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-64 flex-shrink-0">
              <div className="lg:sticky lg:top-24 space-y-6">
                <div className="bg-white rounded-xl p-5 shadow-sm">
                  <h3 className="font-heading font-semibold mb-4">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => { setCategory(cat); setCurrentPage(1); }}
                        className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          category === cat
                            ? 'bg-primary text-white'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 shadow-sm">
                  <h3 className="font-heading font-semibold mb-4">Price Range</h3>
                  <div className="space-y-3">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                      className="input-field text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                      className="input-field text-sm"
                    />
                    <button
                      onClick={handlePriceApply}
                      className="btn-primary w-full text-sm"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </aside>

            <div className="flex-1">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                <p className="text-gray-600">
                  {products.length} products
                </p>
                <div className="flex items-center gap-4">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="input-field py-2 pr-10 w-auto"
                  >
                    {sortOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => setMobileFiltersOpen(true)}
                    className="lg:hidden btn-secondary flex items-center gap-2"
                  >
                    <Filter size={18} /> Filters
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl overflow-hidden animate-pulse">
                      <div className="aspect-[4/5] bg-gray-200" />
                      <div className="p-4 space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-1/4" />
                        <div className="h-5 bg-gray-200 rounded w-3/4" />
                        <div className="h-6 bg-gray-200 rounded w-1/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-gray-500 text-lg mb-4">No products found</p>
                  <Link to="/shop" className="text-primary hover:underline">
                    Clear filters
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product, idx) => (
                    <ProductCard key={product._id} product={product} index={idx} />
                  ))}
                </div>
              )}

              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-12">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="btn-secondary px-4 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="btn-secondary px-4 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileFiltersOpen(false)} />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            className="absolute left-0 top-0 h-full w-80 bg-white overflow-y-auto"
          >
            <div className="p-4 flex justify-between items-center border-b">
              <h2 className="font-heading font-semibold">Filters</h2>
              <button onClick={() => setMobileFiltersOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="p-4 space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Categories</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => { setCategory(cat); setCurrentPage(1); }}
                      className={`block w-full text-left px-3 py-2 rounded-lg ${
                        category === cat ? 'bg-primary text-white' : 'hover:bg-gray-50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Price Range</h3>
                <div className="space-y-3">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    className="input-field text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    className="input-field text-sm"
                  />
                  <button onClick={handlePriceApply} className="btn-primary w-full">
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Shop;
