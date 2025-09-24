import { useState, useEffect } from 'react';
import { useCollections } from '../../../hooks/useCollections';

export const useMenCollections = (hommeCategory, categories, activeSubCategory) => {
  const [filteredCollections, setFilteredCollections] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { data, loading, error } = useCollections();
  
  // Filtrer les collections pour n'afficher que celles liées aux catégories homme
  useEffect(() => {
    if (!loading && data && categories.length > 0 && hommeCategory) {
      // Trouver toutes les sous-catégories de Homme
      const subcategories = categories.filter(cat => 
        cat.parentId === hommeCategory.id
      );
      
      // Ajouter manuellement Birk hommes si aucune sous-catégorie n'est trouvée
      if (subcategories.length === 0) {
        const birkHommes = categories.find(cat => 
          cat.name.toLowerCase().includes('birk') && 
          cat.name.toLowerCase().includes('homme')
        );
        
        if (birkHommes) {
          subcategories.push(birkHommes);
        }
      }
      
      // Extraire les IDs de la catégorie Homme et ses sous-catégories
      const hommeAndSubCategoryIds = [
        hommeCategory.id,
        ...subcategories.map(sub => sub.id)
      ];
      
      console.log('IDs des catégories Homme + sous-catégories:', hommeAndSubCategoryIds);
      
      let hommeCollections = [];
      
      // Si on est sur "Tous les produits", on affiche toutes les collections de la catégorie Homme et ses sous-catégories
      if (activeSubCategory === 'all') {
        hommeCollections = data.collections.filter(collection => 
          collection.categoryId && 
          hommeAndSubCategoryIds.includes(collection.categoryId)
        );
      } 
      // Si on est sur "bestsellers" ou "new", on garde toutes les collections mais on filtrera les produits après
      else if (activeSubCategory === 'bestsellers' || activeSubCategory === 'new') {
        hommeCollections = data.collections.filter(collection => 
          collection.categoryId && 
          hommeAndSubCategoryIds.includes(collection.categoryId)
        );
      }
      // Si on est sur une sous-catégorie spécifique, on filtre par cette sous-catégorie
      else {
        hommeCollections = data.collections.filter(collection => 
          collection.categoryId === activeSubCategory
        );
      }
      
      console.log('Collections pour hommes filtrées:', hommeCollections);
      setFilteredCollections(hommeCollections);
      
      // Filtrer les produits qui appartiennent à ces collections
      const hommeCollectionIds = hommeCollections.map(c => c.id);
      let productsInHommeCollections = data.products.filter(product => 
        product.collectionId && 
        hommeCollectionIds.includes(product.collectionId)
      );
      
      // Appliquer des filtres supplémentaires
      if (activeSubCategory === 'bestsellers') {
        productsInHommeCollections = productsInHommeCollections.filter(p => p.isBestseller);
      } else if (activeSubCategory === 'new') {
        productsInHommeCollections = productsInHommeCollections.filter(p => p.isNew);
      }
      
      setFilteredProducts(productsInHommeCollections);
    }
  }, [activeSubCategory, data, loading, categories, hommeCategory]);

  return {
    filteredCollections,
    filteredProducts,
    loading,
    error
  };
};