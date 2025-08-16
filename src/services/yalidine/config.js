/**
 * Configuration pour l'API Yalidine
 */

const YALIDINE_CONFIG = {
  BASE_URL: 'https://api.yalidine.app/v1',
  API_ID: process.env.REACT_APP_YALIDINE_API_ID || 'VOTRE_API_ID',
  API_TOKEN: process.env.REACT_APP_YALIDINE_API_TOKEN || 'VOTRE_API_TOKEN',
  HEADERS: function() {
    return {
      'X-API-ID': this.API_ID,
      'X-API-TOKEN': this.API_TOKEN,
      'Content-Type': 'application/json'
    };
  }
};

export default YALIDINE_CONFIG;