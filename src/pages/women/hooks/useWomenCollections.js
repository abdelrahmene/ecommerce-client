import { useState, useEffect } from 'react';
import { useCollections } from '../../../hooks/useCollections';

export const useWomenCollections = (femmeCategory, categories, activeSubCategory) => {
  const [filteredCollections, setFilteredCollections] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { data, loading, error } = useCollections();
  
  // Filtrer les collections pour n'afficher que celles liées aux catégories femmes
  useEffect(() => {
    if (!loading && data && categories.length > 0 && femmeCategory) {
      // Trouver toutes les sous-catégories de Femmes
      const subcategories = categories.filter(cat => 
        cat.parentId === femmeCategory.id
      );
      
      // Ajouter manuellement Birk femmes si aucune sous-catégorie n'est trouvée
      if (subcategories.length === 0) {
        const birkFemmes = categories.find(cat => 
          cat.name.toLowerCase().includes('birk') && 
          cat.name.toLowerCase().includes('femme')
        );
        
        if (birkFemmes) {
          subcategories.push(birkFemmes);
        }
      }
      
      // Extraire les IDs de la catégorie Femmes et ses sous-catégories
      const femmeAndSubCategoryIds = [
        femmeCategory.id,
        ...subcategories.map(sub => sub.id)
      ];
      
      console.log('IDs des catégories Femmes + sous-catégories:', femmeAndSubCategoryIds);
      
      let femmeCollections = [];
      
      // Si on est sur "Tous les produits", on affiche toutes les collections de la catégorie Femmes et ses sous-catégories
      if (activeSubCategory === 'all') {
        femmeCollections = data.collections.filter(collection => 
          collection.categoryId && 
          femmeAndSubCategoryIds.includes(collection.categoryId)
        );
      } 
      // Si on est sur "bestsellers" ou "new", on garde toutes les collections mais on filtrera les produits après
      else if (activeSubCategory === 'bestsellers' || activeSubCategory === 'new') {
        femmeCollections = data.collections.filter(collection => 
          collection.categoryId && 
          femmeAndSubCategoryIds.includes(collection.categoryId)
        );
      }
      // Si on est sur une sous-catégorie spécifique, on filtre par cette sous-catégorie
      else {
        femmeCollections = data.collections.filter(collection => 
          collection.categoryId === activeSubCategory
        );
      }
      
      console.log('Collections pour femmes filtrées:', femmeCollections);
      setFilteredCollections(femmeCollections);
      
      // Filtrer les produits qui appartiennent à ces collections
      const femmeCollectionIds = femmeCollections.map(c => c.id);
      let productsInFemmeCollections = data.products.filter(product => 
        product.collectionId && 
        femmeCollectionIds.includes(product.collectionId)
      );
      
      // Appliquer des filtres supplémentaires
      if (activeSubCategory === 'bestsellers') {
        productsInFemmeCollections = productsInFemmeCollections.filter(p => p.isBestseller);
      } else if (activeSubCategory === 'new') {
        productsInFemmeCollections = productsInFemmeCollections.filter(p => p.isNew);
      }
      
      setFilteredProducts(productsInFemmeCollections);
    }
  }, [activeSubCategory, data, loading, categories, femmeCategory]);

  return {
    filteredCollections,
    filteredProducts,
    loading,
    error
  };
};