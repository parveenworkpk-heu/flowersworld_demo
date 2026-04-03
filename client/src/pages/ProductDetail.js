import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Minus, Plus, Star, Truck, Shield, RefreshCw, ChevronRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { formatINR } from '../utils/helpers';
import ProductCard from '../components/ProductCard';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [wishlist, setWishlist] = useState(false);
  
  const { addToCart, loading: cartLoading } = useCart();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`${API_URL}/products/${id}`);
      setProduct(res.data);
      
      const relatedRes = await axios.get(`${API_URL}/products?category=${res.data.category}&limit=4`);
      setRelatedProducts(relatedRes.data.products.filter(p => p._id !== id));
    } catch (err) {
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      await addToCart(product._id, quantity);
    } catch (err) {
      console.error('Failed to add to cart:', err);
    }
  };

  const handleQuantityChange = (delta) => {
    setQuantity(q => Math.max(1, Math.min(product.stock, q + delta)));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-xl text-gray-500 mb-4">Product not found</p>
        <Link to="/shop" className="btn-primary">Back to Shop</Link>
      </div>
    );
  }

  const displayPrice = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  return (
    <>
      <Helmet>
        <title>{product.name} - Flowers World</title>
        <meta name="description" content={product.description} />
      </Helmet>

      <section className="bg-light py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-primary">Home</Link>
            <ChevronRight size={16} />
            <Link to="/shop" className="hover:text-primary">Shop</Link>
            <ChevronRight size={16} />
            <span className="text-dark">{product.name}</span>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="aspect-square rounded-xl overflow-hidden bg-white"
              >
                <img
                  src={product.images?.[selectedImage] || product.images?.[0] || 'https://placehold.co/600x600'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              {product.images?.length > 1 && (
                <div className="flex gap-3 overflow-x-auto">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        idx === selectedImage ? 'border-primary' : 'border-transparent'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-2">{product.category}</p>
              <h1 className="font-heading text-3xl font-bold mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={i < Math.floor(product.ratings) ? 'text-gold fill-gold' : 'text-gray-300'}
                  />
                ))}
                <span className="text-sm text-gray-500">({product.reviews?.length || 0} reviews)</span>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-bold text-primary">{formatINR(displayPrice)}</span>
                {hasDiscount && (
                  <span className="text-xl text-gray-400 line-through">{formatINR(product.price)}</span>
                )}
              </div>

              <p className="text-gray-600 mb-6">{product.description}</p>

              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm text-gray-600">Availability:</span>
                {product.stock > 0 ? (
                  <span className="text-green-600 font-medium">In Stock ({product.stock} available)</span>
                ) : (
                  <span className="text-red-500 font-medium">Out of Stock</span>
                )}
              </div>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm text-gray-600">Quantity:</span>
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-3 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="px-4 font-medium">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                    className="p-3 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              <div className="flex gap-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  disabled={cartLoading || product.stock === 0}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={20} /> Add to Cart
                </button>
                <button
                  onClick={() => setWishlist(!wishlist)}
                  className={`p-3 border-2 rounded-lg transition-colors ${
                    wishlist ? 'border-red-500 bg-red-50 text-red-500' : 'border-gray-300 hover:border-red-500'
                  }`}
                >
                  <Heart size={20} className={wishlist ? 'fill-current' : ''} />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 py-6 border-t">
                <div className="text-center">
                  <Truck size={24} className="mx-auto text-primary mb-2" />
                  <p className="text-xs text-gray-600">Free Delivery</p>
                </div>
                <div className="text-center">
                  <Shield size={24} className="mx-auto text-primary mb-2" />
                  <p className="text-xs text-gray-600">Secure Payment</p>
                </div>
                <div className="text-center">
                  <RefreshCw size={24} className="mx-auto text-primary mb-2" />
                  <p className="text-xs text-gray-600">Fresh Guarantee</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16">
            <div className="flex border-b mb-8">
              {['description', 'care', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 font-medium capitalize transition-colors ${
                    activeTab === tab
                      ? 'border-b-2 border-primary text-primary'
                      : 'text-gray-500 hover:text-dark'
                  }`}
                >
                  {tab === 'care' ? 'Care Instructions' : tab}
                </button>
              ))}
            </div>

            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-gray-600">{product.description}</p>
              </div>
            )}
            {activeTab === 'care' && (
              <div className="prose max-w-none">
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Keep flowers in fresh water and change water daily</li>
                  <li>Trim stems at an angle before placing in vase</li>
                  <li>Avoid direct sunlight and heat sources</li>
                  <li>Remove wilted petals to maintain freshness</li>
                </ul>
              </div>
            )}
            {activeTab === 'reviews' && (
              <div className="text-center py-8 text-gray-500">
                No reviews yet. Be the first to review!
              </div>
            )}
          </div>

          {relatedProducts.length > 0 && (
            <section className="mt-16">
              <h2 className="font-heading text-2xl font-bold mb-8">Related Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((prod, idx) => (
                  <ProductCard key={prod._id} product={prod} index={idx} />
                ))}
              </div>
            </section>
          )}
        </div>
      </section>
    </>
  );
};

export default ProductDetail;
