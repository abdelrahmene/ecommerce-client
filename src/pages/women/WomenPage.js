import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTheme } from '../../contexts/ThemeContext';
import { useSearchParams } from 'react-router-dom';

import { useWomenCategories } from './hooks/useWomenCategories';
import { useWomenCollections } from './hooks/useWomenCollections';

import WomenHeroSection from './components/WomenHeroSection';
import CategoryFilters from '../Men/components/CategoryFilters';
import FilterPanel from '../Men/components/FilterPanel';
import SubCategoryCard from './components/SubCategoryCard';
import CollectionGrid from '../Men/components/CollectionGrid';

const WomenPage = () => {
  const { theme } = useTheme();
  const [searchParams] = useSearchParams();
  const subcategoryFromUrl = searchParams.get('subcategory');
  
  const [activeSubCategory, setActiveSubCategory] = useState('all');
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  const { 
    categories, 
    femmeCategory,
    womenSubCategories, 
    loading: categoriesLoading 
  } = useWomenCategories();
  
  const { 
    filteredCollections, 
    filteredProducts, 
    loading: collectionsLoading,
    error
  } = useWomenCollections(femmeCategory, categories, activeSubCategory);

  useEffect(() => {
    if (subcategoryFromUrl && womenSubCategories.length > 0) {
      const matchingCategory = womenSubCategories.find(cat => cat.slug === subcategoryFromUrl);
      if (matchingCategory) {
        setActiveSubCategory(matchingCategory.id);
      }
    }
  }, [subcategoryFromUrl, womenSubCategories]);
  
  const isLoading = categoriesLoading || collectionsLoading;
  const realSubCategories = womenSubCategories.filter(cat => cat.id !== 'all');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900/90 transition-colors duration-300">
      <Helmet>
        <title>Collection Femme | Birk & Shoes</title>
        <meta name="description" content="Découvrez notre collection femme" />
      </Helmet>
      
      <WomenHeroSection theme={theme} />
      
      <CategoryFilters 
        categories={womenSubCategories}
        activeCategory={activeSubCategory}
        setActiveCategory={setActiveSubCategory}
        filtersOpen={filtersOpen}
        setFiltersOpen={setFiltersOpen}
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
                  accentColor="pink"
                />
              ))}
            </div>
          </div>
        ) : (
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

export default WomenPage;
