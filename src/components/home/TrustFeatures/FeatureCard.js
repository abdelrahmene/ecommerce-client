import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FeatureCard = ({ feature, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  // Animation variants
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        delay: index * 0.1,
        duration: 0.6
      }
    },
    hover: {
      y: -10,
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 10
      }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -30 },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: { 
        type: 'spring', 
        stiffness: 260, 
        damping: 20,
        delay: index * 0.1 + 0.3
      }
    },
    hover: {
      rotate: [0, -10, 10, -5, 0],
      scale: 1.1,
      transition: {
        duration: 0.5
      }
    }
  };

  const highlightVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: i => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: index * 0.1 + 0.5 + (i * 0.1)
      }
    })
  };

  const lineVariants = {
    hidden: { width: 0 },
    visible: {
      width: '40px',
      transition: {
        delay: index * 0.1 + 0.4,
        duration: 0.5
      }
    }
  };

  // Définir un dégradé de fond unique basé sur l'index
  const gradients = [
    'from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20',
    'from-purple-50 via-pink-50 to-red-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-red-900/20',
    'from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-yellow-900/20',
    'from-teal-50 via-cyan-50 to-sky-50 dark:from-teal-900/20 dark:via-cyan-900/20 dark:to-sky-900/20'
  ];
  
  const cardGradient = gradients[index % gradients.length];
  
  return (
    <motion.div
      className={`bg-gradient-to-br ${cardGradient} rounded-2xl shadow-lg hover:shadow-2xl dark:shadow-slate-700/30 overflow-hidden transition-all duration-500 relative border border-white/80 dark:border-slate-700/30 backdrop-blur-sm group`}
      variants={cardVariants}
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10%" }}
    >
      {/* Overlay design pattern - motif géométrique moderne */}
      <div 
        className="absolute inset-0 opacity-10 dark:opacity-20 pointer-events-none text-black/20 dark:text-white/20" 
        style={{ 
          backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTUgMTVMNDUgMTVMNDUgNDVMMTUgNDVMMTUgMTVaIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjxwYXRoIGQ9Ik0zMCAxNUwzMCA0NSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48cGF0aCBkPSJNMTUgMzBMNDUgMzAiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+')",
          backgroundSize: "80px 80px",
          backgroundPosition: "center"
        }}
      />
      
      {/* Effet de brillance au survol */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/40 to-white/0 dark:from-white/0 dark:via-white/10 dark:to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      
      {/* Effet de lueur */}
      <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-b from-white/40 via-white/0 to-white/0 dark:from-white/10 dark:via-white/0 dark:to-white/0 opacity-60 pointer-events-none" />
      
      {/* Cercles décoratifs */}
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-br from-purple-500/10 to-blue-500/10 dark:from-purple-500/20 dark:to-blue-500/20 blur-2xl opacity-50 pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 blur-2xl opacity-50 pointer-events-none" />
      
      <div className="p-6">
        <div className="flex items-center mb-4">
          <motion.div 
            className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-500/30 to-blue-500/30 dark:from-purple-500/40 dark:to-blue-500/40 text-purple-600 dark:text-purple-300 mr-5 relative shadow-lg border border-white/50 dark:border-white/10 backdrop-blur-sm"
            variants={iconVariants}
          >
            {/* Rendu de l'icône comme élément JSX */}
            {feature.icon}
            
            {/* Animated + symbol */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-white dark:ring-slate-800"
                  initial={{ scale: 0, rotate: 0 }}
                  animate={{
                    scale: [0, 1.2, 1],
                    rotate: [0, 180, 0],
                    boxShadow: ['0px 0px 0px rgba(124, 58, 237, 0.3)', '0px 0px 15px rgba(124, 58, 237, 0.5)', '0px 0px 8px rgba(124, 58, 237, 0.4)'],
                  }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{
                    duration: 0.5,
                    times: [0, 0.6, 1],
                    ease: "easeInOut"
                  }}
                >
                  <motion.span
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "mirror"
                    }}
                  >
                    +
                  </motion.span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
        
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors tracking-wide">
          {feature.title}
        </h3>
        
        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">
          {feature.description}
        </p>
        
        {/* Separator line with glow */}
        <motion.div className="relative h-1 mb-6 mt-2">
          <motion.div 
            className="absolute inset-0 h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full shadow-sm"
            variants={lineVariants}
          />
          <motion.div 
            className="absolute inset-0 h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-sm opacity-70"
            variants={lineVariants}
          />
        </motion.div>
        
        {/* Highlights */}
        <ul className="space-y-2 mt-4">
          {feature.highlights.map((highlight, i) => (
            <motion.li 
              key={i} 
              className="flex items-center text-gray-700 dark:text-gray-200 text-sm"
              custom={i}
              variants={highlightVariants}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 mr-2 flex-shrink-0 text-purple-600 dark:text-purple-400" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                  clipRule="evenodd" 
                />
              </svg>
              {highlight}
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default FeatureCard;