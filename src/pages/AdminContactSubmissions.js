import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Package, Users, ShoppingBag, TrendingUp, DollarSign, UserCheck, Clock, LogOut, MessageSquare, Mail, Trash2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { formatINR } from '../utils/helpers';

import API_URL from '../config';

const COLORS = ['#C73086', '#FF6B6B', '#8B9A7D', '#D4AF37'];

const AdminContactSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/contact-submissions`);
      setSubmissions(res.data.submissions || []);
    } catch (err) {
      console.error('Error fetching submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteSubmission = async (id) => {
    if (!window.confirm('Are you sure you want to delete this submission?')) return;
    try {
      await axios.delete(`${API_URL}/admin/contact-submissions/${id}`);
      setSubmissions(submissions.filter(s => s._id !== id));
    } catch (err) {
      console.error('Error deleting submission:', err);
    }
  };

  const sidebarItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
    { path: '/admin/products', icon: Package, label: 'Products' },
    { path: '/admin/users', icon: Users, label: 'Users' },
    { path: '/admin/contact', icon: MessageSquare, label: 'Contact Submissions' }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Contact Submissions - Flowers World Admin</title>
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
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-heading text-2xl font-bold">Contact Submissions</h1>
            <p className="text-gray-500">{submissions.length} total submissions</p>
          </div>

          {submissions.length === 0 ? (
            <div className="bg-white rounded-xl p-12 shadow-sm text-center">
              <Mail size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No contact form submissions yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map((submission, idx) => (
                <motion.div
                  key={submission._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-xl p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="font-semibold text-lg">{submission.name}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          submission.status === 'new' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {submission.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-3">{submission.email} {submission.phone && `• ${submission.phone}`}</p>
                      {submission.subject && (
                        <p className="font-medium text-dark mb-2">Subject: {submission.subject}</p>
                      )}
                      <p className="text-gray-700 whitespace-pre-wrap">{submission.message}</p>
                      <p className="text-xs text-gray-400 mt-4">Submitted on: {formatDate(submission.createdAt)}</p>
                    </div>
                    <button
                      onClick={() => deleteSubmission(submission._id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default AdminContactSubmissions;