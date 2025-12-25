import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockSlides } from './mockData';
import { FaStamp, FaMapMarkerAlt, FaPhone, FaFacebookF } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
import { getImageUrl } from '../../../config/api';
import { useNavigate } from 'react-router-dom';
import LoyaltyModal from '../../loyalty/LoyaltyModal';

const HeroSlider = ({ data }) => {
  // Debug: Données reçues de l'API
  console.log('📊 [HERO] Données reçues de la section:', data);

  // Extraction des données depuis l'API
  // L'API retourne: { id, type, title, description, content, isVisible, order }
  // content devrait être déjà parsé par l'API (objet), mais on gère aussi le cas string
  let heroContent = {};
  let apiSlides = [];
  let sliderConfig = {};
  let loyaltyCard = {};

  if (data?.content) {
    console.log('📊 [HERO] Type de content:', typeof data.content);

    // Si content est une string JSON, le parser
    if (typeof data.content === 'string') {
      try {
        heroContent = JSON.parse(data.content);
        console.log('✅ [HERO] Content parsé depuis string:', heroContent);
      } catch (e) {
        console.error('❌ [HERO] Erreur parsing content JSON:', e);
        console.error('❌ [HERO] Content string reçu:', data.content);
      }
    } else if (typeof data.content === 'object' && data.content !== null) {
      // Si content est déjà un objet (cas normal avec l'API)
      heroContent = data.content;
      console.log('✅ [HERO] Content déjà parsé (objet):', heroContent);
    }

    // Extraire les slides depuis le content parsé
    apiSlides = heroContent.slides || [];
    sliderConfig = heroContent.sliderConfig || {};
    loyaltyCard = heroContent.loyaltyCard || {};

    console.log('🎯 [HERO] Slides extraites:', apiSlides.length, 'slides');
    console.log('🎯 [HERO] Premier slide:', apiSlides[0]);
    console.log('🎯 [HERO] Configuration slider:', sliderConfig);
    console.log('🎯 [HERO] Carte fidélité:', loyaltyCard);
  } else {
    console.warn('⚠️ [HERO] Aucun content dans les données de la section');
  }

  // Utiliser les slides de l'API si disponibles, sinon utiliser les mockSlides
  const slides = (apiSlides && apiSlides.length > 0) ? apiSlides : mockSlides;

  console.log('🎯 [HERO] Slides finaux utilisés:', slides);
  console.log('🎯 [HERO] Source des slides:', (apiSlides && apiSlides.length > 0) ? 'API' : 'Mock');
  console.log('🎯 [HERO] Nombre total de slides:', slides.length);

  // Si on utilise les slides mockées, logger un avertissement
  if (slides === mockSlides) {
    console.warn('⚠️ [HERO] ATTENTION: Utilisation des slides mockées ! Vérifiez que l\'API retourne bien les slides.');
  } else {
    console.log('✅ [HERO] SUCCÈS: Utilisation des slides de l\'API !');
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [showLoyaltyModal, setShowLoyaltyModal] = useState(false);
  const navigate = useNavigate();

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

  // Gérer le clic sur le bouton
  const handleButtonClick = (slide) => {
    if (slide.isLoyaltyCard) {
      // Ouvrir le modal de fidélité
      setShowLoyaltyModal(true);
    } else if (slide.buttonLink) {
      // Naviguer vers le lien
      if (slide.buttonLink.startsWith('http')) {
        window.open(slide.buttonLink, '_blank');
      } else {
        navigate(slide.buttonLink);
      }
    }
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
    console.log('⚠️ [HERO] Aucune slide disponible');
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

  console.log(`🏁 [HERO] Slide courante (index ${currentIndex}):`, currentSlide);

  return (
    <div className="relative w-full h-full md:h-screen overflow-hidden">
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
                      className="flex items-center justify-center lg:justify-start"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <h2 className="text-lg md:text-xl font-bold tracking-wider uppercase bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-white">
                        {currentSlide.subtitle}
                      </h2>
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
                      className="hidden md:flex flex-col md:flex-row items-center justify-center lg:justify-start space-y-4 md:space-y-0 md:space-x-6 mt-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      <motion.button
                        onClick={() => handleButtonClick(currentSlide)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-white text-lg font-bold bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 px-8 py-3 rounded-lg transition-all shadow-xl"
                        animate={{ boxShadow: ['0 0 5px rgba(255,255,255,0.2)', '0 0 15px rgba(255,255,255,0.4)', '0 0 5px rgba(255,255,255,0.2)'] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        S'inscrire maintenant
                      </motion.button>
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
              // Regular Product Slides - SIMPLE & MINIMAL DESIGN
              <div className="w-full h-full flex flex-col lg:flex-row lg:items-center lg:justify-between">

                {/* CONTENT - Top on Mobile, Left on Desktop */}
                <div className="w-full lg:w-1/2 h-[65%] lg:h-auto flex items-center justify-center lg:items-center pt-24 pb-4 lg:pt-0 lg:pb-0 lg:order-1 z-20 relative">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className={`w-full space-y-2 md:space-y-3 ${currentSlide.textColor} px-6 text-center lg:text-left`}
                  >
                    {/* Subtitle - Stylish badge with sparkles like loyalty card */}
                    {currentSlide.subtitle && (
                      <motion.div
                        className="inline-flex items-center justify-center lg:justify-start space-x-2"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                      >
                        <HiSparkles className="text-yellow-400 text-xl" />
                        <h2 className={`text-sm md:text-lg font-bold tracking-wider uppercase bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100 ${currentSlide.subtitleColor || ''}`}>
                          {currentSlide.subtitle}
                        </h2>
                        <HiSparkles className="text-yellow-400 text-xl" />
                      </motion.div>
                    )}

                    {/* Title - Badass style with gradient and glow */}
                    <h1 className={`text-3xl md:text-5xl lg:text-7xl font-black drop-shadow-glow tracking-tight ${currentSlide.titleColor || currentSlide.textColor}`}>
                      <motion.span
                        className="bg-clip-text text-transparent bg-gradient-to-b from-white to-blue-100"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        {currentSlide.title}
                      </motion.span>
                    </h1>

                    {/* Description - Elegant with animation */}
                    {currentSlide.description && (
                      <motion.p
                        className={`text-sm md:text-base opacity-90 max-w-lg mx-auto lg:mx-0 font-medium ${currentSlide.descriptionColor || currentSlide.textColor}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        {currentSlide.description}
                      </motion.p>
                    )}

                    {/* Price and CTA - Compact layout (Hidden on mobile) */}
                    <div className="hidden md:flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-1">
                      {/* Price */}
                      {currentSlide.price && (
                        <div className="flex flex-col items-center sm:items-start">
                          <span className={`text-3xl md:text-4xl font-bold ${currentSlide.priceColor || currentSlide.textColor}`}>
                            {currentSlide.price}
                          </span>
                          {currentSlide.oldPrice && (
                            <span className={`text-sm md:text-base line-through opacity-60 ${currentSlide.priceColor || currentSlide.textColor}`}>
                              {currentSlide.oldPrice}
                            </span>
                          )}
                        </div>
                      )}

                      {/* CTA Button - Simple */}
                      <button
                        onClick={() => handleButtonClick(currentSlide)}
                        className={`px-6 md:px-8 py-2.5 md:py-3 rounded-full text-sm md:text-base font-semibold transition-transform hover:scale-105 ${currentSlide.buttonColor} shadow-lg`}
                      >
                        Découvrir
                      </button>
                    </div>
                  </motion.div>
                </div>

                {/* IMAGE - Bottom on Mobile, Right on Desktop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="w-full lg:w-1/2 h-[35%] lg:h-auto flex items-end justify-center lg:items-center lg:order-2 pb-8 lg:pb-0 z-10 relative"
                >
                  <img
                    src={getImageUrl(currentSlide.image)}
                    alt={currentSlide.title}
                    className="w-auto h-auto max-w-full max-h-full object-contain"
                    style={{ maxHeight: 'min(250px, 30vh)' }}
                    onError={(e) => {
                      console.error('❌ Image loading error:', currentSlide.image);
                    }}
                    loading="lazy"
                    crossOrigin="anonymous"
                  />
                </motion.div>
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
          className="absolute bottom-4 md:bottom-6 left-0 right-0 z-10 flex justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <motion.div
            className="flex items-center space-x-3 md:space-x-6 px-4 py-2 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white shadow-2xl"
            whileHover={{ backgroundColor: 'rgba(0,0,0,0.7)', borderColor: 'rgba(255,255,255,0.3)' }}
          >
            {/* Mobile View: Slide specific CTA and Price */}
            <div className="flex md:hidden items-center space-x-4">
              {currentSlide.price && (
                <div className="flex items-baseline space-x-1">
                  <span className="text-lg font-bold text-white">{currentSlide.price}</span>
                  {currentSlide.oldPrice && (
                    <span className="text-[10px] line-through opacity-50">{currentSlide.oldPrice}</span>
                  )}
                </div>
              )}
              <button
                onClick={() => handleButtonClick(currentSlide)}
                className={`px-5 py-1.5 rounded-full text-xs font-bold ${currentSlide.buttonColor || 'bg-white text-black'} shadow-lg active:scale-95 transition-transform`}
              >
                {currentSlide.isLoyaltyCard ? "S'INSCRIRE" : "DÉCOUVRIR"}
              </button>
            </div>

            {/* Desktop View: Store Info */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-1 text-xs">
                <FaMapMarkerAlt className="text-red-400" />
                <span>Oran, Algérie</span>
              </div>
              <div className="h-3 w-px bg-white/20" />
              <div className="flex items-center space-x-1 text-xs">
                <FaPhone className="text-green-400" />
                <span>+213(0) 554 625 100</span>
              </div>
              <div className="h-3 w-px bg-white/20" />
            </div>

            {/* Facebook Link (Visible on both) */}
            <motion.a
              href="https://fb.com/Birk.Algerie"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-blue-300 hover:text-blue-200 text-xs"
              whileHover={{ scale: 1.05 }}
            >
              <FaFacebookF className="text-xs" />
              <span className="hidden xs:inline">Birk.Algerie</span>
            </motion.a>
          </motion.div>
        </motion.div>
      </div>

      {/* Modal de fidélité */}
      <LoyaltyModal
        isOpen={showLoyaltyModal}
        onClose={() => setShowLoyaltyModal(false)}
      />
    </div>
  );
};

export default HeroSlider;
