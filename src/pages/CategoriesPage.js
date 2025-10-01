import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Package } from 'lucide-react';
import { getImageUrl } from '../config/api';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/categories`);
      const data = await response.json();
      
      // Organiser par catégorie principale et sous-catégories
      const mainCategories = data.categories.filter(cat => !cat.parentId);
      const organized = mainCategories.map(main => ({
        ...main,
        subcategories: data.categories.filter(cat => cat.parentId === main.id)
      }));
      
      setCategories(organized);
    } catch (error) {
      console.error('Erreur chargement catégories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Nos Catégories</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explorez notre collection organisée par catégories et sous-catégories
          </p>
        </div>

        {/* Categories Grid */}
        <div className="space-y-12">
          {categories.map((mainCat, index) => (
            <motion.div
              key={mainCat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              {/* Main Category Header */}
              <Link 
                to={mainCat.slug === 'homme' ? '/homme' : mainCat.slug === 'femmes' ? '/femme' : mainCat.slug === 'enfant' ? '/enfant' : `/category/${mainCat.slug}`}
                className="block"
              >
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 md:p-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                        {mainCat.name}
                      </h2>
                      {mainCat.description && (
                        <p className="text-blue-100">{mainCat.description}</p>
                      )}
                      <div className="flex items-center gap-2 mt-3 text-blue-100">
                        <Package className="w-4 h-4" />
                        <span className="text-sm">{mainCat._count?.products || 0} produits</span>
                      </div>
                    </div>
                    <ChevronRight className="w-8 h-8 text-white" />
                  </div>
                </div>
              </Link>

              {/* Subcategories */}
              {mainCat.subcategories && mainCat.subcategories.length > 0 && (
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Sous-catégories</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mainCat.subcategories.map((sub) => (
                      <Link
                        key={sub.id}
                        to={`${mainCat.slug === 'homme' ? '/homme' : mainCat.slug === 'femmes' ? '/femme' : mainCat.slug === 'enfant' ? '/enfant' : `/category/${mainCat.slug}`}?subcategory=${sub.slug}`}
                        className="group flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all"
                      >
                        {/* Image */}
                        <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                          {sub.image ? (
                            <img
                              src={getImageUrl(sub.image)}
                              alt={sub.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                            {sub.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {sub._count?.products || 0} produits
                          </p>
                        </div>

                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
