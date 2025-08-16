import { productImages } from './images';

export const mockSlides = [
  {
    id: 'loyalty-card',
    title: '6 achetées, 7ème gratuite',
    subtitle: 'Programme exclusif',
    description: 'Collectionnez vos achats et obtenez une paire gratuite pour toute la famille. Valable sur toutes les collections adultes.',
    isLoyaltyCard: true,
    accent: 'from-indigo-800 via-blue-700 to-blue-900',
    textColor: 'text-white',
    buttonColor: 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white hover:from-blue-500 hover:to-indigo-600',
    stampCount: 6,
    showPhysicalCard: true,
    locations: [
      {
        name: 'Centre ville',
        address: '39 rue Larbi Ben mhidi - Oran',
        phone: '+213(0) 554 625 100'
      },
      {
        name: 'Millenium',
        address: '15 Coop El-Mieh Hai Khemisti Bir EL Djir - Oran',
        phone: '+213(0) 542 203 449'
      }
    ],
    facebook: 'fb.com/Birk.Algerie',
    link: '/loyalty-program',
    image: productImages['loyalty-card']
  },
  {
    id: 'summer-sale',
    title: 'Soldes d’Été',
    subtitle: 'Jusqu’à -40%',
    description: 'Profitez de nos offres exceptionnelles sur toute la collection estivale. Sandales, mules et accessoires à prix réduits !',
    price: 'à partir de 89.95',
    image: productImages['boston-shearling'],
    accent: 'from-rose-500 to-orange-600',
    textColor: 'text-white',
    buttonColor: 'bg-gradient-to-r from-orange-400 to-red-500 text-white hover:from-orange-500 hover:to-red-600',
    link: '/sales/summer',
    isSale: true,
    saleTag: '-40%'
  },
  {
    id: 'premium-collection',
    title: 'Collection Premium',
    subtitle: 'Edition Limitée',
    description: 'Découvrez notre collection exclusive fabriquée avec des matériaux d’exception et un savoir-faire unique.',
    price: 'à partir de 129.95',
    image: productImages['arizona-premium'],
    accent: 'from-emerald-600 to-teal-800',
    textColor: 'text-white',
    buttonColor: 'bg-gradient-to-r from-teal-400 to-emerald-500 text-white hover:from-teal-500 hover:to-emerald-600',
    link: '/collections/premium',
    isSale: true,
    saleTag: 'PREMIUM'
  },
];