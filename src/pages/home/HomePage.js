import React, { useRef } from "react";
import HeroSlider from "../../components/home/HeroSlider/Slider";
import Categories from "../../components/home/Categories";
import SectionCollection from "../../components/home/SectionCollection/Collection";
import TrustFeatures from "../../components/home/TrustFeatures/TrustFeatures";
import { useScrollSnap } from "./useScrollSnap";
import { HomeSection } from "./HomeSection";
import { mockCollections, mockCategories } from "../../components/home/mockData";

export default function HomePage() {
  const containerRef = useRef(null);

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
        {/* Hero Section */}
        <section className="w-full min-h-screen snap-start snap-always">
          <HeroSlider />
        </section>

        {/* Collections Section */}
        <section className="w-full min-h-screen snap-start snap-always">
          <div className="h-full flex flex-col justify-center py-8 px-4">
            <div className="text-center mb-8">
              <div className="relative inline-block">
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3 drop-shadow-sm">
                  Nouveau Produit
                  <div className="absolute -bottom-2 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full shadow-sm"></div>
                </h2>
              </div>
              <p className="text-base md:text-lg text-gray-700 dark:text-slate-300 font-medium mt-4 max-w-2xl mx-auto">
                Des pièces uniques pour tous les styles
              </p>
            </div>
            <SectionCollection data={{ collections: mockCollections }} />
          </div>
        </section>

        {/* Categories Section */}
        <section className="w-full min-h-screen snap-start snap-always">
          <div className="h-full flex flex-col justify-center py-8 px-4">
            <div className="text-center mb-8">
              <div className="relative inline-block">
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3 drop-shadow-sm">
                  Nos Catégories
                  <div className="absolute -bottom-2 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-sm"></div>
                </h2>
              </div>
              <p className="text-base md:text-lg text-gray-700 dark:text-slate-300 font-medium mt-4 max-w-2xl mx-auto">
                Explorez nos univers
              </p>
            </div>
            <Categories />
          </div>
        </section>



        {/* Trust Features Section */}
        <section className="w-full min-h-screen snap-start snap-always">
          <TrustFeatures />
        </section>
      </div>
    </div>
  );
}