import { motion } from 'framer-motion';

export const HomeSection = ({ children }) => {
  return (
    <motion.div 
      className="h-screen snap-start"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};