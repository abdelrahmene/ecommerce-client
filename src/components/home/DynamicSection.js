import React from 'react';
import HeroSlider from './HeroSlider';
import Categories from './Categories';
import SectionCollection from './SectionCollection';
import TrustFeatures from './TrustFeatures';

/**
 * Composant pour rendre une section dynamique basée sur le type
 * @param {Object} section - Section à rendre
 */
export const DynamicSection = ({ section }) => {
  console.log('🎨 DynamicSection: Rendu de la section', section.type, section);
  console.log('🔍 DynamicSection: Détails complets de la section:', {
    id: section.id,
    type: section.type,
    title: section.title,
    description: section.description,
    isVisible: section.isVisible,
    order: section.order,
    content: section.content
  });

  switch (section.type) {
    case 'hero':
      // Passer les données de la section au HeroSlider
      console.log('🎯 DynamicSection: Transmission des données hero à HeroSlider:', section);
      return (
        <section className="w-full min-h-screen snap-start snap-always">
          <HeroSlider data={section} />
        </section>
      );

    case 'categories':
      return (
        <section className="w-full min-h-screen snap-start snap-always">
          <div className="h-full flex flex-col justify-center py-8 px-4">
            <div className="text-center mb-8">
              <div className="relative inline-block">
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3 drop-shadow-sm">
                  {section.title || 'Nos Catégories'}
                  <div className="absolute -bottom-2 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-sm"></div>
                </h2>
              </div>
              {section.description && (
                <p className="text-base md:text-lg text-gray-700 dark:text-slate-300 font-medium mt-4 max-w-2xl mx-auto">
                  {section.description}
                </p>
              )}
            </div>
            <Categories data={section} />
          </div>
        </section>
      );

    case 'collection':
    case 'new-products':
    case 'nouveau-produit':  // Support pour le type nouveau-produit
      return (
        <section className="w-full min-h-screen snap-start snap-always">
          <div className="h-full flex flex-col justify-center py-8 px-4">
            <div className="text-center mb-8">
              <div className="relative inline-block">
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3 drop-shadow-sm">
                  {section.title || 'Nouveau Produit'}
                  <div className="absolute -bottom-2 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full shadow-sm"></div>
                </h2>
              </div>
              {section.subtitle && (
                <p className="text-xl md:text-2xl font-medium text-gray-600 dark:text-slate-400 mb-2">
                  {section.subtitle}
                </p>
              )}
              {section.description && (
                <p className="text-base md:text-lg text-gray-700 dark:text-slate-300 font-medium mt-4 max-w-2xl mx-auto">
                  {section.description}
                </p>
              )}
            </div>
            <SectionCollection 
              data={section}
            />
          </div>
        </section>
      );

    case 'featured_products':
      return (
        <section className="w-full min-h-screen snap-start snap-always">
          <div className="h-full flex flex-col justify-center py-8 px-4">
            <div className="text-center mb-8">
              <div className="relative inline-block">
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3 drop-shadow-sm">
                  {section.title || 'Produits en Vedette'}
                  <div className="absolute -bottom-2 left-0 right-0 h-1.5 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full shadow-sm"></div>
                </h2>
              </div>
              {section.description && (
                <p className="text-base md:text-lg text-gray-700 dark:text-slate-300 font-medium mt-4 max-w-2xl mx-auto">
                  {section.description}
                </p>
              )}
            </div>
            <SectionCollection 
              data={section}
            />
          </div>
        </section>
      );

    case 'trust_features':
    case 'advantages':
    case 'trust-features':
      return (
        <section className="w-full min-h-screen snap-start snap-always">
          <TrustFeatures />
        </section>
      );

    default:
      console.error('💥 Type de section NON PRIS EN CHARGE:', section.type);
      console.error('🔍 Section non supportée - Détails complets:', section);
      return (
        <section className="w-full min-h-screen snap-start snap-always flex items-center justify-center">
          <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <div className="text-6xl mb-4">🚧</div>
            <h3 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">
              Type de section non supporté
            </h3>
            <p className="text-red-600 dark:text-red-400 mb-4">
              Type: <code className="bg-red-100 dark:bg-red-800 px-2 py-1 rounded">{section.type}</code>
            </p>
            <p className="text-sm text-red-500 dark:text-red-400 mb-2">
              ID: {section.id}
            </p>
            <p className="text-sm text-red-500 dark:text-red-400">
              Titre: {section.title}
            </p>
          </div>
        </section>
      );
  }
};

export default DynamicSection;
