import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeaturedVideo = () => {
  const videoRef = useRef(null);
  
  useEffect(() => {
    // S'assurer que la vidéo joue automatiquement, en boucle et sans son
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error("Erreur lors de la lecture automatique de la vidéo:", error);
      });
    }
  }, []);

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Overlay de fond */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black"></div>
      
      {/* Contenu principal */}
      <motion.div 
        className="container mx-auto px-4 relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Vidéo avec cadre stylisé */}
          <motion.div 
            className="w-full lg:w-1/2"
            variants={itemVariants}
          >
            <div className="relative rounded-2xl overflow-hidden border-2 border-violet-500/30 shadow-[0_0_25px_rgba(139,92,246,0.3)]">
              {/* Overlay dégradé */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70 z-10"></div>
              
              {/* Bordure lumineuse animée */}
              <div className="absolute inset-0 border-4 border-violet-500/20 z-10 rounded-2xl"></div>
              <motion.div 
                className="absolute inset-0 border-2 border-violet-400/40 z-10 rounded-2xl"
                animate={{
                  boxShadow: ['0 0 5px rgba(139,92,246,0.3)', '0 0 20px rgba(139,92,246,0.7)', '0 0 5px rgba(139,92,246,0.3)']
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              ></motion.div>
              
              {/* Vidéo */}
              <video
                ref={videoRef}
                className="w-full aspect-[9/16] object-cover"
                autoPlay
                loop
                muted
                playsInline
              >
                <source src="/videos/manyaShoesVideoVerTical.mp4" type="video/mp4" />
                Votre navigateur ne supporte pas la lecture de vidéos.
              </video>
              
              {/* Badge flottant */}
              <motion.div 
                className="absolute top-6 right-6 z-20 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg"
                initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                EXCLUSIF
              </motion.div>
            </div>
          </motion.div>
          
          {/* Texte */}
          <motion.div 
            className="w-full lg:w-1/2 text-center lg:text-left"
            variants={itemVariants}
          >
            <motion.span 
              className="inline-block text-sm uppercase tracking-wider bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent font-medium mb-4"
              variants={itemVariants}
            >
              DÉCOUVREZ NOTRE HISTOIRE
            </motion.span>
            
            <motion.h2 
              className="text-4xl md:text-6xl font-bold text-white mb-6"
              variants={itemVariants}
            >
              L'Art de la<br />
              <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                Perfection
              </span>
            </motion.h2>
            
            <motion.p 
              className="text-gray-300 text-lg mb-8 max-w-xl mx-auto lg:mx-0"
              variants={itemVariants}
            >
              Découvrez l'excellence artisanale qui se cache derrière chacune de nos créations. Notre passion pour la qualité et notre souci du détail font de chaque paire une œuvre d'art à porter.
            </motion.p>
            
            <motion.div
              variants={itemVariants}
            >
              <Link 
                to="/about"
                className="group inline-flex items-center bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold rounded-full px-8 py-4 shadow-lg transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px]"
              >
                <span>NOTRE HISTOIRE</span>
                <motion.div
                  className="ml-2"
                  initial={{ x: 0 }}
                  animate={{ x: 0 }}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <ArrowRight size={18} />
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Éléments décoratifs */}
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-violet-900/20 rounded-full blur-3xl"></div>
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-900/20 rounded-full blur-3xl"></div>
    </section>
  );
};

export default FeaturedVideo;