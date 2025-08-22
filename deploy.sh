#!/bin/bash

# Script de déploiement pour la production
# Copie les fichiers et configure les variables d'environnement

echo "🚀 Démarrage du déploiement en production..."

# 1. Build avec les variables de production
echo "📦 Build de l'application..."
NODE_ENV=production REACT_APP_API_BASE_URL=http://148.230.125.251:4000 npm run build

# 2. Copier les fichiers vers le dossier de déploiement
echo "📁 Copie des fichiers..."
# Cette partie sera adaptée selon votre méthode de déploiement

echo "✅ Déploiement terminé!"
echo "🌐 L'application utilise maintenant l'API: http://148.230.125.251:4000"
