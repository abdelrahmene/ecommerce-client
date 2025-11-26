import React, { createContext, useContext, useEffect, useState } from 'react';
import metaPixelService from '../services/metaPixelService';

const MetaPixelContext = createContext();

export const useMetaPixel = () => {
  const context = useContext(MetaPixelContext);
  if (!context) {
    throw new Error('useMetaPixel doit être utilisé avec MetaPixelProvider');
  }
  return context;
};

export const MetaPixelProvider = ({ children }) => {
  const [pixelId, setPixelId] = useState(null);
  const [isEnabled, setIsEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Charger la configuration au démarrage
  useEffect(() => {
    const loadConfig = async () => {
      try {
        // Essayer de charger depuis localStorage d'abord
        const savedConfig = localStorage.getItem('metaPixelConfig');
        
        if (savedConfig) {
          const config = JSON.parse(savedConfig);
          setPixelId(config.pixelId);
          setIsEnabled(config.isEnabled !== false);
          metaPixelService.initialize(config.pixelId, config.isEnabled !== false);
          console.log('📍 [META PIXEL] Config chargée depuis localStorage');
        } else {
          // Essayer de charger depuis l'API admin
          try {
            const response = await fetch('http://localhost:3000/api/admin/meta-pixel-config', {
              credentials: 'include'
            });
            if (response.ok) {
              const config = await response.json();
              setPixelId(config.pixelId);
              setIsEnabled(config.isEnabled !== false);
              metaPixelService.initialize(config.pixelId, config.isEnabled !== false);
              console.log('📍 [META PIXEL] Config chargée depuis l\'API');
            }
          } catch (err) {
            console.warn('⚠️ [META PIXEL] Pas de config trouvée:', err);
          }
        }
      } catch (err) {
        console.error('❌ [META PIXEL] Erreur chargement config:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadConfig();
  }, []);

  // Mettre à jour la configuration
  const updateConfig = (newPixelId, enabled = true) => {
    setPixelId(newPixelId);
    setIsEnabled(enabled);
    metaPixelService.initialize(newPixelId, enabled);
    
    // Sauvegarder localement
    localStorage.setItem('metaPixelConfig', JSON.stringify({
      pixelId: newPixelId,
      isEnabled: enabled
    }));
  };

  const value = {
    pixelId,
    isEnabled,
    isLoading,
    updateConfig,
    trackPageView: () => metaPixelService.trackPageView(),
    trackViewContent: (product) => metaPixelService.trackViewContent(product),
    trackInitiateCheckout: (items, value) => metaPixelService.trackInitiateCheckout(items, value),
    trackPurchase: (orderData) => metaPixelService.trackPurchase(orderData),
    trackCustomEvent: (eventName, data) => metaPixelService.trackCustomEvent(eventName, data),
    getStatus: () => metaPixelService.getStatus()
  };

  return (
    <MetaPixelContext.Provider value={value}>
      {children}
    </MetaPixelContext.Provider>
  );
};
