import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { firestore as db } from '../services/firebase/firebase';

export const useCollections = () => {
  const [data, setData] = useState({ collections: [], products: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      // Collections query - tri par nom au lieu de 'order' qui n'existe peut-être pas
      const collectionsQuery = query(
        collection(db, 'collections'),
        orderBy('name', 'asc')
      );

      // Products query
      const productsQuery = query(
        collection(db, 'products'),
        orderBy('createdAt', 'desc')
      );

      // Subscribe to collections
      const unsubscribeCollections = onSnapshot(collectionsQuery, (snapshot) => {
        const collections = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setData(prev => ({ ...prev, collections }));
      });

      // Subscribe to products
      const unsubscribeProducts = onSnapshot(productsQuery, (snapshot) => {
        const products = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setData(prev => ({ ...prev, products }));
        setLoading(false);
      });

      // Cleanup subscriptions
      return () => {
        unsubscribeCollections();
        unsubscribeProducts();
      };
    } catch (err) {
      console.error('Error in useCollections:', err);
      setError(err);
      setLoading(false);
    }
  }, []);

  return { data, loading, error };
};