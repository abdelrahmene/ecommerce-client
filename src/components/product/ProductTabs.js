import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

const ProductTabs = ({ product, activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'specifications', label: 'Spécifications' },
    { id: 'reviews', label: 'Avis' }
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      className="mt-16"
    >
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                py-4 px-6 font-medium text-sm whitespace-nowrap
                ${activeTab === tab.id 
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }
                transition-colors
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="py-6">
        {activeTab === 'description' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {product.description}
            </p>
            
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              Caractéristiques
            </h3>
            
            <ul className="space-y-2">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check size={18} className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {activeTab === 'specifications' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
              {product.specifications.map((spec, index) => (
                <div 
                  key={index}
                  className={`
                    flex flex-wrap items-center px-4 py-3
                    ${index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'}
                  `}
                >
                  <div className="w-full sm:w-1/3 font-medium text-gray-900 dark:text-white">
                    {spec.name}
                  </div>
                  <div className="w-full sm:w-2/3 text-gray-700 dark:text-gray-300">
                    {spec.value}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'reviews' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center py-10"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
              <span className="text-blue-600 dark:text-blue-400 text-2xl font-bold">{product.rating}</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Basé sur {product.reviewCount} avis
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Les clients adorent ce produit !
            </p>
            <button className="bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
              Voir tous les avis
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductTabs;