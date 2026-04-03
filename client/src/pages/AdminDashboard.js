import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Package, Users, ShoppingBag, TrendingUp, DollarSign, UserCheck, Clock, LogOut } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { formatINR } from '../utils/helpers';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const COLORS = ['#C73086', '#FF6B6B', '#8B9A7D', '#D4AF37'];

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/analytics`);
      setAnalytics(res.data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const sidebarItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
    { path: '/admin/products', icon: Package, label: 'Products' },
    { path: '/admin/users', icon: Users, label: 'Users' }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const kpiCards = [
    { label: 'Total Revenue', value: formatINR(analytics?.kpi?.totalRevenue || 0), icon: DollarSign, color: 'bg-green-500' },
    { label: 'Active Users', value: analytics?.kpi?.activeUsers || 0, icon: UserCheck, color: 'bg-blue-500' },
    { label: 'Pending Orders', value: analytics?.kpi?.pendingOrders || 0, icon: Clock, color: 'bg-yellow-500' },
    { label: 'Total Orders', value: analytics?.kpi?.totalOrders || 0, icon: TrendingUp, color: 'bg-purple-500' }
  ];

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Flowers World</title>
      </Helmet>

      <div className="min-h-screen bg-gray-100 flex">
        <aside className="w-64 bg-dark text-white flex-shrink-0">
          <div className="p-6">
            <h2 className="text-xl font-heading font-bold">Admin Panel</h2>
            <p className="text-sm text-gray-400">Flowers World</p>
          </div>
          <nav className="px-4 space-y-2">
            {sidebarItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors"
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
          </nav>
        </aside>

        <main className="flex-1 p-8">
          <h1 className="font-heading text-2xl font-bold mb-8">Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {kpiCards.map((card, idx) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${card.color}`}>
                    <card.icon size={24} className="text-white" />
                  </div>
                </div>
                <p className="text-2xl font-heading font-bold">{card.value}</p>
                <p className="text-sm text-gray-500">{card.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-heading font-semibold mb-4">Orders Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics?.ordersOverTime || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#C73086" strokeWidth={2} />
                  <Line type="monotone" dataKey="revenue" stroke="#D4AF37" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-heading font-semibold mb-4">Payment Methods</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics?.paymentMethods || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="_id"
                    label
                  >
                    {(analytics?.paymentMethods || []).map((entry, idx) => (
                      <Cell key={entry._id} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-heading font-semibold mb-4">Top Selling Products</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics?.topProducts || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="totalSold" fill="#C73086" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;
