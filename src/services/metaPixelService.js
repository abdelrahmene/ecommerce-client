/**
 * Meta Pixel Service
 * Gère tous les appels d'événements Meta Pixel
 * Tracking: PageView, ViewContent, InitiateCheckout, Purchase
 */

class MetaPixelService {
  constructor() {
    this.pixelId = null;
    this.isInitialized = false;
    this.isEnabled = true;
  }

  /**
   * Initialiser Meta Pixel avec l'ID fourni
   * @param {string} pixelId - Meta Pixel ID
   * @param {boolean} enabled - Activer/désactiver le tracking
   */
  initialize(pixelId, enabled = true) {
    if (!pixelId) {
      console.warn('⚠️ [META PIXEL] Pixel ID non fourni - Meta Pixel désactivé');
      this.isEnabled = false;
      return;
    }

    this.pixelId = pixelId;
    this.isEnabled = enabled;

    // Charger le script Meta Pixel
    this._loadPixelScript();

    console.log('✅ [META PIXEL] Initialisé avec ID:', pixelId);
  }

  /**
   * Charger le script Meta Pixel dynamiquement
   */
  _loadPixelScript() {
    if (window.fbq) {
      console.log('📍 [META PIXEL] Déjà chargé');
      return;
    }

    // Créer et injecter le script Meta Pixel
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://connect.facebook.net/en_US/fbevents.js`;
    document.head.appendChild(script);

    // Initialiser fbq après chargement
    script.onload = () => {
      if (window.fbq) {
        window.fbq('init', this.pixelId);
        window.fbq('track', 'PageView');
        console.log('📍 [META PIXEL] Script chargé et PageView tracké');
      }
    };

    // Créer la fonction fbq si elle n'existe pas
    if (!window.fbq) {
      window.fbq = function () {
        window.fbq.callMethod
          ? window.fbq.callMethod.apply(window.fbq, arguments)
          : window.fbq.queue.push(arguments);
      };
      window.fbq.push = window.fbq;
      window.fbq.loaded = true;
      window.fbq.version = '2.0';
      window.fbq.queue = [];
    }
  }

  /**
   * Tracker une page vue (automatique mais peut être appelé manuellement)
   */
  trackPageView() {
    if (!this.isEnabled || !window.fbq) return;
    window.fbq('track', 'PageView');
    console.log('📍 [META PIXEL] PageView tracké');
  }

  /**
   * Tracker la vue d'un produit
   * @param {Object} product - Données du produit
   */
  trackViewContent(product) {
    if (!this.isEnabled || !window.fbq) return;

    if (!product || !product.id) {
      console.warn('⚠️ [META PIXEL] Product ID manquant pour ViewContent');
      return;
    }

    const eventData = {
      content_name: product.name || 'Produit',
      content_ids: [product.id],
      content_type: 'product',
      value: product.price || 0,
      currency: 'DZD', // Algérie
      sku: product.sku || product.id
    };

    window.fbq('track', 'ViewContent', eventData);
    console.log('🔍 [META PIXEL] ViewContent tracké:', {
      product: product.name,
      price: product.price,
      id: product.id
    });
  }

  /**
   * Tracker l'initialisation du checkout (début du formulaire de commande)
   * @param {Array} items - Articles du panier
   * @param {number} value - Valeur totale
   */
  trackInitiateCheckout(items, value) {
    if (!this.isEnabled || !window.fbq) return;

    if (!items || items.length === 0) {
      console.warn('⚠️ [META PIXEL] Aucun article pour InitiateCheckout');
      return;
    }

    const eventData = {
      content_name: `Commande de ${items.length} article(s)`,
      content_ids: items.map(item => item.id || item.productId),
      content_type: 'product_group',
      value: value || 0,
      currency: 'DZD',
      num_items: items.length
    };

    window.fbq('track', 'InitiateCheckout', eventData);
    console.log('🛒 [META PIXEL] InitiateCheckout tracké:', {
      items: items.length,
      value: value
    });
  }

  /**
   * Tracker un achat (commande complète)
   * @param {Object} orderData - Données de commande
   */
  trackPurchase(orderData) {
    if (!this.isEnabled || !window.fbq) return;

    if (!orderData || !orderData.items || orderData.items.length === 0) {
      console.warn('⚠️ [META PIXEL] Données de commande incomplètes');
      return;
    }

    const eventData = {
      content_name: `Commande #${orderData.orderId || 'N/A'}`,
      content_ids: orderData.items.map(item => item.id || item.productId),
      content_type: 'product_group',
      value: orderData.total || orderData.subtotal || 0,
      currency: 'DZD',
      num_items: orderData.items.length
    };

    window.fbq('track', 'Purchase', eventData);
    console.log('✅ [META PIXEL] Purchase tracké:', {
      orderId: orderData.orderId,
      items: orderData.items.length,
      total: orderData.total
    });
  }

  /**
   * Tracker un événement personnalisé
   * @param {string} eventName - Nom de l'événement
   * @param {Object} data - Données supplémentaires
   */
  trackCustomEvent(eventName, data = {}) {
    if (!this.isEnabled || !window.fbq) return;

    window.fbq('trackCustom', eventName, data);
    console.log(`📊 [META PIXEL] Événement "${eventName}" tracké:`, data);
  }

  /**
   * Désactiver/Activer le tracking
   * @param {boolean} enabled
   */
  setEnabled(enabled) {
    this.isEnabled = enabled;
    console.log(`🔧 [META PIXEL] Tracking ${enabled ? 'ACTIVÉ' : 'DÉSACTIVÉ'}`);
  }

  /**
   * Obtenir le statut du Pixel
   */
  getStatus() {
    return {
      pixelId: this.pixelId,
      isInitialized: this.isInitialized,
      isEnabled: this.isEnabled,
      isLoaded: !!window.fbq
    };
  }
}

// Exporter une instance unique
export default new MetaPixelService();
