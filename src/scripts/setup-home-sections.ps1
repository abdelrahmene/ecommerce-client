# 🛡️ SCRIPT POWERSHELL SÉCURISÉ - SETUP SECTIONS HOME
# ATTENTION: Ce script ne supprime JAMAIS rien ! Il vérifie d'abord ce qui existe.

Write-Host "🛡️ [SETUP SÉCURISÉ] Démarrage..." -ForegroundColor Green

# Variables de configuration
$AdminUrl = if ($env:REACT_APP_ADMIN_API_URL) { $env:REACT_APP_ADMIN_API_URL } else { "http://localhost:4000" }
$ApiEndpoint = "$AdminUrl/api/content/home-sections"

Write-Host "🔗 [CONFIG] URL Admin: $AdminUrl" -ForegroundColor Cyan

# Fonction: Vérifier les sections existantes (LECTURE SEULE)
function Get-ExistingSections {
    Write-Host "🔍 [SÉCURITÉ] Vérification des sections existantes..." -ForegroundColor Yellow
    
    try {
        $response = Invoke-RestMethod -Uri $ApiEndpoint -Method GET -ContentType "application/json"
        
        if ($response.success) {
            $sections = $response.data
            Write-Host "📊 [SÉCURITÉ] $($sections.Count) sections trouvées" -ForegroundColor Green
            
            if ($sections.Count -gt 0) {
                Write-Host "📋 [SÉCURITÉ] Sections existantes:" -ForegroundColor White
                $sections | ForEach-Object { 
                    $status = if ($_.isVisible) { "✅ VISIBLE" } else { "❌ MASQUÉE" }
                    Write-Host "  - $($_.type) : $($_.title) $status" -ForegroundColor Gray
                }
            }
            
            return $sections
        } else {
            Write-Host "⚠️ [SÉCURITÉ] Réponse API invalide" -ForegroundColor Red
            return @()
        }
    }
    catch {
        Write-Host "❌ [SÉCURITÉ] Erreur: $($_.Exception.Message)" -ForegroundColor Red
        return @()
    }
}

# Fonction: Insérer UNIQUEMENT les sections manquantes
function Add-MissingSections {
    param($ExistingSections)
    
    Write-Host "🔒 [INSERTION] Mode sécurisé activé (aucune suppression)" -ForegroundColor Green
    
    $existingTypes = $ExistingSections | ForEach-Object { $_.type }
    
    # Sections par défaut (sera inséré UNIQUEMENT si absent)
    $defaultSections = @(
        @{
            type = "hero"
            title = "Section Hero"
            description = "Carrousel principal avec carte de fidélité"
            isVisible = $true
            order = 1
            content = '{"slides":[{"id":"loyalty-card","title":"6 achetées, 7ème gratuite","subtitle":"Programme exclusif","description":"Collectionnez vos achats et obtenez une paire gratuite.","isLoyaltyCard":true}]}'
        },
        @{
            type = "categories"
            title = "Nos Catégories"
            description = "Collection de catégories principales"
            isVisible = $true
            order = 2
            content = '{"categories":[{"id":"sandals","name":"Sandales"},{"id":"boots","name":"Bottes"}]}'
        },
        @{
            type = "collection"
            title = "Collection en Vedette"
            description = "Nos collections populaires"
            isVisible = $true
            order = 3
            content = '{"featured":{"title":"Nouveautés Automne"}}'
        },
        @{
            type = "advantages"
            title = "Nos Avantages"
            description = "Pourquoi choisir notre boutique"
            isVisible = $true
            order = 4
            content = '{"features":[{"title":"Livraison Rapide"},{"title":"Qualité Garantie"}]}'
        },
        @{
            type = "new-products"
            title = "Nouveautés"
            description = "Dernières arrivées"
            isVisible = $true
            order = 5
            content = '{"products":[]}'
        }
    )
    
    foreach ($section in $defaultSections) {
        if ($section.type -notin $existingTypes) {
            Write-Host "➕ [INSERTION] Ajout de la section manquante: $($section.type)" -ForegroundColor Yellow
            
            try {
                $body = $section | ConvertTo-Json -Depth 10
                $response = Invoke-RestMethod -Uri $ApiEndpoint -Method POST -Body $body -ContentType "application/json"
                
                if ($response.success) {
                    Write-Host "✅ [INSERTION] Section $($section.type) ajoutée avec succès" -ForegroundColor Green
                } else {
                    Write-Host "❌ [INSERTION] Erreur pour $($section.type): $($response.message)" -ForegroundColor Red
                }
            }
            catch {
                Write-Host "❌ [INSERTION] Erreur réseau pour $($section.type): $($_.Exception.Message)" -ForegroundColor Red
            }
        } else {
            Write-Host "⏭️ [INSERTION] Section $($section.type) existe déjà, ignorée" -ForegroundColor Gray
        }
    }
}

# Fonction: Générer un rapport final
function Show-FinalReport {
    Write-Host "`n📊 [RAPPORT] Génération du rapport final..." -ForegroundColor Cyan
    
    $sections = Get-ExistingSections
    
    Write-Host "`n=== RAPPORT FINAL ===" -ForegroundColor White
    Write-Host "Total des sections: $($sections.Count)" -ForegroundColor White
    Write-Host "Sections visibles: $($sections | Where-Object { $_.isVisible } | Measure-Object | Select-Object -ExpandProperty Count)" -ForegroundColor Green
    Write-Host "Sections masquées: $($sections | Where-Object { -not $_.isVisible } | Measure-Object | Select-Object -ExpandProperty Count)" -ForegroundColor Red
    
    if ($sections.Count -gt 0) {
        Write-Host "`n📋 Détail par ordre:" -ForegroundColor White
        $sections | Sort-Object order | ForEach-Object {
            $status = if ($_.isVisible) { "✅ VISIBLE" } else { "❌ MASQUÉE" }
            Write-Host "  $($_.order). $($_.type) - $($_.title) $status" -ForegroundColor Gray
        }
    }
    
    Write-Host "`n🎯 [RAPPORT] Setup terminé avec succès !" -ForegroundColor Green
}

# EXECUTION PRINCIPALE
try {
    # Étape 1: Vérification (LECTURE SEULE)
    Write-Host "`n🔍 [ÉTAPE 1] Vérification de l'existant..." -ForegroundColor Cyan
    $existingSections = Get-ExistingSections
    
    # Étape 2: Insertion sécurisée (AUCUNE SUPPRESSION)
    Write-Host "`n🔒 [ÉTAPE 2] Insertion sécurisée..." -ForegroundColor Cyan
    Add-MissingSections -ExistingSections $existingSections
    
    # Étape 3: Rapport final
    Write-Host "`n📊 [ÉTAPE 3] Rapport final..." -ForegroundColor Cyan
    Show-FinalReport
    
    Write-Host "`n🎉 [SUCCESS] Toutes les étapes terminées avec succès !" -ForegroundColor Green
}
catch {
    Write-Host "`n❌ [ERREUR] Erreur critique: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nAppuyez sur une touche pour continuer..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
