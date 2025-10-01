import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { Package } from 'lucide-react';

import BostonHeroSection from './components/BostonHeroSection';
import BostonSubCategoryCard from './components/BostonSubCategoryCard';
import CollectionGrid from '../Men/components/CollectionGrid';

const BostonPage = () => {
  const [searchParams] = useSearchParams();
  const subcategoryFromUrl = searchParams.get('subcategory');
  
  const [bostonCategory, setBostonCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [activeSubCategory, setActiveSubCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (subcategoryFromUrl && subcategories.length > 0) {
      const matching = subcategories.find(cat => cat.slug === subcategoryFromUrl);
      if (matching) {
        setActiveSubCategory(matching.id);
      }
    }
  }, [subcategoryFromUrl, subcategories]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const categoriesRes = await fetch(`${process.env.REACT_APP_API_URL}/api/categories`);
      const categoriesData = await categoriesRes.json();
      
      const bostonCat = categoriesData.categories.find(c => c.slug === 'boston' && !c.parentId);
      
      if (bostonCat) {
        setBostonCategory(bostonCat);
        
        const bostonSubs = categoriesData.categories.filter(c => c.parentId === bostonCat.id);
        setSubcategories(bostonSubs);
        
        const collectionsRes = await fetch(`${process.env.REACT_APP_API_URL}/api/collections?include=category`);
        const collectionsData = await collectionsRes.json();
        
        const bostonCollections = collectionsData.collections.filter(col => 
          col.categoryId === bostonCat.id || 
          bostonSubs.some(sub => sub.id === col.categoryId)
        );
        
        setCollections(bostonCollections);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCollections = activeSubCategory === 'all' 
    ? collections 
    : collections.filter(col => col.categoryId === activeSubCategory);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900/90">
      <Helmet>
        <title>Collection Boston | Birk & Shoes</title>
      </Helmet>

      <BostonHeroSection />

      <div className="container mx-auto px-4 py-12">
        {activeSubCategory === 'all' && subcategories.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Nos catégories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subcategories.map((sub, index) => (
                <BostonSubCategoryCard
                  key={sub.id}
                  subCategory={sub}
                  index={index}
                  onClick={() => setActiveSubCategory(sub.id)}
                />
              ))}
            </div>
          </div>
        ) : (
          <CollectionGrid 
            collections={filteredCollections}
            loading={loading}
            error={null}
          />
        )}

        {activeSubCategory === 'all' && subcategories.length === 0 && collections.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Aucune catégorie ou collection disponible</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BostonPage;
