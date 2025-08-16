import React from 'react';
import { motion } from 'framer-motion';

// Composant pour afficher une vidéo verticale qui se lance automatiquement
const VideoFeature = ({ videoSrc, title, description, className = '' }) => {
  return (
    <motion.div 
      className={`relative overflow-hidden rounded-2xl shadow-xl ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1.0] }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="relative aspect-[9/16] w-full overflow-hidden rounded-2xl">
        {/* Vidéo qui se lance automatiquement */}
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          src={videoSrc}
        />
        
        {/* Overlay dégradé pour améliorer la lisibilité du texte */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Contenu textuel */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <motion.h3 
            className="text-2xl font-bold mb-2"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {title}
          </motion.h3>
          <motion.p 
            className="text-sm text-gray-200"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            {description}
          </motion.p>
        </div>
        
        {/* Bordure lumineuse animée */}
        <div className="absolute inset-0 rounded-2xl border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.3)] pointer-events-none" />
      </div>
    </motion.div>
  );
};

export default VideoFeature;