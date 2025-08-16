export const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1.0]
    }
  }
};

export const shimmerEffect = {
  hidden: { 
    backgroundPosition: '200% 0',
    opacity: 0 
  },
  visible: { 
    backgroundPosition: '-200% 0',
    opacity: 1,
    transition: {
      backgroundPosition: {
        duration: 2,
        ease: "linear",
        repeat: Infinity
      },
      opacity: {
        duration: 0.5
      }
    }
  }
};

export const neonGlow = {
  '0%': { filter: 'drop-shadow(0 0 2px #4F46E5) drop-shadow(0 0 4px #4F46E5)' },
  '50%': { filter: 'drop-shadow(0 0 6px #4F46E5) drop-shadow(0 0 12px #4F46E5)' },
  '100%': { filter: 'drop-shadow(0 0 2px #4F46E5) drop-shadow(0 0 4px #4F46E5)' }
};

export const collectionVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1.0]
    }
  },
  hover: { 
    y: -10,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1.0]
    }
  }
};