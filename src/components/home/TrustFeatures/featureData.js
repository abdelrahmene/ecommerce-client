import React from 'react';

// Icônes stylisées en composants SVG pour un meilleur contrôle
const DeliveryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <rect x="1" y="3" width="15" height="13" rx="2" />
    <path d="m16 8 4 2v5h-4" />
    <circle cx="6.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

const PaymentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <line x1="2" y1="10" x2="22" y2="10" />
    <line x1="6" y1="15" x2="6" y2="15.01" />
    <line x1="10" y1="15" x2="10" y2="15.01" />
  </svg>
);

const ReturnIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
);

const QualityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

// Données des fonctionnalités avec les textes spécifiques demandés
export const featureData = [
  {
    id: 1,
    icon: <DeliveryIcon />,
    title: "LIVRAISON 58 WILAYAS",
    description: "Livraison rapide partout en Algérie avec suivi en temps réel",
    gradient: "from-blue-400 to-blue-600",
    iconBg: "bg-blue-400/30",
    textColor: "text-white",
    highlights: [
      "Toutes les wilayas",
      "Suivi en temps réel",
      "Livraison express"
    ]
  },
  {
    id: 2,
    icon: <PaymentIcon />,
    title: "PAIEMENT À LA LIVRAISON",
    description: "Payez uniquement quand vous recevez votre commande",
    gradient: "from-orange-400 to-pink-600",
    iconBg: "bg-orange-400/30",
    textColor: "text-white",
    highlights: [
      "Sans frais supplémentaires",
      "100% sécurisé",
      "Simple et rapide"
    ]
  },
  {
    id: 3,
    icon: <ReturnIcon />,
    title: "RETOURS DISPONIBLES",
    description: "Retournez facilement vos articles sous 30 jours",
    gradient: "from-green-400 to-teal-600",
    iconBg: "bg-green-400/30",
    textColor: "text-white",
    highlights: [
      "Sans questions",
      "Remboursement rapide",
      "Procédure simple"
    ]
  },
  {
    id: 4,
    icon: <QualityIcon />,
    title: "QUALITÉ GARANTIE",
    description: "Tous nos produits sont vérifiés et garantis authentiques",
    gradient: "from-purple-400 to-indigo-600",
    iconBg: "bg-purple-400/30",
    textColor: "text-white",
    highlights: [
      "Authenticité garantie",
      "Matériaux premium",
      "Contrôle qualité"
    ]
  }
];