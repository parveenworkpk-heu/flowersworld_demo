import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, X, Edit, Trash2, Search } from 'lucide-react';
import axios from 'axios';
import { formatINR } from '../utils/helpers';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    category: '',
    stock: '',
    images: ['']
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/products?limit=100`);
      setProducts(res.data.products);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ''] });
  };

  const openModal = (product = null) => {
    if (product) {
      setEditProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        discountPrice: product.discountPrice || '',
        category: product.category,
        stock: product.stock,
        images: product.images.length > 0 ? product.images : ['']
      });
    } else {
      setEditProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        discountPrice: '',
        category: '',
        stock: '',
        images: ['']
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        ...formData,
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : 0,
        stock: Number(formData.stock),
        images: formData.images.filter(img => img.trim())
      };

      if (editProduct) {
        await axios.put(`${API_URL}/products/${editProduct._id}`, productData);
      } else {
        await axios.post(`${API_URL}/products`, productData);
      }
      
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      console.error('Error saving product:', err);
    }
  };

  const deleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`${API_URL}/products/${productId}`);
      fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-64 bg-dark text-white flex-shrink-0">
        <div className="p-6">
          <h2 className="text-xl font-heading font-bold">Admin Panel</h2>
          <p className="text-sm text-gray-400">Flowers World</p>
        </div>
        <nav className="px-4 space-y-2">
          <Link to="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors">
            Dashboard
          </Link>
          <Link to="/admin/orders" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors">
            Orders
          </Link>
          <Link to="/admin/products" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/10 transition-colors">
            Products
          </Link>
          <Link to="/admin/users" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors">
            Users
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-heading text-2xl font-bold">Products Management</h1>
          <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
            <Plus size={18} /> Add Product
          </button>
        </div>

        <div className="mb-4">
          <div className="relative max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Product</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Category</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Price</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Stock</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i}>
                      <td colSpan={5} className="px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse"></div></td>
                    </tr>
                  ))
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No products found</td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <motion.tr
                      key={product._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.images?.[0] || 'https://placehold.co/50x50'}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div>
                            <p className="font-medium text-sm">{product.name}</p>
                            <p className="text-xs text-gray-500 line-clamp-1">{product.description?.slice(0, 50)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">{product.category}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="font-medium text-primary">{formatINR(product.discountPrice || product.price)}</span>
                        {product.discountPrice < product.price && (
                          <span className="text-xs text-gray-400 line-through ml-2">{formatINR(product.price)}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={product.stock < 10 ? 'text-red-500 font-medium' : ''}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openModal(product)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => deleteProduct(product._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-heading text-xl font-semibold">
                  {editProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    className="input-field resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Price (₹) *</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Discount Price (₹)</label>
                    <input
                      type="number"
                      name="discountPrice"
                      value={formData.discountPrice}
                      onChange={handleInputChange}
                      min="0"
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                    >
                      <option value="">Select Category</option>
                      <option value="Roses">Roses</option>
                      <option value="Lilies">Lilies</option>
                      <option value="Tulips">Tulips</option>
                      <option value="Orchids">Orchids</option>
                      <option value="Sunflowers">Sunflowers</option>
                      <option value="Mixed">Mixed</option>
                      <option value="Bouquets">Bouquets</option>
                      <option value="Gift Sets">Gift Sets</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Stock *</label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Images (URLs)</label>
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="flex gap-2 mb-2">
                      <input
                        type="url"
                        value={img}
                        onChange={(e) => handleImageChange(idx, e.target.value)}
                        placeholder="https://..."
                        className="input-field flex-1"
                      />
                      {formData.images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newImages = formData.images.filter((_, i) => i !== idx);
                            setFormData({ ...formData, images: newImages });
                          }}
                          className="p-2 text-red-500 hover:bg-red-50 rounded"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addImageField}
                    className="text-sm text-primary hover:underline"
                  >
                    + Add another image
                  </button>
                </div>

                <button type="submit" className="btn-primary w-full">
                  {editProduct ? 'Update Product' : 'Add Product'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminProducts;
