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
  const aspectRatio = layout?.type === 'grid' ? 'aspect-[3/4]' : 'aspect-[4/3]';

  return (
    <motion.div
      variants={variants}
      initial={animation?.enabled ? "hidden" : "visible"}
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{ scale: 1.03 }}
      className={`relative w-full ${aspectRatio}`}
    >
      <Link to={category.link} className="block w-full h-full">
        <div 
          className="relative w-full h-full overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl"
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
                className="absolute inset-0 w-full h-full transition-transform duration-300 hover:scale-105"
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
              
              {/* Overlay */}
              <div 
                className="absolute inset-0"
                style={{
                  backgroundColor: category.style?.overlayColor || '#000000',
                  opacity: (category.style?.overlayOpacity || 40) / 100
                }}
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
          <div 
            className="absolute inset-0 p-4 flex flex-col justify-center items-center"
            style={{ textAlign: category.style?.textAlign || 'center' }}
          >
            <motion.h3 
              className="text-lg md:text-xl font-bold tracking-wider"
              style={{ 
                color: category.style?.textColor || '#ffffff' // Toujours blanc par défaut
              }}
            >
              {category.name || category.title}
            </motion.h3>
            
            {category.description && (
              <motion.p 
                className="text-sm mt-2 opacity-90"
                style={{ 
                  color: category.style?.textColor || '#ffffff' // Toujours blanc par défaut
                }}
              >
                {category.description}
              </motion.p>
            )}
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

const Categories = ({ data }) => {
  console.log('🔍 [CLIENT-CATEGORIES] Données section complète:', data);
  console.log('🔍 [CLIENT-CATEGORIES] Type de données:', typeof data);

  // Extraction des données - UNIQUEMENT depuis l'API
  const sectionContent = data?.content || {};
  const sectionTitle = sectionContent.title || 'Nos Catégories';
  const sectionSubtitle = sectionContent.subtitle || '';
  const sectionCategories = sectionContent.categories || [];
  const layout = sectionContent.layout || { type: 'grid', columns: 3, gap: 24, mobileColumns: 1 };
  const style = sectionContent.style || {};
  const animation = sectionContent.animation || { enabled: true };
  
  console.log('📊 [CLIENT-CATEGORIES] Titre:', sectionTitle);
  console.log('📊 [CLIENT-CATEGORIES] Categories array:', sectionCategories);
  console.log('📊 [CLIENT-CATEGORIES] Categories count:', sectionCategories.length);
  console.log('📊 [CLIENT-CATEGORIES] Raw categories data:');
  console.table(sectionCategories);
  console.log('📊 [CLIENT-CATEGORIES] Layout:', layout);
  
  // Debug détaillé des catégories avec styles
  if (sectionCategories.length > 0) {
    sectionCategories.forEach((cat, index) => {
      console.log(`📂 [CAT-${index}] ID: ${cat.id}, Name: ${cat.name}, Image: ${cat.image}, Active: ${cat.isActive}`);
      console.log(`🎨 [STYLE-${index}] TextColor: ${cat.style?.textColor}, BackgroundColor: ${cat.style?.backgroundColor}`);
      console.log(`🎭 [FULL-STYLE-${index}]:`, cat.style);
    });
  }
  
  // Utiliser uniquement les catégories de l'admin (pas de fallback)
  const categoriesToShow = sectionCategories && sectionCategories.length > 0 
    ? sectionCategories.filter(cat => cat.isActive !== false).sort((a, b) => (a.order || 0) - (b.order || 0))
    : []; // Pas de fallback sur mockCategories

  console.log('✅ [CLIENT-CATEGORIES] Categories à afficher:', categoriesToShow.length);

  return (
    <section 
      className="w-full transition-colors duration-300"
      style={{ 
        backgroundColor: style.backgroundColor || '#f8fafc',
        paddingTop: `${style.padding?.top || 64}px`,
        paddingBottom: `${style.padding?.bottom || 64}px`,
        paddingLeft: `${style.padding?.left || 32}px`,
        paddingRight: `${style.padding?.right || 32}px`
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* En-tête de section */}
        <div className="text-center mb-8">
          <h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: style.titleColor || '#111827' }}
          >
            {sectionTitle}
          </h2>
          
          {sectionSubtitle && (
            <h3 
              className="text-xl md:text-2xl font-medium mb-3"
              style={{ color: style.subtitleColor || '#6b7280' }}
            >
              {sectionSubtitle}
            </h3>
          )}
          
          {sectionContent.description && (
            <p 
              className="text-base max-w-2xl mx-auto"
              style={{ color: style.textColor || '#1f2937' }}
            >
              {sectionContent.description}
            </p>
          )}
        </div>

        {/* Grille de catégories */}
        {categoriesToShow.length > 0 ? (
          <motion.div
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${layout.mobileColumns || 1}, 1fr)`,
              gap: `${layout.gap || 24}px`
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
              @media (min-width: 768px) {
                .grid {
                  grid-template-columns: repeat(${Math.min(layout.columns || 3, 2)}, 1fr) !important;
                }
              }
              @media (min-width: 1024px) {
                .grid {
                  grid-template-columns: repeat(${layout.columns || 3}, 1fr) !important;
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
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg font-medium">Configuration des catégories en cours...</p>
            <p className="text-gray-400 text-sm">Les catégories apparaîtront dès qu'elles seront configurées dans l'admin</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Categories;