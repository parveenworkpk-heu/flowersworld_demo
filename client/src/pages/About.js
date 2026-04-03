import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flower2, Users, Award, Heart } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const About = () => {
  const stats = [
    { value: '15+', label: 'Years of Service', icon: Award },
    { value: '50K+', label: 'Happy Customers', icon: Heart },
    { value: '10K+', label: 'Bouquets Delivered', icon: Flower2 },
    { value: '50+', label: 'Expert Florists', icon: Users }
  ];

  const timeline = [
    { year: '2010', title: 'Our Beginning', description: 'Started as a small flower shop in the heart of the city' },
    { year: '2015', title: 'Going Online', description: 'Launched our e-commerce platform to serve customers nationwide' },
    { year: '2020', title: 'Growth & Recognition', description: 'Received Best Flower Shop award and expanded to multiple locations' },
    { year: '2024', title: 'Today', description: 'Serving 50,000+ happy customers with premium floral arrangements' }
  ];

  const team = [
    { name: 'Sarah Johnson', role: 'Head Florist', image: 'https://placehold.co/200x200' },
    { name: 'Michael Chen', role: 'Creative Director', image: 'https://placehold.co/200x200' },
    { name: 'Emma Williams', role: 'Event Specialist', image: 'https://placehold.co/200x200' },
    { name: 'David Kumar', role: 'Operations Manager', image: 'https://placehold.co/200x200' }
  ];

  return (
    <>
      <Helmet>
        <title>About Us - Flowers World</title>
        <meta name="description" content="Learn about Flowers World - our story, team, and commitment to quality." />
      </Helmet>

      <section className="bg-gradient-to-b from-cream to-light py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-4xl md:text-5xl font-bold mb-6"
          >
            Our <span className="text-primary">Story</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 max-w-2xl mx-auto text-lg"
          >
            Since 2010, Flowers World has been bringing nature's beauty to life's special moments. 
            We believe every occasion deserves the perfect bouquet.
          </motion.p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <stat.icon size={40} className="mx-auto text-primary mb-4" />
                <p className="text-4xl font-heading font-bold text-dark mb-2">{stat.value}</p>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl font-bold text-center mb-12">
            Our <span className="text-primary">Journey</span>
          </h2>
          <div className="max-w-3xl mx-auto">
            {timeline.map((item, idx) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex gap-6 pb-8 border-l-2 border-primary/20 pl-6 last:border-0"
              >
                <div className="flex-shrink-0 w-16">
                  <span className="font-heading font-bold text-primary">{item.year}</span>
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-lg mb-1">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-light">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl font-bold text-center mb-4">
            Meet Our <span className="text-primary">Team</span>
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Our passionate team of florists and event specialists are here to make your moments memorable
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, idx) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full aspect-square object-cover"
                />
                <div className="p-4 text-center">
                  <h3 className="font-heading font-semibold">{member.name}</h3>
                  <p className="text-primary text-sm">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">
              Ready to Create Something Beautiful?
            </h2>
            <p className="text-gray-300 mb-8 max-w-xl mx-auto">
              Browse our collection or contact us for custom arrangements tailored to your needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/shop" className="btn-primary">Shop Now</Link>
              <Link to="/contact" className="btn-secondary bg-transparent border-white hover:bg-white/10">Contact Us</Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default About;
