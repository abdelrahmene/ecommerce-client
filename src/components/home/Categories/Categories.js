import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const mockCategories = [
  {
    id: 'birk-homme',
    title: 'Birk Homme',
    image: '/placeholder-category.jpg',
    link: '/men',
    accent: 'from-blue-600 to-indigo-800'
  },
  {
    id: 'birk-femme',
    title: 'Birk Femme',
    image: '/placeholder-category.jpg',
    link: '/women',
    accent: 'from-purple-600 to-pink-700'
  },
  {
    id: 'birk-enfant',
    title: 'Birk Enfant',
    image: '/placeholder-category.jpg',
    link: '/kids',
    accent: 'from-emerald-500 to-teal-700'
  },
  {
    id: 'basket-sport',
    title: 'Basket Sport',
    image: '/placeholder-category.jpg',
    link: '/categories/basket-sport',
    accent: 'from-red-500 to-red-700'
  },
  {
    id: 'chaussures-classique',
    title: 'Chaussures Classique',
    image: '/placeholder-category.jpg',
    link: '/categories/chaussures-classique',
    accent: 'from-amber-500 to-orange-700'
  },
  {
    id: 'mules',
    title: 'Mules',
    image: '/placeholder-category.jpg',
    link: '/categories/mules',
    accent: 'from-rose-500 to-pink-700'
  }
];

const CategoryCard = ({ category, index }) => {
  const cardVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.8,
      y: 20
    },
    visible: { 
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        delay: index * 0.1
      }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{ scale: 1.03 }}
      className="relative w-full aspect-[3/4]"
    >
      <Link to={category.link} className="block w-full h-full">
        <div className={`relative w-full h-full overflow-hidden rounded-xl bg-gradient-to-br ${category.accent} shadow-lg`}>
          {/* Overlay gradients for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent" />
          
          {/* Animated background pattern */}
          <motion.div 
            className="absolute inset-0 opacity-30"
            initial={{ backgroundPosition: '0% 0%' }}
            animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
            transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
            style={{
              backgroundImage: 'radial-gradient(circle at center, white 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />

          {/* Category title */}
          <div className="absolute inset-x-0 bottom-0 p-4">
            <motion.h3 
              className="text-xl font-bold text-white text-center tracking-wider"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.2 }}
            >
              {category.title}
            </motion.h3>
          </div>

          {/* Hover effect overlay */}
          <motion.div
            className="absolute inset-0 bg-white/10 opacity-0 transition-opacity duration-300"
            whileHover={{ opacity: 1 }}
          />
        </div>
      </Link>
    </motion.div>
  );
};

const Categories = () => {
  return (
    <section className="w-full bg-gray-50 dark:bg-slate-900/90 transition-colors duration-300 py-4 px-4">
      {/* Titre supprimé pour éviter les doublons */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {mockCategories.map((category, index) => (
            <CategoryCard
              key={category.id}
              category={category}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
export default Categories;