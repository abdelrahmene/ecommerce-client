# =============================================================================
# 🔧 SOLUTION RAPIDE - CORRECTION 502 Bad Gateway
# =============================================================================

# Le problème : L'application écoute sur le port 3000 au lieu de 3001

# OPTION 1 - Solution avec serve (plus simple)
# =============================================
cd /var/www/ecommerce-client
pm2 stop ecommerce-client
pm2 delete ecommerce-client
pm2 start ecosystem-serve.config.js

# OPTION 2 - Solution avec serveur Express (plus robuste)
# ========================================================
cd /var/www/ecommerce-client
npm install express connect-history-api-fallback
pm2 stop ecommerce-client
pm2 delete ecommerce-client
pm2 start ecosystem.config.js

# Vérification
# ============
pm2 list
pm2 logs ecommerce-client --lines 10

# Test de fonctionnement
# ======================
curl http://localhost:3001

# Si tout fonctionne, vous devriez voir votre site React
# L'application devrait maintenant répondre sur le port 3001
# et Nginx pourra correctement proxy vers ce port.

# =============================================================================
# 📝 RÉSUMÉ DU PROBLÈME
# =============================================================================

# Problème identifié :
# - PM2 logs montrent : "Accepting connections at http://localhost:3000" 
# - Mais Nginx est configuré pour proxy vers le port 3001
# - Résultat : 502 Bad Gateway car rien n'écoute sur 3001

# Solution appliquée :
# - Forcer l'application à écouter sur le port 3001
# - Utiliser `npx serve -s build -l 3001` ou serveur Express custom
# - S'assurer que PM2 utilise la bonne configuration

# =============================================================================
