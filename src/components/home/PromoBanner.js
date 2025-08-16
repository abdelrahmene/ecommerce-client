import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Clock, ArrowRight, ShoppingBag } from 'lucide-react';

const PromoBanner = () => {
  // Données pour la promotion Birkenstock
  const promoData = {
    title: "COLLECTION ÉTÉ 2025",
    subtitle: "Pré-vente exclusive",
    description: "Accédez en avant-première à notre nouvelle collection Birkenstock été 2025 avec 20% de réduction sur une sélection limitée.",
    buttonText: "Découvrir la collection",
    buttonLink: "/collections/summer-2025",
    promoCode: "SUMMER25",
    endDate: new Date(new Date().setDate(new Date().getDate() + 5)) // 5 jours à partir d'aujourd'hui
  };
  // Calculate remaining time for countdown
  const [timeLeft, setTimeLeft] = React.useState(getTimeLeft());
  
  function getTimeLeft() {
    const difference = promoData.endDate - new Date();
    
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    };
  }
  
  // Update countdown every second
  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };
  
  // Countdown box avec effet 3D moderne
  const CountdownBox = ({ value, label }) => {
    const [prevValue, setPrevValue] = React.useState(value);
    const [isFlipping, setIsFlipping] = React.useState(false);
    
    React.useEffect(() => {
      if (prevValue !== value) {
        setIsFlipping(true);
        const timer = setTimeout(() => {
          setIsFlipping(false);
          setPrevValue(value);
        }, 300);
        
        return () => clearTimeout(timer);
      }
    }, [value, prevValue]);
    
    return (
      <div className="flex flex-col items-center">
        <div className="relative w-16 h-20 mb-1 perspective-500">
          <div 
            className={`absolute inset-0 bg-gradient-to-b from-stone-700 to-stone-800 border border-stone-600 rounded-lg shadow-lg flex items-center justify-center text-2xl font-bold text-white ${isFlipping ? 'animate-flip-down' : ''}`}
            style={{
              transformStyle: 'preserve-3d',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)'
            }}
          >
            {value.toString().padStart(2, '0')}
          </div>
        </div>
        <span className="text-xs font-medium text-stone-400">{label}</span>
      </div>
    );
  };
  
  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-indigo-900 dark:to-purple-900 text-white py-12 md:py-16 overflow-hidden transition-colors duration-300">
      {/* Fond avec effet parallaxe */}
      <div className="absolute inset-0 opacity-20">
        <motion.div 
          className="absolute inset-0 bg-[url('https://www.birkenstock.com/dw/image/v2/BDXC_PRD/on/demandware.static/-/Sites-master-catalog/default/dw4f283d3e/1018742/1018742.jpg')] bg-cover bg-center"
          style={{ backgroundSize: '120%' }}
          animate={{ 
            scale: [1, 1.05, 1],
            x: [0, -5, 0, 5, 0],
            y: [0, -5, 0, 5, 0]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        />
      </div>
      
      {/* Contenu */}
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
          className="flex flex-col lg:flex-row items-center justify-between p-8 md:p-12 rounded-xl backdrop-blur-sm border border-stone-700 bg-gradient-to-r from-stone-900/90 to-stone-800/80 text-white"
        >
          <div className="flex-1 mb-10 lg:mb-0 text-center lg:text-left pr-0 lg:pr-8">
            <motion.div variants={itemVariants} className="mb-2 inline-block">
              <span className="text-sm font-medium tracking-widest bg-stone-700 text-white px-3 py-1 rounded-full">
                {promoData.promoCode}
              </span>
            </motion.div>
            
            <motion.h2 
              variants={itemVariants}
              className="text-3xl md:text-5xl font-bold mb-3 tracking-tight"
            >
              {promoData.title}
            </motion.h2>
            
            <motion.p 
              variants={itemVariants}
              className="text-xl md:text-2xl font-medium mb-4 text-stone-300"
            >
              {promoData.subtitle}
            </motion.p>
            
            <motion.p 
              variants={itemVariants}
              className="text-base md:text-lg opacity-90 mb-8 max-w-xl text-stone-400"
            >
              {promoData.description}
            </motion.p>
            
            <motion.div variants={itemVariants}>
              <Link 
                to={promoData.buttonLink}
                className="group inline-flex items-center justify-center px-8 py-4 bg-white text-stone-900 font-medium rounded-full hover:bg-stone-200 transition-all duration-300"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                {promoData.buttonText}
                <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </motion.div>
          </div>
          
          <motion.div 
            variants={itemVariants}
            className="flex flex-col items-center bg-stone-800/70 backdrop-blur-sm p-8 rounded-xl border border-stone-700 shadow-xl"
          >
            <div className="mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-stone-300" />
              <span className="text-sm font-medium text-stone-300">L'offre se termine dans:</span>
            </div>
            
            <div className="flex space-x-3">
              <CountdownBox value={timeLeft.days} label="Jours" />
              <CountdownBox value={timeLeft.hours} label="Heures" />
              <CountdownBox value={timeLeft.minutes} label="Min" />
              <CountdownBox value={timeLeft.seconds} label="Sec" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default PromoBanner;