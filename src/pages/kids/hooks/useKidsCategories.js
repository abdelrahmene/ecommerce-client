import { useState, useEffect } from 'react';

export const useKidsCategories = () => {
  const [categories, setCategories] = useState([]);
  const [enfantCategory, setEnfantCategory] = useState(null);
  const [kidsSubCategories, setKidsSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/categories`);
      const data = await response.json();

      const allCategories = data.categories || [];
      
      const enfant = allCategories.find(cat => 
        cat.slug === 'enfant' && !cat.parentId
      );

      if (enfant) {
        setEnfantCategory(enfant);
        const subCats = allCategories.filter(cat => cat.parentId === enfant.id);
        
        const filters = [
          { id: 'all', name: 'Toutes les sous-catégories', slug: 'all' },
          ...subCats
        ];

        setKidsSubCategories(filters);
      }

      setCategories(allCategories);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    categories,
    enfantCategory,
    kidsSubCategories,
    loading
  };
};
