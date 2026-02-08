import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://api.birkshoes.store/api';

export const defaultCheckoutConfig = {
    title: 'Livraison Yalidine',
    submitButtonText: 'Commander maintenant',
    fields: [
        { id: 'nom', label: 'Nom', placeholder: 'Votre nom', type: 'text', required: true, enabled: true, order: 1, width: 'half' },
        { id: 'prenom', label: 'Prénom', placeholder: 'Votre prénom', type: 'text', required: true, enabled: true, order: 2, width: 'half' },
        { id: 'telephone', label: 'Téléphone', placeholder: '0550123456', type: 'tel', required: true, enabled: true, order: 3, width: 'full' },
        { id: 'wilaya', label: 'Wilaya', placeholder: 'Sélectionner la wilaya', type: 'select', required: true, enabled: true, order: 4, width: 'half' },
        { id: 'commune', label: 'Commune', placeholder: 'Sélectionner la commune', type: 'select', required: true, enabled: true, order: 5, width: 'half' },
        { id: 'adresse', label: 'Adresse complète', placeholder: 'Rue, numéro, bâtiment, étage...', type: 'textarea', required: false, enabled: true, order: 6, width: 'full' },
        { id: 'remarque', label: 'Remarque (optionnel)', placeholder: 'Instructions spéciales...', type: 'textarea', required: false, enabled: true, order: 7, width: 'full' },
    ]
};

export const checkoutConfigService = {
    get: async () => {
        try {
            // Add timestamp to prevent caching
            const response = await axios.get(`${API_URL}/settings/checkout-form?t=${Date.now()}`);
            return response.data || defaultCheckoutConfig;
        } catch (error) {
            console.error('Failed to fetch checkout config', error);
            return defaultCheckoutConfig;
        }
    }
};
