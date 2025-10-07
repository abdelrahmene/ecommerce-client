import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, MessageSquare, ShoppingCart, AlertCircle, Truck } from 'lucide-react';
import { toast } from 'react-hot-toast';
import PersonalInfoForm from './PersonalInfoForm';
import YalidineSelector from './YalidineSelector';
import DeliveryFeesSummary from './DeliveryFeesSummary';

const ShippingForm = ({ 
  product, 
  quantity, 
  selectedSize, 
  selectedColor, 
  onSubmitSuccess 
}) => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    wilayaId: null,
    wilayaName: '',
    communeId: null,
    communeName: '',
    adresse: '',
    remarque: '',
    totalPrice: (product?.price || 0) * quantity,
    weight: 1,
    length: 30,
    width: 20,
    height: 10
  });

  const [fees, setFees] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Gérer les changements de formulaire
  const handleFormChange = (updates) => {
    setFormData(prev => ({
      ...prev,
      ...updates
    }));

    // Effacer les erreurs des champs modifiés
    const updatedErrors = { ...formErrors };
    Object.keys(updates).forEach(key => {
      if (updatedErrors[key]) {
        delete updatedErrors[key];
      }
    });
    setFormErrors(updatedErrors);
  };

  // Callback quand les frais sont calculés
  const handleFeesCalculated = (calculatedFees) => {
    setFees(calculatedFees);
  };

  // Valider le formulaire
  const validateForm = () => {
    const errors = {};

    if (!formData.nom.trim()) errors.nom = 'Le nom est requis';
    if (!formData.prenom.trim()) errors.prenom = 'Le prénom est requis';
    if (!formData.telephone.trim()) {
      errors.telephone = 'Le téléphone est requis';
    } else if (!/^(0)(5|6|7)[0-9]{8}$|^(0)(2|3)[0-9]{7}$/.test(formData.telephone)) {
      errors.telephone = 'Numéro invalide (ex: 0550123456)';
    }
    if (!formData.wilayaId) errors.wilaya = 'La wilaya est requise';
    if (!formData.communeId) errors.commune = 'La commune est requise';
    if (!formData.adresse.trim()) errors.adresse = 'L\'adresse est requise';

    return errors;
  };

  // Soumettre la commande
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Valider
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          color: selectedColor?.name,
          size: selectedSize?.value,
          quantity: quantity,
          image: selectedColor?.images?.[0]
        },
        customer: {
          firstName: formData.prenom,
          lastName: formData.nom,
          phone: formData.telephone,
          wilayaId: formData.wilayaId,
          wilaya: formData.wilayaName,
          communeId: formData.communeId,
          commune: formData.communeName,
          address: formData.adresse,
          notes: formData.remarque
        },
        shipping: {
          deliveryFee: fees?.deliveryFee || 0,
          totalFee: fees?.totalFee || 0,
          deliveryTime: fees?.deliveryTime || 7,
          codFee: fees?.codFee || 0,
          insuranceFee: fees?.insuranceFee || 0
        },
        yalidine: {
          toWilayaId: formData.wilayaId,
          toWilayaName: formData.wilayaName,
          toCommuneId: formData.communeId,
          toCommuneName: formData.communeName
        }
      };

      // Callback vers le parent
      if (onSubmitSuccess) {
        await onSubmitSuccess(orderData);
      }

      // Réinitialiser le formulaire
      setFormData({
        nom: '',
        prenom: '',
        telephone: '',
        wilayaId: null,
        wilayaName: '',
        communeId: null,
        communeName: '',
        adresse: '',
        remarque: '',
        totalPrice: (product?.price || 0) * quantity,
        weight: 1,
        length: 30,
        width: 20,
        height: 10
      });
      setFees(null);

    } catch (error) {
      console.error('❌ Erreur soumission:', error);
      toast.error('Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <div className="h-8 w-1 rounded-full bg-gradient-to-b from-blue-500 to-indigo-600 mr-3"></div>
          <Truck size={24} className="text-blue-500 mr-2" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Livraison Yalidine
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations personnelles */}
          <PersonalInfoForm
            formData={formData}
            onChange={handleFormChange}
            errors={formErrors}
          />

          {/* Sélection Yalidine */}
          <YalidineSelector
            formData={formData}
            onChange={handleFormChange}
            errors={formErrors}
            onFeesCalculated={handleFeesCalculated}
          />

          {/* Adresse */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">
              <MapPin size={14} className="inline mr-1" /> Adresse complète *
            </label>
            <textarea
              name="adresse"
              value={formData.adresse}
              onChange={(e) => handleFormChange({ adresse: e.target.value })}
              className={`w-full px-4 py-2.5 bg-white dark:bg-gray-800 border ${
                formErrors.adresse ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
              } rounded-lg focus:ring-2 focus:ring-blue-500 transition-all outline-none h-20 resize-none`}
              placeholder="Rue, numéro, bâtiment, étage..."
            />
            {formErrors.adresse && (
              <p className="mt-1 text-sm text-red-500 flex items-center">
                <AlertCircle size={12} className="mr-1" /> {formErrors.adresse}
              </p>
            )}
          </motion.div>

          {/* Remarque */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">
              <MessageSquare size={14} className="inline mr-1" /> Remarque (optionnel)
            </label>
            <textarea
              name="remarque"
              value={formData.remarque}
              onChange={(e) => handleFormChange({ remarque: e.target.value })}
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all outline-none h-16 resize-none"
              placeholder="Instructions spéciales pour la livraison..."
            />
          </motion.div>

          {/* Résumé des frais */}
          {fees && (
            <DeliveryFeesSummary 
              fees={fees} 
              commune={formData.communeName} 
            />
          )}

          {/* Bouton de soumission */}
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-4 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-lg shadow-blue-500/20 ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-xl'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Traitement en cours...</span>
              </>
            ) : (
              <>
                <ShoppingCart size={20} />
                <span>Commander maintenant</span>
              </>
            )}
          </motion.button>
        </form>

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center text-sm text-green-600 dark:text-green-400">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Paiement à la livraison • Retour gratuit sous 7 jours</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ShippingForm;
