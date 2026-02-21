import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Clock, Shield, Package, ShoppingBag } from 'lucide-react';

const DeliveryFeesSummary = ({ fees, commune, productTotal, totalQuantity }) => {
  if (!fees) return null;

  // Total général (Produit + Livraison seulement, sans frais COD)
  const grandTotal = productTotal + fees.deliveryFee;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800 shadow-sm"
    >
      <div className="flex items-center mb-4">
        <div className="bg-blue-500 p-2 rounded-lg mr-3">
          <Truck size={20} className="text-white" />
        </div>
        <h4 className="text-lg font-bold text-gray-900 dark:text-white">
          Récapitulatif de commande
        </h4>
      </div>

      <div className="space-y-3">
        {/* Prix du produit */}
        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
          <div className="flex items-center">
            <ShoppingBag size={16} className="text-indigo-500 mr-2" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Produit ({totalQuantity} ×)
            </span>
          </div>
          <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
            {productTotal.toFixed(2)} DA
          </span>
        </div>

        {/* Frais de livraison */}
        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
          <div className="flex items-center">
            <Package size={16} className="text-blue-500 mr-2" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Frais de livraison</span>
          </div>
          <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
            {fees.deliveryFee.toFixed(2)} DA
          </span>
        </div>

        {/* Délai de livraison */}
        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
          <div className="flex items-center">
            <Clock size={16} className="text-green-500 mr-2" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Délai de livraison</span>
          </div>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            Entre 1 et 5 jours
          </span>
        </div>

        {/* Total général */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg mt-3">
          <span className="text-base font-bold text-white">Total à payer</span>
          <span className="text-2xl font-bold text-white">
            {grandTotal.toFixed(2)} DA
          </span>
        </div>
      </div>

      {/* Info Stop Desk */}
      {commune?.has_stop_desk && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
        >
          <div className="flex items-start">
            <Package size={16} className="text-green-600 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-green-800 dark:text-green-300">
              <p className="font-semibold">Stop Desk disponible !</p>
              <p className="text-xs mt-1">
                Vous pouvez récupérer votre colis dans un point relais à {commune.name}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Informations complémentaires */}
      <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
        <div className="flex items-start text-xs text-gray-600 dark:text-gray-400">
          <Shield size={14} className="mr-2 mt-0.5 flex-shrink-0" />
          <p>
            Colis assuré • Paiement à la livraison • Suivi en temps réel
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default DeliveryFeesSummary;
