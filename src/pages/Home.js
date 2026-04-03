import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { formatINR } from '../utils/helpers';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const heroImages = [
  'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=1920&q=80',
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1920&q=80',
  'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1920&q=80'
];

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/products?limit=6&sort=createdAt&order=desc`);
        setProducts(res.data.products);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <>
      <Helmet>
        <title>Flowers World - Premium Flowers Delivered Fresh</title>
        <meta name="description" content="Discover beautiful flowers and bouquets at Flowers World. Fresh flowers delivered to your doorstep." />
      </Helmet>

      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          {heroImages.map((img, idx) => (
            <div
              key={idx}
              className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
              style={{
                backgroundImage: `url(${img})`,
                opacity: idx === currentSlide ? 1 : 0,
                zIndex: idx === currentSlide ? 1 : 0
              }}
            >
              <div className="absolute inset-0 bg-black/50" />
            </div>
          ))}
        </div>

        <div className="relative z-10 h-full flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="container mx-auto px-4 text-center"
          >
            <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-white/20 shadow-xl">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="font-display text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg"
              >
                Blooming Beauty <span className="text-pink-300">Delivered</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-lg md:text-xl text-white/90 mb-8 drop-shadow-md"
              >
                Fresh handcrafted bouquets for every occasion
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Link to="/shop" className="btn-primary inline-flex items-center justify-center gap-2">
                  Shop Now <ChevronRight size={20} />
                </Link>
                <Link to="/about" className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-6 py-3 rounded-lg font-medium hover:bg-white/30 transition-all inline-flex items-center justify-center gap-2">
                  Know More <ArrowRight size={20} />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {heroImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentSlide ? 'w-8 bg-primary' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      <section className="py-20 bg-light">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Latest <span className="text-primary">Arrivals</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our newest collection of fresh flowers and handcrafted bouquets
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden animate-pulse">
                  <div className="aspect-[4/5] bg-gray-200" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                    <div className="h-6 bg-gray-200 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {products.map((product, idx) => (
                <motion.div key={product._id} variants={itemVariants}>
                  <ProductCard product={product} index={idx} />
                </motion.div>
              ))}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/shop" className="btn-secondary inline-flex items-center gap-2">
              View All Products <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-cream relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {[...Array(20)].map((_, i) => (
              <circle key={i} cx={Math.random() * 100} cy={Math.random() * 100} r={Math.random() * 5 + 2} fill="#C73086" />
            ))}
          </svg>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Have Any <span className="text-primary">Questions?</span>
            </h2>
            <p className="text-gray-600 mb-8">
              Our florists are here to help you find the perfect arrangement
            </p>
            <Link to="/contact" className="btn-primary inline-flex items-center gap-2">
              Contact Us <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Home;
