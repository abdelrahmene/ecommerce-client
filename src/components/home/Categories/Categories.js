import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../../../config/api';

const CategoryCard = ({ category, index, layout, animation }) => {
  const getAnimationVariants = () => {
    if (!animation?.enabled) return {};

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
      className="relative w-full category-card-container"
    >
      <Link to={category.link} className="block w-full h-full group">
        <motion.div 
          whileHover={{ y: -8 }}
          whileTap={{ scale: 0.98 }}
          className="relative w-full h-full overflow-hidden shadow-xl transition-all duration-500 hover:shadow-2xl"
          style={{
            backgroundColor: category.style?.backgroundColor || '#3b82f6',
            borderRadius: `${category.style?.borderRadius || 16}px`
          }}
        >
          {/* Image de fond */}
          {category.image && (
            <>
              <img
                src={getImageUrl(category.image)}
                alt={category.name || category.title}
                className="absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-110"
                style={{
                  objectFit: 'cover',
                  objectPosition: category.style?.imagePosition || 'center center'
                }}
                onError={(e) => {
                  console.log('❌ [CATEGORIES] Image error:', category.image)
                  e.target.style.display = 'none';
                }}
              />
              
              {/* Overlay gradient puissant */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80" />
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
          <div className="absolute inset-0 p-5 flex flex-col justify-end">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 
                className="text-2xl md:text-3xl font-bold tracking-tight leading-tight mb-2"
                style={{ 
                  color: '#ffffff',
                  textShadow: '0 4px 12px rgba(0,0,0,0.8)'
                }}
              >
                {category.name || category.title}
              </h3>
              
              {category.description && (
                <p 
                  className="text-sm md:text-base opacity-90 line-clamp-2 mb-3"
                  style={{ 
                    color: '#ffffff',
                    textShadow: '0 2px 8px rgba(0,0,0,0.8)'
                  }}
                >
                  {category.description}
                </p>
              )}

              {/* Arrow indicator animé */}
              <motion.div
                className="flex items-center gap-2 text-white font-medium text-sm"
                initial={{ x: 0 }}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.3 }}
              >
                <span>Explorer</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </motion.div>
            </motion.div>
          </div>

          {/* Effet brillance diagonal */}
          <motion.div
            className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: 'linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.25) 50%, transparent 70%)',
            }}
            animate={{ 
              x: ['-100%', '200%'],
            }}
            transition={{ 
              duration: 1.5,
              ease: "easeInOut"
            }}
          />

          {/* Border glow on hover */}
          <div className="absolute inset-0 rounded-[16px] border-2 border-white/0 group-hover:border-white/20 transition-all duration-300" />
        </motion.div>
      </Link>
      
      <style jsx>{`
        .category-card-container {
          aspect-ratio: 3 / 4;
          min-height: 280px;
        }

        @media (min-width: 768px) {
          .category-card-container {
            min-height: 320px;
          }
        }

        @media (min-width: 1024px) {
          .category-card-container {
            min-height: 380px;
          }
        }
      `}</style>
    </motion.div>
  );
};

const Categories = ({ data }) => {
  const sectionContent = data?.content || {};
  const sectionCategories = sectionContent.categories || [];
  const layout = sectionContent.layout || { type: 'grid', columns: 3, gap: 16, mobileColumns: 2 };
  const style = sectionContent.style || {};
  const animation = sectionContent.animation || { enabled: true };
  
  const categoriesToShow = sectionCategories && sectionCategories.length > 0 
    ? sectionCategories.filter(cat => cat.isActive !== false).sort((a, b) => (a.order || 0) - (b.order || 0))
    : [];

  if (categoriesToShow.length === 0) {
    return null;
  }

  return (
    <section 
      className="w-full transition-colors duration-300"
      style={{ 
        backgroundColor: style.backgroundColor || '#f8fafc',
        paddingTop: `${style.padding?.top || 48}px`,
        paddingBottom: `${style.padding?.bottom || 48}px`
      }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          className="categories-grid"
          style={{
            display: 'grid',
            gap: `${layout.gap || 16}px`
          }}
          variants={animation?.enabled ? {
            visible: {
              transition: {
                staggerChildren: animation.stagger ? (animation.delay / 1000 || 0.1) : 0
              }
            }
          } : {}}
          initial={animation?.enabled ? "hidden" : "visible"}
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <style jsx>{`
            .categories-grid {
              grid-template-columns: repeat(2, 1fr);
            }
            
            @media (min-width: 768px) {
              .categories-grid {
                grid-template-columns: repeat(2, 1fr);
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
