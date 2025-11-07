import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, CheckCircle, Gift, AlertCircle } from 'lucide-react';
import { FaStamp } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const LoyaltyModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [checkingPhone, setCheckingPhone] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [alreadyRegistered, setAlreadyRegistered] = useState(null);

  // Vérifier si le numéro existe déjà quand l'utilisateur entre son téléphone
  const checkPhoneExists = async (phone) => {
    if (!phone || phone.length < 10) return;
    
    setCheckingPhone(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/loyalty/check/${phone}`);
      
      if (response.data.exists) {
        setAlreadyRegistered(response.data.card);
        setError('');
      } else {
        setAlreadyRegistered(null);
      }
    } catch (err) {
      console.error('Erreur vérification numéro:', err);
    } finally {
      setCheckingPhone(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Si déjà inscrit, bloquer la soumission
    if (alreadyRegistered) {
      setError('Ce numéro est déjà inscrit au programme !');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/api/loyalty/register`, formData);
      
      setSuccess(true);
      
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setFormData({ firstName: '', lastName: '', phone: '', email: '' });
        setAlreadyRegistered(null);
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Vérifier le téléphone en temps réel
    if (name === 'phone' && value.length === 10) {
      checkPhoneExists(value);
    } else if (name === 'phone' && alreadyRegistered) {
      setAlreadyRegistered(null);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md bg-gradient-to-br from-blue-900 via-indigo-800 to-indigo-900 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {/* Header avec animation */}
          <div className="relative p-6 pb-4">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-center justify-center mb-4"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mr-2"
              >
                <FaStamp className="text-4xl text-yellow-400" />
              </motion.div>
              <HiSparkles className="text-3xl text-yellow-300" />
            </motion.div>

            <h2 className="text-2xl font-bold text-white text-center mb-2">
              Programme Fidélité
            </h2>
            <p className="text-blue-200 text-center text-sm">
              6 achetées = 7ème gratuite !
            </p>
          </div>

          {/* Success State */}
          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
              >
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              </motion.div>
              <h3 className="text-xl font-bold text-white mb-2">
                Inscription réussie ! 🎉
              </h3>
              <p className="text-blue-200 text-sm">
                Bienvenue dans notre programme de fidélité
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Prénom */}
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-1">
                  Prénom *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  disabled={alreadyRegistered}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Votre prénom"
                />
              </div>

              {/* Nom */}
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-1">
                  Nom *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  disabled={alreadyRegistered}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Votre nom"
                />
              </div>

              {/* Téléphone */}
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-1">
                  Téléphone *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                    placeholder="0554 625 100"
                  />
                  {checkingPhone && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-400 animate-spin" />
                  )}
                </div>
              </div>

              {/* Message si déjà inscrit */}
              {alreadyRegistered && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border-2 border-yellow-400/50 rounded-lg"
                >
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-6 h-6 text-yellow-300 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-yellow-200 mb-1">
                        🎯 Déjà inscrit !
                      </h4>
                      <p className="text-sm text-yellow-100 mb-2">
                        Vous êtes déjà membre du programme fidélité
                      </p>
                      <div className="bg-black/20 rounded-lg p-3 space-y-1">
                        <p className="text-yellow-200 font-semibold">
                          {alreadyRegistered.firstName} {alreadyRegistered.lastName}
                        </p>
                        <div className="flex items-center space-x-2">
                          <FaStamp className="text-yellow-400" />
                          <p className="text-white font-bold text-lg">
                            {alreadyRegistered.stampCount} / 6 commandes
                          </p>
                        </div>
                        {alreadyRegistered.stampCount >= 6 && (
                          <p className="text-green-300 text-sm font-medium mt-2">
                            🎁 Vous avez droit à une paire gratuite !
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Email (optionnel) */}
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-1">
                  Email (optionnel)
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={alreadyRegistered}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="votre@email.com"
                />
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm"
                >
                  {error}
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading || alreadyRegistered}
                whileHover={!loading && !alreadyRegistered ? { scale: 1.02 } : {}}
                whileTap={!loading && !alreadyRegistered ? { scale: 0.98 } : {}}
                className={`w-full py-3 rounded-lg font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${
                  alreadyRegistered 
                    ? 'bg-gray-600 cursor-not-allowed opacity-50'
                    : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 hover:from-yellow-500 hover:to-orange-600'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Inscription...
                  </>
                ) : alreadyRegistered ? (
                  <>
                    <AlertCircle className="w-5 h-5" />
                    Déjà inscrit
                  </>
                ) : (
                  <>
                    <Gift className="w-5 h-5" />
                    Rejoindre le programme
                  </>
                )}
              </motion.button>

              {/* Info */}
              <p className="text-xs text-blue-300 text-center">
                Pas de date d'expiration • Valable pour toute la famille
              </p>
            </form>
          )}

          {/* Animated Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.1, 0.3, 0.1],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 3 + i * 0.5,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              >
                <FaStamp className="text-white/5 text-4xl" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LoyaltyModal;
