import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ShoppingCart, Plus, Minus, Check, MapPin, Phone, User, MessageSquare, ChevronDown, ChevronUp, AlertCircle, Zap } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useCart } from '../../contexts/CartContext';
import QuickOrderForm from './QuickOrderForm';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

const ProductInfo = ({ 
  product, 
  selectedColor, 
  setSelectedColor, 
  selectedSize, 
  setSelectedSize, 
  quantity, 
  handleQuantityChange, 
  handleAddToCart 
}) => {
  // États pour le formulaire de paiement à la livraison
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    wilaya: '',
    commune: '',
    remarque: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showQuickOrder, setShowQuickOrder] = useState(false);
  
  // Gérer les changements dans le formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Effacer l'erreur pour ce champ si l'utilisateur commence à le remplir
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Valider le formulaire
  const validateForm = () => {
    const errors = {};
    
    if (!formData.nom.trim()) errors.nom = 'Le nom est requis';
    if (!formData.prenom.trim()) errors.prenom = 'Le prénom est requis';
    if (!formData.telephone.trim()) errors.telephone = 'Le numéro de téléphone est requis';
    if (!formData.wilaya) errors.wilaya = 'La wilaya est requise';
    if (!formData.commune.trim()) errors.commune = 'La commune est requise';
    
    return errors;
  };
  
  // Importer le contexte du panier pour accéder à processCashOnDeliveryOrder
  const { processCashOnDeliveryOrder } = useCart();
  
  // Handler pour la commande rapide
  const handleQuickOrderSubmit = async (orderData) => {
    try {
      const response = await processCashOnDeliveryOrder(orderData);
      if (response.success) {
        toast.success(`Commande #${response.orderId} enregistrée avec succès!`);
        return response;
      } else {
        throw new Error('Erreur lors de l\'enregistrement');
      }
    } catch (error) {
      console.error('Erreur de traitement:', error);
      toast.error('Une erreur est survenue. Veuillez réessayer plus tard.');
      throw error;
    }
  };
  
  // Gérer la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Vérifier que la taille et la couleur sont sélectionnées
    if (!selectedSize || !selectedColor) {
      toast.error('Veuillez sélectionner une pointure et une couleur');
      return;
    }
    
    // Valider le formulaire
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setIsSubmitting(true);
    
    // Créer l'objet de commande avec gestion des valeurs undefined
    const orderData = {
      product: {
        id: product.id,
        name: product.name,
        price: product.salePrice || product.price,
        image: selectedColor.images && selectedColor.images.length > 0 ? selectedColor.images[0].url || selectedColor.images[0] : null,
        color: selectedColor.name || 'Standard',
        // S'assurer que colorCode n'est jamais undefined (null est accepté par Firestore)
        colorCode: selectedColor.code || null,
        size: selectedSize.value,
        quantity: quantity
      },
      deliveryInfo: {
        firstName: formData.prenom,
        lastName: formData.nom,
        phone: formData.telephone,
        wilaya: formData.wilaya,
        commune: formData.commune,
        note: formData.remarque || ''
      },
      orderDate: new Date().toISOString(),
      paymentMethod: 'cash-on-delivery',
      status: 'pending'
    };
    
    // Traiter la commande avec paiement à la livraison
    processCashOnDeliveryOrder(orderData)
      .then(response => {
        if (response.success) {
          // Ajouter également au panier pour référence
          handleAddToCart({
            deliveryInfo: formData,
            orderId: response.orderId,
            paymentMethod: 'cash-on-delivery'
          });
          
          // Réinitialiser le formulaire
          setFormData({
            nom: '',
            prenom: '',
            telephone: '',
            wilaya: '',
            commune: '',
            remarque: ''
          });
          
          toast.success(`Commande #${response.orderId} enregistrée avec succès!`);
        } else {
          toast.error('Erreur lors de l\'enregistrement de la commande. Veuillez réessayer.');
        }
      })
      .catch(error => {
        console.error('Erreur de traitement:', error);
        toast.error('Une erreur est survenue. Veuillez réessayer plus tard.');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };
  if (!product) return null;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      className="flex flex-col h-full"
    >
      {/* Titre et évaluation */}
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{product.name}</h1>
      
      <div className="flex items-center mt-3 space-x-4">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              size={16} 
              className={`${i < Math.floor(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`} 
              fill={i < Math.floor(product.rating || 0) ? 'currentColor' : 'none'}
            />
          ))}
          <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-400">
            {product.rating && product.rating.toFixed(1)}
          </span>
        </div>
        
        {product.reviewCount && (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {product.reviewCount} avis
          </span>
        )}
      </div>
      
      {/* Prix */}
      <div className="mt-6 flex items-center">
        <span className="text-2xl font-bold text-gray-900 dark:text-white">
          {product.price && product.price.toFixed(2)} €
        </span>
        
        {product.oldPrice && (
          <span className="ml-3 text-lg line-through text-gray-500 dark:text-gray-400">
            {product.oldPrice.toFixed(2)} €
          </span>
        )}
        
        {product.discount > 0 && (
          <span className="ml-3 text-sm font-medium text-red-600 bg-red-100 px-2 py-1 rounded">
            -{product.discount}%
          </span>
        )}
      </div>
      
      {/* Description */}
      <p className="mt-4 text-gray-600 dark:text-gray-300">
        {product.description}
      </p>
      
      {/* Sélection de couleur */}
      {product.colors && product.colors.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">Couleur</h3>
          <div className="flex items-center space-x-3 mt-2">
            {product.colors.map((color, index) => (
              <button
                key={index}
                onClick={() => setSelectedColor(color)}
                className={`relative w-10 h-10 rounded-full transition-transform ${
                  selectedColor === color ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : ''
                }`}
                style={{ backgroundColor: color.value }}
                aria-label={`Couleur ${color.name}`}
              >
                {selectedColor === color && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <Check size={16} className="text-white" />
                  </span>
                )}
              </button>
            ))}
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {selectedColor ? selectedColor.name : ''}
          </p>
        </div>
      )}
      
      {/* Sélection de taille avec design badass */}
      {product.sizes && product.sizes.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <motion.h3 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-base font-bold text-gray-900 dark:text-white flex items-center"
            >
              <span className="mr-2 bg-gradient-to-r from-blue-500 to-indigo-600 h-5 w-1 rounded-full"></span>
              Pointures Disponibles
            </motion.h3>
            <motion.a 
              href="#guide-tailles" 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-sm font-medium bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent hover:from-indigo-600 hover:to-blue-500"
            >
              Guide des tailles
            </motion.a>
          </div>
          
          {/* Filtrer et regrouper les pointures par type */}
          {(() => {
            const adultSizes = product.sizes.filter(size => !size.type || size.type === 'adult');
            const kidsSizes = product.sizes.filter(size => size.type === 'kids');
            
            return (
              <>
                {/* Pointures adultes */}
                {adultSizes.length > 0 && (
                  <div className="mb-5">
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex items-center mt-4 mb-2"
                    >
                      <div className="h-1 w-1 rounded-full bg-indigo-500 mr-2"></div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Adultes</span>
                      <div className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                        {adultSizes.filter(s => s.available).length} disponibles
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                      className="flex flex-wrap gap-3"
                    >
                      {adultSizes.map((size, index) => (
                        <motion.button
                          key={`adult-${size.value}`}
                          onClick={() => size.available && setSelectedSize(size)}
                          disabled={!size.available}
                          whileHover={size.available ? { scale: 1.08, y: -3 } : {}}
                          whileTap={size.available ? { scale: 0.95 } : {}}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ 
                            opacity: 1, 
                            y: 0,
                            transition: { delay: 0.1 * index + 0.5 }
                          }}
                          className={`relative h-11 w-11 flex items-center justify-center rounded-lg font-bold transition-all duration-300 ${
                            !size.available 
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600 opacity-50' 
                              : selectedSize === size
                                ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                                : 'bg-gray-100 text-gray-900 hover:shadow-md dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                          }`}
                        >
                          {size.value}
                          {selectedSize === size && (
                            <motion.div 
                              layoutId="selectedSize"
                              className="absolute inset-0 rounded-lg border-2 border-blue-500 dark:border-indigo-400"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                            />
                          )}
                          {!size.available && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-8 h-0.5 bg-gray-400 rotate-45 rounded-full"></div>
                            </div>
                          )}
                          {size.stock > 0 && size.stock <= 5 && (
                            <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-amber-500 border border-white dark:border-gray-800"></div>
                          )}
                        </motion.button>
                      ))}
                    </motion.div>
                  </div>
                )}
                
                {/* Pointures enfants */}
                {kidsSizes.length > 0 && (
                  <div>
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="flex items-center mt-4 mb-2"
                    >
                      <div className="h-1 w-1 rounded-full bg-pink-500 mr-2"></div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Enfants</span>
                      <div className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                        {kidsSizes.filter(s => s.available).length} disponibles
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                      className="flex flex-wrap gap-3"
                    >
                      {kidsSizes.map((size, index) => (
                        <motion.button
                          key={`kids-${size.value}`}
                          onClick={() => size.available && setSelectedSize(size)}
                          disabled={!size.available}
                          whileHover={size.available ? { scale: 1.08, y: -3 } : {}}
                          whileTap={size.available ? { scale: 0.95 } : {}}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ 
                            opacity: 1, 
                            y: 0,
                            transition: { delay: 0.1 * index + 0.7 }
                          }}
                          className={`relative h-11 w-11 flex items-center justify-center rounded-lg font-bold transition-all duration-300 ${
                            !size.available 
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600 opacity-50' 
                              : selectedSize === size
                                ? 'bg-gradient-to-br from-pink-400 to-purple-600 text-white shadow-lg shadow-pink-500/30'
                                : 'bg-gray-100 text-gray-900 hover:shadow-md dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                          }`}
                        >
                          {size.value}
                          {selectedSize === size && (
                            <motion.div 
                              layoutId="selectedSize"
                              className="absolute inset-0 rounded-lg border-2 border-pink-500 dark:border-purple-400"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                            />
                          )}
                          {!size.available && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-8 h-0.5 bg-gray-400 rotate-45 rounded-full"></div>
                            </div>
                          )}
                          {size.stock > 0 && size.stock <= 5 && (
                            <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-amber-500 border border-white dark:border-gray-800"></div>
                          )}
                        </motion.button>
                      ))}
                    </motion.div>
                  </div>
                )}
              </>
            );
          })()}
          
          {/* Indicateur de taille sélectionnée avec stock */}
          {selectedSize && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-sm font-medium flex items-center"
            >
              <div className={`px-3 py-1 rounded-full ${selectedSize.type === 'kids' ? 'bg-pink-100 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'}`}>
                Pointure sélectionnée: {selectedSize.value}
              </div>
              {selectedSize.stock > 0 && (
                <div className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                  {selectedSize.stock} en stock
                </div>
              )}
            </motion.div>
          )}
        </div>
      )}
      
      {/* Formulaire de paiement à la livraison pour l'Algérie */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mt-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <div className="p-5">
          <motion.h3 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg font-bold text-gray-900 dark:text-white flex items-center mb-4"
          >
            <div className="h-6 w-1 rounded-full bg-gradient-to-b from-blue-500 to-indigo-600 mr-3"></div>
            Paiement à la livraison
          </motion.h3>
          
          {/* Formulaire avec animations */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Nom et Prénom */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">
                  <User size={14} className="inline mr-1" /> Nom
                </label>
                <input 
                  type="text" 
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 bg-white dark:bg-gray-800 border ${formErrors.nom ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-300 outline-none`}
                  placeholder="Votre nom"
                />
                {formErrors.nom && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-1 text-sm text-red-500 flex items-center"
                  >
                    <AlertCircle size={12} className="mr-1" /> {formErrors.nom}
                  </motion.p>
                )}
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
              >
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">
                  <User size={14} className="inline mr-1" /> Prénom
                </label>
                <input 
                  type="text" 
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 bg-white dark:bg-gray-800 border ${formErrors.prenom ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-300 outline-none`}
                  placeholder="Votre prénom"
                />
                {formErrors.prenom && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-1 text-sm text-red-500 flex items-center"
                  >
                    <AlertCircle size={12} className="mr-1" /> {formErrors.prenom}
                  </motion.p>
                )}
              </motion.div>
            </div>
            
            {/* Numéro de téléphone */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">
                <Phone size={14} className="inline mr-1" /> Numéro de téléphone
              </label>
              <input 
                type="tel" 
                name="telephone"
                value={formData.telephone}
                onChange={handleInputChange}
                className={`w-full px-4 py-2.5 bg-white dark:bg-gray-800 border ${formErrors.telephone ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-300 outline-none`}
                placeholder="Votre numéro"
              />
              {formErrors.telephone && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-1 text-sm text-red-500 flex items-center"
                >
                  <AlertCircle size={12} className="mr-1" /> {formErrors.telephone}
                </motion.p>
              )}
            </motion.div>
            
            {/* Wilaya et Commune */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
              >
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">
                  <MapPin size={14} className="inline mr-1" /> Wilaya
                </label>
                <select 
                  name="wilaya"
                  value={formData.wilaya}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 bg-white dark:bg-gray-800 border ${formErrors.wilaya ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-300 outline-none appearance-none`}
                >
                  <option value="">Sélectionnez votre wilaya</option>
                  <option value="01-Adrar">01 - Adrar</option>
                  <option value="02-Chlef">02 - Chlef</option>
                  <option value="03-Laghouat">03 - Laghouat</option>
                  <option value="04-Oum El Bouaghi">04 - Oum El Bouaghi</option>
                  <option value="05-Batna">05 - Batna</option>
                  <option value="06-Béjaïa">06 - Béjaïa</option>
                  <option value="07-Biskra">07 - Biskra</option>
                  <option value="08-Béchar">08 - Béchar</option>
                  <option value="09-Blida">09 - Blida</option>
                  <option value="10-Bouira">10 - Bouira</option>
                  <option value="11-Tamanrasset">11 - Tamanrasset</option>
                  <option value="12-Tébessa">12 - Tébessa</option>
                  <option value="13-Tlemcen">13 - Tlemcen</option>
                  <option value="14-Tiaret">14 - Tiaret</option>
                  <option value="15-Tizi Ouzou">15 - Tizi Ouzou</option>
                  <option value="16-Alger">16 - Alger</option>
                  <option value="17-Djelfa">17 - Djelfa</option>
                  <option value="18-Jijel">18 - Jijel</option>
                  <option value="19-Sétif">19 - Sétif</option>
                  <option value="20-Saïda">20 - Saïda</option>
                  <option value="21-Skikda">21 - Skikda</option>
                  <option value="22-Sidi Bel Abbès">22 - Sidi Bel Abbès</option>
                  <option value="23-Annaba">23 - Annaba</option>
                  <option value="24-Guelma">24 - Guelma</option>
                  <option value="25-Constantine">25 - Constantine</option>
                  <option value="26-Médéa">26 - Médéa</option>
                  <option value="27-Mostaganem">27 - Mostaganem</option>
                  <option value="28-M'Sila">28 - M'Sila</option>
                  <option value="29-Mascara">29 - Mascara</option>
                  <option value="30-Ouargla">30 - Ouargla</option>
                  <option value="31-Oran">31 - Oran</option>
                  <option value="32-El Bayadh">32 - El Bayadh</option>
                  <option value="33-Illizi">33 - Illizi</option>
                  <option value="34-Bordj Bou Arreridj">34 - Bordj Bou Arreridj</option>
                  <option value="35-Boumerdès">35 - Boumerdès</option>
                  <option value="36-El Tarf">36 - El Tarf</option>
                  <option value="37-Tindouf">37 - Tindouf</option>
                  <option value="38-Tissemsilt">38 - Tissemsilt</option>
                  <option value="39-El Oued">39 - El Oued</option>
                  <option value="40-Khenchela">40 - Khenchela</option>
                  <option value="41-Souk Ahras">41 - Souk Ahras</option>
                  <option value="42-Tipaza">42 - Tipaza</option>
                  <option value="43-Mila">43 - Mila</option>
                  <option value="44-Aïn Defla">44 - Aïn Defla</option>
                  <option value="45-Naâma">45 - Naâma</option>
                  <option value="46-Aïn Témouchent">46 - Aïn Témouchent</option>
                  <option value="47-Ghardaïa">47 - Ghardaïa</option>
                  <option value="48-Relizane">48 - Relizane</option>
                  <option value="49-El M'Ghair">49 - El M'Ghair</option>
                  <option value="50-El Meniaa">50 - El Meniaa</option>
                  <option value="51-Ouled Djellal">51 - Ouled Djellal</option>
                  <option value="52-Bordj Baji Mokhtar">52 - Bordj Baji Mokhtar</option>
                  <option value="53-Béni Abbès">53 - Béni Abbès</option>
                  <option value="54-Timimoun">54 - Timimoun</option>
                  <option value="55-Touggourt">55 - Touggourt</option>
                  <option value="56-Djanet">56 - Djanet</option>
                  <option value="57-In Salah">57 - In Salah</option>
                  <option value="58-In Guezzam">58 - In Guezzam</option>
                </select>
                {formErrors.wilaya && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-1 text-sm text-red-500 flex items-center"
                  >
                    <AlertCircle size={12} className="mr-1" /> {formErrors.wilaya}
                  </motion.p>
                )}
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">
                  <MapPin size={14} className="inline mr-1" /> Commune
                </label>
                <input 
                  type="text" 
                  name="commune"
                  value={formData.commune}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 bg-white dark:bg-gray-800 border ${formErrors.commune ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-300 outline-none`}
                  placeholder="Votre commune"
                />
                {formErrors.commune && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-1 text-sm text-red-500 flex items-center"
                  >
                    <AlertCircle size={12} className="mr-1" /> {formErrors.commune}
                  </motion.p>
                )}
              </motion.div>
            </div>
            
            {/* Remarque */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
            >
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">
                <MessageSquare size={14} className="inline mr-1" /> Remarque (optionnel)
              </label>
              <textarea 
                name="remarque"
                value={formData.remarque}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-300 outline-none h-20 resize-none"
                placeholder="Instructions de livraison spéciales..."
              ></textarea>
            </motion.div>
            
            {/* Quantité */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex items-center"
            >
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mr-4">
                Quantité:
              </label>
              <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                <motion.button
                  type="button"
                  onClick={() => handleQuantityChange(-1)}
                  whileHover={{ backgroundColor: '#f3f4f6' }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-l-lg"
                >
                  <Minus size={18} />
                </motion.button>
                <span className="w-10 text-center text-gray-900 dark:text-white font-medium">
                  {quantity}
                </span>
                <motion.button
                  type="button"
                  onClick={() => handleQuantityChange(1)}
                  whileHover={{ backgroundColor: '#f3f4f6' }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-r-lg"
                >
                  <Plus size={18} />
                </motion.button>
              </div>
            </motion.div>
            
            {/* Bouton d'achat */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 }}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-3.5 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 mt-4 shadow-lg shadow-blue-500/20"
              disabled={!selectedSize || !selectedColor || isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  <span>Traitement en cours...</span>
                </div>
              ) : (
                <>
                  <ShoppingCart size={20} className="mr-2" />
                  <span className="text-base">Acheter maintenant</span>
                </>
              )}
            </motion.button>
          </form>
        </div>
        
        {/* Informations de livraison */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 px-5 py-3 border-t border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center text-sm text-blue-800 dark:text-blue-300">
            <Check size={16} className="mr-2 text-green-500" />
            <span>Livraison disponible dans toute l'Algérie</span>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Stock et livraison */}
      <div className="mt-6 border-t border-gray-200 dark:border-gray-800 pt-6 space-y-3">
        {product.stock > 0 ? (
          <div className="flex items-center text-green-600 dark:text-green-500">
            <Check size={16} className="mr-2" />
            <span className="text-sm font-medium">En stock ({product.stock} disponibles)</span>
          </div>
        ) : (
          <div className="flex items-center text-red-600 dark:text-red-500">
            <span className="text-sm font-medium">Rupture de stock</span>
          </div>
        )}
        
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <span className="text-sm">Livraison gratuite dès 50€ d'achat</span>
        </div>
        
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <span className="text-sm">Retours gratuits sous 30 jours</span>
        </div>
      </div>
      
      {/* Référence */}
      {product.sku && (
        <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
          Référence : {product.sku}
        </div>
      )}
    </motion.div>
  );
};

export default ProductInfo;