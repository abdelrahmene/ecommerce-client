import React from 'react';
import { motion } from 'framer-motion';
import useHomeSections from '../../hooks/useHomeSections';
import HeroSlider from './HeroSlider';
import Categories from './Categories';
import SectionCollection from './SectionCollection';
import LoadingSpinner from '../ui/LoadingSpinner';


/**
 * Composant qui gère l'affichage de toutes les sections de la page d'accueil
 * en fonction des données récupérées depuis Firebase
 */
const HomeSections = () => {
  const { sections, loading, error } = useHomeSections();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    console.error('Erreur lors du chargement des sections:', error);
    return null; // Ne pas afficher d'erreur à l'utilisateur
  }

  // Rendu des sections en fonction de leur type
  const renderSection = (section) => {
    // Debug: Section en cours de rendu
    // console.log('Rendering section:', section.type, section);
    
    // Wrapper commun pour toutes les sections avec snap scrolling
    const SectionWrapper = ({ children }) => (
      <div className="snap-start snap-always min-h-screen flex items-center justify-center w-full">
        <div className="w-full">
          {children}
        </div>
      </div>
    );
    
    switch (section.type) {
      case 'hero-banner':
      case 'hero':
        return (
          <SectionWrapper key={section.id}>
            <HeroSlider data={section} />
          </SectionWrapper>
        );
      
      case 'category-collection':
      case 'categories':
        return (
          <SectionWrapper key={section.id}>
            <Categories data={section} />
          </SectionWrapper>
        );
      
      case 'featured-collections':
      case 'collections':
        return (
          <SectionWrapper key={section.id}>
            <SectionCollection data={section} />
          </SectionWrapper>
        );
      
      // Pour les autres types de sections, on affiche un message de debug mais on ne les rend pas
      // Ces sections pourront être implémentées ultérieurement
      case 'advantages':
      case 'slider':
        console.log(`Section de type ${section.type} détectée mais pas encore implémentée`);
        return null;
      
      default:
        console.warn(`Type de section non pris en charge: ${section.type}`);
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {sections.map(renderSection)}
    </motion.div>
  );
};

export default HomeSections;