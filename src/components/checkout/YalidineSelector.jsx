import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, AlertCircle, Loader, Package } from 'lucide-react';
import { toast } from 'react-hot-toast';
import yalidineService from '../../services/yalidineService';

const YalidineSelector = ({ formData, onChange, errors = {}, onFeesCalculated }) => {
  const [wilayas, setWilayas] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [loadingWilayas, setLoadingWilayas] = useState(true);
  const [loadingCommunes, setLoadingCommunes] = useState(false);
  const [calculatingFees, setCalculatingFees] = useState(false);
  const [fromWilayaId, setFromWilayaId] = useState(null);

  // Charger les wilayas au montage
  useEffect(() => {
    loadWilayas();
  }, []);

  // Charger les communes quand wilaya change
  useEffect(() => {
    if (formData.wilayaId) {
      loadCommunes(formData.wilayaId);
    } else {
      setCommunes([]);
    }
  }, [formData.wilayaId]);

  // Calculer les frais quand commune change
  useEffect(() => {
    if (formData.wilayaId && formData.communeId && formData.totalPrice > 0 && fromWilayaId) {
      calculateFees();
    }
  }, [formData.wilayaId, formData.communeId, formData.totalPrice, fromWilayaId]);

  const loadWilayas = async () => {
    try {
      setLoadingWilayas(true);
      const data = await yalidineService.getWilayas();
      setWilayas(data);
      
      // 🔥 Trouver l'ID d'Oran
      const oran = data.find(w => w.name.toLowerCase() === 'oran');
      if (oran) {
        setFromWilayaId(oran.id);
        console.log('📍 Wilaya de départ: Oran (ID:', oran.id, ')');
      } else {
        console.error('❌ Oran non trouvé dans les wilayas');
        toast.error('Erreur de configuration Yalidine');
      }
      
      console.log('✅ Wilayas chargées:', data.length);
    } catch (error) {
      console.error('❌ Erreur wilayas:', error);
      toast.error('Impossible de charger les wilayas');
    } finally {
      setLoadingWilayas(false);
    }
  };

  const loadCommunes = async (wilayaId) => {
    try {
      setLoadingCommunes(true);
      const data = await yalidineService.getCommunes(wilayaId);
      setCommunes(data);
      console.log(`✅ Communes chargées:`, data.length);
    } catch (error) {
      console.error('❌ Erreur communes:', error);
      toast.error('Impossible de charger les communes');
    } finally {
      setLoadingCommunes(false);
    }
  };

  const calculateFees = async () => {
    if (!fromWilayaId) {
      console.error('❌ fromWilayaId manquant');
      return;
    }

    try {
      setCalculatingFees(true);

      console.log('📊 Calcul des frais:', {
        de: `Oran (${fromWilayaId})`,
        vers: `${formData.wilayaName} (${formData.wilayaId})`,
        commune: `${formData.communeName} (${formData.communeId})`,
        prix: formData.totalPrice
      });

      const fees = await yalidineService.calculateFees({
        fromWilayaId: fromWilayaId, // 🔥 Utiliser Oran dynamiquement
        toWilayaId: formData.wilayaId,
        toCommuneId: formData.communeId,
        price: formData.totalPrice,
        declaredValue: formData.totalPrice,
        weight: formData.weight || 1,
        length: formData.length || 30,
        width: formData.width || 20,
        height: formData.height || 10,
        isStopDesk: false,
        freeShipping: false,
        doInsurance: true
      });

      console.log('✅ Frais calculés:', fees);
      
      if (onFeesCalculated) {
        onFeesCalculated(fees);
      }

      toast.success(`Frais de livraison: ${fees.deliveryFee} DA`, {
        icon: '📦',
        duration: 3000
      });
    } catch (error) {
      console.error('❌ Erreur calcul frais:', error);
      toast.error('Impossible de calculer les frais');
    } finally {
      setCalculatingFees(false);
    }
  };

  const handleWilayaChange = (e) => {
    const wilayaId = parseInt(e.target.value);
    const selectedWilaya = wilayas.find(w => w.id === wilayaId);

    onChange({
      wilayaId: wilayaId || null,
      wilayaName: selectedWilaya?.name || '',
      communeId: null,
      communeName: ''
    });
  };

  const handleCommuneChange = (e) => {
    const communeId = parseInt(e.target.value);
    const selectedCommune = communes.find(c => c.id === communeId);

    onChange({
      communeId: communeId || null,
      communeName: selectedCommune?.name || ''
    });
  };

  return (
    <div className="space-y-4">
      {/* Wilaya */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">
          <MapPin size={14} className="inline mr-1" /> Wilaya *
        </label>
        <div className="relative">
          <select
            value={formData.wilayaId || ''}
            onChange={handleWilayaChange}
            disabled={loadingWilayas}
            className={`w-full px-4 py-2.5 bg-white dark:bg-gray-800 border ${
              errors.wilaya ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
            } rounded-lg focus:ring-2 focus:ring-blue-500 transition-all outline-none appearance-none`}
          >
            <option value="">
              {loadingWilayas ? 'Chargement...' : 'Sélectionnez votre wilaya'}
            </option>
            {wilayas.map((wilaya) => (
              <option key={wilaya.id} value={wilaya.id}>
                {wilaya.id} - {wilaya.name}
              </option>
            ))}
          </select>
          {loadingWilayas && (
            <div className="absolute right-3 top-3">
              <Loader size={20} className="animate-spin text-blue-500" />
            </div>
          )}
        </div>
        {errors.wilaya && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-1 text-sm text-red-500 flex items-center"
          >
            <AlertCircle size={12} className="mr-1" /> {errors.wilaya}
          </motion.p>
        )}
      </motion.div>

      {/* Commune */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">
          <Package size={14} className="inline mr-1" /> Commune *
        </label>
        <div className="relative">
          <select
            value={formData.communeId || ''}
            onChange={handleCommuneChange}
            disabled={!formData.wilayaId || loadingCommunes}
            className={`w-full px-4 py-2.5 bg-white dark:bg-gray-800 border ${
              errors.commune ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
            } rounded-lg focus:ring-2 focus:ring-blue-500 transition-all outline-none appearance-none`}
          >
            <option value="">
              {!formData.wilayaId
                ? 'Sélectionnez d\'abord une wilaya'
                : loadingCommunes
                ? 'Chargement...'
                : 'Sélectionnez votre commune'}
            </option>
            {communes.map((commune) => (
              <option key={commune.id} value={commune.id}>
                {commune.name} {commune.has_stop_desk ? '🏢 (Stop Desk)' : ''}
              </option>
            ))}
          </select>
          {(loadingCommunes || calculatingFees) && (
            <div className="absolute right-3 top-3">
              <Loader size={20} className="animate-spin text-blue-500" />
            </div>
          )}
        </div>
        {errors.commune && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-1 text-sm text-red-500 flex items-center"
          >
            <AlertCircle size={12} className="mr-1" /> {errors.commune}
          </motion.p>
        )}
        {communes.length > 0 && (
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {communes.length} commune(s) disponible(s) • {communes.filter(c => c.has_stop_desk).length} avec stop desk
          </p>
        )}
      </motion.div>

      {/* Indicateur de calcul */}
      {calculatingFees && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center justify-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
        >
          <Loader size={18} className="animate-spin text-blue-500 mr-2" />
          <span className="text-sm text-blue-700 dark:text-blue-300">
            Calcul des frais de livraison...
          </span>
        </motion.div>
      )}
    </div>
  );
};

export default YalidineSelector;
