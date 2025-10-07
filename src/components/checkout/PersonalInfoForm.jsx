import React from 'react';
import { motion } from 'framer-motion';
import { User, Phone, AlertCircle } from 'lucide-react';

const PersonalInfoForm = ({ formData, onChange, errors = {} }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
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
      </motion.div>
    </div>
  );
};

export default PersonalInfoForm;
