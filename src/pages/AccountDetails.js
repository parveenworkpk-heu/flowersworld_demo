import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { validateEmail, validatePhone } from '../utils/helpers';

const AccountDetails = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });
  const [errors, setErrors] = useState({});

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!profileData.name.trim()) newErrors.name = 'Name is required';
    if (!profileData.email.trim()) newErrors.email = 'Email is required';
    else if (!validateEmail(profileData.email)) newErrors.email = 'Invalid email';
    if (profileData.phone && !validatePhone(profileData.phone)) newErrors.phone = 'Invalid phone';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await updateProfile(profileData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || 'Failed to update' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="font-heading text-xl font-semibold mb-6">Account Details</h2>

      <form onSubmit={handleProfileSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            value={profileData.name}
            onChange={handleProfileChange}
            className={`input-field ${errors.name ? 'border-red-500' : ''}`}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email Address</label>
          <input
            type="email"
            name="email"
            value={profileData.email}
            onChange={handleProfileChange}
            className={`input-field ${errors.email ? 'border-red-500' : ''}`}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={profileData.phone}
            onChange={handleProfileChange}
            className={`input-field ${errors.phone ? 'border-red-500' : ''}`}
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary flex items-center gap-2"
        >
          <Save size={18} />
          {loading ? 'Saving...' : 'Save Changes'}
        </button>

        {success && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-green-600 text-sm"
          >
            Profile updated successfully!
          </motion.p>
        )}
      </form>
    </div>
  );
};

export default AccountDetails;
