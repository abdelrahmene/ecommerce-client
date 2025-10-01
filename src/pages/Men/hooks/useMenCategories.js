import { useState, useEffect } from 'react';

export const useMenCategories = () => {
  const [categories, setCategories] = useState([]);
  const [hommeCategory, setHommeCategory] = useState(null);
  const [menSubCategories, setMenSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/categories`);
      const data = await response.json();

      const allCategories = data.categories || [];

      const homme = allCategories.find(cat => 
        cat.slug === 'homme' && !cat.parentId
      );

      if (homme) {
        setHommeCategory(homme);
        const subCats = allCategories.filter(cat => cat.parentId === homme.id);
        
        const filters = [
          { id: 'all', name: 'Toutes les sous-catégories', slug: 'all' },
          ...subCats
        ];

        setMenSubCategories(filters);
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
    hommeCategory,
    menSubCategories,
    loading
  };
};
