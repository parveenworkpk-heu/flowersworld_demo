import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, MapPin, X, Save } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AccountAddresses = () => {
  const { user, updateProfile } = useAuth();
  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  useEffect(() => {
    if (user?.addresses) {
      setAddresses(user.addresses);
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const newAddresses = [...addresses];
      
      if (editingIndex !== null) {
        newAddresses[editingIndex] = formData;
      } else {
        newAddresses.push(formData);
      }

      await axios.put(`${API_URL}/auth/profile`, { addresses: newAddresses });
      setAddresses(newAddresses);
      setShowForm(false);
      setEditingIndex(null);
      setFormData({ name: '', phone: '', address: '', city: '', state: '', pincode: '' });
    } catch (err) {
      console.error('Error saving address:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (index) => {
    setFormData(addresses[index]);
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleDelete = async (index) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    
    setLoading(true);
    try {
      const newAddresses = addresses.filter((_, i) => i !== index);
      await axios.put(`${API_URL}/auth/profile`, { addresses: newAddresses });
      setAddresses(newAddresses);
    } catch (err) {
      console.error('Error deleting address:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingIndex(null);
    setFormData({ name: '', phone: '', address: '', city: '', state: '', pincode: '' });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-heading text-xl font-semibold">My Addresses</h2>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} /> Add New Address
        </button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 rounded-xl p-6 mb-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-heading font-semibold">
              {editingIndex !== null ? 'Edit Address' : 'Add New Address'}
            </h3>
            <button onClick={handleCancel} className="p-1 hover:bg-gray-200 rounded">
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Enter name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Enter phone number"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Address *</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                rows="2"
                className="input-field resize-none"
                placeholder="Enter full address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">City *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Enter city"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">State *</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Enter state"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Pincode *</label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Enter pincode"
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center gap-2"
              >
                <Save size={18} />
                {loading ? 'Saving...' : 'Save Address'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {addresses.length === 0 && !showForm ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <MapPin size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 mb-4">No addresses saved yet</p>
          <button onClick={() => setShowForm(true)} className="btn-primary">
            Add Your First Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white border rounded-xl p-4 shadow-sm"
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium">{addr.name}</h4>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(index)}
                    className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600">{addr.address}</p>
              <p className="text-sm text-gray-600">{addr.city}, {addr.state} - {addr.pincode}</p>
              <p className="text-sm text-gray-500 mt-1">{addr.phone}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AccountAddresses;
