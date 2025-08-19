/**
 * 🧪 TEST RAPIDE API - Vérification endpoints
 */

async function testAPI() {
  const API_BASE = 'http://localhost:4000/api';
  
  console.log('🔌 Test de l\'API BirkShoes...');
  console.log('🌐 Base URL:', API_BASE);
  
  try {
    // Test endpoint health
    console.log('\n1. Test Health Check...');
    const healthResponse = await fetch('http://localhost:4000/health');
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Health Check:', healthData);
    } else {
      console.log('❌ Health Check failed:', healthResponse.status);
    }
    
    // Test endpoint home-sections
    console.log('\n2. Test Home Sections...');
    const sectionsResponse = await fetch(`${API_BASE}/content/home-sections`);
    
    if (sectionsResponse.ok) {
      const sections = await sectionsResponse.json();
      console.log('✅ Home Sections récupérées:', sections.length);
      
      sections.forEach((section, index) => {
        console.log(`   ${index + 1}. ${section.type.toUpperCase()}: "${section.title}" (Visible: ${section.isVisible}, Ordre: ${section.order})`);
      });
      
      // Vérifier la section hero
      const heroSection = sections.find(s => s.type === 'hero');
      if (heroSection) {
        console.log('🎯 Section Hero trouvée:', heroSection.title);
        console.log('🔍 Contenu Hero:', JSON.stringify(heroSection.content, null, 2));
      } else {
        console.log('⚠️ Aucune section Hero trouvée!');
      }
      
    } else {
      console.log('❌ Erreur Home Sections:', sectionsResponse.status, sectionsResponse.statusText);
      const errorText = await sectionsResponse.text();
      console.log('🔍 Détails erreur:', errorText);
    }
    
  } catch (error) {
    console.error('💥 Erreur de connexion API:', error.message);
    console.log('\n🚨 Vérifiez que:');
    console.log('   - L\'API backend est démarrée');
    console.log('   - Le port 4000 est libre');
    console.log('   - Aucun firewall ne bloque la connexion');
  }
}

// Exécuter le test
testAPI().then(() => {
  console.log('\n🎉 Test terminé!');
}).catch(console.error);
