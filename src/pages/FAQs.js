import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const FAQItem = ({ question, answer, isOpen, onToggle }) => (
  <div className="border-b border-gray-200 py-4">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between text-left"
    >
      <span className="font-medium text-gray-800">{question}</span>
      <ChevronDown
        className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        size={20}
      />
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-3 text-gray-600"
        >
          {answer}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: 'How do I place an order?',
      answer: 'Browse our collection, add items to your cart, proceed to checkout, fill in your shipping details, and select Cash on Delivery as your payment method. It\'s that simple!'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We currently accept Cash on Delivery (COD). You pay when your order is delivered to your doorstep.'
    },
    {
      question: 'How long does delivery take?',
      answer: 'Standard delivery takes 2-4 business days. For metro cities, we offer same-day delivery on orders placed before 12 PM.'
    },
    {
      question: 'Do you deliver to all locations?',
      answer: 'We deliver to most major cities and towns across India. During checkout, you can check if we deliver to your pincode.'
    },
    {
      question: 'Can I cancel or modify my order?',
      answer: 'Yes, you can cancel or modify your order within 2 hours of placing it. Contact our customer support immediately.'
    },
    {
      question: 'What is your return policy?',
      answer: 'If you\'re not satisfied with the quality of flowers, we offer a 100% replacement guarantee. Contact us within 24 hours of delivery with photos.'
    },
    {
      question: 'How do I track my order?',
      answer: 'Once your order is dispatched, you\'ll receive a tracking link via SMS and email. You can also track it from your account dashboard.'
    },
    {
      question: 'Are the flowers fresh?',
      answer: 'Absolutely! We source fresh flowers daily from local farms and guarantee same-day arrangements for maximum freshness and longevity.'
    },
    {
      question: 'Can I get a customized bouquet?',
      answer: 'Yes! Contact us with your requirements and our florists will create a custom bouquet tailored to your needs. Additional charges may apply.'
    },
    {
      question: 'How do I contact customer support?',
      answer: 'You can reach us through the Contact page, email us at support@flowersworld.com, or call our 24/7 helpline.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>FAQs - Flowers World</title>
        <meta name="description" content="Frequently Asked Questions about Flowers World online flower shop." />
      </Helmet>

      <section className="bg-gradient-to-b from-cream to-light py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <HelpCircle size={40} className="text-primary" />
            <h1 className="font-heading text-4xl font-bold">
              Frequently Asked <span className="text-primary">Questions</span>
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600"
          >
            Find answers to common questions about our services
          </motion.p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
              />
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">Still have questions?</p>
            <a href="/contact" className="btn-primary">
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default FAQs;