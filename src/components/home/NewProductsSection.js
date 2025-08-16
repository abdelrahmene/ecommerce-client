import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const NewProductsSection = ({ data }) => {
  const [currentSlide, setCurrentSlide] = useState(2); // Commence à Sport Elite (index 2)
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Slides depuis les données ou fallback
  const slides = data?.content?.slides || [
    {
      id: "collection-premium",
      title: "Collection Premium", 
      subtitle: "Élégance et qualité",
      href: "/collections/premium",
      gradient: "from-purple-800 to-purple-950"
    },
    {
      id: "edition-limitee",
      title: "Édition Limitée",
      subtitle: "Pièces exclusives", 
      href: "/collections/edition-limitee",
      gradient: "from-red-800 to-red-950"
    },
    {
      id: "sport-elite",
      title: "Sport Elite",
      subtitle: "Performance et style",
      href: "/collections/sport",
      gradient: "from-blue-800 to-blue-950"
    },
    {
      id: "casual-chic", 
      title: "Casual Chic",
      subtitle: "Le confort au quotidien",
      href: "/collections/casual",
      gradient: "from-green-800 to-green-950"
    },
    {
      id: "business-pro",
      title: "Business Pro",
      subtitle: "Style professionnel",
      href: "/collections/business",
      gradient: "from-gray-800 to-gray-950"
    }
  ];

  // Auto-rotation - Timing optimisé pour l'attention client
  useEffect(() => {
    if (isPaused || isTransitioning) return;
    
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setCurrentSlide(prev => (prev + 1) % slides.length);
      
      // Reset transition flag
      setTimeout(() => setIsTransitioning(false), 800);
    }, 2800); // 2.8 secondes - assez rapide pour maintenir l'attention, assez long pour lire
    
    return () => clearInterval(timer);
  }, [isPaused, isTransitioning, slides.length]);

  const goToSlide = useCallback((index) => {
    if (isTransitioning) return; // Empêche les clics rapides
    
    setIsTransitioning(true);
    setCurrentSlide(index);
    setIsPaused(true);
    
    // Reset transition et reprendre l'auto-rotation
    setTimeout(() => {
      setIsTransitioning(false);
      setIsPaused(false);
    }, 6000);
  }, [isTransitioning]);

  const getSlideStyle = (index) => {
    const diff = index - currentSlide;
    const totalSlides = slides.length;
    
    // Calcul de la position circulaire
    let normalizedDiff = diff;
    if (Math.abs(diff) > totalSlides / 2) {
      normalizedDiff = diff > 0 ? diff - totalSlides : diff + totalSlides;
    }
    
    const baseOffset = normalizedDiff * 1004.786; // Espacement entre slides
    const scale = index === currentSlide ? 0.987388 : 0.811655;
    const opacity = index === currentSlide ? 1 : (Math.abs(normalizedDiff) === 1 ? 0.3 : 0); // Prévisualisation des slides adjacents
    
    return {
      opacity,
      transform: `translateX(${baseOffset}px) scale(${scale}) translateZ(0px)`,
      transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)' // Transition fluide optimisée
    };
  };

  const getContentStyle = (index) => {
    if (index === currentSlide) {
      return {
        opacity: 1,
        transform: 'none',
        transition: 'all 0.6s ease-out 0.2s' // Délai pour effet séquentiel
      };
    }
    return {
      opacity: 0,
      transform: 'translateY(20px) translateZ(0px)',
      transition: 'all 0.4s ease-in'
    };
  };

  const getPatternPosition = (index) => {
    // Position du pattern animé basée sur l'index
    const positions = ['16.2614% 16.2614%', '0.19377% 0.19377%', '32.5228% 32.5228%', '48.7842% 48.7842%', '65.0456% 65.0456%'];
    return positions[index] || '0% 0%';
  };

  return (
    <div className="h-full flex flex-col justify-center py-8 px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="relative inline-block">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3 drop-shadow-sm">
            {data?.content?.title || "Nouveau Produit"}
            <div className="absolute -bottom-2 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full shadow-sm"></div>
          </h2>
        </div>
        <p className="text-base md:text-lg text-gray-700 dark:text-slate-300 font-medium mt-4 max-w-2xl mx-auto">
          {data?.content?.subtitle || "Des pièces uniques pour tous les styles"}
        </p>
      </div>

      {/* Slider Container */}
      <div className="relative w-full overflow-hidden bg-gray-50 dark:bg-slate-900/90 transition-colors duration-300 py-4">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative h-[70vh] w-full">
            
            {/* Slides */}
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className="absolute inset-0 w-full z-20"
                style={getSlideStyle(index)}
              >
                <Link to={slide.href || `/collections/${slide.id}`} className="block w-full h-full">
                  <div className={`relative h-[70vh] overflow-hidden rounded-2xl bg-gradient-to-br ${slide.gradient}`}>
                    {/* Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent"></div>
                    
                    {/* Pattern Background FIXE */}
                    <div 
                      className="absolute inset-0 opacity-30"
                      style={{
                        backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                        backgroundSize: '20px 20px',
                      }}
                    ></div>
                    
                    {/* Particules flottantes subtiles - comme birkshoes.store */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      {[...Array(20)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-0.5 h-0.5 bg-white/30 rounded-full"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                          }}
                          animate={{
                            y: [0, -12, 0, -8, 0],
                            x: [0, 4, -3, 5, 0],
                            opacity: [0.1, 0.5, 0.2, 0.6, 0.1],
                          }}
                          transition={{
                            duration: 10 + Math.random() * 6,
                            repeat: Infinity,
                            delay: Math.random() * 8,
                            ease: "easeInOut"
                          }}
                        />
                      ))}
                    </div>
                    
                    {/* Image de fond si présente */}
                    {slide.image && (
                      <div 
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{
                          backgroundImage: `url(${slide.image})`,
                          opacity: slide.imageOpacity || 0.4 // 40% par défaut, configurable
                        }}
                      ></div>
                    )}
                    
                    {/* Content */}
                    <div className="absolute inset-0 p-8 flex flex-col justify-center items-center text-center">
                      <div 
                        className="max-w-2xl transition-all duration-600 ease-out"
                        style={getContentStyle(index)}
                      >
                        <h3 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                          {slide.title}
                        </h3>
                        <p className="text-gray-200 text-lg md:text-xl mb-8">
                          {slide.subtitle}
                        </p>
                        <button 
                          className="px-8 py-3 bg-white text-black rounded-full text-lg font-medium hover:bg-gray-100 transition-colors duration-200 shadow-lg"
                          tabIndex="0"
                        >
                          Découvrir
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
            
            {/* Indicateurs */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                    index === currentSlide ? 'bg-white' : 'bg-white/40'
                  }`}
                />
              ))}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewProductsSection;