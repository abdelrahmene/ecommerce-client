// Service Yalidine pour le client e-commerce
const API_BASE_URL = `${process.env.REACT_APP_API_URL || 'http://localhost:4000'}/api`;

console.log('🔧 Yalidine Service - API_BASE_URL:', API_BASE_URL);

export const yalidineService = {
  // Récupérer toutes les wilayas
  async getWilayas() {
    try {
      console.log('📡 Fetching wilayas from:', `${API_BASE_URL}/yalidine/wilayas`);
      const response = await fetch(`${API_BASE_URL}/yalidine/wilayas`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Wilayas fetch failed:', response.status, errorText);
        throw new Error(`Failed to fetch wilayas: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Wilayas fetched:', data.length);
      return data;
    } catch (error) {
      console.error('❌ Error fetching wilayas:', error);
      throw error;
    }
  },

  // Récupérer les communes d'une wilaya
  async getCommunes(wilayaId) {
    try {
      console.log('📡 Fetching communes for wilaya:', wilayaId);
      const response = await fetch(`${API_BASE_URL}/yalidine/communes?wilaya_id=${wilayaId}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Communes fetch failed:', response.status, errorText);
        throw new Error(`Failed to fetch communes: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Communes fetched:', data.length);
      return data;
    } catch (error) {
      console.error('❌ Error fetching communes:', error);
      throw error;
    }
  },

  // Récupérer les centres (stop desks) d'une commune
  async getCenters(communeId) {
    try {
      console.log('📡 Fetching centers for commune:', communeId);
      const response = await fetch(`${API_BASE_URL}/yalidine/centers?commune_id=${communeId}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Centers fetch failed:', response.status, errorText);
        throw new Error(`Failed to fetch centers: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Centers fetched:', data.length);
      return data;
    } catch (error) {
      console.error('❌ Error fetching centers:', error);
      throw error;
    }
  },

  // Calculer les frais de livraison
  async calculateFees(data) {
    try {
      console.log('📡 Calculating fees:', data);
      const response = await fetch(`${API_BASE_URL}/yalidine/calculate-fees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Fees calculation failed:', response.status, errorText);
        throw new Error(`Failed to calculate fees: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('✅ Fees calculated:', result);
      return result;
    } catch (error) {
      console.error('❌ Error calculating fees:', error);
      throw error;
    }
  },

  // Obtenir les informations de livraison
  async getDeliveryInfo(wilayaName, communeName) {
    try {
      console.log('📡 Fetching delivery info:', { wilayaName, communeName });
      const response = await fetch(
        `${API_BASE_URL}/yalidine/delivery-info?wilaya=${encodeURIComponent(wilayaName)}&commune=${encodeURIComponent(communeName)}`
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Delivery info fetch failed:', response.status, errorText);
        throw new Error(`Failed to fetch delivery info: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Delivery info fetched:', data);
      return data;
    } catch (error) {
      console.error('❌ Error fetching delivery info:', error);
      throw error;
    }
  }
};

export default yalidineService;
