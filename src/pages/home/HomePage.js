import React, { useRef } from "react";
import HeroSlider from "../../components/home/HeroSlider/Slider";
import Categories from "../../components/home/Categories";
import SectionCollection from "../../components/home/SectionCollection/Collection";
import TrustFeatures from "../../components/home/TrustFeatures/TrustFeatures";
import { useScrollSnap } from "./useScrollSnap";
import { HomeSection } from "./HomeSection";
import { useHomeSections } from "../../hooks/useHomeSections";
import { DynamicSection } from "../../components/home/DynamicSection";

export default function HomePage() {
  const containerRef = useRef(null);
  const { sections, loading, error, isFromFallback, refetch } = useHomeSections();

  // Logs pour le debugging
  if (loading) {
    console.log('🔄 HomePage: Chargement des sections...');
  }
  
  if (isFromFallback) {
    console.log('📋 HomePage: Utilisation des données de fallback');
  }

  console.log('🏠 HomePage: Sections disponibles:', sections.length, isFromFallback ? '(fallback)' : '(API)');

  return (
    <div className="relative bg-gray-50 dark:bg-slate-900/90 transition-colors duration-300">
      <div 
        ref={containerRef}
        className="flex flex-col min-h-screen overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth"
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
          scrollSnapType: 'y mandatory',
          scrollBehavior: 'smooth'
        }}
      >
        {/* ERREUR: Cas d'erreur critique seulement */}
        {error && sections.length === 0 && (
          <div className="w-full min-h-screen flex items-center justify-center bg-red-50 dark:bg-red-900/20">
            <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-red-200 dark:border-red-800">
              <div className="text-6xl mb-4">💥</div>
              <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
                Erreur de Chargement
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {error}
              </p>
              <button 
                onClick={refetch} 
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Réessayer
              </button>
            </div>
          </div>
        )}

        {/* CHARGEMENT */}
        {loading && (
          <div className="w-full min-h-screen flex items-center justify-center bg-blue-50 dark:bg-blue-900/20">
            <div className="text-center p-8">
              <div className="animate-spin text-6xl mb-4">🔄</div>
              <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                Chargement des sections...
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                Connexion à l'API en cours
              </p>
            </div>
          </div>
        )}

        {/* CONTENU: Rendu des sections (API ou fallback) */}
        {!loading && sections.length > 0 && (
          <>
            {/* Notification si mode fallback */}
            {isFromFallback && (
              <div className="fixed top-4 left-4 bg-yellow-100 dark:bg-yellow-900/50 border border-yellow-300 dark:border-yellow-700 rounded-lg p-3 z-50 shadow-lg">
                <div className="flex items-center space-x-2">
                  <div className="text-yellow-600 dark:text-yellow-400">📋</div>
                  <div className="text-sm">
                    <div className="font-semibold text-yellow-800 dark:text-yellow-200">Mode Hors-ligne</div>
                    <div className="text-yellow-700 dark:text-yellow-300">API non disponible, utilisation des données par défaut</div>
                  </div>
                  <button 
                    onClick={refetch}
                    className="ml-2 px-2 py-1 bg-yellow-600 text-white rounded text-xs hover:bg-yellow-700 transition-colors"
                  >
                    Réessayer
                  </button>
                </div>
              </div>
            )}
            
            {sections.map((section) => (
              <DynamicSection 
                key={section.id} 
                section={section} 
              />
            ))}
          </>
        )}

        {/* Message de debug en mode développement */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-4 right-4 bg-black/70 text-white p-2 rounded text-xs z-50">
            <div>{loading ? 'Chargement...' : `${sections.length} sections`}</div>
            <div>{isFromFallback ? 'Fallback' : 'API'}</div>
            {error && <div className="text-red-300">Erreur: {error}</div>}
          </div>
        )}
      </div>
    </div>
  );
}