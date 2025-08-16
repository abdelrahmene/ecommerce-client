import { useState, useEffect } from 'react';
import { 
  collection,
  query,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { firestore as db } from '../services/firebase/firebase';

export const useHomeContent = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Créer une requête pour obtenir les sections triées par ordre
    const q = query(
      collection(db, 'homeContent'),
      orderBy('order', 'asc')
    );

    // S'abonner aux mises à jour en temps réel
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const sectionsData = snapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }));

        console.log('Sections chargées:', sectionsData);

        // Ne garder que les sections visibles
        const visibleSections = sectionsData.filter(section => section.isVisible);
        console.log('Sections visibles:', visibleSections);

        setSections(visibleSections);
        setLoading(false);
      },
      (err) => {
        console.error('Erreur lors du chargement des sections:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    // Nettoyer l'abonnement lors du démontage
    return () => unsubscribe();
  }, []);

  // Fonction utilitaire pour obtenir une section spécifique
  const getSection = (type) => {
    return sections.find(section => section.type === type);
  };

  return {
    sections,
    loading,
    error,
    getSection
  };
};