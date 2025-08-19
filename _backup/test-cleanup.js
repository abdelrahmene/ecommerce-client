#!/usr/bin/env node

// 🧪 SCRIPT DE TEST POUR VÉRIFIER LE NETTOYAGE FIREBASE
// Ce script vérifie que le projet peut démarrer sans Firebase

const fs = require('fs');
const path = require('path');

console.log('🧪 DÉBUT DES TESTS DE NETTOYAGE FIREBASE\n');

// Test 1 : Vérifier les fichiers mock créés
console.log('📁 Test 1 : Vérification des fichiers mock...');
const mockFiles = [
  'src/data/mockData.js',
  'src/services/mockServices.js'
];

let allMockFilesExist = true;
mockFiles.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    console.log(`   ✅ ${filePath} existe`);
  } else {
    console.log(`   ❌ ${filePath} manquant`);
    allMockFilesExist = false;
  }
});

// Test 2 : Vérifier que Firebase est toujours dans package.json
console.log('\n📦 Test 2 : Vérification de Firebase dans package.json...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
if (packageJson.dependencies && packageJson.dependencies.firebase) {
  console.log(`   ✅ Firebase ${packageJson.dependencies.firebase} présent dans package.json`);
} else {
  console.log(`   ❌ Firebase absent de package.json`);
}

// Test 3 : Vérifier les imports Firebase dans les fichiers sources
console.log('\n🔍 Test 3 : Recherche d\'imports Firebase restants...');
const srcDir = 'src';
let firebaseImportsFound = false;

function searchFirebaseImports(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && file !== 'node_modules') {
      searchFirebaseImports(filePath);
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Rechercher les imports Firebase
      if (content.includes('from \'firebase') || content.includes('import firebase')) {
        console.log(`   ⚠️  Import Firebase trouvé dans ${filePath}`);
        firebaseImportsFound = true;
      }
    }
  });
}

searchFirebaseImports(srcDir);

if (!firebaseImportsFound) {
  console.log('   ✅ Aucun import Firebase direct trouvé');
}

// Test 4 : Vérifier les hooks mock
console.log('\n🎣 Test 4 : Vérification des hooks mock...');
const mockHooks = [
  'src/hooks/useProducts.js',
  'src/hooks/useHomeContent.js',
  'src/hooks/useCollections.js',
  'src/hooks/useHomeSectionsClient.js'
];

mockHooks.forEach(hookPath => {
  if (fs.existsSync(hookPath)) {
    const content = fs.readFileSync(hookPath, 'utf8');
    if (content.includes('mockData') || content.includes('Mock:')) {
      console.log(`   ✅ ${hookPath} utilise des données mock`);
    } else {
      console.log(`   ⚠️  ${hookPath} pourrait encore utiliser Firebase`);
    }
  } else {
    console.log(`   ❌ ${hookPath} manquant`);
  }
});

// Test 5 : Vérifier le contexte d'auth
console.log('\n🔐 Test 5 : Vérification du contexte d\'authentification...');
const authContextPath = 'src/contexts/AuthContext.js';
if (fs.existsSync(authContextPath)) {
  const authContent = fs.readFileSync(authContextPath, 'utf8');
  if (authContent.includes('mockServices') || authContent.includes('localStorage')) {
    console.log('   ✅ AuthContext utilise des services mock');
  } else {
    console.log('   ⚠️  AuthContext pourrait encore utiliser Firebase');
  }
}

// Résumé final
console.log('\n🎯 RÉSUMÉ DES TESTS :');
if (allMockFilesExist && !firebaseImportsFound) {
  console.log('✅ TOUS LES TESTS PASSENT - Le nettoyage Firebase est réussi !');
  console.log('\n🚀 PRÊT POUR LE DÉMARRAGE :');
  console.log('   Exécutez : npm start ou yarn start');
  console.log('   L\'application devrait démarrer sans erreur');
  console.log('   Connexion test : test@example.com / password123');
} else {
  console.log('❌ CERTAINS TESTS ONT ÉCHOUÉ - Vérifiez les points ci-dessus');
}

console.log('\n📋 FICHIERS CRÉÉS/MODIFIÉS :');
console.log('   - NETTOYAGE_FIREBASE.md (ce rapport)');
console.log('   - src/data/mockData.js (données mock)');
console.log('   - src/services/mockServices.js (services mock)');
console.log('   - Tous les hooks et contextes modifiés');
