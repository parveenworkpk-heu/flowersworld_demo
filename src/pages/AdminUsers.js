import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, UserX, UserCheck, ChevronLeft, ChevronRight, Mail } from 'lucide-react';
import axios from 'axios';
import { formatDate } from '../utils/helpers';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [blockFilter, setBlockFilter] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchQuery, blockFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', currentPage);
      params.append('limit', 10);
      if (searchQuery) params.append('search', searchQuery);
      if (blockFilter) params.append('isBlocked', blockFilter);

      const res = await axios.get(`${API_URL}/admin/users?${params.toString()}`);
      setUsers(res.data.users);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserBlock = async (userId) => {
    try {
      await axios.patch(`${API_URL}/admin/users/${userId}/toggle-block`);
      fetchUsers();
    } catch (err) {
      console.error('Error toggling user block:', err);
    }
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
          <Link to="/admin/orders" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors">
            Orders
          </Link>
          <Link to="/admin/products" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors">
            Products
          </Link>
          <Link to="/admin/users" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/10 transition-colors">
            Users
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-heading text-2xl font-bold">Users Management</h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative max-w-md flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="input-field pl-10"
            />
          </div>
          <select
            value={blockFilter}
            onChange={(e) => { setBlockFilter(e.target.value); setCurrentPage(1); }}
            className="input-field w-auto"
          >
            <option value="">All Users</option>
            <option value="false">Active</option>
            <option value="true">Blocked</option>
          </select>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">User</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Phone</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Joined</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Last Active</th>
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
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">No users found</td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <motion.tr
                      key={user._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-primary font-medium">{user.name?.charAt(0)}</span>
                          </div>
                          <p className="font-medium text-sm">{user.name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail size={14} className="text-gray-400" />
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{user.phone || 'N/A'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          user.isBlocked ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                        }`}>
                          {user.isBlocked ? 'Blocked' : 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{formatDate(user.createdAt)}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {user.lastActive ? formatDate(user.lastActive) : 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleUserBlock(user._id)}
                          className={`p-2 rounded ${
                            user.isBlocked 
                              ? 'text-green-600 hover:bg-green-50' 
                              : 'text-red-600 hover:bg-red-50'
                          }`}
                          title={user.isBlocked ? 'Unblock User' : 'Block User'}
                        >
                          {user.isBlocked ? <UserCheck size={16} /> : <UserX size={16} />}
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

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

export default AdminUsers;
