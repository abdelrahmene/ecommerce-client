import React, { useState, useEffect } from 'react';
import locationService from '../../services/locationService';

const QuickOrderForm = ({ product, onOrderSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    note: ''
  });
  
  const [selectedLocation, setSelectedLocation] = useState({
    wilaya: null,
    commune: null
  });
  
  const [wilayas, setWilayas] = useState([]);
  const [communes, setCommunesList] = useState([]);
  const [loadingWilayas, setLoadingWilayas] = useState(true);
  const [loadingCommunes, setLoadingCommunes] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Charger les wilayas au montage du composant
  useEffect(() => {
    loadWilayas();
  }, []);

  // Charger les communes quand une wilaya est sélectionnée
  useEffect(() => {
    if (selectedLocation.wilaya) {
      loadCommunes(selectedLocation.wilaya.id);
    } else {
      setCommunesList([]);
      setSelectedLocation(prev => ({ ...prev, commune: null }));
    }
  }, [selectedLocation.wilaya]);

  const loadWilayas = async () => {
    try {
      setLoadingWilayas(true);
      const wilayasData = await locationService.getWilayas();
      setWilayas(wilayasData);
    } catch (error) {
      console.error('Erreur lors du chargement des wilayas:', error);
      setErrors({ general: 'Impossible de charger les wilayas. Veuillez réessayer.' });
    } finally {
      setLoadingWilayas(false);
    }
  };

  const loadCommunes = async (wilayaId) => {
    try {
      setLoadingCommunes(true);
      const communesData = await locationService.getCommunesByWilaya(wilayaId);
      setCommunesList(communesData);
    } catch (error) {
      console.error('Erreur lors du chargement des communes:', error);
      setErrors({ communes: 'Impossible de charger les communes.' });
    } finally {
      setLoadingCommunes(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Supprimer l'erreur du champ modifié
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleWilayaChange = (e) => {
    const wilayaId = parseInt(e.target.value);
    const wilaya = wilayas.find(w => w.id === wilayaId);
    setSelectedLocation(prev => ({ ...prev, wilaya, commune: null }));
    
    if (errors.wilaya) {
      setErrors(prev => ({ ...prev, wilaya: null }));
    }
  };

  const handleCommuneChange = (e) => {
    const communeId = parseInt(e.target.value);
    const commune = communes.find(c => c.id === communeId);
    setSelectedLocation(prev => ({ ...prev, commune }));
    
    if (errors.commune) {
      setErrors(prev => ({ ...prev, commune: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'Le prénom est requis';
    if (!formData.lastName.trim()) newErrors.lastName = 'Le nom est requis';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Le téléphone est requis';
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Format invalide (10 chiffres)';
    }
    if (!selectedLocation.wilaya) newErrors.wilaya = 'Sélectionnez une wilaya';
    if (!selectedLocation.commune) newErrors.commune = 'Sélectionnez une commune';
    if (!formData.address.trim()) newErrors.address = 'L\'adresse est requise';

    // Vérifier si la livraison est possible
    if (selectedLocation.commune && !selectedLocation.commune.is_deliverable) {
      newErrors.commune = 'Livraison non disponible dans cette commune';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getDeliveryPrice = () => {
    if (!selectedLocation.commune) return 0;
    
    // Calcul basé sur la zone ou delivery_time_parcel
    if (selectedLocation.commune.zone) {
      switch (selectedLocation.commune.zone) {
        case 1: return 400;
        case 2: return 500; 
        case 3: return 600;
        case 4: return 800;
        default: return 500;
      }
    }
    
    // Fallback basé sur delivery_time_parcel
    const deliveryTime = selectedLocation.commune.delivery_time_parcel || 10;
    if (deliveryTime <= 5) return 400;
    if (deliveryTime <= 10) return 500;
    if (deliveryTime <= 15) return 600;
    return 800;
  };

  const getTotalPrice = () => {
    return product.price + getDeliveryPrice();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const orderData = {
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1
        },
        deliveryInfo: {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          phone: formData.phone.trim(),
          wilaya: selectedLocation.wilaya.name,
          commune: selectedLocation.commune.name,
          address: formData.address.trim(),
          note: formData.note.trim()
        },
        totalAmount: getTotalPrice(),
        deliveryPrice: getDeliveryPrice(),
        paymentMethod: 'cash-on-delivery',
        paymentStatus: 'pending',
        status: 'pending',
        orderDate: new Date().toISOString(),
        yalidineData: {
          to_wilaya_name: selectedLocation.wilaya.name,
          to_commune_name: selectedLocation.commune.name,
          to_wilaya_id: selectedLocation.wilaya.id,
          to_commune_id: selectedLocation.commune.id
        }
      };

      await onOrderSubmit(orderData);
      onClose();
      
    } catch (error) {
      console.error('Erreur lors de la commande:', error);
      setErrors({ submit: 'Une erreur s\'est produite. Veuillez réessayer.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingWilayas) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Chargement des données de livraison...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              🚀 Commande Express
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
            >
              ×
            </button>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Passez votre commande rapidement avec paiement à la livraison
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Résumé du produit */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">📦 Votre produit</h3>
            <div className="flex items-center space-x-4">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white">{product.name}</h4>
                <p className="text-lg font-bold text-blue-600">{product.price.toLocaleString()} DA</p>
              </div>
            </div>
            
            {selectedLocation.commune && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Produit:</span>
                  <span>{product.price.toLocaleString()} DA</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Livraison ({selectedLocation.commune.name}):</span>
                  <span>{getDeliveryPrice().toLocaleString()} DA</span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span className="text-green-600">{getTotalPrice().toLocaleString()} DA</span>
                </div>
              </div>
            )}
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Informations personnelles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  👤 Prénom *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Votre prénom"
                  disabled={isSubmitting}
                />
                {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  👤 Nom *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Votre nom"
                  disabled={isSubmitting}
                />
                {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
              </div>
            </div>

            {/* Téléphone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                📱 Téléphone *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0555 12 34 56"
                disabled={isSubmitting}
              />
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
            </div>

            {/* Sélection wilaya */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                📍 Wilaya *
              </label>
              <select
                value={selectedLocation.wilaya?.id || ''}
                onChange={handleWilayaChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.wilaya ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isSubmitting}
              >
                <option value="">Sélectionnez votre wilaya</option>
                {wilayas.map((wilaya) => (
                  <option key={wilaya.id} value={wilaya.id}>
                    {wilaya.name} {wilaya.is_deliverable ? '📦' : '❌'}
                  </option>
                ))}
              </select>
              {errors.wilaya && <p className="mt-1 text-sm text-red-600">{errors.wilaya}</p>}
            </div>

            {/* Sélection commune */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                🏘️ Commune *
              </label>
              <select
                value={selectedLocation.commune?.id || ''}
                onChange={handleCommuneChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.commune ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isSubmitting || !selectedLocation.wilaya || loadingCommunes}
              >
                <option value="">
                  {!selectedLocation.wilaya 
                    ? 'Sélectionnez d\'abord une wilaya' 
                    : loadingCommunes 
                      ? 'Chargement des communes...' 
                      : 'Sélectionnez votre commune'
                  }
                </option>
                {communes.map((commune) => (
                  <option key={commune.id} value={commune.id}>
                    {commune.name} {commune.is_deliverable ? '📦' : '❌'}
                  </option>
                ))}
              </select>
              {errors.commune && <p className="mt-1 text-sm text-red-600">{errors.commune}</p>}
              
              {loadingCommunes && (
                <div className="mt-2 flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  <span>Chargement des communes...</span>
                </div>
              )}
            </div>

            {/* Adresse */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                🏠 Adresse complète *
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows="3"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Adresse détaillée (rue, quartier, points de repère...)"
                disabled={isSubmitting}
              />
              {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
            </div>

            {/* Note optionnelle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                📝 Note (optionnel)
              </label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleInputChange}
                rows="2"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Instructions spéciales, commentaires..."
                disabled={isSubmitting}
              />
            </div>

            {/* Informations de livraison */}
            {selectedLocation.commune && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                  📋 Informations de livraison
                </h4>
                <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                  <p><strong>Zone:</strong> {selectedLocation.commune.zone || 'Standard'}</p>
                  <p><strong>Statut:</strong> {selectedLocation.commune.is_deliverable ? '✅ Livraison disponible' : '❌ Livraison non disponible'}</p>
                  <p><strong>Délai:</strong> {selectedLocation.commune.delivery_time_parcel || 10} jours ouvrables</p>
                  {!selectedLocation.commune.is_deliverable && (
                    <p className="text-red-600 dark:text-red-400 font-medium">
                      ⚠️ Cette zone n'est pas couverte par notre service de livraison.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Erreur de soumission */}
            {errors.submit && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
                <p className="text-red-600 dark:text-red-400 text-sm">{errors.submit}</p>
              </div>
            )}

            {/* Erreur générale */}
            {errors.general && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
                <p className="text-red-600 dark:text-red-400 text-sm">{errors.general}</p>
              </div>
            )}

            {/* Boutons */}
            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                disabled={isSubmitting}
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting || (selectedLocation.commune && !selectedLocation.commune.is_deliverable)}
                className={`flex-1 px-4 py-3 rounded-lg font-medium text-white transition-all duration-200 ${
                  isSubmitting || (selectedLocation.commune && !selectedLocation.commune.is_deliverable)
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 hover:scale-105 shadow-lg hover:shadow-xl'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Traitement...</span>
                  </div>
                ) : selectedLocation.commune && !selectedLocation.commune.is_deliverable ? (
                  '❌ Livraison non disponible'
                ) : (
                  `🚀 Commander - ${selectedLocation.commune ? getTotalPrice().toLocaleString() : product.price.toLocaleString()} DA`
                )}
              </button>
            </div>
          </form>

          {/* Informations légales */}
          <div className="mt-6 text-xs text-gray-500 dark:text-gray-400 text-center space-y-1">
            <p>💳 Paiement à la livraison disponible</p>
            <p>📦 Livraison sous 24-48h dans les zones couvertes</p>
            <p>🔒 Vos données sont sécurisées</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickOrderForm;