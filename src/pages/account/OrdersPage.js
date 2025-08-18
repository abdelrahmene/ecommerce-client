import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { OrderService } from '../../services/mockServices';
import './OrdersPage.css';

const OrdersPage = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadOrders = async () => {
      if (!currentUser) {
        setError('Utilisateur non connecté');
        setLoading(false);
        return;
      }

      try {
        const userOrders = await OrderService.getUserOrders(currentUser.uid);
        setOrders(userOrders);
      } catch (err) {
        setError('Erreur lors du chargement des commandes');
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [currentUser]);

  if (loading) return <div className="loading">Chargement...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="orders-page">
      <h1>Mes Commandes</h1>
      
      {orders.length === 0 ? (
        <div className="no-orders">
          <p>Vous n'avez pas encore passé de commande.</p>
          <Link to="/" className="shop-link">
            Découvrir nos produits
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <h3>Commande #{order.id}</h3>
                <span className={`status ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </div>
              
              <div className="order-details">
                <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                <p>Total: {order.total}€</p>
                <p>Articles: {order.items?.length || 0}</p>
              </div>

              <div className="order-preview">
                {order.items?.slice(0, 3).map((item, index) => (
                  <img 
                    key={index} 
                    src={item.image} 
                    alt={item.name}
                    className="item-thumbnail"
                  />
                ))}
                {order.items?.length > 3 && (
                  <span className="more-items">+{order.items.length - 3}</span>
                )}
              </div>

              <Link 
                to={`/account/orders/${order.id}`} 
                className="view-details-btn"
              >
                Voir les détails
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;