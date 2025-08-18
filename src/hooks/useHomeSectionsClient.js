import { useState, useEffect } from 'react';
import { mockHomeContent } from '../data/mockData';

/**
 * Hook personnalisé pour récupérer les sections de la page d'accueil (Mock)
 */
export const useHomeSections = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        setLoading(true);
        
        console.log('🔧 Mock: Récupération des sections de la page d\'accueil...');
        
        // Simuler un délai réseau
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Transformer les données mock et les trier par ordre
        const fetchedSections = [...mockHomeContent]
          .filter(section => section.isVisible !== false)
          .sort((a, b) => a.order - b.order)
          .map(section => {
            console.log('🔧 Mock: Section récupérée:', section.type, section);
            return section;
          });
        
        console.log('🔧 Mock: Sections filtrées et prêtes à afficher:', fetchedSections.length);
        setSections(fetchedSections);
      } catch (err) {
        console.error('❌ Mock: Erreur lors de la récupération des sections:', err);
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
