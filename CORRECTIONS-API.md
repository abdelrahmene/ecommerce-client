# 🔧 GUIDE DE CORRECTION API - Birkshoes

## ✅ Corrections apportées

### 1. URLs API corrigées
- **homeService.js**: URL API corrigée vers `http://localhost:4000/api/content/home-sections`
- **collectionsService.js**: URLs API corrigées avec `/api/` prefix
- **api.js**: Configuration API mise à jour

### 2. Variables d'environnement
- **Client (.env)**: `REACT_APP_API_URL=http://localhost:4000`
- **Backend (.env)**: Ajout de `http://localhost:3000` dans ALLOWED_ORIGINS

### 3. Support section "nouveau-produit"
- **DynamicSection.js**: Ajout du support pour le type `nouveau-produit`
- **Fallback data**: Section "nouveau-produit" remplacée par "collection"

### 4. Scripts de test créés
- **create-test-sections.ts**: Script pour créer du contenu test dans la DB
- **start-dev.bat**: Script pour lancer les deux services

## 🚀 Comment tester

### 1. Démarrer les services
```bash
# Terminal 1 - API Backend
cd "C:\Users\abdelrahmene fares\Desktop\birkshoes-api"
npm run dev

# Terminal 2 - Client React  
cd "C:\ecommerce-client"
npm start
```

### 2. Créer du contenu test (optionnel)
```bash
cd "C:\Users\abdelrahmene fares\Desktop\birkshoes-api"
npx tsx create-test-sections.ts
```

### 3. Vérifier les URLs
- **Backend API**: http://localhost:4000
- **Client React**: http://localhost:3000
- **Test API**: http://localhost:4000/api/content/home-sections

## 🔍 Diagnostic des erreurs

### Si erreur 404 sur `/content/home-sections`:
✅ **CORRIGÉ**: L'URL est maintenant `/api/content/home-sections`

### Si erreur CORS:
✅ **CORRIGÉ**: `localhost:3000` ajouté aux origines autorisées

### Si "nouveau-produit non supporté":
✅ **CORRIGÉ**: Type ajouté dans DynamicSection.js

### Si pas de données collections:
- Vérifiez que l'API backend tourne sur :4000
- Exécutez le script de test sections
- Les données fallback s'affichent automatiquement

## 📊 Structure des données attendues

```json
{
  "id": "collections-section",
  "type": "collection",
  "title": "Nos Collections",
  "content": {
    "items": [
      {
        "id": "collection-1",
        "title": "Collection Classique",
        "subtitle": "Élégance intemporelle",
        "description": "Des modèles classiques...",
        "image": "/images/collection-classic.jpg",
        "link": "/collections/classique"
      }
    ]
  }
}
```

## 🎯 Résultat attendu
- ✅ Plus d'erreurs 404 dans la console
- ✅ Plus d'erreurs CORS  
- ✅ Sections affichées (fallback ou API)
- ✅ Type "nouveau-produit" supporté
- ✅ Collections chargées depuis l'API

---
*Corrections appliquées le $(date)*
