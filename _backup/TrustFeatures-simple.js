import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Truck, ShieldCheck, CreditCard, RefreshCw, MapPin, Clock, CheckCircle } from 'lucide-react';

const TrustFeatures = () => {
  // Features data - Version ultra badass avec couleurs d'été
  const features = [
    {
      id: 1,
      icon: <Truck className="h-10 w-10" />,
      title: "LIVRAISON 58 WILAYAS",
      description: "Livraison rapide partout en Algérie avec suivi en temps réel",
      gradient: "from-cyan-400 to-blue-500",
      textColor: "text-cyan-50",
      iconColor: "text-cyan-50",
      highlights: ["Toutes les wilayas", "Suivi en temps réel", "Livraison express"]
    },
    {
      id: 2,
      icon: <CreditCard className="h-10 w-10" />,
      title: "PAIEMENT À LA LIVRAISON",
      description: "Payez uniquement quand vous recevez votre commande",
      gradient: "from-orange-400 to-pink-500",
      textColor: "text-orange-50",
      iconColor: "text-orange-50",
      highlights: ["Sans frais supplémentaires", "100% sécurisé", "Simple et rapide"]
    },
    {
      id: 3,
      icon: <RefreshCw className="h-10 w-10" />,
      title: "RETOURS DISPONIBLES",
      description: "Retournez facilement vos articles sous 30 jours",
      gradient: "from-green-400 to-teal-500",
      textColor: "text-green-50",
      iconColor: "text-green-50",
      highlights: ["Sans questions", "Remboursement rapide", "Procédure simple"]
    },
    {
      id: 4,
      icon: <CheckCircle className="h-10 w-10" />,
      title: "QUALITÉ GARANTIE",
      description: "Tous nos produits sont vérifiés et garantis authentiques",
      gradient: "from-purple-400 to-indigo-500",
      textColor: "text-purple-50",
      iconColor: "text-purple-50",
      highlights: ["Authenticité garantie", "Matériaux premium", "Contrôle qualité"]
    }
  ];
  
  // Use IntersectionObserver to trigger animations
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: custom * 0.1,
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1]
      }
    })
  };
  
  // Icon hover animation
  const iconVariants = {
    hover: {
      scale: 1.1,
      rotate: [0, -10, 10, -10, 0],
      transition: {
        duration: 0.5
      }
    }
  };
  
  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background avec motif d'été */}
      <div className="absolute inset-0 opacity-10 bg-repeat" 
           style={{ backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cGF0aCBkPSJNMzAgMzBtLTI4IDBhMjggMjggMCAxIDAgNTYgMCAyOCAyOCAwIDEgMC01NiAwWiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmYzMzY2IiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=')", backgroundSize: "60px 60px" }}>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Titre de section badass */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
            AVANTAGES EXCLUSIFS
          </h2>
          <div className="w-24 h-1 mx-auto rounded-full bg-gradient-to-r from-pink-500 to-cyan-500"></div>
        </motion.div>
        
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              custom={index}
              variants={itemVariants}
              className={`summer-card rounded-xl overflow-hidden shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 h-full`}
            >
              {/* Card Header with Gradient */}
              <div className={`bg-gradient-to-r ${feature.gradient} p-6 relative`}>
                <motion.div 
                  whileHover="hover"
                  variants={iconVariants}
                  className={`mb-4 p-4 rounded-full bg-white/20 backdrop-blur-sm inline-block ${feature.iconColor}`}
                >
                  {feature.icon}
                </motion.div>
                
                <h3 className={`text-xl font-bold ${feature.textColor}`}>
                  {feature.title}
                </h3>
                
                <p className={`mt-2 ${feature.textColor} opacity-90 text-sm md:text-base`}>
                  {feature.description}
                </p>
                
                {/* Curved bottom edge */}
                <div className="absolute -bottom-6 left-0 right-0 h-6 bg-white dark:bg-secondary-900 rounded-t-[50%]"></div>
              </div>
              
              {/* Card Body with Highlights */}
              <div className="p-6 pt-8 bg-white dark:bg-secondary-900">
                <ul className="space-y-2">
                  {feature.highlights.map((highlight, i) => (
                    <li key={i} className="flex items-center text-sm">
                      <span className={`inline-block w-2 h-2 rounded-full bg-gradient-to-r ${feature.gradient} mr-2`}></span>
                      <span className="text-gray-700 dark:text-gray-300">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Badge flottant badass */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="absolute -top-5 right-10 md:right-20 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg transform rotate-3 hidden md:block"
        >
          ⚡️ ULTRA BADASS ⚡️
        </motion.div>
      </div>
    </section>
  );
};

export default TrustFeatures;