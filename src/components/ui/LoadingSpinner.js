import React from 'react';
import { motion } from 'framer-motion';

/**
 * Composant de spinner de chargement avec animation
 * @param {Object} props - Propriétés du composant
 * @param {string} props.size - Taille du spinner: 'sm', 'md', 'lg' ou 'xl'
 * @param {string} props.color - Couleur du spinner (classe Tailwind)
 */
const LoadingSpinner = ({ size = 'md', color = 'primary' }) => {
  // Définir les tailles en fonction du paramètre
  const sizes = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
    xl: 'h-16 w-16 border-4'
  };
  
  // Définir les couleurs en fonction du paramètre
  const colors = {
    primary: 'border-primary-600',
    secondary: 'border-secondary-600',
    white: 'border-white',
    black: 'border-black'
  };
  
  // Obtenir les classes CSS en fonction des paramètres
  const sizeClass = sizes[size] || sizes.md;
  const colorClass = colors[color] || colors.primary;
  
  return (
    <div className="flex items-center justify-center">
      <motion.div
        className={`${sizeClass} rounded-full ${colorClass} border-t-transparent`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
};

export default LoadingSpinner;