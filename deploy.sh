#!/bin/bash

# Script de déploiement production - Client (birkshoes.store)

echo "🚀 Déploiement du client Birkshoes en production..."

# Variables
PROJECT_DIR="/var/www/birkshoes.store"
REPO_URL="https://github.com/your-username/ecommerce-client.git"

cd $PROJECT_DIR

# Pull du code
echo "📥 Récupération du code..."
git fetch --all
git reset --hard origin/main

# Installation des dépendances
echo "📦 Installation des dépendances..."
npm ci --only=production

# Build production
echo "🔨 Build de production..."
npm run build:prod

# Redémarrage PM2
echo "🔄 Redémarrage du service..."
pm2 restart birkshoes-client || pm2 start ecosystem.config.json

echo "✅ Déploiement client terminé !"
