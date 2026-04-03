import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Eye, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatINR } from '../utils/helpers';

const ProductCard = ({ product, index = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [wishlistAnimating, setWishlistAnimating] = useState(false);
  const { addToCart, loading } = useCart();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToCart(product._id, 1);
    } catch (err) {
      console.error('Failed to add to cart:', err);
    }
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlistAnimating(true);
    setTimeout(() => setWishlistAnimating(false), 500);
  };

  const displayPrice = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link
        to={`/product/${product._id}`}
        className="group block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
          <div className="relative aspect-[4/5] overflow-hidden">
            <img
              src={product.images?.[0] || 'https://placehold.co/400x500'}
              alt={product.name}
              className={`w-full h-full object-cover transition-transform duration-500 ${
                isHovered ? 'scale-110' : 'scale-100'
              }`}
            />
            
            {hasDiscount && (
              <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
                {Math.round((1 - product.discountPrice / product.price) * 100)}% OFF
              </span>
            )}
            
            <motion.button
              whileTap={{ scale: 0.9 }}
              animate={wishlistAnimating ? { rotate: [0, -10, 10, 0] } : {}}
              onClick={handleWishlist}
              className={`absolute top-3 left-3 p-2 rounded-full bg-white shadow-md transition-colors ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Heart size={18} className="text-gray-400 hover:text-red-500" />
            </motion.button>

            <div className={`absolute inset-0 bg-black/40 flex items-center justify-center gap-3 transition-opacity ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}>
              <Link
                to={`/product/${product._id}`}
                className="p-3 bg-white rounded-full hover:bg-primary hover:text-white transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Eye size={20} />
              </Link>
              <button
                onClick={handleAddToCart}
                disabled={loading || product.stock === 0}
                className="p-3 bg-primary text-white rounded-full hover:brightness-110 disabled:opacity-50"
              >
                <ShoppingBag size={20} />
              </button>
            </div>
          </div>

          <div className="p-4">
            <p className="text-xs text-gray-500 mb-1">{product.category}</p>
            <h3 className="font-heading font-semibold text-dark mb-2 line-clamp-1 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-primary">
                {formatINR(displayPrice)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-gray-400 line-through">
                  {formatINR(product.price)}
                </span>
              )}
            </div>
            {product.stock === 0 && (
              <p className="text-red-500 text-xs mt-1">Out of Stock</p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
