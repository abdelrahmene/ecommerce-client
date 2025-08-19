import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Send, Check, AlertCircle } from 'lucide-react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');
  
  // Use IntersectionObserver to trigger animations
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate email
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setStatus('error');
      setMessage('Veuillez entrer une adresse email valide');
      return;
    }
    
    // Set loading state
    setStatus('loading');
    
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setMessage('Merci pour votre inscription ! Vous recevrez bientôt nos offres exclusives.');
      setEmail('');
      
      // Reset after 5 seconds
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 4000);
    }, 1500);
  };
  
  return (
    <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-800 dark:from-indigo-800 dark:to-purple-900 text-white transition-colors duration-300">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Rejoignez notre newsletter
          </h2>
          
          <p className="text-primary-100 mb-8 max-w-xl mx-auto">
            Inscrivez-vous pour recevoir en avant-première nos offres exclusives, les nouveaux produits et des codes promo personnalisés.
          </p>
          
          <form onSubmit={handleSubmit} className="relative max-w-md mx-auto">
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre adresse email"
                className={`w-full pl-4 pr-14 py-4 rounded-full bg-white/20 backdrop-blur-sm border ${
                  status === 'error' ? 'border-red-400' : 'border-white/30'
                } text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50`}
                disabled={status === 'loading' || status === 'success'}
              />
              
              <button
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-white text-primary-600 p-2.5 rounded-full hover:bg-primary-50 transition-colors disabled:opacity-70"
              >
                {status === 'loading' ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    <Send size={20} />
                  </motion.div>
                ) : status === 'success' ? (
                  <Check size={20} />
                ) : (
                  <Send size={20} />
                )}
              </button>
            </div>
            
            {/* Status message */}
            <AnimatedMessage status={status} message={message} />
            
            <p className="text-sm text-white/70 mt-4">
              Nous respectons votre vie privée et ne partagerons jamais vos informations.
            </p>
          </form>
          
          {/* Decorative elements */}
          <div className="absolute -left-10 top-10 w-20 h-20 bg-white/10 rounded-full blur-xl" />
          <div className="absolute right-20 bottom-10 w-32 h-32 bg-white/10 rounded-full blur-xl" />
        </motion.div>
      </div>
    </section>
  );
};

// Animated message component with motion
const AnimatedMessage = ({ status, message }) => {
  if (!message) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`mt-2 flex items-center ${
        status === 'error' ? 'text-red-300' : 'text-green-300'
      }`}
    >
      {status === 'error' ? (
        <AlertCircle size={16} className="mr-1" />
      ) : (
        <Check size={16} className="mr-1" />
      )}
      <span className="text-sm">{message}</span>
    </motion.div>
  );
};

export default Newsletter;