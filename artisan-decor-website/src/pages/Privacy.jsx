import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ScrollToTop from '../components/ScrollToTop';

const Privacy = () => {
  const sections = [
    {
      title: 'Introduction',
      content: 'At Sparsh Divine Art Studio, we respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, disclose, and safeguard your information when you visit our website.'
    },
    {
      title: 'Information We Collect',
      content: 'We may collect information about you in a variety of ways. The information we may collect on the Site includes: Personal Data such as your name, shipping address, email address, and telephone number. When you register for an account, we collect your username, full name, email address, and password.'
    },
    {
      title: 'Use of Your Information',
      content: 'Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to: process your transactions and send you related information; email you regarding your account or order; generate a personal profile about you to make our Site easier to navigate; increase the efficiency and operation of our Site; monitor and analyze usage and trends to improve your experience with the Site.'
    },
    {
      title: 'Disclosure of Your Information',
      content: 'We may share or disclose your information in the following situations: By Law or to Protect Rights - If we believe the release of information is necessary to comply with the law, enforce our Site policies, or protect ours or others\' rights, property, and safety. Third-Party Information Sharing - We do not sell, trade, or rent Users\' personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners, trusted affiliates, and advertisers for the purposes outlined above.'
    },
    {
      title: 'Security of Your Information',
      content: 'We use administrative, technical, and physical security measures to protect your personal information. However, no method of transmission over the Internet or method of electronic storage is 100% secure. We cannot guarantee absolute security of your information. We encrypt sensitive financial information transmitted to us.'
    },
    {
      title: 'Contact Us',
      content: 'If you have questions or comments about this Privacy Policy, please contact us at: Sparsh Divine Art Studio | Email: sparshdivineartstudio@gmail.com | Phone: +91-8160901481. We will respond to your inquiry within 5-7 business days.'
    }
  ];

  return (
    <>
      <ScrollToTop />
      <main className="min-h-screen bg-stone-50 dark:bg-stone-950 pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <h1 className="font-serif text-5xl md:text-6xl text-stone-900 dark:text-stone-50 font-light mb-4">
              Privacy Policy
            </h1>
            <p className="text-stone-600 dark:text-stone-400 text-lg">
              Your privacy is important to us. Learn how we protect your data.
            </p>
          </motion.div>

          {/* Sections */}
          <div className="space-y-12">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-stone-900/50 rounded-lg p-8 border border-stone-200 dark:border-stone-800"
              >
                <h2 className="font-serif text-2xl md:text-3xl text-stone-900 dark:text-stone-50 font-light mb-4">
                  {section.title}
                </h2>
                <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                  {section.content}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Last Updated */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-16 pt-8 border-t border-stone-200 dark:border-stone-800 text-center"
          >
            <p className="text-stone-600 dark:text-stone-400 text-sm">
              Last Updated: April 2026
            </p>
          </motion.div>

          {/* Back to Home */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <Link
              to="/"
              className="inline-block text-amber-600 hover:text-amber-700 dark:hover:text-amber-500 font-semibold transition-colors"
            >
              ← Back to Home
            </Link>
          </motion.div>
        </div>
      </main>
    </>
  );
};

export default Privacy;
