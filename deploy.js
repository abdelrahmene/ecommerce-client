const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Démarrage du déploiement en production...');

// 1. Vérifier que les variables d'environnement sont correctes
const productionEnv = `# Configuration API pour la production
# URL de base de l'API Backend en production
REACT_APP_API_BASE_URL=http://148.230.125.251:4000

# Variables pour la production
REACT_APP_ENV=production
REACT_APP_DEBUG=false

# Désactiver la génération de source maps pour la production
GENERATE_SOURCEMAP=false
`;

// Écrire le fichier .env.production
fs.writeFileSync('.env.production', productionEnv);
console.log('✅ Fichier .env.production créé/mis à jour');

// 2. Build avec les bonnes variables
console.log('📦 Build de l\'application...');
try {
  execSync('npm run build', {
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: 'production',
      REACT_APP_API_BASE_URL: 'http://148.230.125.251:4000',
      REACT_APP_ENV: 'production',
      REACT_APP_DEBUG: 'false',
      GENERATE_SOURCEMAP: 'false'
    }
  });
  console.log('✅ Build terminé avec succès!');
} catch (error) {
  console.error('❌ Erreur lors du build:', error.message);
  process.exit(1);
}

console.log('✅ Déploiement terminé!');
console.log('🌐 L\'application utilise maintenant l\'API: http://148.230.125.251:4000');
console.log('📁 Les fichiers sont prêts dans le dossier build/');
console.log('');
console.log('📋 Prochaines étapes:');
console.log('  1. Copier le contenu du dossier build/ vers votre serveur');
console.log('  2. Redémarrer votre serveur web');
console.log('  3. Vérifier que l\'API backend est accessible sur http://148.230.125.251:4000');
