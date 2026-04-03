import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatINR } from '../utils/helpers';

const CartDrawer = () => {
  const { cartItems, cartOpen, setCartOpen, updateCartItem, removeFromCart, cartTotal } = useCart();

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 bg-black/50 z-50"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-xl"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="font-heading font-semibold text-lg flex items-center gap-2">
                  <ShoppingBag size={20} /> Your Cart ({cartItems.length})
                </h2>
                <button
                  onClick={() => setCartOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {cartItems.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">Your cart is empty</p>
                    <Link
                      to="/shop"
                      onClick={() => setCartOpen(false)}
                      className="inline-block mt-4 text-primary hover:underline"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item._id} className="flex gap-4 p-3 bg-gray-50 rounded-lg">
                        <img
                          src={item.image || 'https://placehold.co/100x100'}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{item.name}</h4>
                          <p className="text-primary font-semibold mt-1">{formatINR(item.price)}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <button
                              onClick={() => updateCartItem(item._id, Math.max(1, item.quantity - 1))}
                              className="p-1 bg-white border rounded hover:bg-gray-100"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="text-sm font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateCartItem(item._id, Math.min(item.maxStock, item.quantity + 1))}
                              disabled={item.quantity >= item.maxStock}
                              className="p-1 bg-white border rounded hover:bg-gray-100 disabled:opacity-50"
                            >
                              <Plus size={14} />
                            </button>
                            <button
                              onClick={() => removeFromCart(item._id)}
                              className="p-1 text-red-500 hover:bg-red-50 rounded ml-auto"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cartItems.length > 0 && (
                <div className="border-t p-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-heading font-semibold text-lg">{formatINR(cartTotal)}</span>
                  </div>
                  <Link
                    to="/checkout"
                    onClick={() => setCartOpen(false)}
                    className="block w-full btn-primary text-center"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
