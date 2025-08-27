// Service Firebase simulé pour le checkout utilisant l'API
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

console.log('🔧 Service Firebase simulé avec API initialisé');

export const serverTimestamp = () => {
  return new Date().toISOString();
};

export const addDoc = async (collectionRef, data) => {
  console.log('📡 API Firebase - Ajout de document:', data);
  
  try {
    // Créer une commande via l'API
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur d\'ajout de document');
    }

    const result = await response.json();
    console.log('✅ API Firebase - Document ajouté:', result);
    return { id: result.id };
  } catch (error) {
    console.error('❌ API Firebase - Erreur d\'ajout:', error);
    throw error;
  }
};

export const collection = (collectionName) => {
  return { name: collectionName };
};

export default {
  serverTimestamp,
  addDoc,
  collection
};
