// 🎯 SERVICE DE COMMANDES MOCK - Remplace Firebase Firestore
// Ce service simule les opérations sur les commandes avec des données locales

import { mockOrders } from '../data/mockData';

const ORDERS_COLLECTION = 'orders';

// Simuler un stockage local des commandes
let localOrders = [...mockOrders];

/**
 * Crée une nouvelle commande (mock)
 * @param {Object} orderData - Données de la commande
 * @returns {Promise<Object>} - Objet contenant l'ID de la commande et le statut
 */
export const createOrder = async (orderData) => {
  try {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 500));

    // Nettoyer les données (remplacer undefined par null)
    const cleanData = JSON.parse(JSON.stringify(orderData));
    
    // S'assurer que le code couleur est défini
    if (cleanData.product && cleanData.product.colorCode === undefined) {
      cleanData.product.colorCode = null;
    }
    
    // Créer la nouvelle commande
    const newOrder = {
      id: 'order_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      ...cleanData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: cleanData.status || 'pending'
    };
    
    // Ajouter à la liste locale
    localOrders.unshift(newOrder);
    
    console.log('🔧 Mock: Nouvelle commande créée:', newOrder.id);
    
    return {
      success: true,
      orderId: newOrder.id
    };
  } catch (error) {
    console.error('❌ Mock: Erreur lors de la création de la commande:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Récupère une commande par son ID (mock)
 * @param {string} orderId - ID de la commande
 * @returns {Promise<Object>} - Données de la commande
 */
export const getOrderById = async (orderId) => {
  try {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const order = localOrders.find(o => o.id === orderId);
    
    if (order) {
      console.log('🔧 Mock: Commande trouvée:', orderId);
      return {
        id: order.id,
        ...order
      };
    } else {
      throw new Error('Commande non trouvée');
    }
  } catch (error) {
    console.error('❌ Mock: Erreur lors de la récupération de la commande:', error);
    throw error;
  }
};

/**
 * Met à jour le statut d'une commande (mock)
 * @param {string} orderId - ID de la commande
 * @param {string} status - Nouveau statut
 * @returns {Promise<boolean>} - Succès de la mise à jour
 */
export const updateOrderStatus = async (orderId, status) => {
  try {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const orderIndex = localOrders.findIndex(o => o.id === orderId);
    
    if (orderIndex >= 0) {
      localOrders[orderIndex] = {
        ...localOrders[orderIndex],
        status,
        updatedAt: new Date().toISOString()
      };
      
      console.log('🔧 Mock: Statut de commande mis à jour:', orderId, '->', status);
      return true;
    } else {
      console.error('❌ Mock: Commande non trouvée pour mise à jour:', orderId);
      return false;
    }
  } catch (error) {
    console.error('❌ Mock: Erreur lors de la mise à jour du statut:', error);
    return false;
  }
};

/**
 * Récupère toutes les commandes (mock)
 * @param {Object} filters - Filtres optionnels (status, date, etc.)
 * @returns {Promise<Array>} - Liste des commandes
 */
export const getAllOrders = async (filters = {}) => {
  try {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 400));
    
    let filteredOrders = [...localOrders];
    
    // Appliquer les filtres si nécessaire
    if (filters.status) {
      filteredOrders = filteredOrders.filter(order => order.status === filters.status);
    }
    
    // Trier par date de création (plus récent d'abord)
    filteredOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    console.log('🔧 Mock: Commandes récupérées:', filteredOrders.length);
    
    return filteredOrders.map(order => ({
      id: order.id,
      ...order
    }));
  } catch (error) {
    console.error('❌ Mock: Erreur lors de la récupération des commandes:', error);
    throw error;
  }
};

/**
 * Récupère les commandes d'un client spécifique (mock)
 * @param {string} clientId - ID du client
 * @returns {Promise<Array>} - Liste des commandes du client
 */
export const getOrdersByClient = async (clientId) => {
  try {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const clientOrders = localOrders
      .filter(order => order.clientId === clientId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    console.log('🔧 Mock: Commandes du client récupérées:', clientId, '->', clientOrders.length);
    
    return clientOrders.map(order => ({
      id: order.id,
      ...order
    }));
  } catch (error) {
    console.error('❌ Mock: Erreur lors de la récupération des commandes du client:', error);
    throw error;
  }
};

console.log('🔧 Service de commandes Mock initialisé');

export default {
  createOrder,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
  getOrdersByClient
};
