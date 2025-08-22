#!/bin/bash

# Script de déploiement complet pour le serveur
# À exécuter sur le serveur de production

echo "🚀 Déploiement frontend ecommerce-client"
echo "========================================"

# Variables
PROJECT_DIR="/var/www/ecommerce-client"
BACKUP_DIR="/var/www/backups/ecommerce-client-$(date +%Y%m%d-%H%M%S)"
PM2_APP="ecommerce-client"

# 1. Créer un backup
echo "📦 Création du backup..."
if [ -d "$PROJECT_DIR" ]; then
    mkdir -p "$(dirname "$BACKUP_DIR")"
    cp -r "$PROJECT_DIR" "$BACKUP_DIR"
    echo "✅ Backup créé dans $BACKUP_DIR"
else
    echo "⚠️  Dossier projet non trouvé, pas de backup nécessaire"
fi

# 2. Arrêter PM2
echo "⏹️  Arrêt de l'application..."
pm2 stop $PM2_APP 2>/dev/null || echo "Application n'était pas démarrée"

# 3. Créer le dossier projet si nécessaire
mkdir -p "$PROJECT_DIR"
cd "$PROJECT_DIR"

# 4. Les fichiers build ont été copiés manuellement ou via un autre moyen
# Vérifier que les fichiers sont présents
if [ ! -d "build" ]; then
    echo "❌ Erreur: Dossier build/ non trouvé!"
    echo "Veuillez copier les fichiers de build avant d'exécuter ce script."
    exit 1
fi

# 5. Installer serve si pas présent
echo "📥 Vérification de serve..."
if ! command -v serve &> /dev/null; then
    echo "Installation de serve..."
    npm install -g serve
fi

# 6. Configurer PM2 avec le nouveau fichier de configuration
echo "⚙️  Configuration PM2..."
if [ -f "ecosystem.config.js" ]; then
    pm2 start ecosystem.config.js
else
    # Configuration par défaut si pas de fichier ecosystem
    pm2 start serve --name $PM2_APP -- -s build -l 3001
fi

# 7. Vérifications
echo "🔍 Vérifications..."
sleep 2

# Vérifier que PM2 a démarré l'app
if pm2 list | grep -q "$PM2_APP.*online"; then
    echo "✅ Application démarrée avec succès"
else
    echo "❌ Erreur lors du démarrage"
    pm2 logs $PM2_APP --lines 10
    exit 1
fi

# Vérifier que l'API backend est accessible
echo "🌐 Vérification de l'API backend..."
if curl -f -s http://148.230.125.251:4000/api/categories > /dev/null; then
    echo "✅ API backend accessible"
else
    echo "⚠️  API backend non accessible sur http://148.230.125.251:4000"
    echo "   Vérifiez que birkshoes-api est démarré"
fi

# Vérifier que le frontend répond
echo "🌐 Vérification du frontend..."
if curl -f -s http://localhost:3001 > /dev/null; then
    echo "✅ Frontend accessible sur le port 3001"
else
    echo "❌ Frontend non accessible"
fi

echo ""
echo "🎉 Déploiement terminé!"
echo "📋 Résumé:"
echo "   - Frontend: http://148.230.125.251:3001"
echo "   - API: http://148.230.125.251:4000"
echo "   - Backup: $BACKUP_DIR"
echo ""
echo "📊 Status PM2:"
pm2 list
