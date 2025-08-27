// Service de commandes utilisant UNIQUEMENT l'API
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.birkshoes.store/api';

console.log('🔧 Service de commandes API initialisé');

const orderService = {
  async createOrder(orderData) {
    console.log('📡 API Orders - Création de commande:', orderData);
    
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur de création de commande');
      }

      const data = await response.json();
      console.log('✅ API Orders - Commande créée:', data);
      return data;
    } catch (error) {
      console.error('❌ API Orders - Erreur de création:', error);
      throw error;
    }
  },

  async getUserOrders(userId) {
    console.log('📡 API Orders - Récupération des commandes pour:', userId);
    
    try {
      const response = await fetch(`${API_BASE_URL}/orders/user/${userId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur de récupération des commandes');
      }

      const data = await response.json();
      console.log('✅ API Orders - Commandes récupérées:', data);
      return data;
    } catch (error) {
      console.error('❌ API Orders - Erreur de récupération:', error);
      throw error;
    }
  },

  async getOrderById(orderId) {
    console.log('📡 API Orders - Récupération de la commande:', orderId);
    
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur de récupération de la commande');
      }

      const data = await response.json();
      console.log('✅ API Orders - Commande récupérée:', data);
      return data;
    } catch (error) {
      console.error('❌ API Orders - Erreur de récupération:', error);
      throw error;
    }
  }
};

export { orderService as OrderService };
export const createOrder = orderService.createOrder;
export default orderService;
