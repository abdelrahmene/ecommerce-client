/**
 * 🛒 SERVICE API COMMANDES - VERSION MYSQL CLIENT
 * Remplace Firebase par l'API MySQL pour les commandes côté client
 */

const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:8000' 
  : 'https://api.birkshoes.store';

/**
 * Crée une nouvelle commande
 */
export const createOrder = async (orderData) => {
  try {
    console.log('📡 API Client: Création d\'une nouvelle commande...');
    
    const response = await fetch(`${API_BASE_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Erreur lors de la création de la commande');
    }

    console.log('✅ Commande créée avec succès:', data.order?.id);
    
    return data.order;
  } catch (error) {
    console.error('❌ Erreur lors de la création de la commande:', error);
    throw error;
  }
};

/**
 * Récupère une commande par son ID
 */
export const getOrder = async (orderId) => {
  try {
    console.log('📡 API Client: Récupération de la commande:', orderId);
    
    const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null; // Commande non trouvée
      }
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Erreur lors de la récupération de la commande');
    }

    console.log('✅ Commande récupérée:', data.order?.order_number);
    
    return data.order;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération de la commande:', error);
    throw error;
  }
};

/**
 * Met à jour le statut d'une commande
 */
export const updateOrderStatus = async (orderId, status, note = '') => {
  try {
    console.log('📡 API Client: Mise à jour du statut de la commande:', orderId, '→', status);
    
    const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status, note }),
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Erreur lors de la mise à jour du statut');
    }

    console.log('✅ Statut de la commande mis à jour');
    
    return data.order;
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour du statut:', error);
    throw error;
  }
};

/**
 * Récupère l'historique d'une commande
 */
export const getOrderHistory = async (orderId) => {
  try {
    console.log('📡 API Client: Récupération de l\'historique de la commande:', orderId);
    
    const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/history`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Erreur lors de la récupération de l\'historique');
    }

    console.log('✅ Historique récupéré:', data.history?.length || 0, 'événements');
    
    return data.history || [];
  } catch (error) {
    console.error('❌ Erreur lors de la récupération de l\'historique:', error);
    throw error;
  }
};

/**
 * Recherche une commande par numéro de téléphone (pour le suivi)
 */
export const trackOrderByPhone = async (phone, orderNumber = '') => {
  try {
    console.log('📡 API Client: Recherche de commande par téléphone:', phone);
    
    const params = new URLSearchParams();
    params.append('phone', phone);
    if (orderNumber) {
      params.append('order_number', orderNumber);
    }
    
    const response = await fetch(`${API_BASE_URL}/api/orders/track?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return []; // Aucune commande trouvée
      }
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Erreur lors de la recherche de commandes');
    }

    console.log('✅ Commandes trouvées:', data.orders?.length || 0);
    
    return data.orders || [];
  } catch (error) {
    console.error('❌ Erreur lors de la recherche de commandes:', error);
    throw error;
  }
};

/**
 * Calcule les frais de livraison pour une commande
 */
export const calculateShipping = async (items, deliveryInfo) => {
  try {
    console.log('📡 API Client: Calcul des frais de livraison...');
    
    const response = await fetch(`${API_BASE_URL}/api/orders/shipping`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items, deliveryInfo }),
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Erreur lors du calcul des frais de livraison');
    }

    console.log('✅ Frais de livraison calculés:', data.shipping?.fee, 'DZD');
    
    return data.shipping;
  } catch (error) {
    console.error('❌ Erreur lors du calcul des frais de livraison:', error);
    throw error;
  }
};
