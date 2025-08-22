#!/bin/bash

# =============================================================================
# 🔧 GUIDE DE CORRECTION - ERREUR 502 Bad Gateway
# =============================================================================

echo "🚀 Correction du problème 502 Bad Gateway..."

# 1. Aller dans le dossier du projet sur le serveur
cd /var/www/ecommerce-client

# 2. Arrêter l'application actuelle
echo "📴 Arrêt de l'application..."
pm2 stop ecommerce-client
pm2 delete ecommerce-client

# 3. Installer les nouvelles dépendances
echo "📦 Installation des dépendances..."
npm install express connect-history-api-fallback

# 4. Copier les nouveaux fichiers depuis votre machine locale
echo "📁 Assurez-vous d'avoir copié :"
echo "   - server.js"
echo "   - ecosystem.config.js (mise à jour)"
echo "   - package.json (mise à jour)"

# 5. Vérifier que le build existe
if [ ! -d "build" ]; then
    echo "❌ Le dossier build n'existe pas !"
    echo "   Copiez le dossier build depuis votre machine locale"
    exit 1
fi

# 6. Démarrer avec la nouvelle configuration
echo "🚀 Démarrage avec la nouvelle configuration..."
pm2 start ecosystem.config.js

# 7. Vérifier le statut
echo "📊 Vérification du statut..."
pm2 list

# 8. Voir les logs
echo "📄 Logs de démarrage :"
pm2 logs ecommerce-client --lines 10

echo ""
echo "✅ Configuration mise à jour !"
echo "🌐 L'application devrait maintenant fonctionner sur le port 3001"
echo "🔗 Test : curl http://localhost:3001"
