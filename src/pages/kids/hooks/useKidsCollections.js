import { useState, useEffect } from 'react';
import { useCollections } from '../../../hooks/useCollections';

export const useKidsCollections = (enfantCategory, categories, activeSubCategory) => {
  const [filteredCollections, setFilteredCollections] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { data, loading, error } = useCollections();
  
  useEffect(() => {
    if (!loading && data && categories.length > 0 && enfantCategory) {
      const subcategories = categories.filter(cat => 
        cat.parentId === enfantCategory.id
      );
      
      const enfantAndSubCategoryIds = [
        enfantCategory.id,
        ...subcategories.map(sub => sub.id)
      ];
      
      let enfantCollections = [];
      
      if (activeSubCategory === 'all') {
        enfantCollections = data.collections.filter(collection => 
          collection.categoryId && 
          enfantAndSubCategoryIds.includes(collection.categoryId)
        );
      } else if (activeSubCategory === 'bestsellers' || activeSubCategory === 'new') {
        enfantCollections = data.collections.filter(collection => 
          collection.categoryId && 
          enfantAndSubCategoryIds.includes(collection.categoryId)
        );
      } else {
        enfantCollections = data.collections.filter(collection => 
          collection.categoryId === activeSubCategory
        );
      }
      
      setFilteredCollections(enfantCollections);
      
      const enfantCollectionIds = enfantCollections.map(c => c.id);
      let productsInEnfantCollections = data.products.filter(product => 
        product.collectionId && 
        enfantCollectionIds.includes(product.collectionId)
      );
      
      if (activeSubCategory === 'bestsellers') {
        productsInEnfantCollections = productsInEnfantCollections.filter(p => p.isBestseller);
      } else if (activeSubCategory === 'new') {
        productsInEnfantCollections = productsInEnfantCollections.filter(p => p.isNew);
      }
      
      setFilteredProducts(productsInEnfantCollections);
    }
  }, [activeSubCategory, data, loading, categories, enfantCategory]);

  return {
    filteredCollections,
    filteredProducts,
    loading,
    error
  };
};
