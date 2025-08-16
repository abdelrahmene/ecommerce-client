@echo off
echo.
echo ==============================================
echo 🚀 DÉMARRAGE RAPIDE - MIGRATION HOME SECTIONS
echo ==============================================
echo.
echo ⚠️  ATTENTION: Ce script ne supprime RIEN !
echo ✅ Il ajoute seulement ce qui manque en base.
echo.
pause

echo.
echo 📡 [ÉTAPE 1] Test de connectivité...
echo.
node src/scripts/test-connection.js
echo.

echo.
echo ⏳ Appuyez sur une touche pour continuer vers l'étape 2...
pause

echo.
echo 🔧 [ÉTAPE 2] Setup des sections...
echo.
powershell -ExecutionPolicy Bypass -File "src\scripts\setup-home-sections.ps1"
echo.

echo.
echo ⏳ Appuyez sur une touche pour la vérification finale...
pause

echo.
echo 🔍 [ÉTAPE 3] Vérification finale...
echo.
node src/scripts/verify-sections.js
echo.

echo.
echo ✅ MIGRATION TERMINÉE !
echo.
echo 📋 Prochaines étapes:
echo   1. Aller sur http://localhost:3000/content
echo   2. Modifier le contenu des sections
echo   3. Voir les changements sur http://localhost:3001
echo.
echo 📞 En cas de problème, voir README-MIGRATION.md
echo.
pause
