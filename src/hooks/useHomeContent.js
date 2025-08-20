import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_CONFIG, getImageUrl } from '../config/api';

export const useHomeContent = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        console.log('📡 Chargement des sections depuis l\'API...');
        
        const response = await axios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HOME_SECTIONS}`);
        
        // Traiter les sections pour corriger les URLs d'images
        const sectionsWithImages = response.data.map(section => {
          if (section.content && section.content.slides) {
            section.content.slides = section.content.slides.map(slide => ({
              ...slide,
              image: getImageUrl(slide.image)
            }));
          }
          return section;
        });
        
        const sortedSections = sectionsWithImages
          .filter(section => section.isVisible !== false)
          .sort((a, b) => a.order - b.order);

        console.log('✅ Sections chargées depuis l\'API:', sortedSections.length);
        setSections(sortedSections);
        setLoading(false);
      } catch (err) {
        console.error('❌ Erreur lors du chargement des sections:', err);
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
