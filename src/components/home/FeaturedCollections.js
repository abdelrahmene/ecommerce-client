// import React, { useState, useEffect, useRef } from 'react';
// import { Link } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useInView } from 'react-intersection-observer';
// import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

// // Animations pour les composants
// const containerVariants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: {
//       staggerChildren: 0.2
//     }
//   }
// };

// const titleVariants = {
//   hidden: { opacity: 0, y: -20 },
//   visible: {
//     opacity: 1,
//     y: 0,
//     transition: {
//       duration: 0.6,
//       ease: "easeOut"
//     }
//   }
// };

// const itemVariants = {
//   hidden: { opacity: 0, scale: 0.8, y: 30 },
//   visible: (custom) => ({
//     opacity: 1,
//     scale: 1,
//     y: 0,
//     transition: {
//       delay: custom * 0.1,
//       duration: 0.6,
//       ease: [0.16, 1, 0.3, 1]
//     }
//   }),
//   exit: { opacity: 0, scale: 0.8, y: -30, transition: { duration: 0.4 } }
// };

// const underlineVariants = {
//   hidden: { width: 0 },
//   visible: {
//     width: '100%',
//     transition: {
//       delay: 0.5,
//       duration: 0.8,
//       ease: "easeOut"
//     }
//   }
// };

// const fadeInUpVariants = {
//   hidden: { opacity: 0, y: 20 },
//   visible: {
//     opacity: 1,
//     y: 0,
//     transition: {
//       delay: 0.2,
//       duration: 0.6,
//       ease: [0.16, 1, 0.3, 1]
//     }
//   }
// };

// const FeaturedCollections = ({ data }) => {
//   // État pour stocker les collections
//   const [collections, setCollections] = useState([]);
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [visibleCollections, setVisibleCollections] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   // Détecter si l'appareil est mobile
//   const [isMobile, setIsMobile] = useState(false);
//   const autoplayTimerRef = useRef(null);
  
//   // Animation lorsque la section est visible
//   const [ref, inView] = useInView({
//     triggerOnce: false,
//     threshold: 0.1
//   });
  
//   // Détection du mobile
//   useEffect(() => {
//     const checkIfMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//     };
    
//     checkIfMobile();
//     window.addEventListener('resize', checkIfMobile);
    
//     return () => {
//       window.removeEventListener('resize', checkIfMobile);
//     };
//   }, []);
  
//   // Chargement initial des collections
//   useEffect(() => {
//     fetchCollections();
//   }, []);
  
//   // Défilement automatique des collections
//   useEffect(() => {
//     if (inView && collections.length > 0) {
//       const autoplaySpeed = data?.autoplaySpeed || 2;
//       autoplayTimerRef.current = setInterval(() => {
//         setActiveIndex((prevIndex) => {
//           const newIndex = (prevIndex + 1) % collections.length;
//           return newIndex;
//         });
//       }, autoplaySpeed * 1000); // Change selon la configuration
      
//       return () => {
//         if (autoplayTimerRef.current) {
//           clearInterval(autoplayTimerRef.current);
//         }
//       };
//     }
//   }, [inView, collections.length]);
  
//   // Mise à jour des collections visibles quand activeIndex change
//   useEffect(() => {
//     if (collections.length > 0) {
//       updateVisibleCollections(activeIndex);
//     }
//   }, [activeIndex, collections]);
  
//   // Fonction pour charger les collections
//   const fetchCollections = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       // Utiliser les collections provenant de Firebase ou les collections par défaut
//       const collectionsData = data?.collections || [
//         {
//           id: 'boston-collection',
//           name: 'Collection Boston',
//           description: 'Notre collection phare de mules premium pour un confort inégalé et un style intemporel',
//           image: '/images/products/boston.png',
//           category: 'homme',
//           type: 'mules',
//           link: '/collections/boston',
//           accent: 'bg-indigo-600 dark:bg-indigo-700',
//           bg: 'bg-gradient-to-br from-indigo-200 via-purple-200 to-violet-200 dark:from-indigo-900 dark:via-purple-900 dark:to-violet-900',
//           text: 'text-gray-900 dark:text-indigo-100'
//         },
//         {
//           id: 'arizona-collection',
//           name: 'Collection Arizona',
//           description: 'Sandales emblématiques avec boucles ajustables pour un maintien parfait tout au long de la journée',
//           image: '/images/products/arizona.png',
//           category: 'femme',
//           type: 'sandales',
//           link: '/collections/arizona',
//           accent: 'bg-violet-600 dark:bg-violet-700',
//           bg: 'bg-gradient-to-br from-violet-200 via-purple-200 to-fuchsia-200 dark:from-violet-900 dark:via-purple-900 dark:to-fuchsia-900',
//           text: 'text-gray-900 dark:text-violet-100'
//         },
//         {
//           id: 'madrid-collection',
//           name: 'Collection Madrid',
//           description: 'Élégance minimaliste avec une seule bride, parfaite pour un style décontracté chic',
//           image: '/images/products/madrid.png',
//           category: 'femme',
//           type: 'mules',
//           link: '/collections/madrid',
//           accent: 'bg-fuchsia-600 dark:bg-fuchsia-700',
//           bg: 'bg-gradient-to-br from-fuchsia-200 via-pink-200 to-rose-200 dark:from-fuchsia-900 dark:via-pink-900 dark:to-rose-900',
//           text: 'text-gray-900 dark:text-fuchsia-100'
//         },
//         {
//           id: 'gizeh-collection',
//           name: 'Collection Gizeh',
//           description: 'Sandales tongs ergonomiques avec un design distinctif pour un confort optimal',
//           image: '/images/products/gizeh.png',
//           category: 'homme',
//           type: 'sandales',
//           link: '/collections/gizeh',
//           accent: 'bg-blue-600 dark:bg-blue-700',
//           bg: 'bg-gradient-to-br from-blue-200 via-sky-200 to-cyan-200 dark:from-blue-900 dark:via-sky-900 dark:to-cyan-900',
//           text: 'text-gray-900 dark:text-blue-100'
//         },
//         {
//           id: 'kids-collection',
//           name: 'Collection Enfants',
//           description: 'Conçue spécialement pour les petits pieds, alliant durabilité, confort et style ludique',
//           image: '/images/products/kyoto.png',
//           category: 'enfant',
//           type: 'sandales',
//           link: '/collections/kids',
//           accent: 'bg-emerald-600 dark:bg-emerald-700',
//           bg: 'bg-gradient-to-br from-emerald-200 via-green-200 to-teal-200 dark:from-emerald-900 dark:via-green-900 dark:to-teal-900',
//           text: 'text-gray-900 dark:text-emerald-100'
//         }
//       ];
      
//       // Simuler un délai de chargement
//       await new Promise(resolve => setTimeout(resolve, 500));
      
//       // Mettre à jour les états
//       setCollections(collectionsData);
//       setActiveIndex(0);
      
//       setLoading(false);
//     } catch (error) {
//       console.log('Erreur lors du chargement des collections:', error);
//       setError('Impossible de charger les collections. Veuillez réessayer plus tard.');
//       setLoading(false);
//     }
//   };
  
//   // Fonction pour passer à la collection précédente
//   const prevCollection = () => {
//     if (autoplayTimerRef.current) {
//       clearInterval(autoplayTimerRef.current);
//       autoplayTimerRef.current = null;
      
//       // Redémarrer l'autoplay après 10 secondes d'inactivité
//       setTimeout(() => {
//         if (!autoplayTimerRef.current && inView) {
//           autoplayTimerRef.current = setInterval(() => {
//             setActiveIndex((prevIndex) => (prevIndex + 1) % collections.length);
//           }, 4000);
//         }
//       }, 10000);
//     }
    
//     setActiveIndex((prevIndex) => (prevIndex === 0 ? collections.length - 1 : prevIndex - 1));
//   };
  
//   // Fonction pour passer à la collection suivante
//   const nextCollection = () => {
//     if (autoplayTimerRef.current) {
//       clearInterval(autoplayTimerRef.current);
//       autoplayTimerRef.current = null;
      
//       // Redémarrer l'autoplay après 10 secondes d'inactivité
//       setTimeout(() => {
//         if (!autoplayTimerRef.current && inView) {
//           autoplayTimerRef.current = setInterval(() => {
//             setActiveIndex((prevIndex) => (prevIndex + 1) % collections.length);
//           }, 4000);
//         }
//       }, 10000);
//     }
    
//     setActiveIndex((prevIndex) => (prevIndex + 1) % collections.length);
//   };
  
//   // Fonction pour mettre à jour les collections visibles
//   const updateVisibleCollections = (startIdx) => {
//     if (collections.length === 0) return;
    
//     // Sur mobile, on montre toutes les collections
//     if (isMobile) {
//       setVisibleCollections(collections);
//       return;
//     }
    
//     // Sur desktop, on montre 4 collections à la fois
//     const numToShow = Math.min(4, collections.length);
//     let newVisibleCollections = [];
    
//     for (let i = 0; i < numToShow; i++) {
//       const idx = (startIdx + i) % collections.length;
//       newVisibleCollections.push(collections[idx]);
//     }
    
//     setVisibleCollections(newVisibleCollections);
//   };
  
//   // Calcul du décalage pour l'animation de défilement
//   const getScrollOffset = () => {
//     if (isMobile) {
//       // Sur mobile, on défile mais avec un décalage réduit pour voir plusieurs cartes
//       return -activeIndex * (200 + 8); // Largeur réduite de la carte + marge réduite
//     } else {
//       // Sur desktop, on défile avec un décalage réduit pour voir plusieurs cartes
//       return -activeIndex * (250 + 12); // Largeur réduite de la carte + marge réduite
//     }
//   };
  
//   return (
//     <section className="py-16 md:py-24 relative overflow-hidden bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
//       {/* Motifs d'arrière-plan */}
//       <div className="absolute inset-0 opacity-10 dark:opacity-20 overflow-hidden">
//         {/* Formes géométriques animées */}
//         <motion.div 
//           className="absolute top-10 left-10 w-60 h-60 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 blur-3xl"
//           animate={{
//             x: [0, 30, 0],
//             opacity: [0.3, 0.5, 0.3],
//             scale: [1, 1.2, 1],
//           }}
//           transition={{
//             duration: 15,
//             repeat: Infinity,
//             ease: "easeInOut"
//           }}
//         />
//         <motion.div 
//           className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-500 blur-3xl"
//           animate={{
//             x: [0, -40, 0],
//             opacity: [0.4, 0.6, 0.4],
//             scale: [1, 1.3, 1],
//           }}
//           transition={{
//             duration: 18,
//             repeat: Infinity,
//             ease: "easeInOut"
//           }}
//         />
        
//         {/* Motif de points */}
//         <div className="absolute inset-0 opacity-10 dark:opacity-5" style={{ 
//           backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%24000000\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
//           backgroundSize: '30px 30px'
//         }}></div>
//       </div>

//       <div className="container mx-auto px-4 md:px-6 relative z-10">
//         <motion.div 
//           ref={ref}
//           initial="hidden"
//           animate={inView ? "visible" : "hidden"}
//           variants={containerVariants}
//           className="space-y-12"
//         >
//           {/* En-tête de section */}
//           <motion.div variants={itemVariants} className="max-w-3xl mx-auto">
//             <div className="text-center mb-12">
//               <div className="inline-block mb-4">
//                 <motion.span 
//                   initial={{ opacity: 0, scale: 0.8 }}
//                   animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
//                   transition={{ duration: 0.4 }}
//                   className="px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg"
//                 >
//                   Été 2025
//                 </motion.span>
//               </div>
              
//               <motion.h2 
//                 variants={titleVariants}
//                 className="text-3xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent"
//               >
//                 COLLECTIONS MANYA SHOES
//               </motion.h2>
              
//               <motion.div 
//                 variants={underlineVariants}
//                 className="h-1 w-24 mx-auto rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 mb-6"
//               ></motion.div>
              
//               <motion.p 
//                 variants={fadeInUpVariants}
//                 className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto text-lg"
//               >
//                 Découvrez nos collections de sandales et mules artisanales premium, conçues pour un confort exceptionnel et un style intemporel
//               </motion.p>
//             </div>
//           </motion.div>
          
//           {/* Affichage des collections */}
//           {loading ? (
//             <div className="flex justify-center items-center py-20">
//               <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin"></div>
//             </div>
//           ) : error ? (
//             <div className="text-center py-20">
//               <p className="text-red-500 mb-4">{error}</p>
//               <button 
//                 onClick={fetchCollections}
//                 className="px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
//               >
//                 Réessayer
//               </button>
//             </div>
//           ) : (
//             <div className="relative">
//               {/* Indicateur de défilement automatique */}
//               <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-20">
//                 <motion.div 
//                   className="h-1 w-32 bg-gray-200 rounded-full overflow-hidden"
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ duration: 0.5 }}
//                 >
//                   <motion.div 
//                     className="h-full bg-gradient-to-r from-indigo-500 to-violet-500"
//                     initial={{ width: '0%' }}
//                     animate={{ width: '100%' }}
//                     transition={{ duration: 5, repeat: Infinity, repeatType: 'loop', ease: 'linear' }}
//                   />
//                 </motion.div>
//               </div>
              
//               {/* Boutons de navigation */}
//               <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20">
//                 <button 
//                   onClick={prevCollection}
//                   className="p-3 rounded-full bg-white/80 dark:bg-black/30 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
//                   aria-label="Collection précédente"
//                 >
//                   <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
//                 </button>
//               </div>
              
//               <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20">
//                 <button 
//                   onClick={nextCollection}
//                   className="p-3 rounded-full bg-white/80 dark:bg-black/30 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
//                   aria-label="Collection suivante"
//                 >
//                   <ChevronRight className="w-6 h-6 text-gray-800 dark:text-white" />
//                 </button>
//               </div>
              
//               {/* Conteneur avec défilement horizontal */}
//               <div className="relative py-8">
//                 <div className="overflow-x-auto hide-scrollbar no-scrollbar pb-8">
//                   <AnimatePresence mode="popLayout">
//                     <motion.div 
//                       key={activeIndex}
//                       className="flex space-x-3 md:space-x-4 px-4 min-w-min"
//                       initial={{ x: 0 }}
//                       animate={{ x: getScrollOffset() }}
//                       transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
//                     >
//                     {collections.map((collection, index) => (
//                       <motion.div
//                         key={collection.id}
//                         custom={index}
//                         initial={{ opacity: 0, scale: 0.7, y: 40 }}
//                         animate={index === activeIndex 
//                           ? { 
//                               opacity: 1, 
//                               scale: 1.1, 
//                               y: 0,
//                               zIndex: 10,
//                               boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
//                             } 
//                           : { 
//                               opacity: 0.85, 
//                               scale: 0.95, 
//                               y: 0 
//                             }
//                         }
//                         exit={{ opacity: 0, scale: 0.7, y: -40 }}
//                         transition={{ 
//                           type: "spring", 
//                           stiffness: 300, 
//                           damping: 20,
//                           duration: 0.5
//                         }}
//                         className={`relative flex-shrink-0 w-[200px] h-[300px] md:w-[250px] md:h-[350px] rounded-2xl overflow-hidden shadow-xl group transform transition-all duration-500 ${index === activeIndex ? 'z-10' : 'z-0'}`}
//                         whileHover={{ y: -10, scale: index === activeIndex ? 1.15 : 1.05, transition: { duration: 0.3 } }}
//                         whileTap={{ scale: 0.95 }}
//                       >
//                         <Link to={collection.link} className="block h-full">
//                           <div className="h-full overflow-hidden">
//                             {/* Image d'arrière-plan */}
//                             <motion.div
//                               className="absolute inset-0 bg-cover bg-center h-full w-full"
//                               style={{ backgroundImage: `url(${collection.image})` }}
//                               whileHover={{ scale: 1.08 }}
//                               transition={{ duration: 1.2, ease: [0.33, 1, 0.68, 1] }}
//                             />
                            
//                             {/* Overlay gradient */}
//                             <div className={`absolute inset-0 ${collection.bg} opacity-70 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-60`} />
                            
//                             {/* Badges */}
//                             <div className="absolute top-4 left-4 flex flex-col gap-2">
//                               <div className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/30 backdrop-blur-sm text-white shadow-lg">
//                                 {collection.category.charAt(0).toUpperCase() + collection.category.slice(1)}
//                               </div>
//                               <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${collection.accent} text-white shadow-lg`}>
//                                 {collection.type.charAt(0).toUpperCase() + collection.type.slice(1)}
//                               </div>
//                             </div>
                            
//                             {/* Contenu */}
//                             <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-5">
//                               <div className="transform transition-all duration-500 group-hover:translate-y-[-12px]">
//                                 <h3 className={`text-lg md:text-xl font-extrabold mb-1 md:mb-2 ${collection.text}`}>{collection.name}</h3>
//                                 <p className={`${collection.text} text-xs md:text-sm line-clamp-2 opacity-90 mb-3 md:mb-4`}>{collection.description}</p>
                                
//                                 <div className={`inline-flex items-center px-3 py-1.5 rounded-full ${collection.accent} text-white shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:scale-105`}>
//                                   <span className="text-xs md:text-sm font-bold mr-2">Découvrir</span>
//                                   <motion.div
//                                     animate={{ x: [0, 5, 0] }}
//                                     transition={{ 
//                                       duration: 1.5, 
//                                       repeat: Infinity, 
//                                       repeatType: 'loop',
//                                       ease: 'easeInOut'
//                                     }}
//                                   >
//                                     <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
//                                   </motion.div>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </Link>
//                       </motion.div>
//                     ))}
//                     </motion.div>
//                   </AnimatePresence>
//                 </div>
//               </div>
              
//               {/* Indicateurs de pagination */}
//               <div className="flex justify-center mt-6 space-x-2">
//                 {collections.map((_, idx) => (
//                   <motion.button
//                     key={idx}
//                     onClick={() => setActiveIndex(idx)}
//                     className={`h-2 md:h-3 rounded-full transition-all duration-300 ${idx === activeIndex ? 'bg-gradient-to-r from-indigo-500 to-violet-500 w-6 md:w-8' : 'bg-gray-300 dark:bg-gray-700 w-2 md:w-3'}`}
//                     aria-label={`Voir la collection ${idx + 1}`}
//                     whileTap={{ scale: 0.9 }}
//                     animate={idx === activeIndex ? { scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] } : {}}
//                     transition={idx === activeIndex ? { duration: 2, repeat: Infinity } : {}}
//                   />
//                 ))}
//               </div>
//             </div>
//           )}
          
//           {/* Badges flottants */}
//           <motion.div 
//             initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
//             animate={inView ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0.8, rotate: -5 }}
//             transition={{ delay: 0.8, duration: 0.5 }}
//             className="absolute top-10 right-10 bg-gradient-to-r from-indigo-400 to-violet-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg transform rotate-3 hidden lg:block"
//           >
//             ⚡️ QUALITÉ PREMIUM ⚡️
//           </motion.div>
          
//           <motion.div 
//             initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
//             animate={inView ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0.8, rotate: 5 }}
//             transition={{ delay: 1, duration: 0.5 }}
//             className="absolute bottom-10 left-10 bg-gradient-to-r from-violet-500 to-indigo-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg transform -rotate-3 hidden lg:block"
//           >
//             🔥 MANYA SHOES ÉTÉ 2025 🔥
//           </motion.div>
//         </motion.div>
//       </div>
//     </section>
//   );
// };

// export default FeaturedCollections;