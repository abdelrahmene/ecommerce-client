// Service pour récupérer les wilayas et communes depuis Firebase (côté client)
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';

// Configuration Firebase (même que l'admin)
const firebaseConfig = {
  apiKey: "AIzaSyCSpl6NXWo1p00Za0aK0bAfnnzDVHEA7EI",
  authDomain: "ecommerce-website-ff1dd.firebaseapp.com",
  projectId: "ecommerce-website-ff1dd",
  storageBucket: "ecommerce-website-ff1dd.firebasestorage.app",
  messagingSenderId: "449173690511",
  appId: "1:449173690511:web:8966757adec59140aeb8fa",
  measurementId: "G-72E2XBVF79"
};

// Initialisation Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

class LocationService {
  constructor() {
    this.cache = {
      wilayas: null,
      communes: null,
      organization: null,
      lastFetch: null
    };
    this.cacheTimeout = 24 * 60 * 60 * 1000; // 24 heures
  }

  // Vérifier si le cache est valide
  isCacheValid() {
    return this.cache.lastFetch && 
           (Date.now() - this.cache.lastFetch) < this.cacheTimeout;
  }

  // Récupérer toutes les wilayas
  async getWilayas(forceRefresh = false) {
    try {
      // Utiliser le cache si disponible et valide
      if (!forceRefresh && this.cache.wilayas && this.isCacheValid()) {
        return this.cache.wilayas;
      }

      console.log('🔄 Récupération des wilayas depuis Firebase...');
      const wilayasCollection = collection(db, 'yalidine_wilayas');
      const wilayasSnapshot = await getDocs(wilayasCollection);
      
      const wilayas = [];
      wilayasSnapshot.forEach((doc) => {
        wilayas.push({
          id: doc.id,
          ...doc.data()
        });
      });

      // Trier par nom
      wilayas.sort((a, b) => a.name.localeCompare(b.name));

      // Mettre en cache
      this.cache.wilayas = wilayas;
      this.cache.lastFetch = Date.now();

      console.log(`✅ ${wilayas.length} wilayas récupérées`);
      return wilayas;

    } catch (error) {
      console.error('❌ Erreur lors de la récupération des wilayas:', error);
      
      // Retourner le cache en cas d'erreur si disponible
      if (this.cache.wilayas) {
        console.log('📋 Utilisation du cache des wilayas');
        return this.cache.wilayas;
      }
      
      throw error;
    }
  }

  // Récupérer toutes les communes
  async getCommunes(forceRefresh = false) {
    try {
      // Utiliser le cache si disponible et valide
      if (!forceRefresh && this.cache.communes && this.isCacheValid()) {
        return this.cache.communes;
      }

      console.log('🔄 Récupération des communes depuis Firebase...');
      const communesCollection = collection(db, 'yalidine_communes');
      const communesSnapshot = await getDocs(communesCollection);
      
      const communes = [];
      communesSnapshot.forEach((doc) => {
        communes.push({
          id: doc.id,
          ...doc.data()
        });
      });

      // Trier par nom
      communes.sort((a, b) => a.name.localeCompare(b.name));

      // Mettre en cache
      this.cache.communes = communes;
      this.cache.lastFetch = Date.now();

      console.log(`✅ ${communes.length} communes récupérées`);
      return communes;

    } catch (error) {
      console.error('❌ Erreur lors de la récupération des communes:', error);
      
      // Retourner le cache en cas d'erreur si disponible
      if (this.cache.communes) {
        console.log('📋 Utilisation du cache des communes');
        return this.cache.communes;
      }
      
      throw error;
    }
  }

  // Récupérer les communes d'une wilaya spécifique
  async getCommunesByWilaya(wilayaId, forceRefresh = false) {
    try {
      const communes = await this.getCommunes(forceRefresh);
      return communes.filter(commune => commune.wilaya_id === parseInt(wilayaId));
    } catch (error) {
      console.error(`❌ Erreur lors de la récupération des communes pour la wilaya ${wilayaId}:`, error);
      throw error;
    }
  }

  // Récupérer l'organisation (communes groupées par wilaya)
  async getOrganization(forceRefresh = false) {
    try {
      // Utiliser le cache si disponible et valide
      if (!forceRefresh && this.cache.organization && this.isCacheValid()) {
        return this.cache.organization;
      }

      console.log('🔄 Récupération de l\'organisation depuis Firebase...');
      const organizationCollection = collection(db, 'yalidine_organization');
      const organizationSnapshot = await getDocs(organizationCollection);
      
      const organization = {};
      organizationSnapshot.forEach((doc) => {
        const data = doc.data();
        organization[data.wilaya_name] = data;
      });

      // Mettre en cache
      this.cache.organization = organization;
      this.cache.lastFetch = Date.now();

      console.log(`✅ Organisation récupérée: ${Object.keys(organization).length} wilayas`);
      return organization;

    } catch (error) {
      console.error('❌ Erreur lors de la récupération de l\'organisation:', error);
      
      // Retourner le cache en cas d'erreur si disponible
      if (this.cache.organization) {
        console.log('📋 Utilisation du cache de l\'organisation');
        return this.cache.organization;
      }
      
      throw error;
    }
  }

  // Rechercher une wilaya par nom
  async findWilayaByName(name, forceRefresh = false) {
    try {
      const wilayas = await this.getWilayas(forceRefresh);
      return wilayas.find(wilaya => 
        wilaya.name.toLowerCase() === name.toLowerCase()
      );
    } catch (error) {
      console.error(`❌ Erreur lors de la recherche de la wilaya "${name}":`, error);
      throw error;
    }
  }

  // Rechercher une commune par nom et wilaya
  async findCommuneByName(communeName, wilayaId, forceRefresh = false) {
    try {
      const communes = await this.getCommunesByWilaya(wilayaId, forceRefresh);
      return communes.find(commune => 
        commune.name.toLowerCase() === communeName.toLowerCase()
      );
    } catch (error) {
      console.error(`❌ Erreur lors de la recherche de la commune "${communeName}":`, error);
      throw error;
    }
  }

  // Vérifier si les données sont disponibles
  async checkDataAvailability() {
    try {
      // Vérifier les métadonnées
      const wilayasMetaDoc = await getDoc(doc(db, 'yalidine_metadata', 'wilayas'));
      const communesMetaDoc = await getDoc(doc(db, 'yalidine_metadata', 'communes'));
      
      return {
        wilayas: wilayasMetaDoc.exists(),
        communes: communesMetaDoc.exists(),
        wilayasCount: wilayasMetaDoc.exists() ? wilayasMetaDoc.data().total_count : 0,
        communesCount: communesMetaDoc.exists() ? communesMetaDoc.data().total_count : 0,
        lastUpdated: {
          wilayas: wilayasMetaDoc.exists() ? wilayasMetaDoc.data().last_updated : null,
          communes: communesMetaDoc.exists() ? communesMetaDoc.data().last_updated : null
        }
      };
    } catch (error) {
      console.error('❌ Erreur lors de la vérification des données:', error);
      return {
        wilayas: false,
        communes: false,
        wilayasCount: 0,
        communesCount: 0,
        lastUpdated: { wilayas: null, communes: null }
      };
    }
  }

  // Méthode utilitaire pour formater les données pour les sélecteurs
  async getFormattedDataForSelectors(forceRefresh = false) {
    try {
      const [wilayas, organization] = await Promise.all([
        this.getWilayas(forceRefresh),
        this.getOrganization(forceRefresh)
      ]);

      return {
        wilayas: wilayas.map(wilaya => ({
          value: wilaya.id,
          label: wilaya.name,
          zone: wilaya.zone,
          is_deliverable: wilaya.is_deliverable
        })),
        communesByWilaya: Object.fromEntries(
          Object.entries(organization).map(([wilayaName, data]) => [
            data.wilaya_id,
            data.communes.map(commune => ({
              value: commune.id,
              label: commune.name,
              zone: commune.zone,
              is_deliverable: commune.is_deliverable
            }))
          ])
        )
      };
    } catch (error) {
      console.error('❌ Erreur lors du formatage des données:', error);
      throw error;
    }
  }

  // Vider le cache
  clearCache() {
    this.cache = {
      wilayas: null,
      communes: null,
      organization: null,
      lastFetch: null
    };
    console.log('🗑️ Cache vidé');
  }

  // Récupérer les statistiques du cache
  getCacheStats() {
    return {
      hasWilayas: !!this.cache.wilayas,
      hasCommunites: !!this.cache.communes,
      hasOrganization: !!this.cache.organization,
      lastFetch: this.cache.lastFetch,
      isValid: this.isCacheValid(),
      wilayasCount: this.cache.wilayas?.length || 0,
      communesCount: this.cache.communes?.length || 0
    };
  }
}

// Instance singleton
const locationService = new LocationService();

export default locationService;

// Exports nommés pour plus de flexibilité
export {
  LocationService,
  locationService
};