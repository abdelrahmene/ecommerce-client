import React, { useState, useEffect } from 'react';
import locationService from '../services/locationService';

const LocationSelector = ({ 
  onLocationChange, 
  initialWilaya = null, 
  initialCommune = null,
  disabled = false,
  className = "",
  required = false,
  showDeliveryStatus = true
}) => {
  const [wilayas, setWilayas] = useState([]);
  const [communes, setCommunesList] = useState([]);
  const [selectedWilaya, setSelectedWilaya] = useState(initialWilaya);
  const [selectedCommune, setSelectedCommune] = useState(initialCommune);
  const [loading, setLoading] = useState(true);
  const [loadingCommunes, setLoadingCommunes] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadWilayas();
  }, []);

  useEffect(() => {
    if (selectedWilaya) {
      loadCommunes(selectedWilaya);
    } else {
      setCommunesList([]);
      setSelectedCommune(null);
    }
  }, [selectedWilaya]);

  useEffect(() => {
    // Notifier le parent des changements
    if (onLocationChange) {
      const wilayaData = wilayas.find(w => w.id === selectedWilaya);
      const communeData = communes.find(c => c.id === selectedCommune);
      
      onLocationChange({
        wilaya: wilayaData ? {
          id: wilayaData.id,
          name: wilayaData.name,
          zone: wilayaData.zone,
          is_deliverable: wilayaData.is_deliverable
        } : null,
        commune: communeData ? {
          id: communeData.id,
          name: communeData.name,
          zone: communeData.zone,
          is_deliverable: communeData.is_deliverable
        } : null
      });
    }
  }, [selectedWilaya, selectedCommune, wilayas, communes, onLocationChange]);

  const loadWilayas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Vérifier d'abord si les données sont disponibles
      const availability = await locationService.checkDataAvailability();
      
      if (!availability.wilayas) {
        setError('Les données des wilayas ne sont pas encore disponibles. Veuillez contacter l\'administrateur.');
        return;
      }

      const wilayasData = await locationService.getWilayas();
      setWilayas(wilayasData);
      
    } catch (error) {
      console.error('Erreur lors du chargement des wilayas:', error);
      setError('Impossible de charger les wilayas. Vérifiez votre connexion.');
    } finally {
      setLoading(false);
    }
  };

  const loadCommunes = async (wilayaId) => {
    try {
      setLoadingCommunes(true);
      setSelectedCommune(null);
      
      const communesData = await locationService.getCommunesByWilaya(wilayaId);
      setCommunesList(communesData);
      
    } catch (error) {
      console.error('Erreur lors du chargement des communes:', error);
      setError('Impossible de charger les communes.');
    } finally {
      setLoadingCommunes(false);
    }
  };

  const handleWilayaChange = (e) => {
    const wilayaId = parseInt(e.target.value) || null;
    setSelectedWilaya(wilayaId);
  };

  const handleCommuneChange = (e) => {
    const communeId = parseInt(e.target.value) || null;
    setSelectedCommune(communeId);
  };

  const getDeliveryBadge = (isDeliverable) => {
    if (!showDeliveryStatus) return null;
    
    return (
      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
        isDeliverable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {isDeliverable ? '📦 Livrable' : '❌ Non livrable'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <span className="text-red-500">⚠️</span>
            <span className="text-red-700 text-sm">{error}</span>
          </div>
          <button
            onClick={loadWilayas}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Sélecteur de Wilaya */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          📍 Wilaya {required && <span className="text-red-500">*</span>}
        </label>
        <select
          value={selectedWilaya || ''}
          onChange={handleWilayaChange}
          disabled={disabled}
          required={required}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">Sélectionnez une wilaya</option>
          {wilayas.map((wilaya) => (
            <option key={wilaya.id} value={wilaya.id}>
              {wilaya.name} (Zone {wilaya.zone})
            </option>
          ))}
        </select>
        {selectedWilaya && (
          <div className="mt-1 flex items-center">
            {(() => {
              const wilaya = wilayas.find(w => w.id === selectedWilaya);
              return wilaya ? getDeliveryBadge(wilaya.is_deliverable) : null;
            })()}
          </div>
        )}
      </div>

      {/* Sélecteur de Commune */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          🏘️ Commune {required && <span className="text-red-500">*</span>}
        </label>
        <select
          value={selectedCommune || ''}
          onChange={handleCommuneChange}
          disabled={disabled || !selectedWilaya || loadingCommunes}
          required={required}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">
            {!selectedWilaya 
              ? 'Sélectionnez d\'abord une wilaya' 
              : loadingCommunes 
                ? 'Chargement des communes...' 
                : 'Sélectionnez une commune'
            }
          </option>
          {communes.map((commune) => (
            <option key={commune.id} value={commune.id}>
              {commune.name} (Zone {commune.zone})
            </option>
          ))}
        </select>
        {selectedCommune && (
          <div className="mt-1 flex items-center">
            {(() => {
              const commune = communes.find(c => c.id === selectedCommune);
              return commune ? getDeliveryBadge(commune.is_deliverable) : null;
            })()}
          </div>
        )}
        
        {loadingCommunes && (
          <div className="mt-2 flex items-center space-x-2 text-sm text-gray-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            <span>Chargement des communes...</span>
          </div>
        )}
      </div>

      {/* Informations supplémentaires */}
      {selectedWilaya && selectedCommune && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <h4 className="text-sm font-medium text-blue-800 mb-1">📋 Informations de livraison</h4>
          <div className="text-xs text-blue-700 space-y-1">
            {(() => {
              const wilaya = wilayas.find(w => w.id === selectedWilaya);
              const commune = communes.find(c => c.id === selectedCommune);
              
              if (!wilaya || !commune) return null;
              
              return (
                <>
                  <p><strong>Zone de livraison:</strong> {commune.zone}</p>
                  <p><strong>Statut:</strong> {commune.is_deliverable ? '✅ Livraison disponible' : '❌ Livraison non disponible'}</p>
                  {!commune.is_deliverable && (
                    <p className="text-red-600 font-medium">
                      ⚠️ Cette zone n'est pas couverte par notre service de livraison.
                    </p>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;