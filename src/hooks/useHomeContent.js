import { useState, useEffect } from 'react';
import { mockHomeContent } from '../data/mockData';

export const useHomeContent = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        console.log('🔧 Mock: Chargement des sections de la page d\'accueil...');
        
        // Simuler un délai réseau
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Utiliser les données mock triées par ordre
        const sortedSections = [...mockHomeContent]
          .filter(section => section.isVisible !== false)
          .sort((a, b) => a.order - b.order);

        console.log('🔧 Mock: Sections chargées:', sortedSections.length);
        console.log('Sections détails:', sortedSections.map(s => ({ type: s.type, visible: s.isVisible })));

        setSections(sortedSections);
        setLoading(false);
      } catch (err) {
        console.error('❌ Mock: Erreur lors du chargement des sections:', err);
        setError(err.message || 'Erreur de chargement');
        setLoading(false);
      }
    };

    fetchSections();
  }, []);

  // Fonction utilitaire pour obtenir une section spécifique
  const getSection = (type) => {
    const section = sections.find(section => section.type === type);
    console.log('🔧 Mock: Section demandée:', type, 'trouvée:', !!section);
    return section;
  };

  return {
    sections,
    loading,
    error,
    getSection
  };
};
