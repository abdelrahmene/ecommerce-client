/**
 * Script de test pour vérifier la connexion à l'API home-sections
 * URL CORRECTE: http://localhost:4000/api/content/home-sections
 */

const API_BASE_URL = 'http://localhost:4000/api';

async function testHomeAPI() {
  console.log('🧪 Test de l\'API Home Sections');
  console.log('='.repeat(50));
  
  try {
    const url = `${API_BASE_URL}/content/home-sections`;
    console.log(`📡 Test de l'URL CORRECTE: ${url}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    console.log(`📈 Status: ${response.status} ${response.statusText}`);
    console.log(`🔗 URL finale: ${response.url}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Succès! Données reçues:');
      console.log(JSON.stringify(data, null, 2));
      console.log(`📏 Nombre de sections: ${Array.isArray(data) ? data.length : 'Non-array'}`);
    } else {
      const errorText = await response.text();
      console.log('❌ Erreur HTTP:');
      console.log(`Status: ${response.status}`);
      console.log(`Message: ${errorText}`);
      
      if (response.status === 404) {
        console.log('\n💡 La route /api/content/home-sections n\'existe pas sur le serveur');
        console.log('   Vérifiez dans le backend si cette route est implémentée');
        console.log('   Exemple: router.get(\'/content/home-sections\', ...)');
      }
    }
    
  } catch (error) {
    console.log('💥 Erreur de connexion:');
    console.log(`Type: ${error.name}`);
    console.log(`Message: ${error.message}`);
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      console.log('\n💡 Le serveur backend ne répond pas');
      console.log('   1. Vérifiez que le serveur est démarré');
      console.log('   2. Vérifiez que le serveur écoute sur http://localhost:4000');
      console.log('   3. Vérifiez les CORS si nécessaire');
      console.log('   4. Backend attendu: C:\\Users\\abdelrahmene fares\\Desktop\\birkshoes-api');
    }
  }
}

// Test des autres routes API pour comparaison
async function testOtherAPIs() {
  console.log('\n🔍 Test des autres routes API:');
  console.log('-'.repeat(30));
  
  const routes = [
    '/auth/login',
    '/products', 
    '/content',
    '/api-docs',  // Documentation Swagger
    '/health',    // Route de santé commune
    '/ping'       // Test simple
  ];
  
  for (const route of routes) {
    try {
      const url = `http://localhost:4000/api${route}`;
      const response = await fetch(url, { 
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      console.log(`${route}: ${response.status} ${response.statusText}`);
      
      // Si c'est une route de contenu, on affiche plus de détails
      if (route.includes('content') && response.ok) {
        try {
          const data = await response.json();
          console.log(`  -> ${Array.isArray(data) ? data.length + ' éléments' : typeof data}`);
        } catch (e) {
          console.log('  -> Réponse non-JSON');
        }
      }
    } catch (error) {
      console.log(`${route}: ERREUR (${error.name})`);
    }
  }
}

// Test spécifique des routes de contenu
async function testContentRoutes() {
  console.log('\n📄 Test spécifique des routes de contenu:');
  console.log('-'.repeat(40));
  
  const contentRoutes = [
    '/content',
    '/content/sections',
    '/content/home',
    '/content/home-sections',
    '/sections',
    '/home-sections'
  ];
  
  for (const route of contentRoutes) {
    try {
      const url = `http://localhost:4000/api${route}`;
      const response = await fetch(url);
      console.log(`${route}: ${response.status} ${response.statusText}`);
      
      if (response.status === 200) {
        console.log('✅ ROUTE TROUVÉE!');
        try {
          const data = await response.json();
          console.log('  Data type:', Array.isArray(data) ? `Array(${data.length})` : typeof data);
          if (Array.isArray(data) && data.length > 0) {
            console.log('  Premier élément:', Object.keys(data[0]));
          }
        } catch (e) {
          console.log('  Réponse non-JSON');
        }
      }
    } catch (error) {
      console.log(`${route}: ERREUR RÉSEAU`);
    }
  }
}

// Exécution des tests
testHomeAPI().then(() => {
  return testOtherAPIs();
}).then(() => {
  return testContentRoutes();
}).then(() => {
  console.log('\n✨ Tous les tests terminés');
  console.log('\n💡 RECOMMANDATIONS:');
  console.log('1. Vérifiez que le backend est démarré sur http://localhost:4000');
  console.log('2. Recherchez la route correcte dans les résultats ci-dessus');
  console.log('3. Si aucune route de contenu ne fonctionne, implémentez-en une dans le backend');
  console.log('4. L\'URL correcte doit être: http://localhost:4000/api/[ROUTE_TROUVÉE]');
}).catch(console.error);
