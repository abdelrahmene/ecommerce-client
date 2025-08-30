@echo off
echo ===================================
echo 🚀 Démarrage de la stack Birkshoes
echo ===================================

echo.
echo 📊 1. Démarrage de l'API backend...
cd /d "C:\Users\abdelrahmene fares\Desktop\birkshoes-api"
start "API Backend" cmd /k "npm run dev"

echo.
echo ⏳ Attendre que l'API démarre (5 secondes)...
timeout /t 5 /nobreak

echo.
echo 🎨 2. Démarrage du client React...
cd /d "C:\ecommerce-client"
start "React Client" cmd /k "npm start"

echo.
echo ✅ Services lancés:
echo    - API Backend: http://localhost:4000
echo    - Client React: http://localhost:3001
echo.
echo 📝 Pour créer des sections de test dans la DB:
echo    cd "C:\Users\abdelrahmene fares\Desktop\birkshoes-api"
echo    npx tsx create-test-sections.ts
echo.
echo 🔧 Si problème de CORS, vérifiez que l'API est bien démarrée
pause
