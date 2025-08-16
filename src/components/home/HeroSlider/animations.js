export const containerVariants = {
  hidden: {
    opacity: 0,
    y: 50
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1
    }
  }
};

export const slideVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4
    }
  },
  active: {
    scale: 1.05,
    zIndex: 1
  },
  inactive: {
    scale: 0.95,
    opacity: 0.7,
    zIndex: 0
  }
};