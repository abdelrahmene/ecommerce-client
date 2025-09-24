import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTheme } from '../../contexts/ThemeContext';

// Custom hooks
import { useMenCategories } from './hooks/useMenCategories';
import { useMenCollections } from './hooks/useMenCollections';

// Components
import HeroSection from './components/HeroSection';
import CategoryFilters from './components/CategoryFilters';
import FilterPanel from './components/FilterPanel';
import CollectionGrid from './components/CollectionGrid';

/**
 * Page Homme qui affiche les collections et produits pour hommes
 * Elle utilise une architecture modulaire avec des composants séparés pour chaque partie
 */
const MenPage = () => {
  const { theme } = useTheme();
  const [activeSubCategory, setActiveSubCategory] = useState('all');
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  // Récupérer les catégories pour homme
  const { 
    categories, 
    hommeCategory,
    menSubCategories, 
    loading: categoriesLoading 
  } = useMenCategories();
  
  // Récupérer les collections et produits filtrés
  const { 
    filteredCollections, 
    filteredProducts, 
    loading: collectionsLoading,
    error
  } = useMenCollections(hommeCategory, categories, activeSubCategory);

  // Log pour debug (uniquement dans la console)
  useEffect(() => {
    console.log('MenSubCategories actuelles:', menSubCategories);
  }, [menSubCategories]);
  
  // État de chargement global
  const isLoading = categoriesLoading || collectionsLoading;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900/90 transition-colors duration-300">
      <Helmet>
        <title>Collection Homme | Birk & Shoes</title>
        <meta name="description" content="Découvrez notre collection de chaussures homme Birkenstock. Sandales, sabots et chaussures au design iconique et au confort inégalé." />
      </Helmet>
      
      {/* Hero Section avec Parallax et Animations */}
      <HeroSection theme={theme} />
      
      {/* Filtres de catégories */}
      <CategoryFilters 
        categories={menSubCategories}
        activeCategory={activeSubCategory}
        setActiveCategory={setActiveSubCategory}
        filtersOpen={filtersOpen}
        setFiltersOpen={setFiltersOpen}
      />
      
      {/* Panneau de filtres avancés */}
      <FilterPanel 
        isOpen={filtersOpen} 
        onClose={() => setFiltersOpen(false)} 
      />
      
      {/* Affichage des Collections Homme */}
      <div className="container mx-auto px-4 py-12">
        <CollectionGrid 
          collections={filteredCollections} 
          loading={isLoading} 
          error={error} 
        />
      </div>
    </div>
  );
};

export default MenPage;