import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { formatINR, formatDate, getStatusColor } from '../utils/helpers';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AccountOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_URL}/orders/my-orders`);
      setOrders(res.data.orders);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded-xl"></div>
          </div>
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">No orders yet</p>
        <Link to="/shop" className="btn-primary">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-heading text-xl font-semibold mb-6">My Orders</h2>
      
      <div className="space-y-4">
        {orders.map((order) => (
          <motion.div
            key={order._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border rounded-xl overflow-hidden"
          >
            <div className="p-4 bg-gray-50 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-medium">Order #{order._id.slice(-8)}</p>
                <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
                <span className="font-heading font-semibold text-primary">{formatINR(order.totalAmount)}</span>
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex gap-4 overflow-x-auto pb-2">
                {order.items.slice(0, 4).map((item, idx) => (
                  <img
                    key={idx}
                    src={item.image || 'https://placehold.co/60x60'}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                ))}
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-500">{order.items.length} items</span>
                <button
                  onClick={() => setSelectedOrder(selectedOrder === order._id ? null : order._id)}
                  className="text-primary text-sm font-medium flex items-center gap-1 hover:underline"
                >
                  {selectedOrder === order._id ? 'Hide' : 'View'} Details <ChevronRight size={16} />
                </button>
              </div>
              
              {selectedOrder === order._id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 pt-4 border-t"
                >
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span>{item.name} x {item.quantity}</span>
                        <span>{formatINR(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium">Shipping Address</p>
                    <p className="text-sm text-gray-600">
                      {order.shippingDetails.name}<br />
                      {order.shippingDetails.address}<br />
                      {order.shippingDetails.city}, {order.shippingDetails.state} - {order.shippingDetails.pincode}
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AccountOrders;
