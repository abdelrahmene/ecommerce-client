import { useState, useEffect } from 'react';
import { getHomeSections } from '../services/homeService';

/**
 * Hook personnalisé pour récupérer les sections de la page d'accueil
 * 🔄 Connecté à l'API Backend avec fallback automatique
 */
export const useHomeSections = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFromFallback, setIsFromFallback] = useState(false);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔄 Hook: Récupération des sections de la page d\'accueil...');
        
        const fetchedSections = await getHomeSections();
        
        console.log('🔄 Hook: Sections récupérées:', fetchedSections.length);
        console.log('🔍 Hook: Détail des sections:', fetchedSections);
        
        // Vérifier si c'est du fallback en regardant l'ID de la première section
        const fromFallback = fetchedSections.length > 0 && fetchedSections[0].id === 'hero';
        setIsFromFallback(fromFallback);
        
        if (fromFallback) {
          console.log('📋 Hook: Utilisation des données de fallback');
        } else {
          console.log('✅ Hook: Utilisation des données de l\'API');
        }
        
        setSections(fetchedSections);
        setError(null); // Pas d'erreur puisqu'on a des données
      } catch (err) {
        // Cette erreur ne devrait plus jamais se produire avec le fallback
        console.error('❌ Hook: Erreur inattendue:', err);
        setError('Erreur inattendue lors du chargement');
        setSections([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, []);

  // Fonction pour recharger les données
  const refetch = async () => {
    const fetchSections = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔄 Hook: Rechargement des sections...');
        
        const fetchedSections = await getHomeSections();
        
        console.log('🔄 Hook: Sections rechargées:', fetchedSections.length);
        console.log('🔍 Hook: Détail sections rechargées:', fetchedSections);
        
        const fromFallback = fetchedSections.length > 0 && fetchedSections[0].id === 'hero';
        setIsFromFallback(fromFallback);
        
        setSections(fetchedSections);
        setError(null);
      } catch (err) {
        console.error('❌ Hook: Erreur lors du rechargement:', err);
        setError('Erreur lors du rechargement');
        setSections([]);
      } finally {
        setLoading(false);
      }
    };
    
    await fetchSections();
  };

  return { 
    sections, 
    loading, 
    error, 
    refetch,
    isFromFallback
  };
};

export default useHomeSections;
