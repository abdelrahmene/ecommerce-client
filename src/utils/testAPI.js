/**
 * 🧪 SCRIPT DE TEST - Vérification de la connexion API
 * Ce script vérifie si l'API Backend est accessible depuis le client
 */

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const testAPIConnection = async () => {
  console.log('🧪 Test API: Démarrage des tests de connexion...');
  console.log('🔗 URL de base:', API_BASE_URL);

  try {
    // Test 1: Vérifier la disponibilité de l'API
    console.log('📡 Test 1: Vérification de la connexion API...');
    
    const response = await fetch(`${API_BASE_URL}/content/home-sections`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    console.log('📊 Status:', response.status);
    console.log('📊 Status Text:', response.statusText);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const sections = await response.json();
    console.log('✅ Test 1 RÉUSSI: API accessible');
    console.log('📋 Sections récupérées:', sections.length);
    
    sections.forEach((section, index) => {
      console.log(`  ${index + 1}. ${section.type} - "${section.title}" (visible: ${section.isVisible})`);
    });

    return { success: true, sections };

  } catch (error) {
    console.log('❌ Test 1 ÉCHOUÉ: API non accessible');
    console.log('🚨 Erreur:', error.message);
    
    // Test 2: Utiliser les données mock comme fallback
    console.log('🔄 Test 2: Chargement des données mock...');
    
    try {
      const { mockHomeContent } = await import('../data/mockData');
      const mockSections = mockHomeContent
        .filter(section => section.isVisible !== false)
        .sort((a, b) => a.order - b.order);
      
      console.log('✅ Test 2 RÉUSSI: Données mock chargées');
      console.log('📋 Sections mock:', mockSections.length);
      
      mockSections.forEach((section, index) => {
        console.log(`  ${index + 1}. ${section.type} - "${section.title}"`);
      });

      return { success: false, sections: mockSections, usedMock: true };
      
    } catch (mockError) {
      console.log('❌ Test 2 ÉCHOUÉ: Impossible de charger les données mock');
      console.log('🚨 Erreur mock:', mockError.message);
      
      return { success: false, sections: [], usedMock: false };
    }
  }
};

// Export pour utilisation dans les composants React
export { testAPIConnection };

// Auto-exécution si appelé directement
if (typeof window !== 'undefined' && window.location.search.includes('test-api')) {
  testAPIConnection().then(result => {
    console.log('🏁 Test terminé:', result);
  });
}

export default testAPIConnection;
