import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
// Utilisation d'un URL relatif au lieu d'un import direct

const VideoBackground = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    // S'assurer que la vidéo joue automatiquement, en boucle et sans son
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error("Erreur lors de la lecture automatique de la vidéo:", error);
      });
    }
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden z-0 pointer-events-none">
      <div className="absolute inset-0 bg-black/80 z-10"></div>
      
      <motion.div 
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 2 }}
      >
        <video
          ref={videoRef}
          className="absolute h-full w-auto max-w-none object-cover"
          autoPlay
          loop
          muted
          playsInline
          style={{ 
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            minHeight: '100%',
            minWidth: '100%',
            filter: 'saturate(1.2) contrast(1.1)'
          }}
        >
          <source src="/videos/manyaShoesVideoVerTical.mp4" type="video/mp4" />
          Votre navigateur ne supporte pas la lecture de vidéos.
        </video>
      </motion.div>
    </div>
  );
};

export default VideoBackground;