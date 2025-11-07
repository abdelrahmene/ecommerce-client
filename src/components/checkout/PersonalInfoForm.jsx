import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, AlertCircle, Gift } from 'lucide-react';
import { FaStamp } from 'react-icons/fa';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const PersonalInfoForm = ({ formData, onChange, errors = {} }) => {
  const [loyaltyInfo, setLoyaltyInfo] = useState(null);
  const [checkingLoyalty, setCheckingLoyalty] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ [name]: value });

    // Vérifier loyalty quand téléphone = 10 chiffres
    if (name === 'telephone') {
      const cleanPhone = value.replace(/\s/g, '');
      console.log('📱 [LOYALTY] Téléphone:', cleanPhone, 'Longueur:', cleanPhone.length);
      
      if (cleanPhone.length === 10) {
        console.log('✅ [LOYALTY] 10 chiffres, vérification...');
        checkLoyaltyStatus(cleanPhone);
      } else {
        setLoyaltyInfo(null);
      }
    }
  };

  const checkLoyaltyStatus = async (phone) => {
    setCheckingLoyalty(true);
    console.log('🔍 [LOYALTY] Appel API pour:', phone);
    
    try {
      const url = `${API_BASE_URL}/api/loyalty/check/${phone}`;
      console.log('📡 [LOYALTY] URL:', url);
      
      const response = await axios.get(url);
      console.log('✅ [LOYALTY] Réponse:', response.data);
      
      if (response.data.exists) {
        console.log('🎊 [LOYALTY] Client trouvé!', response.data.card);
        setLoyaltyInfo(response.data.card);
      } else {
        console.log('ℹ️ [LOYALTY] Non inscrit');
        setLoyaltyInfo(null);
      }
    } catch (error) {
      console.error('❌ [LOYALTY] Erreur:', error);
      setLoyaltyInfo(null);
    } finally {
      setCheckingLoyalty(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Nom et Prénom */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">
            <User size={14} className="inline mr-1" /> Nom *
          </label>
          <input
            type="text"
            name="nom"
            value={formData.nom || ''}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 bg-white dark:bg-gray-800 border ${
              errors.nom ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
            } rounded-lg focus:ring-2 focus:ring-blue-500 transition-all outline-none`}
            placeholder="Votre nom"
          />
          {errors.nom && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-1 text-sm text-red-500 flex items-center"
            >
              <AlertCircle size={12} className="mr-1" /> {errors.nom}
            </motion.p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">
            <User size={14} className="inline mr-1" /> Prénom *
          </label>
          <input
            type="text"
            name="prenom"
            value={formData.prenom || ''}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 bg-white dark:bg-gray-800 border ${
              errors.prenom ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
            } rounded-lg focus:ring-2 focus:ring-blue-500 transition-all outline-none`}
            placeholder="Votre prénom"
          />
          {errors.prenom && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-1 text-sm text-red-500 flex items-center"
            >
              <AlertCircle size={12} className="mr-1" /> {errors.prenom}
            </motion.p>
          )}
        </motion.div>
      </div>

      {/* Téléphone */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">
          <Phone size={14} className="inline mr-1" /> Téléphone *
        </label>
        <div className="relative">
          <input
            type="tel"
            name="telephone"
            value={formData.telephone || ''}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 bg-white dark:bg-gray-800 border ${
              errors.telephone ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
            } rounded-lg focus:ring-2 focus:ring-blue-500 transition-all outline-none`}
            placeholder="0550123456"
          />
          {checkingLoyalty && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>
        <p className="mt-1 text-xs text-gray-500">Format: 05XXXXXXXX ou 06XXXXXXXX</p>
        {errors.telephone && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-1 text-sm text-red-500 flex items-center"
          >
            <AlertCircle size={12} className="mr-1" /> {errors.telephone}
          </motion.p>
        )}

        {/* Message Fidélité */}
        {loyaltyInfo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="mt-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-300 dark:border-blue-600 rounded-lg"
          >
            <div className="flex items-start space-x-3">
              <Gift className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-1">
                  🎊 Membre Fidélité !
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-300 mb-2">
                  Ce numéro est inscrit chez nous
                </p>
                <div className="bg-white/70 dark:bg-black/20 rounded-lg p-3 space-y-1">
                  <p className="text-blue-900 dark:text-blue-200 font-semibold">
                    {loyaltyInfo.firstName} {loyaltyInfo.lastName}
                  </p>
                  <div className="flex items-center space-x-2">
                    <FaStamp className="text-yellow-500" />
                    <p className="text-gray-900 dark:text-white font-bold">
                      {loyaltyInfo.stampCount} / 6 commandes
                    </p>
                  </div>
                  {loyaltyInfo.stampCount >= 6 && (
                    <p className="text-green-600 dark:text-green-400 text-sm font-medium mt-2 flex items-center space-x-1">
                      <Gift className="w-4 h-4" />
                      <span>Paire gratuite disponible !</span>
                    </p>
                  )}
                  {loyaltyInfo.stampCount < 6 && (
                    <p className="text-gray-600 dark:text-gray-400 text-xs mt-2">
                      Encore {6 - loyaltyInfo.stampCount} commande{6 - loyaltyInfo.stampCount > 1 ? 's' : ''} pour votre paire gratuite
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default PersonalInfoForm;
