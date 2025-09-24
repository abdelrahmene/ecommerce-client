import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

// Composant ProductCard avec un design moderne et élégant
const ProductCard = ({ product, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [cardRef, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  return (
    <Link to={`/product/${product.id}`} className="block">
      <motion.div
        ref={cardRef}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.6,
              delay: index * 0.2,
              ease: [0.16, 1, 0.3, 1]
            }
          }
        }}
        className="group relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container avec overlay et animations */}
        <div className="aspect-[3/4] overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
          <div className="relative h-full w-full">
            <motion.img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover object-center"
              animate={{
                scale: isHovered ? 1.05 : 1
              }}
              transition={{ duration: 0.4 }}
            />
            
            {/* Overlay avec dégradé */}
            <motion.div
              className={`absolute inset-0 bg-gradient-to-t ${product.accent} opacity-0 group-hover:opacity-30 transition-opacity duration-300`}
            />

            {/* Badges New et Bestseller */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isNew && (
                <span className="bg-blue-600 text-white px-3 py-1 text-xs font-medium rounded-full shadow-lg">
                  Nouveau
                </span>
              )}
              {product.isBestseller && (
                <span className="bg-amber-500 text-white px-3 py-1 text-xs font-medium rounded-full shadow-lg">
                  Best-seller
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Informations produit avec animations */}
        <div className="mt-4 space-y-2">
          <motion.h3
            className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
            animate={{ x: isHovered ? 10 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {product.name}
          </motion.h3>

          <div className="flex items-center justify-between">
            <motion.p 
              className="text-lg font-semibold text-gray-900 dark:text-white"
              animate={{ x: isHovered ? 10 : 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {product.price ? `${product.price.toFixed(2)} €` : 'Prix sur demande'}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                <span className="text-sm font-medium">Voir</span>
                <ArrowRight size={16} />
              </div>
            </motion.div>
          </div>

          {/* Couleurs disponibles */}
          <motion.div 
            className="flex items-center gap-1"
            animate={{ x: isHovered ? 10 : 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            {product.colors && product.colors.map((color, i) => (
              <span 
                key={i}
                className="text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full"
              >
                {color}
              </span>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </Link>
  );
};

export default ProductCard;