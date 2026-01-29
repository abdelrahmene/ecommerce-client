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
          // Essayer de charger depuis l'API admin (Production)
          try {
            const adminUrl = 'https://admin.birkshoes.store/api/admin/meta-pixel-config';
            console.log(`🔍 [META PIXEL] Chargement config depuis: ${adminUrl}`);

            const response = await fetch(adminUrl, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json'
              }
            });

            if (response.ok) {
              const config = await response.json();
              console.log('✅ [META PIXEL] Config reçue:', config);

              if (config.pixelId) {
                setPixelId(config.pixelId);
                setIsEnabled(config.isEnabled !== false);
                metaPixelService.initialize(config.pixelId, config.isEnabled !== false);

                // Sauvegarder en cache
                localStorage.setItem('metaPixelConfig', JSON.stringify(config));
              }
            } else {
              throw new Error(`Erreur HTTP: ${response.status}`);
            }
          } catch (err) {
            console.warn('⚠️ [META PIXEL] Pas de config trouvée sur le serveur:', err);
            // Fallback localstorage
            if (savedConfig) {
              // ... déjà géré
            }
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
