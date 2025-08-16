import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { firestore } from './firebase/firebase';

const ORDERS_COLLECTION = 'orders';

/**
 * Crée une nouvelle commande dans Firestore
 * @param {Object} orderData - Données de la commande
 * @returns {Promise<Object>} - Objet contenant l'ID de la commande et le statut
 */
export const createOrder = async (orderData) => {
  try {
    // Nettoyer les valeurs undefined qui ne sont pas acceptées par Firestore
    const cleanData = JSON.parse(JSON.stringify(orderData));
    
    // S'assurer que le code couleur est défini ou le remplacer par une valeur par défaut
    if (cleanData.product && cleanData.product.colorCode === undefined) {
      cleanData.product.colorCode = null; // Firestore accepte null mais pas undefined
    }
    
    // Ajouter un timestamp serveur
    const orderWithTimestamp = {
      ...cleanData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: cleanData.status || 'pending' // Statut par défaut: en attente
    };
    
    // Ajouter la commande à Firestore
    const docRef = await addDoc(collection(firestore, ORDERS_COLLECTION), orderWithTimestamp);
    
    return {
      success: true,
      orderId: docRef.id
    };
  } catch (error) {
    console.error('Erreur lors de la création de la commande:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Récupère une commande par son ID
 * @param {string} orderId - ID de la commande
 * @returns {Promise<Object>} - Données de la commande
 */
export const getOrderById = async (orderId) => {
  try {
    const orderDoc = await getDoc(doc(firestore, ORDERS_COLLECTION, orderId));
    
    if (orderDoc.exists()) {
      return {
        id: orderDoc.id,
        ...orderDoc.data()
      };
    } else {
      throw new Error('Commande non trouvée');
    }
  } catch (error) {
    console.error('Erreur lors de la récupération de la commande:', error);
    throw error;
  }
};

/**
 * Met à jour le statut d'une commande
 * @param {string} orderId - ID de la commande
 * @param {string} status - Nouveau statut
 * @returns {Promise<boolean>} - Succès de la mise à jour
 */
export const updateOrderStatus = async (orderId, status) => {
  try {
    await updateDoc(doc(firestore, ORDERS_COLLECTION, orderId), {
      status,
      updatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut de la commande:', error);
    return false;
  }
};

/**
 * Récupère toutes les commandes
 * @param {Object} filters - Filtres optionnels (status, date, etc.)
 * @returns {Promise<Array>} - Liste des commandes
 */
export const getAllOrders = async (filters = {}) => {
  try {
    let ordersQuery = collection(firestore, ORDERS_COLLECTION);
    
    // Appliquer les filtres si nécessaire
    if (filters.status) {
      ordersQuery = query(ordersQuery, where('status', '==', filters.status));
    }
    
    // Toujours trier par date de création (plus récent d'abord)
    ordersQuery = query(ordersQuery, orderBy('createdAt', 'desc'));
    
    const ordersSnapshot = await getDocs(ordersQuery);
    
    return ordersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error);
    throw error;
  }
};

/**
 * Récupère les commandes d'un client spécifique
 * @param {string} clientId - ID du client
 * @returns {Promise<Array>} - Liste des commandes du client
 */
export const getOrdersByClient = async (clientId) => {
  try {
    const ordersQuery = query(
      collection(firestore, ORDERS_COLLECTION),
      where('clientId', '==', clientId),
      orderBy('createdAt', 'desc')
    );
    
    const ordersSnapshot = await getDocs(ordersQuery);
    
    return ordersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes du client:', error);
    throw error;
  }
};

export default {
  createOrder,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
  getOrdersByClient
};