import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import axios from 'axios';
import { formatINR, formatDate, getStatusColor } from '../utils/helpers';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [currentPage, statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', currentPage);
      params.append('limit', 10);
      if (statusFilter) params.append('status', statusFilter);

      const res = await axios.get(`${API_URL}/admin/orders?${params.toString()}`);
      setOrders(res.data.orders);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(`${API_URL}/admin/orders/${orderId}/status`, { status: newStatus });
      fetchOrders();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const exportCSV = () => {
    const headers = ['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Date'];
    const rows = orders.map(o => [
      o._id,
      o.user?.name || 'N/A',
      o.items.length,
      o.totalAmount,
      o.status,
      formatDate(o.createdAt)
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orders.csv';
    a.click();
  };

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
          <Link to="/admin/orders" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/10 transition-colors">
            Orders
          </Link>
          <Link to="/admin/products" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors">
            Products
          </Link>
          <Link to="/admin/users" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors">
            Users
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-heading text-2xl font-bold">Orders Management</h1>
          <button onClick={exportCSV} className="btn-secondary flex items-center gap-2">
            <Download size={18} /> Export CSV
          </button>
        </div>

        <div className="mb-4">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="input-field w-auto"
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Order ID</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Customer</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Items</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Total</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i}>
                      <td colSpan={7} className="px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse"></div></td>
                    </tr>
                  ))
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">No orders found</td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <motion.tr
                      key={order._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 text-sm">#{order._id.slice(-8)}</td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-sm">{order.user?.name || 'N/A'}</p>
                        <p className="text-xs text-gray-500">{order.user?.email}</p>
                      </td>
                      <td className="px-6 py-4 text-sm">{order.items.length} items</td>
                      <td className="px-6 py-4 text-sm font-medium text-primary">{formatINR(order.totalAmount)}</td>
                      <td className="px-6 py-4">
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus(order._id, e.target.value)}
                          className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer ${getStatusColor(order.status)}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{formatDate(order.createdAt)}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedOrder(selectedOrder === order._id ? null : order._id)}
                          className="text-primary hover:underline text-sm"
                        >
                          {selectedOrder === order._id ? 'Hide' : 'View'}
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {selectedOrder && orders.find(o => o._id === selectedOrder) && (
            <div className="p-6 bg-gray-50 border-t">
              <h4 className="font-medium mb-3">Order Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Items</p>
                  <div className="space-y-2 mt-1">
                    {orders.find(o => o._id === selectedOrder).items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span>{item.name} x {item.quantity}</span>
                        <span>{formatINR(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Shipping Address</p>
                  <p className="text-sm mt-1">
                    {orders.find(o => o._id === selectedOrder)?.shippingDetails?.name}<br />
                    {orders.find(o => o._id === selectedOrder)?.shippingDetails?.address}<br />
                    {orders.find(o => o._id === selectedOrder)?.shippingDetails?.city}, {orders.find(o => o._id === selectedOrder)?.shippingDetails?.state} - {orders.find(o => o._id === selectedOrder)?.shippingDetails?.pincode}
                  </p>
                </div>
              </div>
            </div>
          )}

          {totalPages > 1 && (
            <div className="px-6 py-4 flex justify-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 border rounded hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="px-4 py-2">Page {currentPage} of {totalPages}</span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 border rounded hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminOrders;
