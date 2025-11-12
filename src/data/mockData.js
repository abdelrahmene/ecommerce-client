// 🎯 DONNÉES MOCK POUR REMPLACER FIREBASE
// Ces données remplacent temporairement Firebase jusqu'à connexion avec votre API

export const mockProducts = [
  {
    id: 'p1',
    name: 'Arizona Big Buckle',
    description: "L'iconique sandale Arizona réinventée avec une grande boucle métallique pour un style affirmé. Dotée d'une semelle anatomique en liège naturel et d'une doublure en cuir suédé.",
    price: 149.99,
    salePrice: 149.99,
    oldPrice: 149.99,
    discount: 0,
    rating: 4.8,
    reviewCount: 124,
    stockQuantity: 15,
    active: true,
    createdAt: '2024-01-15T10:00:00Z',
    category: 'sandales',
    collectionId: 'arizona-collection',
    tags: ['confort', 'été', 'iconique'],
    nameSearchable: 'arizona big buckle',
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1160&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?q=80&w=1160&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=943&auto=format&fit=crop'
    ],
    colors: [
      { name: 'Noir', hex: '#000000' },
      { name: 'Marron', hex: '#8B4513' },
      { name: 'Taupe', hex: '#483C32' }
    ],
    sizes: [
      { value: '36', available: true },
      { value: '37', available: true },
      { value: '38', available: true },
      { value: '39', available: true },
      { value: '40', available: true },
      { value: '41', available: true },
      { value: '42', available: false },
      { value: '43', available: true }
    ],
    specifications: [
      { name: 'Matériau extérieur', value: 'Cuir Birko-Flor' },
      { name: 'Semelle intérieure', value: 'Liège naturel' },
      { name: 'Semelle extérieure', value: 'EVA' },
      { name: 'Doublure', value: 'Cuir suédé' }
    ],
    features: [
      'Semelle anatomique en liège naturel',
      'Soutien de la voûte plantaire',
      'Boucles ajustables',
      'Résistant à l\'eau'
    ]
  },
  {
    id: 'p2',
    name: 'Boston Soft Footbed',
    description: 'Le sabot iconique avec semelle souple pour un confort optimal toute la journée. Parfait pour un usage quotidien.',
    price: 159.99,
    salePrice: null,
    rating: 4.7,
    reviewCount: 89,
    stockQuantity: 23,
    active: true,
    createdAt: '2024-01-10T08:30:00Z',
    category: 'sabots',
    collectionId: 'boston-collection',
    tags: ['confort', 'quotidien', 'classique'],
    nameSearchable: 'boston soft footbed',
    images: [
      'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=1112&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1604671801908-6f0c6a092c05?q=80&w=1170&auto=format&fit=crop'
    ],
    colors: [
      { name: 'Taupe', hex: '#483C32' },
      { name: 'Noir', hex: '#000000' }
    ],
    sizes: [
      { value: '37', available: true },
      { value: '38', available: true },
      { value: '39', available: true },
      { value: '40', available: true },
      { value: '41', available: true },
      { value: '42', available: true }
    ]
  },
  {
    id: 'p3',
    name: 'Gizeh Platform',
    description: 'Notre modèle Gizeh emblématique avec une semelle plateforme tendance pour un style moderne et décontracté.',
    price: 129.99,
    salePrice: 109.99,
    rating: 4.6,
    reviewCount: 156,
    stockQuantity: 8,
    active: true,
    createdAt: '2024-01-20T14:15:00Z',
    category: 'tongs',
    collectionId: 'gizeh-collection',
    tags: ['tendance', 'plateforme', 'moderne'],
    nameSearchable: 'gizeh platform',
    images: [
      'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?q=80&w=1015&auto=format&fit=crop'
    ],
    colors: [
      { name: 'Blanc', hex: '#FFFFFF' },
      { name: 'Noir', hex: '#000000' },
      { name: 'Argenté', hex: '#C0C0C0' }
    ]
  },
  {
    id: 'p4',
    name: 'Madrid Big Buckle',
    description: 'La sandale une bride revisitée avec une boucle oversize pour un look moderne et élégant.',
    price: 134.99,
    rating: 4.5,
    reviewCount: 67,
    stockQuantity: 12,
    active: true,
    createdAt: '2024-01-05T11:20:00Z',
    category: 'sandales',
    collectionId: 'madrid-collection',
    tags: ['élégant', 'moderne', 'une bride'],
    nameSearchable: 'madrid big buckle',
    images: [
      'https://images.unsplash.com/photo-1604671801908-6f0c6a092c05?q=80&w=1170&auto=format&fit=crop'
    ]
  }
];

export const mockCollections = [
  {
    id: 'arizona-collection',
    name: 'Arizona Collection',
    description: 'La collection iconique Arizona avec ses designs intemporels',
    image: '/images/collections/arizona.jpg',
    category: 'sandales',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'boston-collection',
    name: 'Boston Collection',
    description: 'Confort et style avec notre collection Boston',
    image: '/images/collections/boston.jpg',
    category: 'sabots',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'gizeh-collection',
    name: 'Gizeh Collection',
    description: 'Modernité et tendance avec Gizeh',
    image: '/images/collections/gizeh.jpg',
    category: 'tongs',
    createdAt: '2024-01-01T00:00:00Z'
  }
];

export const mockHomeContent = [
  {
    id: 'hero-section',
    type: 'hero',
    order: 1,
    isVisible: true,
    content: {
      title: "Collection Été 2025",
      subtitle: "Découvrez notre nouvelle collection",
      slides: [
        {
          title: "Arizona Big Buckle",
          description: "Le modèle iconique, réinventé",
          price: "149.99 €",
          image: "/images/products/arizona.png",
          gradient: "from-blue-600 to-indigo-900"
        },
        {
          title: "Boston Soft",
          description: "Le confort au quotidien",
          price: "159.99 €",
          image: "/images/products/boston.png",
          gradient: "from-red-600 to-pink-900"
        }
      ]
    }
  },
  {
    id: 'collections-section',
    type: 'collections',
    order: 2,
    isVisible: true,
    content: {
      title: "Collections Tendance",
      subtitle: "Découvrez nos collections estivales, un mélange parfait de style et de fraîcheur",
      collectionIds: ['arizona-collection', 'boston-collection', 'gizeh-collection']
    }
  },
  {
    id: 'categories-section',
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
    id: 'advantages-section',
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

export const mockUsers = [
  {
    id: 'user1',
    email: 'test@example.com',
    name: 'Utilisateur Test',
    role: 'customer',
    createdAt: '2024-01-01T00:00:00Z',
    shippingAddresses: [],
    wishlist: [],
    cart: []
  }
];

export const mockOrders = [
  {
    id: 'order1',
    status: 'pending',
    paymentStatus: 'pending',
    paymentMethod: 'cash-on-delivery',
    totalAmount: 149.99,
    orderDate: '2024-01-25T10:30:00Z',
    createdAt: '2024-01-25T10:30:00Z',
    updatedAt: '2024-01-25T10:30:00Z',
    product: {
      id: 'p1',
      name: 'Arizona Big Buckle',
      price: 149.99,
      quantity: 1
    },
    deliveryInfo: {
      firstName: 'John',
      lastName: 'Doe',
      phone: '+213555123456',
      wilaya: 'Alger',
      commune: 'Alger Centre',
      address: '123 Rue de la Paix'
    },
    statusHistory: [
      {
        status: 'pending',
        timestamp: '2024-01-25T10:30:00Z',
        note: 'Commande créée avec paiement à la livraison'
      }
    ]
  }
];
