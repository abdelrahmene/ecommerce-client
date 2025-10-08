import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../../../config/api';

const CategoryCard = ({ category, index, layout, animation }) => {
  const getAnimationVariants = () => {
    if (!animation?.enabled) return {};

    const baseVariants = {
      hidden: { opacity: 0 },
      visible: { opacity: 1 }
    };

    switch (animation.type) {
      case 'slide':
        return {
          hidden: { opacity: 0, y: 30 },
          visible: { 
            opacity: 1, 
            y: 0,
            transition: {
              duration: animation.duration / 1000 || 0.6,
              delay: animation.stagger ? index * (animation.delay / 1000 || 0.15) : 0
            }
          }
        };
      case 'zoom':
        return {
          hidden: { opacity: 0, scale: 0.8 },
          visible: { 
            opacity: 1, 
            scale: 1,
            transition: {
              duration: animation.duration / 1000 || 0.6,
              delay: animation.stagger ? index * (animation.delay / 1000 || 0.15) : 0
            }
          }
        };
      case 'bounce':
        return {
          hidden: { opacity: 0, y: -30 },
          visible: { 
            opacity: 1, 
            y: 0,
            transition: {
              type: 'spring',
              bounce: 0.4,
              duration: animation.duration / 1000 || 0.6,
              delay: animation.stagger ? index * (animation.delay / 1000 || 0.15) : 0
            }
          }
        };
      default:
        return {
          hidden: { opacity: 0 },
          visible: { 
            opacity: 1,
            transition: {
              duration: animation.duration / 1000 || 0.6,
              delay: animation.stagger ? index * (animation.delay / 1000 || 0.15) : 0
            }
          }
        };
    }
  };

  const variants = getAnimationVariants();

  return (
    <motion.div
      variants={variants}
      initial={animation?.enabled ? "hidden" : "visible"}
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{ scale: 1.05, y: -10 }}
      className="relative w-full category-card-container"
    >
      <Link to={category.link} className="block w-full h-full group">
        <div 
          className="relative w-full h-full overflow-hidden shadow-lg transition-all duration-500 hover:shadow-2xl"
          style={{
            backgroundColor: category.style?.backgroundColor || '#3b82f6',
            borderRadius: `${category.style?.borderRadius || 12}px`
          }}
        >
          {/* Image de fond */}
          {category.image && (
            <>
              <img
                src={getImageUrl(category.image)}
                alt={category.name || category.title}
                className="absolute inset-0 w-full h-full transition-transform duration-300 group-hover:scale-110"
                style={{
                  objectFit: category.style?.imageFit || 'cover',
                  objectPosition: category.style?.imagePosition || 'center center',
                  opacity: (category.style?.imageOpacity || 80) / 100
                }}
                onError={(e) => {
                  console.log('❌ [CATEGORIES] Image error:', category.image)
                  e.target.style.display = 'none';
                }}
              />
              
              {/* Overlay gradient */}
              <div 
                className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"
              />
            </>
          )}

          {/* Animated background pattern si pas d'image */}
          {!category.image && (
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
          )}

          {/* Content */}
          <div className="absolute inset-0 p-4 flex flex-col justify-end items-start">
            <motion.h3 
              className="text-xl md:text-2xl lg:text-3xl font-bold tracking-wide drop-shadow-lg"
              style={{ 
                color: category.style?.textColor || '#ffffff'
              }}
            >
              {category.name || category.title}
            </motion.h3>
            
            {category.description && (
              <motion.p 
                className="text-sm md:text-base mt-2 opacity-90 drop-shadow-md"
                style={{ 
                  color: category.style?.textColor || '#ffffff'
                }}
              >
                {category.description}
              </motion.p>
            )}

            {/* Arrow indicator */}
            <motion.div
              className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={{ x: -10 }}
              whileHover={{ x: 0 }}
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.div>
          </div>

          {/* Shine effect on hover */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)',
              opacity: 0
            }}
            whileHover={{ opacity: 1 }}
            animate={{ x: ['-200%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          />
        </div>
      </Link>
      
      <style jsx>{`
        .category-card-container {
          aspect-ratio: 1 / 1;
          min-height: 200px;
        }

        @media (min-width: 768px) {
          .category-card-container {
            aspect-ratio: 4 / 3;
            min-height: 250px;
          }
        }

        @media (min-width: 1024px) {
          .category-card-container {
            aspect-ratio: 3 / 4;
            min-height: 300px;
          }
        }
      `}</style>
    </motion.div>
  );
};

const Categories = ({ data }) => {
  // Extraction des données - UNIQUEMENT depuis l'API
  const sectionContent = data?.content || {};
  const sectionCategories = sectionContent.categories || [];
  const layout = sectionContent.layout || { type: 'grid', columns: 3, gap: 24, mobileColumns: 2 };
  const style = sectionContent.style || {};
  const animation = sectionContent.animation || { enabled: true };
  
  // Utiliser uniquement les catégories de l'admin
  const categoriesToShow = sectionCategories && sectionCategories.length > 0 
    ? sectionCategories.filter(cat => cat.isActive !== false).sort((a, b) => (a.order || 0) - (b.order || 0))
    : [];

  // Ne rien afficher si pas de catégories
  if (categoriesToShow.length === 0) {
    return null;
  }

  return (
    <section 
      className="w-full transition-colors duration-300"
      style={{ 
        backgroundColor: style.backgroundColor || '#f8fafc',
        paddingTop: `${style.padding?.top || 64}px`,
        paddingBottom: `${style.padding?.bottom || 64}px`,
        paddingLeft: `${style.padding?.left || 16}px`,
        paddingRight: `${style.padding?.right || 16}px`
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Grille de catégories */}
        <motion.div
          className="categories-grid"
          style={{
            display: 'grid',
            gap: `${layout.gap || 16}px`
          }}
          variants={animation?.enabled ? {
            visible: {
              transition: {
                staggerChildren: animation.stagger ? (animation.delay / 1000 || 0.15) : 0
              }
            }
          } : {}}
          initial={animation?.enabled ? "hidden" : "visible"}
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <style jsx>{`
            .categories-grid {
              grid-template-columns: repeat(${layout.mobileColumns || 2}, 1fr);
            }
            
            @media (min-width: 768px) {
              .categories-grid {
                grid-template-columns: repeat(${Math.min(layout.columns || 3, 2)}, 1fr);
              }
            }
            
            @media (min-width: 1024px) {
              .categories-grid {
                grid-template-columns: repeat(${layout.columns || 3}, 1fr);
              }
            }
          `}</style>
          
          {categoriesToShow.map((category, index) => (
            <CategoryCard
              key={category.id}
              category={category}
              index={index}
              layout={layout}
              animation={animation}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Categories;
