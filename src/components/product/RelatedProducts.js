import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

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

const RelatedProductCard = ({ product, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [cardRef, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  return (
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
            delay: index * 0.1,
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
            className={`absolute inset-0 bg-gradient-to-t ${product.accent || 'from-gray-400 to-gray-600'} opacity-0 group-hover:opacity-30 transition-opacity duration-300`}
          />
        </div>
      </div>

      {/* Informations produit avec animations */}
      <div className="mt-4 space-y-1">
        <motion.h3
          className="text-base font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
          animate={{ x: isHovered ? 5 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {product.name}
        </motion.h3>

        <motion.p 
          className="text-base font-semibold text-gray-900 dark:text-white"
          animate={{ x: isHovered ? 5 : 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {product.price.toFixed(2)} €
        </motion.p>
      </div>
    </motion.div>
  );
};

const RelatedProducts = ({ products }) => {
  const [sectionRef, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <motion.div
      ref={sectionRef}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={fadeInUp}
      className="mt-20"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Produits similaires</h2>
        <Link 
          to="/products" 
          className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
        >
          <span>Voir plus</span>
          <ArrowRight size={16} className="ml-1" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product, index) => (
          <Link to={`/product/${product.id}`} key={product.id}>
            <RelatedProductCard product={product} index={index} />
          </Link>
        ))}
      </div>
    </motion.div>
  );
};

export default RelatedProducts;