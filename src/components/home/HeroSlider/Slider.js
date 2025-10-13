import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockSlides } from './mockData';
import { FaStamp, FaMapMarkerAlt, FaPhone, FaFacebookF } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
import { getImageUrl } from '../../../config/api';

const HeroSlider = ({ data }) => {
  // Debug: Données reçues de l'API
  console.log('📊 HeroSlider - Données reçues:', data);
  console.log('📊 HeroSlider - Content:', data?.content);
  console.log('📊 HeroSlider - Content Type:', data?.content?.type);
  console.log('📊 HeroSlider - Slides:', data?.content?.slides);
  
  // Extraction des données de la section depuis l'admin
  const sectionTitle = data?.content?.title || '';
  const sectionSubtitle = data?.content?.subtitle || '';
  const sectionImages = data?.content?.images || [];
  const apiSlides = data?.content?.slides || [];
  
  // Utiliser les slides de l'API si disponibles, sinon utiliser les mockSlides
  const slides = (apiSlides && apiSlides.length > 0) ? apiSlides : mockSlides;
  
  console.log('🎯 HeroSlider - Slides finaux utilisés:', slides);
  console.log('🎯 HeroSlider - Source des slides:', (apiSlides && apiSlides.length > 0) ? 'API' : 'Mock');
  console.log('🎯 HeroSlider - Nombre total de slides:', slides.length);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const [isPaused, setIsPaused] = useState(false);
  const [autoplayEnabled, setAutoplayEnabled] = useState(true);
  const autoplayTimerRef = useRef(null);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  // Fonction pour naviguer d'un slide à l'autre
  const paginate = useCallback((newDirection) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) nextIndex = slides.length - 1;
      if (nextIndex >= slides.length) nextIndex = 0;
      return nextIndex;
    });
  }, [slides.length]);

  // Fonction pour naviguer manuellement avec pause temporaire
  const handleManualNavigation = useCallback((newDirection) => {
    setIsPaused(true);
    paginate(newDirection);
  }, [paginate, setIsPaused]);

  // Gérer le défilement automatique avec possibilité de pause
  useEffect(() => {
    if (!autoplayEnabled) return;
    
    if (isPaused) {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
        autoplayTimerRef.current = null;
      }
      
      // Reprendre le défilement automatique après 10 secondes d'inactivité
      const resumeTimer = setTimeout(() => {
        setIsPaused(false);
      }, 10000);
      
      return () => clearTimeout(resumeTimer);
    } else {
      // Déterminer le délai en fonction du type de slide
      // Donner plus de temps pour la carte de fidélité pour que l'animation se termine
      const isLoyaltyCard = slides[currentIndex]?.isLoyaltyCard;
      const slideDelay = isLoyaltyCard ? 12000 : 4000; // 12 secondes pour la carte de fidélité, 4 secondes pour les autres
      
      console.log(`Délai pour la slide ${currentIndex}: ${slideDelay}ms (${isLoyaltyCard ? 'Carte de fidélité' : 'Slide normale'})`);
      
      // Nettoyer l'intervalle précédent avant d'en créer un nouveau
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
      
      // Utiliser setTimeout au lieu de setInterval pour mieux contrôler le timing
      autoplayTimerRef.current = setTimeout(() => {
        paginate(1);
      }, slideDelay);
      
      return () => {
        if (autoplayTimerRef.current) {
          clearTimeout(autoplayTimerRef.current);
          autoplayTimerRef.current = null;
        }
      };
    }
  }, [paginate, isPaused, autoplayEnabled, currentIndex]); // Ajouter currentIndex comme dépendance

  const currentSlide = slides[currentIndex];
  
  // Sécurité: Vérifier que nous avons des slides et une slide courante
  if (!slides || slides.length === 0 || !currentSlide) {
    console.log('⚠️ HeroSlider - Aucune slide disponible');
    return (
      <div className="relative w-full h-screen overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔄</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Chargement...
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Récupération du contenu
          </p>
        </div>
      </div>
    );
  }
  
  console.log('🏁 HeroSlider - Slide courante:', currentSlide);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Gradient */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-tr ${currentSlide.accent} opacity-90`}
        initial={false}
        animate={{ opacity: 0.9 }}
        transition={{ duration: 0.8 }}
      />

      <div className="relative h-full container mx-auto px-4 lg:px-8">

        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.4 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);

              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
            className="absolute inset-0"
          >
            {currentSlide.isLoyaltyCard ? (
              // Loyalty Card Design - Super Badass
              <div className="w-full h-full flex flex-col lg:flex-row items-center justify-center p-4 lg:p-8 overflow-hidden pointer-events-none">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className={`w-full lg:w-1/2 space-y-8 text-center lg:text-left z-10 ${currentSlide.textColor} pointer-events-auto`}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="space-y-4"
                  >
                    <motion.div 
                      className="flex items-center justify-center lg:justify-start space-x-2"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <HiSparkles className="text-yellow-400 text-2xl" />
                      <h2 className="text-lg md:text-xl font-bold tracking-wider uppercase bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-white">
                        {currentSlide.subtitle}
                      </h2>
                      <HiSparkles className="text-yellow-400 text-2xl" />
                    </motion.div>
                    
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black drop-shadow-glow tracking-tight">
                      <motion.span
                        animate={{ scale: [1, 1.05, 1], textShadow: ['0 0 5px rgba(255,255,255,0.5)', '0 0 20px rgba(255,255,255,0.8)', '0 0 5px rgba(255,255,255,0.5)'] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="bg-clip-text text-transparent bg-gradient-to-b from-white to-blue-100"
                      >
                        {currentSlide.title}
                      </motion.span>
                    </h1>
                    
                    <motion.p 
                      className="text-lg md:text-xl opacity-90 max-w-lg mx-auto lg:mx-0 font-medium"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      {currentSlide.description}
                    </motion.p>
                    
                    <motion.div 
                      className="flex flex-col md:flex-row items-center justify-center lg:justify-start space-y-4 md:space-y-0 md:space-x-6 mt-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      <motion.div
                        className="text-white text-lg font-bold bg-gradient-to-r from-indigo-200/20 to-indigo-400/20 backdrop-blur-sm px-6 py-3 rounded-lg border border-white/10"
                        animate={{ boxShadow: ['0 0 5px rgba(255,255,255,0.2)', '0 0 15px rgba(255,255,255,0.4)', '0 0 5px rgba(255,255,255,0.2)'] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-100">Programme exclusif</span>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </motion.div>
                
                {/* Loyalty Card */}
                <motion.div 
                  className="w-full lg:w-1/2 flex items-center justify-center mt-0 mb-0 md:mt-0 lg:mt-0 z-10 pointer-events-auto"
                  initial={{ opacity: 0, y: 40, rotateY: 90 }}
                  animate={{ opacity: 1, y: 0, rotateY: 0 }}
                  transition={{ delay: 0.6, duration: 0.8, type: "spring" }}
                >
                  {/* Template fidélité FIXE - dimensions obligatoires */}
                  <motion.div 
                    className="relative w-[320px] sm:w-[340px] md:w-[380px] lg:w-[420px] h-[200px] sm:h-[215px] md:h-[240px] lg:h-[265px] rounded-xl overflow-hidden flex flex-col bg-gradient-to-br from-blue-900 via-indigo-800 to-indigo-900 p-3 md:p-4 lg:p-5 border-2 border-indigo-400/30 shadow-[0_0_30px_rgba(79,70,229,0.5)]" 
                    whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(79,70,229,0.7)' }}
                    animate={{ y: [0, -8, 0], rotateZ: [0, 1, 0, -1, 0] }}
                    transition={{ duration: 6, repeat: Infinity, repeatType: "reverse" }}
                  >
                    {/* Card Header */}
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2">
                        <motion.div
                          className="text-blue-200"
                          animate={{ rotate: [0, 15, 0, -15, 0] }}
                          transition={{ duration: 5, repeat: Infinity }}
                        >
                          <FaStamp className="text-2xl" />
                        </motion.div>
                        <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">Birk&Shoes</div>
                      </div>
                      <motion.div 
                        className="text-xs font-medium px-3 py-1 rounded-full bg-gradient-to-r from-rose-500 to-red-600 text-white uppercase"
                        animate={{ scale: [1, 1.1, 1], opacity: [0.9, 1, 0.9] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        Exclusif
                      </motion.div>
                    </div>
                    
                    {/* Card Body - Grille FIXE 6 cases */}
                    <motion.div 
                      className="flex-grow flex flex-col justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                    >
                      <div className="grid grid-cols-6 gap-2 w-full mb-4">
                        {[...Array(6)].map((_, index) => (
                          <motion.div 
                            key={index} 
                            className="aspect-square rounded-md border-2 border-white/30 flex items-center justify-center bg-white/10 backdrop-blur-sm relative overflow-hidden"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1 + (index * 0.1), type: "spring" }}
                          >
                            <motion.div 
                              className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-indigo-600"
                              initial={{ y: "100%" }}
                              animate={{ y: "0%" }}
                              transition={{ delay: 1.5 + (index * 0.7), duration: 0.7, ease: "easeOut" }}
                            />
                            <motion.div 
                              className="relative z-10 text-lg text-white"
                              initial={{ opacity: 0, scale: 0, rotateZ: -45 }}
                              animate={{ opacity: 1, scale: 1, rotateZ: 0 }}
                              transition={{ delay: 1.7 + (index * 0.7), duration: 0.4, type: "spring", damping: 10 }}
                            >
                              <FaStamp />
                            </motion.div>
                          </motion.div>
                        ))}
                      </div>
                      
                      {/* Message fixe */}
                      <motion.div 
                        className="text-center text-white/90 text-sm font-medium mb-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 5.5, duration: 0.7 }}
                      >
                        <motion.span className="font-bold text-yellow-300">6 achetées</motion.span>
                        <motion.span className="font-bold"> = </motion.span>
                        <motion.span className="font-bold text-green-300">7ème gratuite!</motion.span>
                      </motion.div>
                    </motion.div>
                    
                    {/* Footer */}
                    <div className="flex justify-between items-center pt-2 border-t border-white/20 text-white/80 text-xs">
                      <div>Valable pour toute la famille</div>
                      <div className="flex items-center space-x-1">
                        <HiSparkles className="text-yellow-300" />
                        <span>Pas de date d'expiration</span>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            ) : (
              // Regular Product Slides - BADASS MOBILE LAYOUT
              <div className="w-full h-full flex flex-col lg:flex-row lg:items-center lg:justify-between">
                
                {/* IMAGE EN HAUT (Mobile) / À DROITE (Desktop) */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="w-full lg:w-1/2 h-[40%] sm:h-[45%] lg:h-auto flex items-center justify-center lg:order-2 pt-20 sm:pt-16 lg:pt-0"
                >
                  <motion.img
                    src={getImageUrl(currentSlide.image)}
                    alt={currentSlide.title}
                    className="w-auto h-auto max-w-full max-h-full object-contain drop-shadow-2xl"
                    style={{ maxHeight: 'min(500px, 50vh)' }}
                    animate={{ 
                      y: [0, -10, 0],
                      rotate: [0, -2, 2, 0]
                    }}
                    transition={{ 
                      duration: 6,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                    onError={(e) => {
                      console.error('❌ [HERO-IMAGE] Erreur chargement image:', {
                        path: currentSlide.image,
                        url: getImageUrl(currentSlide.image),
                        errorType: e.type,
                        targetSrc: e.target.src,
                        naturalWidth: e.target.naturalWidth,
                        naturalHeight: e.target.naturalHeight
                      });
                      // NE PAS mettre de placeholder - laisser l'image par défaut du navigateur
                      // pour diagnostiquer le problème
                    }}
                    onLoad={(e) => {
                      console.log('✅ [HERO-MOBILE] Image du slider chargée avec succès:', currentSlide.image);
                      console.log('✅ [HERO-MOBILE] URL utilisée:', getImageUrl(currentSlide.image));
                      console.log('✅ [HERO-MOBILE] Dimensions image:', e.target.naturalWidth, 'x', e.target.naturalHeight);
                    }}
                    loading="lazy"
                    crossOrigin="anonymous"
                  />
                </motion.div>

                {/* CONTENU EN BAS (Mobile) / À GAUCHE (Desktop) */}
                <div className="w-full lg:w-1/2 h-[60%] sm:h-[55%] lg:h-auto flex items-end lg:items-center pb-20 sm:pb-16 lg:pb-0 lg:order-1">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className={`w-full space-y-3 md:space-y-6 ${currentSlide.textColor} px-2`}
                  >
                    {/* Badge subtitle avec effet BADASS */}
                    <motion.div 
                      className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-lg"
                      animate={{ 
                        scale: [1, 1.05, 1],
                        boxShadow: [
                          '0 4px 6px rgba(0,0,0,0.1)',
                          '0 10px 20px rgba(0,0,0,0.2)',
                          '0 4px 6px rgba(0,0,0,0.1)'
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <h2 className="text-xs md:text-base font-bold tracking-wider uppercase">
                        {currentSlide.subtitle}
                      </h2>
                    </motion.div>
                    
                    {/* Titre BADASS */}
                    <motion.h1 
                      className="text-3xl md:text-5xl lg:text-7xl font-black tracking-tight leading-tight"
                      animate={{ 
                        textShadow: [
                          '0 2px 10px rgba(0,0,0,0.3)',
                          '0 4px 20px rgba(0,0,0,0.5)',
                          '0 2px 10px rgba(0,0,0,0.3)'
                        ]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      {currentSlide.title}
                    </motion.h1>
                    
                    {/* Description */}
                    <p className="text-sm md:text-lg lg:text-xl opacity-90 max-w-md leading-relaxed">
                      {currentSlide.description}
                    </p>
                    
                    {/* Prix et CTA - Layout BADASS */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 pt-2">
                      {/* Prix avec effet néon */}
                      <motion.div 
                        className="flex flex-col"
                        animate={{
                          textShadow: [
                            '0 0 10px rgba(255,255,255,0.5)',
                            '0 0 20px rgba(255,255,255,0.8)',
                            '0 0 10px rgba(255,255,255,0.5)'
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <span className="text-3xl md:text-5xl font-black">
                          {currentSlide.price} DA
                        </span>
                        {currentSlide.oldPrice && (
                          <span className="text-base md:text-lg line-through opacity-70">
                            {currentSlide.oldPrice} DA
                          </span>
                        )}
                      </motion.div>
                      
                      {/* Bouton CTA BADASS */}
                      <motion.button
                        whileHover={{ 
                          scale: 1.08,
                          boxShadow: '0 10px 30px rgba(0,0,0,0.4)'
                        }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-6 md:px-8 py-2.5 md:py-3 rounded-full text-sm md:text-lg font-bold transition-all ${currentSlide.buttonColor} shadow-xl`}
                        animate={{
                          boxShadow: [
                            '0 4px 15px rgba(0,0,0,0.2)',
                            '0 8px 25px rgba(0,0,0,0.3)',
                            '0 4px 15px rgba(0,0,0,0.2)'
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        Découvrir
                      </motion.button>
                    </div>
                  </motion.div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        




        {/* Navigation Arrows */}
        <motion.button
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center backdrop-blur-sm transition-all border border-white/20 z-50"
          onClick={() => handleManualNavigation(-1)}
          whileHover={{ scale: 1.1, x: -5 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 md:h-7 md:w-7 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <motion.div 
            className="absolute inset-0 rounded-full border border-white/40"
            animate={{ scale: [1, 1.1, 1], opacity: [0.7, 0.3, 0.7] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.button>
        <motion.button
          className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center backdrop-blur-sm transition-all border border-white/20 z-50"
          onClick={() => handleManualNavigation(1)}
          whileHover={{ scale: 1.1, x: 5 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 md:h-7 md:w-7 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M9 5l7 7-7 7"
            />
          </svg>
          <motion.div 
            className="absolute inset-0 rounded-full border border-white/40"
            animate={{ scale: [1, 1.1, 1], opacity: [0.7, 0.3, 0.7] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.button>
        

        
        {/* Store Info Footer - Fixed at bottom */}
        <motion.div 
          className="absolute bottom-2 md:bottom-3 left-0 right-0 z-10 flex justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <motion.div 
            className="flex items-center space-x-3 md:space-x-6 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/80 text-[10px] md:text-xs"
            whileHover={{ backgroundColor: 'rgba(0,0,0,0.6)', borderColor: 'rgba(255,255,255,0.2)' }}
          >
            <div className="flex items-center space-x-1">
              <FaMapMarkerAlt className="text-red-400 text-xs" />
              <span>Oran, Algérie</span>
            </div>
            <div className="h-2 w-px bg-white/20" />
            <div className="flex items-center space-x-1">
              <FaPhone className="text-green-400 text-xs" />
              <span className="hidden sm:inline">+213(0) 554 625 100</span>
              <span className="sm:hidden">+213(0)...</span>
            </div>
            <div className="h-2 w-px bg-white/20" />
            <motion.a 
              href="https://fb.com/Birk.Algerie"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-blue-300 hover:text-blue-200"
              whileHover={{ scale: 1.05 }}
            >
              <FaFacebookF className="text-xs" />
              <span className="hidden xs:inline">Birk.Algerie</span>
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSlider;
