import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { OrderService } from '../../services/mockServices';
import './AccountPage.css';

const AccountPage = () => {
  const { currentUser, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      if (currentUser) {
        try {
          const userOrders = await OrderService.getUserOrders(currentUser.uid);
          setOrders(userOrders);
        } catch (error) {
          console.error('Erreur lors du chargement des commandes:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadOrders();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  if (!currentUser) {
    return <div>Veuillez vous connecter</div>;
  }

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="account-page">
      <h1>Mon Compte</h1>
      
      <div className="account-info">
        <h2>Informations personnelles</h2>
        <p>Email: {currentUser.email}</p>
        <p>Nom: {currentUser.displayName || 'Non renseigné'}</p>
      </div>

      <div className="account-orders">
        <h2>Mes Commandes</h2>
        {orders.length === 0 ? (
          <p>Aucune commande trouvée</p>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order.id} className="order-item">
                <p>Commande #{order.id}</p>
                <p>Date: {order.createdAt}</p>
                <p>Total: {order.total}€</p>
                <p>Status: {order.status}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <button onClick={handleLogout} className="logout-btn">
        Se déconnecter
      </button>
    </div>
  );
};

export default AccountPage;