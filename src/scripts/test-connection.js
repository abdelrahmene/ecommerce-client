/**
 * 🧪 SCRIPT DE TEST RAPIDE
 * Teste la connectivité avec l'API admin sans modifications
 */

const testConnection = async () => {
  const ADMIN_URL = 'http://localhost:4000';
  
  console.log('🧪 [TEST] Démarrage du test de connectivité...');
  
  try {
    // Test de ping simple
    console.log('📡 [TEST] Test de connexion...');
    const response = await fetch(`${ADMIN_URL}/api/content/home-sections`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    const sections = result.data || [];
    
    console.log('✅ [TEST] Connexion réussie !');
    console.log('📊 [TEST] Sections trouvées:', sections.length);
    
    if (sections.length === 0) {
      console.log('ℹ️ [TEST] Aucune section en base - Normal pour une première installation');
      console.log('💡 [TEST] Utilisez le script setup-home-sections.ps1 pour initialiser');
    } else {
      console.log('📋 [TEST] Sections disponibles:');
      sections.forEach((section, index) => {
        const status = section.isVisible ? '✅' : '❌';
        console.log(`  ${index + 1}. ${section.type} - "${section.title}" ${status}`);
      });
    }
    
    return { success: true, sections };
    
  } catch (error) {
    console.error('❌ [TEST] Erreur de connexion:', error.message);
    
    if (error.message.includes('Failed to fetch')) {
      console.log('💡 [TEST] Solutions possibles:');
      console.log('  1. Vérifiez que le serveur admin tourne sur http://localhost:4000');
      console.log('  2. Vérifiez les CORS si nécessaire');
      console.log('  3. Vérifiez la route /api/content/home-sections');
    }
    
    return { success: false, error: error.message };
  }
};

// Test immédiat
testConnection().then(result => {
  if (result.success) {
    console.log('🎉 [TEST] Test terminé avec succès !');
  } else {
    console.log('🔧 [TEST] Des ajustements sont nécessaires.');
  }
});

module.exports = { testConnection };
