# Guide de Déploiement Production

## Problème Identifié

L'application frontend utilise `localhost:4000` en production au lieu de l'adresse IP publique du serveur. 

### Erreurs corrigées :

1. **Configuration API incorrecte** : `localhost:4000` → `http://148.230.125.251:4000`
2. **Types de sections manquants** : Ajout du support pour `featured_products` et `trust_features`
3. **Problèmes CORS avec images externes** (Birkenstock)

## Solution

### 1. Fichiers de configuration créés/modifiés :

- `.env.production` : Variables d'environnement pour la production
- `deploy.js` : Script de déploiement automatisé
- `DynamicSection.js` : Ajout du support pour les types de sections manquants

### 2. Scripts de déploiement :

```bash
# Build pour la production avec les bonnes variables
npm run build:prod

# Ou utiliser le script de déploiement complet
npm run deploy
```

### 3. Variables d'environnement production :

```env
REACT_APP_API_BASE_URL=http://148.230.125.251:4000
REACT_APP_ENV=production
REACT_APP_DEBUG=false
GENERATE_SOURCEMAP=false
```

## Instructions de déploiement

### Sur votre machine locale :

1. **Générer le build de production :**
   ```bash
   cd C:\ecommerce-client
   npm run deploy
   ```

2. **Copier les fichiers vers le serveur :**
   ```bash
   # Le contenu du dossier build/ doit être copié vers /var/www/ecommerce-client/
   ```

### Sur le serveur :

1. **Arrêter l'application :**
   ```bash
   pm2 stop ecommerce-client
   ```

2. **Remplacer les fichiers :**
   ```bash
   # Copier le nouveau build dans /var/www/ecommerce-client/
   ```

3. **Redémarrer l'application :**
   ```bash
   pm2 start ecommerce-client
   ```

## Vérifications

1. **API Backend accessible :**
   ```bash
   curl http://148.230.125.251:4000/api/content/home-sections
   ```

2. **Application frontend accessible :**
   ```bash
   curl http://148.230.125.251:3001
   ```

## Configuration PM2

Assurez-vous que votre configuration PM2 pour le client utilise le bon port et les bonnes variables d'environnement :

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'ecommerce-client',
    script: 'serve',
    args: '-s build -l 3001',
    env: {
      NODE_ENV: 'production',
      REACT_APP_API_BASE_URL: 'http://148.230.125.251:4000'
    }
  }]
}
```

## Notes importantes

- L'API backend doit être accessible sur le port 4000
- Le frontend sera accessible sur le port 3001
- Les images externes (Birkenstock) peuvent ne pas se charger à cause des restrictions CORS
- Un système de fallback est en place pour les images qui ne se chargent pas
