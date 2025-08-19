/**
 * ✅ SCRIPT DE VÉRIFICATION SIMPLE
 * Vérifie juste ce qui existe sans rien modifier
 */

const ADMIN_URL = 'http://localhost:4000';

const verifyOnly = async () => {
  console.log('🔍 Vérification des sections...');
  
  try {
    const response = await fetch(`${ADMIN_URL}/api/content/home-sections`);
    const result = await response.json();
    const sections = result.data || [];
    
    console.log(`📊 ${sections.length} sections trouvées`);
    
    sections.forEach(section => {
      console.log(`- ${section.type}: "${section.title}" (visible: ${section.isVisible})`);
    });
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
};

verifyOnly();
