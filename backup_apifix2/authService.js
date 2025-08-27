// Service d'authentification utilisant UNIQUEMENT l'API
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

console.log('🔧 Service d\'authentification API initialisé');

const authService = {
  async login(email, password) {
    console.log('📡 API Auth - Tentative de connexion:', email);
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur de connexion');
      }

      const data = await response.json();
      console.log('✅ API Auth - Connexion réussie:', data);
      return data.user;
    } catch (error) {
      console.error('❌ API Auth - Erreur de connexion:', error);
      throw error;
    }
  },

  async register(userData) {
    console.log('📡 API Auth - Tentative d\'inscription:', userData.email);
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur d\'inscription');
      }

      const data = await response.json();
      console.log('✅ API Auth - Inscription réussie:', data);
      return data.user;
    } catch (error) {
      console.error('❌ API Auth - Erreur d\'inscription:', error);
      throw error;
    }
  },

  async logout() {
    console.log('📡 API Auth - Déconnexion');
    // Logique de déconnexion si nécessaire côté serveur
    return true;
  }
};

export { authService as AuthService };
export default authService;
