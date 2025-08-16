import { collection, addDoc } from 'firebase/firestore';
import { firestore } from './firebase';

const initialSections = [
  {
    type: 'hero',
    order: 1,
    isVisible: true,
    content: {
      title: "Collection Été 2025",
      subtitle: "Découvrez notre nouvelle collection",
      slides: [
        {
          title: "Arizona",
          description: "Le modèle iconique, réinventé",
          price: "119.99 €",
          image: "/images/products/arizona.png",
          gradient: "from-blue-600 to-indigo-900"
        },
        {
          title: "Boston",
          description: "Le confort au quotidien",
          price: "139.99 €",
          image: "/images/products/boston.png",
          gradient: "from-red-600 to-pink-900"
        }
      ]
    }
  },
  {
    type: 'collections',
    order: 2,
    isVisible: true,
    content: {
      title: "Collections Tendance",
      subtitle: "Découvrez nos collections estivales, un mélange parfait de style et de fraîcheur",
      collectionIds: ['classics', 'essentials', 'premium', 'new-arrivals']
    }
  },
  {
    type: 'categories',
    order: 3,
    isVisible: true,
    content: {
      title: "Nos Catégories",
      subtitle: "Explorez notre large gamme de chaussures pour tous les styles",
      categories: [
        {
          id: 'sandals',
          name: 'Sandales',
          description: 'Pour un été stylé et confortable',
          image: '/images/categories/sandals.jpg',
          darkGradient: 'from-blue-600 to-indigo-900',
          lightGradient: 'from-blue-400 to-indigo-600'
        },
        {
          id: 'clogs',
          name: 'Sabots',
          description: 'Le confort au quotidien',
          image: '/images/categories/clogs.jpg',
          darkGradient: 'from-purple-600 to-indigo-900',
          lightGradient: 'from-purple-400 to-indigo-600'
        },
        {
          id: 'boots',
          name: 'Boots',
          description: 'Pour affronter tous les temps',
          image: '/images/categories/boots.jpg',
          darkGradient: 'from-red-600 to-pink-900',
          lightGradient: 'from-red-400 to-pink-600'
        }
      ]
    }
  },
  {
    type: 'advantages',
    order: 4,
    isVisible: true,
    content: {
      title: "Nos Avantages",
      subtitle: "Une expérience shopping fraîche et agréable",
      advantages: [
        {
          id: 'quality',
          title: 'Qualité Premium',
          description: 'Des matériaux soigneusement sélectionnés',
          icon: '✨',
          darkGradient: 'from-blue-600 to-indigo-900',
          lightGradient: 'from-blue-400 to-indigo-600'
        },
        {
          id: 'comfort',
          title: 'Confort Optimal',
          description: 'Pour un bien-être quotidien',
          icon: '👟',
          darkGradient: 'from-purple-600 to-indigo-900',
          lightGradient: 'from-purple-400 to-indigo-600'
        },
        {
          id: 'delivery',
          title: 'Livraison Rapide',
          description: 'Gratuite dès 100€ d\'achat',
          icon: '🚚',
          darkGradient: 'from-red-600 to-pink-900',
          lightGradient: 'from-red-400 to-pink-600'
        }
      ]
    }
  }
];

export const initializeHomeContent = async () => {
  try {
    const homeContentRef = collection(firestore, 'homeContent');
    
    for (const section of initialSections) {
      await addDoc(homeContentRef, section);
    }
    
    console.log('Home content initialized successfully');
  } catch (error) {
    console.error('Error initializing home content:', error);
  }
};