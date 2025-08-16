import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { firestore } from '../services/firebase/firebase';

/**
 * Hook personnalisé pour récupérer les sections de la page d'accueil depuis Firebase
 */
export const useHomeSections = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        setLoading(true);
        
        // Créer une requête pour récupérer les sections triées par ordre
        const sectionsRef = collection(firestore, 'homeContent');
        const q = query(sectionsRef, orderBy('order'));
        const snapshot = await getDocs(q);
        
        console.log('Sections récupérées depuis Firebase:', snapshot.docs.length);
        
        // Transformer les documents en objets JavaScript
        const fetchedSections = snapshot.docs
          .map(doc => {
            const data = {
              id: doc.id,
              ...doc.data()
            };
            console.log('Section récupérée:', data.type, data);
            return data;
          })
          // Filtrer pour ne garder que les sections visibles
          .filter(section => section.isVisible !== false);
        
        console.log('Sections filtrées et prêtes à afficher:', fetchedSections.length);
        setSections(fetchedSections);
      } catch (err) {
        console.error('Erreur lors de la récupération des sections:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, []);

  return { sections, loading, error };
};

export default useHomeSections;