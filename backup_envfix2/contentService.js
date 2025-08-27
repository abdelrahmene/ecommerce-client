/**
 * 📝 SERVICE API CONTENT - Communication avec Admin Dashboard
 * Gère tout le contenu dynamique depuis l'admin MySQL
 */

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000';

// Configuration pour les requêtes avec timeout
const fetchWithTimeout = (url, options = {}, timeout = 4000) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), timeout)
    )
  ]);
};

console.log('🔗 ContentService: API_BASE_URL =', API_BASE_URL);

/**
 * Récupère toutes les sections de la page d'accueil
 */
export const getHomeSections = async () => {
  try {
    console.log('📡 Récupération sections home depuis admin...');
    console.log('🔗 URL:', `${API_BASE_URL}/content/home-sections`);
    
    const response = await fetchWithTimeout(`${API_BASE_URL}/content/home-sections`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    }, 10000);

    console.log('📥 Response status:', response.status, response.statusText);
    console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Response error body:', errorText);
      throw new Error(`HTTP Error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('📦 Raw API result:', result);
    
    if (!result.success) {
      throw new Error(result.error || 'Erreur API');
    }
    
    const data = result.data || [];
    console.log('✅ Sections récupérées:', data.length);
    
    // Debug des sections et leur visibilité
    data.forEach((section, index) => {
      console.log(`  ${index + 1}. [${section.type}] "${section.title}" - Visible: ${section.isVisible ? '✅' : '❌'} (ordre: ${section.order})`);
    });
    
    const visibleCount = data.filter(s => s.isVisible === true).length;
    const hiddenCount = data.filter(s => s.isVisible === false).length;
    console.log(`📊 Visibilité: ${visibleCount} visibles, ${hiddenCount} masquées`);
    
    return data.map(section => ({
      id: section.id,
      type: section.type,
      title: section.title,
      description: section.description,
      content: typeof section.content === 'string' 
        ? JSON.parse(section.content) 
        : section.content,
      isVisible: section.isVisible,
      order: section.order,
      createdAt: section.createdAt,
      updatedAt: section.updatedAt
    }));
  } catch (error) {
    console.error('❌ Erreur getHomeSections:', error);
    console.error('❌ Erreur détaillée:', {
      name: error.name,
      message: error.message,
      stack: error.stack?.split('\n')[0]
    });
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      console.error('💡 Problème de connexion au serveur admin. Vérifiez que le serveur admin est démarré sur http://localhost:4000');
      console.error('🔍 Tentative de diagnostic...');
      
      // Test de connectivité basique
      try {
        const pingResponse = await fetch('http://localhost:4000', { method: 'HEAD', timeout: 2000 }).catch(() => null);
        if (pingResponse) {
          console.log('✅ Serveur admin répond sur port 4000');
        } else {
          console.error('❌ Serveur admin ne répond pas sur port 4000');
        }
      } catch (pingError) {
        console.error('❌ Impossible de ping le serveur admin:', pingError.message);
      }
    }
    return [];
  }
};

/**
 * Récupère une section spécifique par ID
 */
export const getHomeSection = async (id) => {
  try {
    console.log('📡 Récupération section:', id);
    
    const response = await fetch(`${API_BASE_URL}/content/home-sections/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Erreur API');
    }
    
    const section = result.data;
    console.log('✅ Section récupérée:', section.title);
    
    return {
      ...section,
      content: typeof section.content === 'string' 
        ? JSON.parse(section.content) 
        : section.content
    };
  } catch (error) {
    console.error('❌ Erreur getHomeSection:', error);
    return null;
  }
};

/**
 * Récupère les paramètres globaux du site
 */
export const getSettings = async () => {
  try {
    console.log('⚙️ Récupération paramètres globaux...');
    
    const response = await fetch(`${API_BASE_URL}/settings`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Erreur API');
    }
    
    const settings = result.data || {};
    console.log('✅ Paramètres récupérés:', Object.keys(settings).length);
    
    return settings;
  } catch (error) {
    console.error('❌ Erreur getSettings:', error);
    return {};
  }
};

/**
 * Récupère un paramètre spécifique
 */
export const getSetting = async (key) => {
  try {
    const response = await fetch(`${API_BASE_URL}/settings?key=${key}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const result = await response.json();
    if (!result.success) {
      if (result.error === 'Paramètre non trouvé') return null;
      throw new Error(result.error || 'Erreur API');
    }
    
    return result.data.value;
  } catch (error) {
    console.error(`❌ Erreur getSetting ${key}:`, error);
    return null;
  }
};

/**
 * Récupère les catégories pour la navigation
 */
export const getCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const categories = await response.json();
    return categories;
  } catch (error) {
    console.error('❌ Erreur getCategories:', error);
    return [];
  }
};

/**
 * Récupère les collections
 */
export const getCollections = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/collections`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const collections = await response.json();
    return collections;
  } catch (error) {
    console.error('❌ Erreur getCollections:', error);
    return [];
  }
};

/**
 * Créer une nouvelle commande
 */
export const createOrder = async (orderData) => {
  try {
    console.log('📦 Création commande...');
    
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData)
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const order = await response.json();
    console.log('✅ Commande créée:', order.orderNumber);
    
    return order;
  } catch (error) {
    console.error('❌ Erreur createOrder:', error);
    throw error;
  }
};

/**
 * Récupérer une commande par ID
 */
export const getOrder = async (orderId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const order = await response.json();
    return order;
  } catch (error) {
    console.error('❌ Erreur getOrder:', error);
    return null;
  }
};
