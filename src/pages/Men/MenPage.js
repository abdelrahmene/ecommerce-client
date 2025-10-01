import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTheme } from '../../contexts/ThemeContext';
import { useSearchParams } from 'react-router-dom';

import { useMenCategories } from './hooks/useMenCategories';
import { useMenCollections } from './hooks/useMenCollections';

import MenHeroSection from './components/MenHeroSection';
import CategoryFilters from './components/CategoryFilters';
import FilterPanel from './components/FilterPanel';
import SubCategoryCard from './components/SubCategoryCard';
import CollectionGrid from './components/CollectionGrid';

const MenPage = () => {
  const { theme } = useTheme();
  const [searchParams] = useSearchParams();
  const subcategoryFromUrl = searchParams.get('subcategory');
  
  const [activeSubCategory, setActiveSubCategory] = useState('all');
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  const { 
    categories, 
    hommeCategory,
    menSubCategories, 
    loading: categoriesLoading 
  } = useMenCategories();
  
  const { 
    filteredCollections, 
    filteredProducts, 
    loading: collectionsLoading,
    error
  } = useMenCollections(hommeCategory, categories, activeSubCategory);

  useEffect(() => {
    if (subcategoryFromUrl && menSubCategories.length > 0) {
      const matchingCategory = menSubCategories.find(cat => cat.slug === subcategoryFromUrl);
      if (matchingCategory) {
        setActiveSubCategory(matchingCategory.id);
      }
    }
  }, [subcategoryFromUrl, menSubCategories]);
  
  const isLoading = categoriesLoading || collectionsLoading;

  // Sous-catégories réelles (sauf 'all')
  const realSubCategories = menSubCategories.filter(cat => cat.id !== 'all');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900/90 transition-colors duration-300">
      <Helmet>
        <title>Collection Homme | Birk & Shoes</title>
        <meta name="description" content="Découvrez notre collection homme" />
      </Helmet>
      
      <MenHeroSection theme={theme} />
      
      <CategoryFilters 
        categories={menSubCategories}
        activeCategory={activeSubCategory}
        setActiveCategory={setActiveSubCategory}
        filtersOpen={filtersOpen}
        setFiltersOpen={setFiltersOpen}
        title="Nos modèles pour homme"
      />
      
      <FilterPanel 
        isOpen={filtersOpen} 
        onClose={() => setFiltersOpen(false)} 
      />
      
      <div className="container mx-auto px-4 py-12">
        {activeSubCategory === 'all' && realSubCategories.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Nos catégories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {realSubCategories.map((subCat, index) => (
                <SubCategoryCard
                  key={subCat.id}
                  subCategory={subCat}
                  index={index}
                  onClick={() => setActiveSubCategory(subCat.id)}
                />
              ))}
            </div>
          </div>
        ) : (
          // Afficher collections de la sous-catégorie sélectionnée
          <CollectionGrid 
            collections={filteredCollections} 
            loading={isLoading} 
            error={error} 
          />
        )}
      </div>
    </div>
  );
};

export default MenPage;
