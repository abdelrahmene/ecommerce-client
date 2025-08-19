/**
 * 🛡️ SCRIPT SÉCURISÉ DE SETUP DES SECTIONS
 * ATTENTION: Ce script ne supprime JAMAIS les données existantes !
 * Il vérifie d'abord ce qui existe, puis insère UNIQUEMENT ce qui manque.
 */

const ADMIN_API_URL = process.env.REACT_APP_ADMIN_API_URL || 'http://localhost:4000';

/**
 * ✅ FONCTION DE VÉRIFICATION SÉCURISÉE
 */
const checkExistingSections = async () => {
  console.log('🔍 [SÉCURITÉ] Vérification des sections existantes...');
  
  try {
    const response = await fetch(`${ADMIN_API_URL}/api/content/home-sections`);
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    const result = await response.json();
    const sections = result.data || [];
    
    console.log(`📊 [SÉCURITÉ] ${sections.length} sections trouvées en base`);
    
    if (sections.length > 0) {
      console.log('📋 [SÉCURITÉ] Sections existantes:');
      sections.forEach((section, index) => {
        console.log(`  ${index + 1}. ${section.type} - "${section.title}"`);
      });
    }
    
    return sections;
  } catch (error) {
    console.error('❌ [SÉCURITÉ] Erreur lors de la vérification:', error);
    return [];
  }
};

/**
 * 🔒 FONCTION D'INSERTION SÉCURISÉE (SANS SUPPRESSION)
 */
const insertMissingSections = async () => {
  console.log('\n🔒 [SÉCURITÉ] Mode insertion sécurisée activé');
  
  // Vérifier ce qui existe déjà
  const existingSections = await checkExistingSections();
  const existingTypes = existingSections.map(s => s.type);
  
  // Sections par défaut à insérer UNIQUEMENT si elles n'existent pas
  const defaultSections = [
    {
      type: 'hero',
      title: 'Section Hero',
      description: 'Carrousel principal avec carte de fidélité',
      isVisible: true,
      order: 1,
      content: JSON.stringify({
        slides: [
          {
            id: 'loyalty-card',
            title: '6 achetées, 7ème gratuite',
            subtitle: 'Programme exclusif',
            description: 'Collectionnez vos achats et obtenez une paire gratuite pour toute la famille.',
            isLoyaltyCard: true,
            accent: 'from-indigo-800 via-blue-700 to-blue-900',
            textColor: 'text-white',
            stampCount: 6,
            showPhysicalCard: true,
            locations: [
              { name: 'Centre ville', address: '39 rue Larbi Ben mhidi - Oran', phone: '+213(0) 554 625 100' },
              { name: 'Millenium', address: '15 Coop El-Mieh Hai Khemisti Bir EL Djir - Oran', phone: '+213(0) 542 203 449' }
            ]
          }
        ]
      })
    },
    {
      type: 'categories',
      title: 'Nos Catégories',
      description: 'Collection de catégories principales',
      isVisible: true,
      order: 2,
      content: JSON.stringify({
        categories: [
          { id: 'sandals', name: 'Sandales', link: '/categories/sandals' },
          { id: 'boots', name: 'Bottes', link: '/categories/boots' },
          { id: 'accessories', name: 'Accessoires', link: '/categories/accessories' }
        ]
      })
    },
    {
      type: 'collection',
      title: 'Collection en Vedette',
      description: 'Nos collections populaires',
      isVisible: true,
      order: 3,
      content: JSON.stringify({
        featured: {
          title: 'Nouveautés Automne',
          description: 'Découvrez les dernières tendances'
        }
      })
    },
    {
      type: 'advantages',
      title: 'Nos Avantages',
      description: 'Pourquoi choisir notre boutique',
      isVisible: true,
      order: 4,
      content: JSON.stringify({
        features: [
          { id: 'shipping', title: 'Livraison Rapide', description: 'Gratuite dès 50€' },
          { id: 'quality', title: 'Qualité Garantie', description: 'Produits authentiques' }
        ]
      })
    },
    {
      type: 'new-products',
      title: 'Nouveautés',
      description: 'Dernières arrivées',
      isVisible: true,
      order: 5,
      content: JSON.stringify({
        products: []
      })
    }
  ];
  
  // Insérer UNIQUEMENT les sections manquantes
  for (const section of defaultSections) {
    if (!existingTypes.includes(section.type)) {
      console.log(`➕ [SÉCURITÉ] Insertion de la section manquante: ${section.type}`);
      
      try {
        const response = await fetch(`${ADMIN_API_URL}/api/content/home-sections`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(section)
        });
        
        if (response.ok) {
          console.log(`✅ [SÉCURITÉ] Section ${section.type} insérée avec succès`);
        } else {
          console.error(`❌ [SÉCURITÉ] Erreur insertion ${section.type}:`, response.status);
        }
      } catch (error) {
        console.error(`❌ [SÉCURITÉ] Erreur réseau pour ${section.type}:`, error);
      }
    } else {
      console.log(`⏭️ [SÉCURITÉ] Section ${section.type} existe déjà, ignorée`);
    }
  }
};

/**
 * 🔍 FONCTION DE RAPPORT FINAL
 */
const generateReport = async () => {
  console.log('\n📊 [RAPPORT] Génération du rapport final...');
  
  const sections = await checkExistingSections();
  
  console.log('\n=== RAPPORT FINAL ===');
  console.log(`Total des sections: ${sections.length}`);
  console.log(`Sections visibles: ${sections.filter(s => s.isVisible).length}`);
  console.log(`Sections masquées: ${sections.filter(s => !s.isVisible).length}`);
  
  if (sections.length > 0) {
    console.log('\n📋 Détail par ordre:');
    sections
      .sort((a, b) => a.order - b.order)
      .forEach(section => {
        const status = section.isVisible ? '✅ VISIBLE' : '❌ MASQUÉE';
        console.log(`  ${section.order}. ${section.type} - ${section.title} ${status}`);
      });
  }
  
  console.log('\n🎯 [RAPPORT] Terminé !');
};

/**
 * 🚀 EXECUTION PRINCIPALE
 */
const main = async () => {
  console.log('🛡️ [SETUP] Démarrage du setup sécurisé des sections...\n');
  
  try {
    // Étape 1: Vérification
    await checkExistingSections();
    
    // Étape 2: Insertion sécurisée (sans suppression)
    await insertMissingSections();
    
    // Étape 3: Rapport final
    await generateReport();
    
  } catch (error) {
    console.error('❌ [SETUP] Erreur critique:', error);
  }
};

if (require.main === module) {
  main();
}

module.exports = { checkExistingSections, insertMissingSections, generateReport };
