// 🎯 SERVICES MOCK POUR REMPLACER FIREBASE
// Ces services simulent Firebase en utilisant des données locales

import { mockProducts, mockCollections, mockHomeContent, mockUsers, mockOrders } from '../data/mockData';

// ========================================
// 🔐 AUTH MOCK SERVICE
// ========================================

class MockAuthService {
  constructor() {
    this.currentUser = null;
    this.subscribers = [];
    
    // Charger l'utilisateur depuis localStorage s'il existe
    const savedUser = localStorage.getItem('mockUser');
    if (savedUser) {
      try {
        this.currentUser = JSON.parse(savedUser);
      } catch (e) {
        localStorage.removeItem('mockUser');
      }
    }
  }

  // Inscription
  async createUserWithEmailAndPassword(email, password) {
    // Simulation d'un délai réseau
    await this.delay(500);
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      throw new Error('Un compte avec cette adresse email existe déjà');
    }

    const newUser = {
      uid: 'user_' + Date.now(),
      email,
      emailVerified: false,
      createdAt: new Date().toISOString()
    };

    this.currentUser = newUser;
    localStorage.setItem('mockUser', JSON.stringify(newUser));
    this.notifySubscribers(newUser);

    return { user: newUser };
  }

  // Connexion
  async signInWithEmailAndPassword(email, password) {
    await this.delay(500);
    
    // Pour la démo, accepter test@example.com / password123
    if (email === 'test@example.com' && password === 'password123') {
      const user = {
        uid: 'user_test',
        email: 'test@example.com',
        emailVerified: true,
        createdAt: '2024-01-01T00:00:00Z'
      };

      this.currentUser = user;
      localStorage.setItem('mockUser', JSON.stringify(user));
      this.notifySubscribers(user);

      return { user };
    } else {
      throw new Error('Identifiants invalides');
    }
  }

  // Déconnexion
  async signOut() {
    await this.delay(300);
    this.currentUser = null;
    localStorage.removeItem('mockUser');
    localStorage.removeItem('mockUserProfile');
    this.notifySubscribers(null);
  }

  // Réinitialisation de mot de passe
  async sendPasswordResetEmail(email) {
    await this.delay(500);
    console.log('🔧 Mock: Email de réinitialisation envoyé à', email);
    // En vrai, cela enverrait un email
  }

  // Écouter les changements d'état d'authentification
  onAuthStateChanged(callback) {
    this.subscribers.push(callback);
    
    // Appeler immédiatement avec l'état actuel
    setTimeout(() => callback(this.currentUser), 0);
    
    // Retourner une fonction de nettoyage
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  notifySubscribers(user) {
    this.subscribers.forEach(callback => callback(user));
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ========================================
// 🗄️ FIRESTORE MOCK SERVICE
// ========================================

class MockFirestoreService {
  constructor() {
    this.collections = {
      products: [...mockProducts],
      collections: [...mockCollections],
      homeContent: [...mockHomeContent],
      users: [...mockUsers],
      orders: [...mockOrders]
    };
  }

  // Simuler une collection
  collection(name) {
    return {
      name,
      get: () => this.getDocs(name),
      add: (data) => this.addDoc(name, data),
      doc: (id) => this.doc(name, id)
    };
  }

  // Simuler un document
  doc(collectionName, docId) {
    return {
      get: () => this.getDoc(collectionName, docId),
      set: (data) => this.setDoc(collectionName, docId, data),
      update: (data) => this.updateDoc(collectionName, docId, data)
    };
  }

  // Obtenir tous les documents d'une collection
  async getDocs(collectionName, queryOptions = {}) {
    await this.delay(300);
    
    let data = [...(this.collections[collectionName] || [])];
    
    // Appliquer les filtres
    if (queryOptions.where) {
      queryOptions.where.forEach(([field, operator, value]) => {
        data = data.filter(doc => {
          switch (operator) {
            case '==': return doc[field] === value;
            case '!=': return doc[field] !== value;
            case '>': return doc[field] > value;
            case '>=': return doc[field] >= value;
            case '<': return doc[field] < value;
            case '<=': return doc[field] <= value;
            default: return true;
          }
        });
      });
    }

    // Appliquer le tri
    if (queryOptions.orderBy) {
      queryOptions.orderBy.forEach(([field, direction]) => {
        data.sort((a, b) => {
          const aVal = a[field];
          const bVal = b[field];
          const result = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
          return direction === 'desc' ? -result : result;
        });
      });
    }

    // Appliquer la limite
    if (queryOptions.limit) {
      data = data.slice(0, queryOptions.limit);
    }

    return {
      docs: data.map(doc => ({
        id: doc.id,
        data: () => doc,
        exists: () => true
      })),
      empty: data.length === 0,
      size: data.length
    };
  }

  // Obtenir un document spécifique
  async getDoc(collectionName, docId) {
    await this.delay(200);
    
    const collection = this.collections[collectionName] || [];
    const doc = collection.find(d => d.id === docId);
    
    if (doc) {
      return {
        id: doc.id,
        data: () => doc,
        exists: () => true
      };
    } else {
      return {
        id: docId,
        data: () => undefined,
        exists: () => false
      };
    }
  }

  // Ajouter un document
  async addDoc(collectionName, data) {
    await this.delay(300);
    
    const newDoc = {
      id: 'doc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      ...data,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (!this.collections[collectionName]) {
      this.collections[collectionName] = [];
    }

    this.collections[collectionName].push(newDoc);
    
    return {
      id: newDoc.id
    };
  }

  // Définir un document
  async setDoc(collectionName, docId, data) {
    await this.delay(300);
    
    if (!this.collections[collectionName]) {
      this.collections[collectionName] = [];
    }

    const collection = this.collections[collectionName];
    const existingIndex = collection.findIndex(d => d.id === docId);
    
    const docData = {
      id: docId,
      ...data,
      updatedAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      collection[existingIndex] = docData;
    } else {
      collection.push(docData);
    }
  }

  // Mettre à jour un document
  async updateDoc(collectionName, docId, updates) {
    await this.delay(300);
    
    const collection = this.collections[collectionName] || [];
    const existingIndex = collection.findIndex(d => d.id === docId);
    
    if (existingIndex >= 0) {
      collection[existingIndex] = {
        ...collection[existingIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };
    } else {
      throw new Error('Document not found');
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ========================================
// 📋 ORDER SERVICE
// ========================================

class MockOrderService {
  constructor() {
    this.orders = [...mockOrders];
  }

  async getUserOrders(userId) {
    await this.delay(300);
    return this.orders.filter(order => order.userId === userId);
  }

  async getOrderById(orderId) {
    await this.delay(200);
    return this.orders.find(order => order.id === orderId);
  }

  async createOrder(orderData) {
    await this.delay(500);
    
    const newOrder = {
      id: 'order_' + Date.now(),
      ...orderData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.orders.push(newOrder);
    return newOrder;
  }

  async updateOrderStatus(orderId, status) {
    await this.delay(300);
    
    const orderIndex = this.orders.findIndex(order => order.id === orderId);
    if (orderIndex >= 0) {
      this.orders[orderIndex] = {
        ...this.orders[orderIndex],
        status,
        updatedAt: new Date().toISOString()
      };
      return this.orders[orderIndex];
    }
    throw new Error('Order not found');
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ========================================
// 🚀 INSTANCES GLOBALES
// ========================================

export const mockAuth = new MockAuthService();
export const mockFirestore = new MockFirestoreService();
export const AuthService = mockAuth;
export const OrderService = new MockOrderService();

// ========================================
// 📦 FONCTIONS UTILITAIRES COMPATIBLES FIREBASE
// ========================================

// Simuler les fonctions Firebase
export const createUserWithEmailAndPassword = (auth, email, password) => 
  mockAuth.createUserWithEmailAndPassword(email, password);

export const signInWithEmailAndPassword = (auth, email, password) => 
  mockAuth.signInWithEmailAndPassword(email, password);

export const signOut = (auth) => mockAuth.signOut();

export const sendPasswordResetEmail = (auth, email) => 
  mockAuth.sendPasswordResetEmail(email);

export const onAuthStateChanged = (auth, callback) => 
  mockAuth.onAuthStateChanged(callback);

// Mock Firestore functions
export const collection = (firestore, name) => mockFirestore.collection(name);
export const doc = (firestore, collectionName, docId) => mockFirestore.doc(collectionName, docId);
export const getDoc = (docRef) => mockFirestore.getDoc(docRef.collection, docRef.docId);
export const getDocs = (queryRef) => mockFirestore.getDocs(queryRef.collectionName, queryRef.options);
export const addDoc = (collectionRef, data) => mockFirestore.addDoc(collectionRef.name, data);
export const setDoc = (docRef, data) => mockFirestore.setDoc(docRef.collection, docRef.docId, data);
export const updateDoc = (docRef, data) => mockFirestore.updateDoc(docRef.collection, docRef.docId, data);

// Mock query functions
export const query = (collectionRef, ...constraints) => ({
  collectionName: collectionRef.name,
  options: parseQueryConstraints(constraints)
});

export const where = (field, operator, value) => ({ type: 'where', field, operator, value });
export const orderBy = (field, direction = 'asc') => ({ type: 'orderBy', field, direction });
export const limit = (count) => ({ type: 'limit', count });
export const startAfter = (doc) => ({ type: 'startAfter', doc });

function parseQueryConstraints(constraints) {
  const options = {};
  
  constraints.forEach(constraint => {
    switch (constraint.type) {
      case 'where':
        if (!options.where) options.where = [];
        options.where.push([constraint.field, constraint.operator, constraint.value]);
        break;
      case 'orderBy':
        if (!options.orderBy) options.orderBy = [];
        options.orderBy.push([constraint.field, constraint.direction]);
        break;
      case 'limit':
        options.limit = constraint.count;
        break;
      default:
        break;
    }
  });
  
  return options;
}

// Mock serverTimestamp
export const serverTimestamp = () => new Date().toISOString();

// Mock onSnapshot (temps réel)
export const onSnapshot = (queryRef, callback, errorCallback) => {
  // Simuler les mises à jour en temps réel
  const interval = setInterval(() => {
    mockFirestore.getDocs(queryRef.collectionName, queryRef.options)
      .then(snapshot => callback(snapshot))
      .catch(error => errorCallback && errorCallback(error));
  }, 5000);

  // Appeler immédiatement
  mockFirestore.getDocs(queryRef.collectionName, queryRef.options)
    .then(snapshot => callback(snapshot))
    .catch(error => errorCallback && errorCallback(error));

  // Retourner fonction de nettoyage
  return () => clearInterval(interval);
};

console.log('🔧 Services Mock Firebase initialisés avec succès');
