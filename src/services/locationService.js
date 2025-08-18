// 🎯 SERVICE DE LOCALISATION MOCK - Remplace Firebase
// Mock des wilayas et communes d'Algérie

const MOCK_WILAYAS = [
  { id: '01', name: 'Adrar', zone: 'Sud', is_deliverable: true },
  { id: '02', name: 'Chlef', zone: 'Centre', is_deliverable: true },
  { id: '03', name: 'Laghouat', zone: 'Sud', is_deliverable: true },
  { id: '04', name: 'Oum El Bouaghi', zone: 'Est', is_deliverable: true },
  { id: '05', name: 'Batna', zone: 'Est', is_deliverable: true },
  { id: '06', name: 'Béjaïa', zone: 'Est', is_deliverable: true },
  { id: '07', name: 'Biskra', zone: 'Sud', is_deliverable: true },
  { id: '08', name: 'Béchar', zone: 'Sud', is_deliverable: true },
  { id: '09', name: 'Blida', zone: 'Centre', is_deliverable: true },
  { id: '10', name: 'Bouira', zone: 'Centre', is_deliverable: true },
  { id: '11', name: 'Tamanrasset', zone: 'Sud', is_deliverable: false },
  { id: '12', name: 'Tébessa', zone: 'Est', is_deliverable: true },
  { id: '13', name: 'Tlemcen', zone: 'Ouest', is_deliverable: true },
  { id: '14', name: 'Tiaret', zone: 'Ouest', is_deliverable: true },
  { id: '15', name: 'Tizi Ouzou', zone: 'Centre', is_deliverable: true },
  { id: '16', name: 'Alger', zone: 'Centre', is_deliverable: true },
  { id: '17', name: 'Djelfa', zone: 'Sud', is_deliverable: true },
  { id: '18', name: 'Jijel', zone: 'Est', is_deliverable: true },
  { id: '19', name: 'Sétif', zone: 'Est', is_deliverable: true },
  { id: '20', name: 'Saïda', zone: 'Ouest', is_deliverable: true },
  { id: '21', name: 'Skikda', zone: 'Est', is_deliverable: true },
  { id: '22', name: 'Sidi Bel Abbès', zone: 'Ouest', is_deliverable: true },
  { id: '23', name: 'Annaba', zone: 'Est', is_deliverable: true },
  { id: '24', name: 'Guelma', zone: 'Est', is_deliverable: true },
  { id: '25', name: 'Constantine', zone: 'Est', is_deliverable: true },
  { id: '26', name: 'Médéa', zone: 'Centre', is_deliverable: true },
  { id: '27', name: 'Mostaganem', zone: 'Ouest', is_deliverable: true },
  { id: '28', name: 'M\'Sila', zone: 'Sud', is_deliverable: true },
  { id: '29', name: 'Mascara', zone: 'Ouest', is_deliverable: true },
  { id: '30', name: 'Ouargla', zone: 'Sud', is_deliverable: true },
  { id: '31', name: 'Oran', zone: 'Ouest', is_deliverable: true },
  { id: '32', name: 'El Bayadh', zone: 'Sud', is_deliverable: true },
  { id: '33', name: 'Illizi', zone: 'Sud', is_deliverable: false },
  { id: '34', name: 'Bordj Bou Arréridj', zone: 'Est', is_deliverable: true },
  { id: '35', name: 'Boumerdès', zone: 'Centre', is_deliverable: true },
  { id: '36', name: 'El Tarf', zone: 'Est', is_deliverable: true },
  { id: '37', name: 'Tindouf', zone: 'Sud', is_deliverable: false },
  { id: '38', name: 'Tissemsilt', zone: 'Centre', is_deliverable: true },
  { id: '39', name: 'El Oued', zone: 'Sud', is_deliverable: true },
  { id: '40', name: 'Khenchela', zone: 'Est', is_deliverable: true },
  { id: '41', name: 'Souk Ahras', zone: 'Est', is_deliverable: true },
  { id: '42', name: 'Tipaza', zone: 'Centre', is_deliverable: true },
  { id: '43', name: 'Mila', zone: 'Est', is_deliverable: true },
  { id: '44', name: 'Aïn Defla', zone: 'Centre', is_deliverable: true },
  { id: '45', name: 'Naâma', zone: 'Sud', is_deliverable: true },
  { id: '46', name: 'Aïn Témouchent', zone: 'Ouest', is_deliverable: true },
  { id: '47', name: 'Ghardaïa', zone: 'Sud', is_deliverable: true },
  { id: '48', name: 'Relizane', zone: 'Ouest', is_deliverable: true }
];

const MOCK_COMMUNES = {
  '16': [ // Alger
    { id: '1601', name: 'Alger Centre', wilaya_id: 16, zone: 'Centre', is_deliverable: true },
    { id: '1602', name: 'Bab El Oued', wilaya_id: 16, zone: 'Centre', is_deliverable: true },
    { id: '1603', name: 'Kouba', wilaya_id: 16, zone: 'Centre', is_deliverable: true },
    { id: '1604', name: 'Birtouta', wilaya_id: 16, zone: 'Centre', is_deliverable: true }
  ],
  '31': [ // Oran
    { id: '3101', name: 'Oran', wilaya_id: 31, zone: 'Ouest', is_deliverable: true },
    { id: '3102', name: 'Es Senia', wilaya_id: 31, zone: 'Ouest', is_deliverable: true },
    { id: '3103', name: 'Bir El Djir', wilaya_id: 31, zone: 'Ouest', is_deliverable: true }
  ],
  '25': [ // Constantine
    { id: '2501', name: 'Constantine', wilaya_id: 25, zone: 'Est', is_deliverable: true },
    { id: '2502', name: 'El Khroub', wilaya_id: 25, zone: 'Est', is_deliverable: true },
    { id: '2503', name: 'Hamma Bouziane', wilaya_id: 25, zone: 'Est', is_deliverable: true }
  ]
};

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

  // Simuler un délai réseau
  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Vérifier si le cache est valide
  isCacheValid() {
    return this.cache.lastFetch && 
           (Date.now() - this.cache.lastFetch) < this.cacheTimeout;
  }

  // Récupérer toutes les wilayas (Mock)
  async getWilayas(forceRefresh = false) {
    try {
      // Utiliser le cache si disponible et valide
      if (!forceRefresh && this.cache.wilayas && this.isCacheValid()) {
        return this.cache.wilayas;
      }

      console.log('🔧 Mock: Récupération des wilayas...');
      await this.delay(400);
      
      const wilayas = [...MOCK_WILAYAS].sort((a, b) => a.name.localeCompare(b.name));

      // Mettre en cache
      this.cache.wilayas = wilayas;
      this.cache.lastFetch = Date.now();

      console.log(`✅ Mock: ${wilayas.length} wilayas récupérées`);
      return wilayas;

    } catch (error) {
      console.error('❌ Mock: Erreur lors de la récupération des wilayas:', error);
      
      // Retourner le cache en cas d'erreur si disponible
      if (this.cache.wilayas) {
        console.log('📋 Mock: Utilisation du cache des wilayas');
        return this.cache.wilayas;
      }
      
      throw error;
    }
  }

  // Récupérer toutes les communes (Mock)
  async getCommunes(forceRefresh = false) {
    try {
      // Utiliser le cache si disponible et valide
      if (!forceRefresh && this.cache.communes && this.isCacheValid()) {
        return this.cache.communes;
      }

      console.log('🔧 Mock: Récupération des communes...');
      await this.delay(500);
      
      const communes = [];
      Object.values(MOCK_COMMUNES).forEach(communeList => {
        communes.push(...communeList);
      });

      // Trier par nom
      communes.sort((a, b) => a.name.localeCompare(b.name));

      // Mettre en cache
      this.cache.communes = communes;
      this.cache.lastFetch = Date.now();

      console.log(`✅ Mock: ${communes.length} communes récupérées`);
      return communes;

    } catch (error) {
      console.error('❌ Mock: Erreur lors de la récupération des communes:', error);
      
      // Retourner le cache en cas d'erreur si disponible
      if (this.cache.communes) {
        console.log('📋 Mock: Utilisation du cache des communes');
        return this.cache.communes;
      }
      
      throw error;
    }
  }

  // Récupérer les communes d'une wilaya spécifique (Mock)
  async getCommunesByWilaya(wilayaId, forceRefresh = false) {
    try {
      console.log(`🔧 Mock: Récupération des communes pour la wilaya ${wilayaId}`);
      await this.delay(200);
      
      const communes = MOCK_COMMUNES[wilayaId] || [];
      console.log(`✅ Mock: ${communes.length} communes trouvées pour la wilaya ${wilayaId}`);
      return communes;
    } catch (error) {
      console.error(`❌ Mock: Erreur lors de la récupération des communes pour la wilaya ${wilayaId}:`, error);
      throw error;
    }
  }

  // Récupérer l'organisation (Mock)
  async getOrganization(forceRefresh = false) {
    try {
      // Utiliser le cache si disponible et valide
      if (!forceRefresh && this.cache.organization && this.isCacheValid()) {
        return this.cache.organization;
      }

      console.log('🔧 Mock: Récupération de l\'organisation...');
      await this.delay(300);
      
      const organization = {};
      MOCK_WILAYAS.forEach(wilaya => {
        organization[wilaya.name] = {
          wilaya_id: parseInt(wilaya.id),
          wilaya_name: wilaya.name,
          communes: MOCK_COMMUNES[wilaya.id] || []
        };
      });

      // Mettre en cache
      this.cache.organization = organization;
      this.cache.lastFetch = Date.now();

      console.log(`✅ Mock: Organisation récupérée: ${Object.keys(organization).length} wilayas`);
      return organization;

    } catch (error) {
      console.error('❌ Mock: Erreur lors de la récupération de l\'organisation:', error);
      
      // Retourner le cache en cas d'erreur si disponible
      if (this.cache.organization) {
        console.log('📋 Mock: Utilisation du cache de l\'organisation');
        return this.cache.organization;
      }
      
      throw error;
    }
  }

  // Rechercher une wilaya par nom (Mock)
  async findWilayaByName(name, forceRefresh = false) {
    try {
      const wilayas = await this.getWilayas(forceRefresh);
      return wilayas.find(wilaya => 
        wilaya.name.toLowerCase() === name.toLowerCase()
      );
    } catch (error) {
      console.error(`❌ Mock: Erreur lors de la recherche de la wilaya "${name}":`, error);
      throw error;
    }
  }

  // Rechercher une commune par nom et wilaya (Mock)
  async findCommuneByName(communeName, wilayaId, forceRefresh = false) {
    try {
      const communes = await this.getCommunesByWilaya(wilayaId, forceRefresh);
      return communes.find(commune => 
        commune.name.toLowerCase() === communeName.toLowerCase()
      );
    } catch (error) {
      console.error(`❌ Mock: Erreur lors de la recherche de la commune "${communeName}":`, error);
      throw error;
    }
  }

  // Vérifier si les données sont disponibles (Mock)
  async checkDataAvailability() {
    try {
      console.log('🔧 Mock: Vérification de la disponibilité des données...');
      await this.delay(200);
      
      return {
        wilayas: true,
        communes: true,
        wilayasCount: MOCK_WILAYAS.length,
        communesCount: Object.values(MOCK_COMMUNES).flat().length,
        lastUpdated: {
          wilayas: new Date().toISOString(),
          communes: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('❌ Mock: Erreur lors de la vérification des données:', error);
      return {
        wilayas: false,
        communes: false,
        wilayasCount: 0,
        communesCount: 0,
        lastUpdated: { wilayas: null, communes: null }
      };
    }
  }

  // Méthode utilitaire pour formater les données pour les sélecteurs (Mock)
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
      console.error('❌ Mock: Erreur lors du formatage des données:', error);
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
    console.log('🗑️ Mock: Cache vidé');
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

console.log('🔧 Service de localisation Mock initialisé');
