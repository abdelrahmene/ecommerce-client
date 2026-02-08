import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, MessageSquare, ShoppingCart, AlertCircle, Truck, User, Phone, Package, Gift, Loader } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useMetaPixel } from '../../contexts/MetaPixelContext';
import { checkoutConfigService } from '../../services/checkoutConfig';
import { useYalidine } from '../../hooks/useYalidine';
import { useLoyalty } from '../../hooks/useLoyalty';
import DeliveryFeesSummary from './DeliveryFeesSummary';
import { FaStamp } from 'react-icons/fa';

const ShippingForm = ({
  product,
  quantity,
  selectedSize,
  selectedColor,
  onSubmitSuccess
}) => {
  const { trackInitiateCheckout } = useMetaPixel();
  const [config, setConfig] = useState(null);
  const [loadingConfig, setLoadingConfig] = useState(true);

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

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hooks
  const {
    wilayas, communes, loadingWilayas, loadingCommunes, calculatingFees, fees, setFees
  } = useYalidine(formData, setFormData);

  const { loyaltyInfo, checkingLoyalty, checkLoyaltyStatus } = useLoyalty();

  // Load config
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const data = await checkoutConfigService.get();
        // Sort fields by order
        data.fields.sort((a, b) => a.order - b.order);
        setConfig(data);
      } catch (error) {
        console.error('Failed to load checkout config', error);
      } finally {
        setLoadingConfig(false);
      }
    };
    loadConfig();
  }, []);

  const handleFormChange = (updates) => {
    setFormData(prev => ({ ...prev, ...updates }));

    // Check loyalty if phone changes
    if (updates.telephone) {
      checkLoyaltyStatus(updates.telephone);
    }

    // Clear errors
    const updatedErrors = { ...formErrors };
    Object.keys(updates).forEach(key => delete updatedErrors[key]);
    setFormErrors(updatedErrors);
  };

  const handleWilayaChange = (e) => {
    const wilayaId = parseInt(e.target.value);
    const selectedWilaya = wilayas.find(w => w.id === wilayaId);
    handleFormChange({
      wilayaId: wilayaId || null,
      wilayaName: selectedWilaya?.name || '',
      communeId: null,
      communeName: ''
    });
  };

  const handleCommuneChange = (e) => {
    const communeId = parseInt(e.target.value);
    const selectedCommune = communes.find(c => c.id === communeId);
    handleFormChange({
      communeId: communeId || null,
      communeName: selectedCommune?.name || ''
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!config) return errors;

    config.fields.forEach(field => {
      if (field.enabled && field.required) {
        const value = field.id === 'wilaya' ? formData.wilayaId :
          field.id === 'commune' ? formData.communeId :
            formData[field.id];

        if (!value || (typeof value === 'string' && !value.trim())) {
          errors[field.id] = `${field.label} est requis`;
        }
      }
    });

    if (formData.telephone && !/^(0)(5|6|7)[0-9]{8}$|^(0)(2|3)[0-9]{7}$/.test(formData.telephone)) {
      errors.telephone = 'Numéro invalide (ex: 0550123456)';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
          image: selectedColor?.images?.[0],
          selectedVariant: selectedSize
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

      trackInitiateCheckout([orderData.product], orderData.product.price * orderData.product.quantity);

      if (onSubmitSuccess) {
        await onSubmitSuccess(orderData);
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingConfig) {
    return <div className="flex justify-center p-8"><Loader className="animate-spin text-blue-500" /></div>;
  }

  const renderField = (field) => {
    if (!field.enabled) return null;

    const commonClasses = `w-full px-4 py-2.5 bg-white dark:bg-gray-800 border ${formErrors[field.id] ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
      } rounded-lg focus:ring-2 focus:ring-blue-500 transition-all outline-none`;

    switch (field.id) {
      case 'wilaya':
        return (
          <div className="relative">
            <select
              value={formData.wilayaId || ''}
              onChange={handleWilayaChange}
              disabled={loadingWilayas}
              className={`${commonClasses} appearance-none`}
            >
              <option value="">{loadingWilayas ? 'Chargement...' : field.placeholder}</option>
              {wilayas.map(w => (
                <option key={w.id} value={w.id}>{w.id} - {w.name}</option>
              ))}
            </select>
            {loadingWilayas && <Loader size={18} className="absolute right-3 top-3 animate-spin text-blue-500" />}
          </div>
        );

      case 'commune':
        return (
          <div className="relative">
            <select
              value={formData.communeId || ''}
              onChange={handleCommuneChange}
              disabled={!formData.wilayaId || loadingCommunes}
              className={`${commonClasses} appearance-none`}
            >
              <option value="">
                {!formData.wilayaId ? 'Sélectionnez d\'abord une wilaya' :
                  loadingCommunes ? 'Chargement...' : field.placeholder}
              </option>
              {communes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {(loadingCommunes || calculatingFees) && <Loader size={18} className="absolute right-3 top-3 animate-spin text-blue-500" />}
          </div>
        );

      case 'telephone':
        return (
          <div className="relative">
            <input
              type="tel"
              value={formData.telephone}
              onChange={(e) => handleFormChange({ telephone: e.target.value })}
              placeholder={field.placeholder}
              className={commonClasses}
            />
            {checkingLoyalty && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
              </div>
            )}
            {loyaltyInfo && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 rounded-lg flex items-center gap-3"
              >
                <Gift className="text-blue-600" size={20} />
                <div>
                  <p className="text-sm font-bold text-blue-900 dark:text-blue-300">
                    {loyaltyInfo.firstName} {loyaltyInfo.lastName}
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-400 flex items-center gap-1">
                    <FaStamp className="text-yellow-500" />
                    {loyaltyInfo.stampCount} / 6 commandes
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        );

      case 'remarque':
      case 'adresse':
        return (
          <textarea
            value={formData[field.id]}
            onChange={(e) => handleFormChange({ [field.id]: e.target.value })}
            placeholder={field.placeholder}
            className={`${commonClasses} ${field.id === 'adresse' ? 'h-20' : 'h-16'} resize-none`}
          />
        );

      default:
        // Generic fields (nom, prenom, or custom text fields)
        if (field.type === 'select' && field.options) {
          return (
            <select
              value={formData[field.id] || ''}
              onChange={(e) => handleFormChange({ [field.id]: e.target.value })}
              className={commonClasses}
            >
              <option value="">{field.placeholder}</option>
              {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          );
        }
        return (
          <input
            type={field.type}
            value={formData[field.id] || ''}
            onChange={(e) => handleFormChange({ [field.id]: e.target.value })}
            placeholder={field.placeholder}
            className={commonClasses}
          />
        );
    }
  };

  const getIcon = (id) => {
    switch (id) {
      case 'nom': return User;
      case 'prenom': return User;
      case 'telephone': return Phone;
      case 'wilaya': return MapPin;
      case 'commune': return Package;
      case 'adresse': return MapPin;
      case 'remarque': return MessageSquare;
      default: return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700"
    >
      <div className="p-6">
        <div className="flex items-center mb-6">
          <div className="h-8 w-1 rounded-full bg-gradient-to-b from-blue-500 to-indigo-600 mr-3"></div>
          <Truck size={24} className="text-blue-500 mr-2" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {config?.title || 'Livraison'}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {config?.fields.map((field) => {
              if (!field.enabled) return null;
              const Icon = getIcon(field.id);
              const isFullWidth = field.width === 'full';

              return (
                <div
                  key={field.id}
                  className={`${isFullWidth ? 'md:col-span-2' : 'md:col-span-1'}`}
                >
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">
                    {Icon && <Icon size={14} className="inline mr-1" />}
                    {field.label} {field.required && '*'}
                  </label>
                  {renderField(field)}
                  {formErrors[field.id] && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle size={12} className="mr-1" /> {formErrors[field.id]}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {fees && (
            <DeliveryFeesSummary
              fees={fees}
              commune={formData.communeName}
              product={product}
              quantity={quantity}
            />
          )}

          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-4 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-lg shadow-blue-500/20 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-xl'
              }`}
          >
            {isSubmitting ? (
              <>
                <Loader className="animate-spin" size={20} />
                <span>Traitement...</span>
              </>
            ) : (
              <>
                <ShoppingCart size={20} />
                <span>{config?.submitButtonText || 'Commander maintenant'}</span>
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center text-sm text-green-600 dark:text-green-400">
            <Truck className="w-5 h-5 mr-2" />
            <span>Paiement à la livraison • Retour gratuit sous 7 jours</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ShippingForm;
