// Service Yalidine pour le client - version simplifiée centrée sur le suivi des livraisons

// Fonction pour suivre un envoi existant
export const trackShipment = async (trackingNumber) => {
  try {
    const apiKey = process.env.REACT_APP_YALIDINE_API_KEY;
    const apiId = process.env.REACT_APP_YALIDINE_API_ID;
    
    if (!apiKey || !apiId) {
      throw new Error('Les clés API Yalidine ne sont pas configurées correctement');
    }

    // Requête pour obtenir le statut d'un envoi
    const response = await fetch(`https://api.yalidine.app/v1/parcels/${trackingNumber}/tracking`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-API-ID': apiId,
        'X-API-TOKEN': apiKey
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Erreur Yalidine: ${errorData.message || 'Erreur inconnue'}`);
    }
    
    const data = await response.json();
    
    // Formater les données de suivi
    return {
      tracking: data.tracking_number,
      currentStatus: data.status,
      statusHistory: data.tracking_history.map(item => ({
        status: item.status,
        timestamp: item.created_at,
        description: item.description
      })),
      expectedDeliveryDate: data.expected_delivery_date,
      deliveredAt: data.delivered_at || null,
      isCancelled: data.is_cancelled || false,
      isPending: data.is_pending || false,
      isDelivered: data.is_delivered || false
    };
  } catch (error) {
    console.error('Erreur tracking Yalidine:', error);
    throw error;
  }
};

// Fonction pour obtenir les tarifs de livraison
export const getShippingRates = async (wilaya, commune) => {
  try {
    const apiKey = process.env.REACT_APP_YALIDINE_API_KEY;
    const apiId = process.env.REACT_APP_YALIDINE_API_ID;
    
    if (!apiKey || !apiId) {
      throw new Error('Les clés API Yalidine ne sont pas configurées correctement');
    }

    // Requête pour obtenir les tarifs de livraison
    const response = await fetch(`https://api.yalidine.app/v1/deliveryFees/${wilaya}/${commune}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-API-ID': apiId,
        'X-API-TOKEN': apiKey
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Erreur Yalidine: ${errorData.message || 'Erreur inconnue'}`);
    }
    
    const data = await response.json();
    
    return {
      wilaya: data.wilaya,
      commune: data.commune,
      homeDeliveryFee: data.home_delivery,
      stopdeskDeliveryFee: data.stopdesk_delivery,
      deliveryTime: data.delivery_time
    };
  } catch (error) {
    console.error('Erreur tarifs Yalidine:', error);
    throw error;
  }
};

// Objet exporté pour faciliter l'accès aux fonctions
const yalidineService = {
  trackShipment,
  getShippingRates
};

export default yalidineService;