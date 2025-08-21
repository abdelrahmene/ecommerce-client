import React, { useState } from 'react';
import LocationSelector from './LocationSelector';

const CheckoutForm = ({ product, onSubmit }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    wilaya: null,
    commune: null,
    address: '',
    note: '',
    paymentMethod: 'cash-on-delivery'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleLocationChange = (locationData) => {
    setFormData(prev => ({
      ...prev,
      wilaya: locationData.wilaya,
      commune: locationData.commune
    }));
    
    // Effacer les erreurs de localisation
    setErrors(prev => ({
      ...prev,
      wilaya: null,
      commune: null
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Le prénom est requis';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Le nom est requis';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Le numéro de téléphone est requis';
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Numéro de téléphone invalide (10 chiffres)';
    }

    if (!formData.wilaya) {
      newErrors.wilaya = 'Veuillez sélectionner une wilaya';
    }

    if (!formData.commune) {
      newErrors.commune = 'Veuillez sélectionner une commune';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'L\'adresse est requise';
    }

    // Vérifier si la livraison est possible
    if (formData.commune && !formData.commune.is_deliverable) {
      newErrors.commune = 'La livraison n\'est pas disponible dans cette commune';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

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
          wilaya: formData.wilaya.name, // Format compatible avec Firebase existant
          commune: formData.commune.name,
          address: formData.address.trim(),
          note: formData.note.trim()
        },
        totalAmount: product.price,
        paymentMethod: formData.paymentMethod,
        paymentStatus: 'pending',
        status: 'pending',
        orderDate: new Date().toISOString(),
        yalidineData: {
          // Données dans le format Yalidine pour faciliter l'envoi
          to_wilaya_name: formData.wilaya.name,
          to_commune_name: formData.commune.name,
          to_wilaya_id: formData.wilaya.id,
          to_commune_id: formData.commune.id
        }
      };

      await onSubmit(orderData);
      
      // Réinitialiser le formulaire en cas de succès
      setFormData({
        firstName: '',
        lastName: '',
        phone: '',
        wilaya: null,
        commune: null,
        address: '',
        note: '',
        paymentMethod: 'cash-on-delivery'
      });

    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      setErrors({ submit: 'Une erreur s\'est produite. Veuillez réessayer.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDeliveryPrice = () => {
    if (!formData.commune) return 0;
    
    // Calcul du prix de livraison basé sur la zone
    const zone = formData.commune.zone;
    switch (zone) {
      case 1: return 400; // Zone centre
      case 2: return 500; // Zone proche
      case 3: return 600; // Zone éloignée
      case 4: return 800; // Zone très éloignée
      default: return 500;
    }
  };

  const getTotalPrice = () => {
    return product.price + getDeliveryPrice();
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          🛍️ Finaliser votre commande
        </h2>
        <p className="text-gray-600">
          Remplissez vos informations de livraison
        </p>
      </div>

      {/* Récapitulatif du produit */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">📦 Votre commande</h3>
        <div className="flex items-center space-x-4">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-16 h-16 object-cover rounded-lg"
          />
          <div className="flex-1">
            <h4 className="font-medium text-gray-900">{product.name}</h4>
            <p className="text-gray-600">{product.price.toLocaleString()} DA</p>
          </div>
        </div>
        
        {formData.commune && (
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Produit:</span>
              <span>{product.price.toLocaleString()} DA</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Livraison (Zone {formData.commune.zone}):</span>
              <span>{getDeliveryPrice().toLocaleString()} DA</span>
            </div>
            <div className="flex justify-between font-semibold text-lg border-t pt-2">
              <span>Total:</span>
              <span>{getTotalPrice().toLocaleString()} DA</span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations personnelles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              👤 Prénom <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.firstName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Votre prénom"
              disabled={isSubmitting}
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              👤 Nom <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.lastName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Votre nom"
              disabled={isSubmitting}
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
            )}
          </div>
        </div>

        {/* Téléphone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            📱 Téléphone <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0555 12 34 56"
            disabled={isSubmitting}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>

        {/* Sélecteur de localisation */}
        <LocationSelector
          onLocationChange={handleLocationChange}
          disabled={isSubmitting}
          required={true}
          showDeliveryStatus={true}
        />
        
        {errors.wilaya && (
          <p className="text-sm text-red-600">{errors.wilaya}</p>
        )}
        {errors.commune && (
          <p className="text-sm text-red-600">{errors.commune}</p>
        )}

        {/* Adresse */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🏠 Adresse complète <span className="text-red-500">*</span>
          </label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            rows="3"
            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.address ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Adresse détaillée (rue, quartier, points de repère...)"
            disabled={isSubmitting}
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">{errors.address}</p>
          )}
        </div>

        {/* Note optionnelle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            📝 Note (optionnel)
          </label>
          <textarea
            id="note"
            name="note"
            value={formData.note}
            onChange={handleInputChange}
            rows="2"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Instructions spéciales, commentaires..."
            disabled={isSubmitting}
          />
        </div>

        {/* Méthode de paiement */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            💳 Méthode de paiement
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                id="paymentMethod"
                name="paymentMethod"
                value="cash-on-delivery"
                checked={formData.paymentMethod === 'cash-on-delivery'}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                disabled={isSubmitting}
              />
              <span className="ml-2 text-sm text-gray-700">
                💰 Paiement à la livraison (Cash on Delivery)
              </span>
            </label>
          </div>
        </div>

        {/* Erreur de soumission */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm">{errors.submit}</p>
          </div>
        )}

        {/* Bouton de soumission */}
        <button
          type="submit"
          disabled={isSubmitting || (formData.commune && !formData.commune.is_deliverable)}
          className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
            isSubmitting || (formData.commune && !formData.commune.is_deliverable)
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 hover:scale-105 shadow-lg hover:shadow-xl'
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Traitement en cours...</span>
            </div>
          ) : formData.commune && !formData.commune.is_deliverable ? (
            '❌ Livraison non disponible dans cette zone'
          ) : (
            `🚀 Commander maintenant - ${formData.commune ? getTotalPrice().toLocaleString() : product.price.toLocaleString()} DA`
          )}
        </button>
      </form>

      {/* Informations légales */}
      <div className="mt-6 text-xs text-gray-500 text-center">
        <p>En passant commande, vous acceptez nos conditions de vente.</p>
        <p>Livraison sous 24-48h dans les zones couvertes.</p>
      </div>
    </div>
  );
};

export default CheckoutForm;