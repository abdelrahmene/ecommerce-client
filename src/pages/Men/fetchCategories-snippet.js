// Script pour mettre à jour fetchCategories
const fetchCategories = async () => {
  try {
    const categoriesResponse = await apiClient.get('/api/categories');
    console.log('📋 Catégories récupérées:', categoriesResponse);
    
    // Stocker toutes les catégories
    const allCategories = categoriesResponse.categories || [];
    setCategories(allCategories);
    
    // Trouver la catégorie Homme
    const hommeCategory = allCategories.find(cat => 
      cat.name.toLowerCase() === 'homme' || 
      cat.name.toLowerCase().includes('homme')
    );
    
    if (hommeCategory) {
      console.log('Catégorie Homme trouvée:', hommeCategory);
      
      // Trouver toutes les sous-catégories de Homme
      const subcategories = allCategories.filter(cat => 
        cat.parentId === hommeCategory.id
      );
      
      console.log('Sous-catégories de Homme:', subcategories);
      
      // Créer une liste pour le filtre avec "Tous les produits" en premier
      const subcategoriesForFilter = [
        { id: 'all', name: 'Tous les produits' },
        ...subcategories.map(cat => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug
        }))
      ];
      
      // Ajouter aussi Best-sellers et Nouveautés à la fin
      subcategoriesForFilter.push(
        { id: 'bestsellers', name: 'Best-sellers' },
        { id: 'new', name: 'Nouveautés' }
      );
      
      setMenSubCategories(subcategoriesForFilter);
    } else {
      console.warn('Catégorie Homme non trouvée');
      // Si on ne trouve pas la catégorie Homme, utiliser des filtres par défaut
      setMenSubCategories([
        { id: 'all', name: 'Tous les produits' },
        { id: 'sandales', name: 'Sandales' },
        { id: 'sabots', name: 'Sabots' },
        { id: 'chaussures', name: 'Chaussures' },
        { id: 'bestsellers', name: 'Best-sellers' },
        { id: 'new', name: 'Nouveautés' }
      ]);
    }
  } catch (err) {
    console.error('❌ Erreur lors de la récupération des catégories:', err);
    // En cas d'erreur, utiliser des filtres par défaut
    setMenSubCategories([
      { id: 'all', name: 'Tous les produits' },
      { id: 'sandales', name: 'Sandales' },
      { id: 'sabots', name: 'Sabots' },
      { id: 'chaussures', name: 'Chaussures' },
      { id: 'bestsellers', name: 'Best-sellers' },
      { id: 'new', name: 'Nouveautés' }
    ]);
  }
};