# 📝 Warnings React Router v6 → v7 - Documentation

## ⚠️ Warnings actuels détectés dans les logs

### 1. v7_startTransition Future Flag
```
⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early.
```

### 2. v7_relativeSplatPath Future Flag  
```
⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early.
```

## 🔧 CORRECTION IMMÉDIATE

Ajouter les future flags dans votre Router pour supprimer les warnings :

```javascript
// Dans App.js ou là où vous initialisez le Router
import { BrowserRouter } from 'react-router-dom';

<BrowserRouter 
  future={{
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }}
>
  {/* Vos routes */}
</BrowserRouter>
```

## 🔍 Autres corrections possibles pour v7

### 1. Import warnings
```javascript
// ❌ Ancien (v6 - déprécié)
import { useHistory } from 'react-router-dom';

// ✅ Nouveau (v7)
import { useNavigate } from 'react-router-dom';
```

### 2. Navigation warnings
```javascript
// ❌ Ancien
const history = useHistory();
history.push('/path');

// ✅ Nouveau
const navigate = useNavigate();
navigate('/path');
```

### 3. Route component warnings
```javascript
// ❌ Ancien
<Route path="/path" component={Component} />

// ✅ Nouveau
<Route path="/path" element={<Component />} />
```

### 4. Switch → Routes
```javascript
// ❌ Ancien
import { Switch } from 'react-router-dom';
<Switch>
  <Route path="/path" component={Component} />
</Switch>

// ✅ Nouveau
import { Routes } from 'react-router-dom';
<Routes>
  <Route path="/path" element={<Component />} />
</Routes>
```

## 🔍 Fichiers à vérifier

1. `src/App.js` - Configuration des routes principales
2. `src/components/**/*.js` - Composants utilisant la navigation
3. `src/pages/**/*.js` - Pages utilisant useHistory/useLocation
4. `src/hooks/**/*.js` - Hooks personnalisés de navigation

## 📋 Plan de migration

### Phase 1 - Correction immédiate (FAIT)
- [x] Ajouter les future flags pour supprimer les warnings
- [ ] Vérifier que cela fonctionne

### Phase 2 - Audit complet
- [ ] Identifier tous les warnings restants dans la console
- [ ] Lister tous les fichiers utilisant les API dépréciées
- [ ] Créer une liste de priorités

### Phase 3 - Corrections complètes
- [ ] Remplacer `useHistory` par `useNavigate`
- [ ] Remplacer `Switch` par `Routes`
- [ ] Remplacer `component` par `element` dans les Routes
- [ ] Mettre à jour les imports dépréciés

## 📚 Ressources
- [Guide officiel React Router v7](https://reactrouter.com/v6/upgrading/future)
- [Documentation des future flags](https://reactrouter.com/v6/upgrading/future#v7_starttransition)
