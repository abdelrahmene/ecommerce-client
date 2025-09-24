import { useState, useEffect } from 'react';
import { apiClient } from '../../../config/apiClient';

export const useWomenCategories = () => {
  const [categories, setCategories] = useState([]);
  const [womenSubCategories, setWomenSubCategories] = useState([
    { id: 'all', name: 'Tous les produits' }
  ]);
  const [femmeCategory, setFemmeCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        console.log('Tentative de récupération des catégories...');
        const categoriesResponse = await apiClient.get('/api/categories');
        console.log('Réponse brute de l\'API catégories:', categoriesResponse);
        
        const allCategories = categoriesResponse.categories || [];
        console.log('Toutes les catégories extraites:', allCategories);
        
        // Afficher les IDs de toutes les catégories pour le débogage
        allCategories.forEach(cat => {
          console.log(`Catégorie: ${cat.name}, ID: ${cat.id}, ParentID: ${cat.parentId || 'None'}`);
        });
        
        // Trouver la catégorie Femmes
        const femmeCat = allCategories.find(cat => 
          cat.name.toLowerCase() === 'femmes' || 
          (cat.name.toLowerCase().includes('femme') && !cat.parentId)
        );
        
        console.log('Catégorie Femmes trouvée:', femmeCat);
        
        setCategories(allCategories);
        
        if (femmeCat) {
          setFemmeCategory(femmeCat);
          
          // Vérifier les types de données pour débogage
          console.log('Type de femmeCategory.id:', typeof femmeCat.id);
          
          // Trouver les sous-catégories basées sur parentId avec un log détaillé
          const subcategories = allCategories.filter(cat => {
            const isSubCategory = cat.parentId === femmeCat.id;
            console.log(`Vérification sous-catégorie: ${cat.name}, parentId: ${cat.parentId}, femmeId: ${femmeCat.id}, isMatch: ${isSubCategory}`);
            return isSubCategory;
          });
          
          console.log('Sous-catégories trouvées:', subcategories);
          
          // Créer une liste pour le filtre avec "Tous les produits" en premier
          const subcategoriesForFilter = [
            { id: 'all', name: 'Tous les produits' }
          ];

          // Ajouter toutes les sous-catégories réelles de Femmes
          if (subcategories && subcategories.length > 0) {
            console.log('Ajout des sous-catégories aux filtres');
            subcategories.forEach(cat => {
              subcategoriesForFilter.push({
                id: cat.id,
                name: cat.name,
                slug: cat.slug
              });
            });
          } else {
            console.log('Aucune sous-catégorie trouvée pour Femmes, ajout de "Birk femmes" manuellement');
            // Si aucune sous-catégorie n'est trouvée, vérifier si "Birk femmes" existe quand même
            const birkFemmes = allCategories.find(cat => 
              cat.name.toLowerCase().includes('birk') && 
              cat.name.toLowerCase().includes('femme')
            );
            
            if (birkFemmes) {
              console.log('Catégorie "Birk femmes" trouvée manuellement:', birkFemmes);
              subcategoriesForFilter.push({
                id: birkFemmes.id,
                name: birkFemmes.name,
                slug: birkFemmes.slug
              });
            }
          }
          
          // Ajouter aussi Best-sellers et Nouveautés à la fin (ces filtres sont spéciaux)
          subcategoriesForFilter.push(
            { id: 'bestsellers', name: 'Best-sellers' },
            { id: 'new', name: 'Nouveautés' }
          );
          
          console.log('Liste finale des sous-catégories pour filtres:', subcategoriesForFilter);
          setWomenSubCategories(subcategoriesForFilter);
        } else {
          console.warn('Catégorie Femmes non trouvée');
          // Fallback avec juste les options de base
          setWomenSubCategories([
            { id: 'all', name: 'Tous les produits' },
            { id: 'bestsellers', name: 'Best-sellers' },
            { id: 'new', name: 'Nouveautés' }
          ]);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('❌ Erreur lors de la récupération des catégories:', err);
        setError(err.message || 'Erreur lors du chargement des catégories');
        
        // Fallback avec juste les options de base
        setWomenSubCategories([
          { id: 'all', name: 'Tous les produits' },
          { id: 'bestsellers', name: 'Best-sellers' },
          { id: 'new', name: 'Nouveautés' }
        ]);
        
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);

  return { 
    categories,
    femmeCategory,
    womenSubCategories, 
    loading, 
    error
  };
};