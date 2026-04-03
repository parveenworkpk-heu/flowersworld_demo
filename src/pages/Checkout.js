import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, CreditCard, Wallet, CheckCircle, Loader } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatINR, validateEmail, validatePhone } from '../utils/helpers';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  
  const [shippingDetails, setShippingDetails] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });
  
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setShippingDetails(prev => ({
        ...prev,
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  useEffect(() => {
    if (cartItems.length === 0 && !orderSuccess) {
      navigate('/shop');
    }
  }, [cartItems, orderSuccess, navigate]);

  const handleChange = (e) => {
    setShippingDetails({ ...shippingDetails, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateShipping = () => {
    const newErrors = {};
    if (!shippingDetails.name.trim()) newErrors.name = 'Name is required';
    if (!shippingDetails.phone.trim()) newErrors.phone = 'Phone is required';
    else if (!validatePhone(shippingDetails.phone)) newErrors.phone = 'Invalid phone format';
    if (!shippingDetails.email.trim()) newErrors.email = 'Email is required';
    else if (!validateEmail(shippingDetails.email)) newErrors.email = 'Invalid email format';
    if (!shippingDetails.address.trim()) newErrors.address = 'Address is required';
    if (!shippingDetails.city.trim()) newErrors.city = 'City is required';
    if (!shippingDetails.state.trim()) newErrors.state = 'State is required';
    if (!shippingDetails.pincode.trim()) newErrors.pincode = 'Pincode is required';
    return newErrors;
  };

  const handlePlaceOrder = async () => {
    console.log('handlePlaceOrder called', { cartItems, shippingDetails, paymentMethod, total });
    
    const validationErrors = validateShipping();
    if (Object.keys(validationErrors).length > 0) {
      console.log('Validation errors:', validationErrors);
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token);
      
      if (!token) {
        throw new Error('Please login to place order');
      }
      
      const orderData = {
        items: cartItems.map(item => ({
          product: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image
        })),
        shippingDetails,
        paymentMethod,
        totalAmount: total
      };

      console.log('Order data:', orderData);

      const res = await axios.post(`${API_URL}/orders`, orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Response:', res.data);
      
      if (res.data && res.data._id) {
        setOrderId(res.data._id);
        setOrderSuccess(true);
        await clearCart();
      } else {
        throw new Error('Order failed');
      }
    } catch (err) {
      console.error('Error placing order:', err);
      alert(err.response?.data?.message || err.message || 'Failed to place order. Please try again.');
      setErrors({ submit: err.response?.data?.message || err.message || 'Failed to place order. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <>
        <Helmet>
          <title>Order Success - Flowers World</title>
        </Helmet>
        <section className="min-h-screen flex items-center justify-center py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-green-500" />
            </div>
            <h1 className="font-heading text-3xl font-bold mb-4">Order Placed Successfully!</h1>
            <p className="text-gray-600 mb-2">Order ID: {orderId}</p>
            <p className="text-gray-600 mb-8">Thank you for your purchase. We'll process your order shortly.</p>
            <div className="flex gap-4 justify-center">
              <Link to="/shop" className="btn-primary">Continue Shopping</Link>
              <Link to="/account/orders" className="btn-secondary">View Orders</Link>
            </div>
          </motion.div>
        </section>
      </>
    );
  }

  const shippingCost = cartTotal > 500 ? 0 : 50;
  const total = cartTotal + shippingCost;

  return (
    <>
      <Helmet>
        <title>Checkout - Flowers World</title>
      </Helmet>

      <section className="bg-light py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-4">
            {['Details', 'Payment', 'Confirm'].map((label, idx) => (
              <React.Fragment key={label}>
                <div className={`flex items-center gap-2 ${step > idx + 1 ? 'text-green-500' : step === idx + 1 ? 'text-primary' : 'text-gray-400'}`}>
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    step > idx + 1 ? 'bg-green-500 border-green-500 text-white' : step === idx + 1 ? 'border-primary text-primary' : 'border-gray-300'
                  }`}>
                    {step > idx + 1 ? <CheckCircle size={16} /> : idx + 1}
                  </span>
                  <span className="hidden sm:inline font-medium">{label}</span>
                </div>
                {idx < 2 && <ChevronRight size={20} className="text-gray-300" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-white rounded-xl p-6 shadow-sm"
                  >
                    <h2 className="font-heading text-xl font-semibold mb-6">Shipping Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Full Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={shippingDetails.name}
                          onChange={handleChange}
                          className={`input-field ${errors.name ? 'border-red-500' : ''}`}
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Phone Number *</label>
                        <input
                          type="tel"
                          name="phone"
                          value={shippingDetails.phone}
                          onChange={handleChange}
                          className={`input-field ${errors.phone ? 'border-red-500' : ''}`}
                        />
                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Email *</label>
                        <input
                          type="email"
                          name="email"
                          value={shippingDetails.email}
                          onChange={handleChange}
                          className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Address *</label>
                        <textarea
                          name="address"
                          value={shippingDetails.address}
                          onChange={handleChange}
                          rows="2"
                          className={`input-field resize-none ${errors.address ? 'border-red-500' : ''}`}
                        />
                        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">City *</label>
                        <input
                          type="text"
                          name="city"
                          value={shippingDetails.city}
                          onChange={handleChange}
                          className={`input-field ${errors.city ? 'border-red-500' : ''}`}
                        />
                        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">State *</label>
                        <input
                          type="text"
                          name="state"
                          value={shippingDetails.state}
                          onChange={handleChange}
                          className={`input-field ${errors.state ? 'border-red-500' : ''}`}
                        />
                        {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Pincode *</label>
                        <input
                          type="text"
                          name="pincode"
                          value={shippingDetails.pincode}
                          onChange={handleChange}
                          className={`input-field ${errors.pincode ? 'border-red-500' : ''}`}
                        />
                        {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                      <button onClick={() => setStep(2)} className="btn-primary flex items-center gap-2">
                        Continue to Payment <ChevronRight size={20} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-white rounded-xl p-6 shadow-sm"
                  >
                    <h2 className="font-heading text-xl font-semibold mb-6">Payment Method</h2>
                    <div className="space-y-4">
                      <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-colors ${
                        paymentMethod === 'COD' ? 'border-primary bg-primary/5' : 'hover:border-gray-300'
                      }`}>
                        <input
                          type="radio"
                          name="payment"
                          value="COD"
                          checked={paymentMethod === 'COD'}
                          onChange={() => setPaymentMethod('COD')}
                          className="w-4 h-4 text-primary"
                        />
                        <Wallet size={24} />
                        <div>
                          <p className="font-medium">Cash on Delivery</p>
                          <p className="text-sm text-gray-500">Pay when you receive your order</p>
                        </div>
                      </label>
                      <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-colors ${
                        paymentMethod === 'UPI' ? 'border-primary bg-primary/5' : 'hover:border-gray-300'
                      }`}>
                        <input
                          type="radio"
                          name="payment"
                          value="UPI"
                          checked={paymentMethod === 'UPI'}
                          onChange={() => setPaymentMethod('UPI')}
                          className="w-4 h-4 text-primary"
                        />
                        <CreditCard size={24} />
                        <div>
                          <p className="font-medium">UPI Payment</p>
                          <p className="text-sm text-gray-500">Pay using UPI app</p>
                        </div>
                      </label>
                    </div>

                    {paymentMethod === 'UPI' && (
                      <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                        <p className="text-sm text-gray-600 mb-2">UPI ID: flowersworld@upi</p>
                        <p className="text-xs text-gray-500">Scan QR or enter UPI ID to complete payment</p>
                      </div>
                    )}

                    <div className="mt-6 flex justify-between">
                      <button onClick={() => setStep(1)} className="btn-secondary flex items-center gap-2">
                        <ChevronLeft size={20} /> Back
                      </button>
                      <button
                        onClick={handlePlaceOrder}
                        disabled={loading}
                        className="btn-primary flex items-center gap-2"
                      >
                        {loading ? (
                          <Loader size={20} className="animate-spin" />
                        ) : (
                          <>Place Order</>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div>
              <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
                <h2 className="font-heading text-xl font-semibold mb-4">Order Summary</h2>
                <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                  {cartItems.map((item) => (
                    <div key={item._id} className="flex gap-3">
                      <img
                        src={item.image || 'https://placehold.co/60x60'}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm line-clamp-1">{item.name}</p>
                        <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                        <p className="text-primary font-semibold">{formatINR(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{formatINR(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span>{shippingCost === 0 ? 'Free' : formatINR(shippingCost)}</span>
                  </div>
                  <div className="flex justify-between font-heading font-semibold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span className="text-primary">{formatINR(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Checkout;
