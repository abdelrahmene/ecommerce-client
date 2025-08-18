import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { OrderService } from '../../services/mockServices';
import './OrderDetailPage.css';

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const { currentUser } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadOrder = async () => {
      if (!currentUser) {
        setError('Utilisateur non connecté');
        setLoading(false);
        return;
      }

      try {
        const orderData = await OrderService.getOrder(orderId);
        if (orderData.userId !== currentUser.uid) {
          setError('Accès non autorisé à cette commande');
        } else {
          setOrder(orderData);
        }
      } catch (err) {
        setError('Erreur lors du chargement de la commande');
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId, currentUser]);

  if (loading) return <div className="loading">Chargement...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!order) return <div className="error">Commande non trouvée</div>;

  return (
    <div className="order-detail-page">
      <h1>Détail de la commande #{order.id}</h1>
      
      <div className="order-info">
        <div className="order-status">
          <h2>Statut: {order.status}</h2>
          <p>Date de commande: {new Date(order.createdAt).toLocaleDateString()}</p>
        </div>

        <div className="shipping-info">
          <h3>Adresse de livraison</h3>
          <p>{order.shippingAddress?.name}</p>
          <p>{order.shippingAddress?.address}</p>
          <p>{order.shippingAddress?.city}, {order.shippingAddress?.wilaya}</p>
          <p>{order.shippingAddress?.phone}</p>
        </div>

        <div className="order-items">
          <h3>Articles commandés</h3>
          {order.items?.map((item, index) => (
            <div key={index} className="order-item">
              <img src={item.image} alt={item.name} />
              <div className="item-details">
                <h4>{item.name}</h4>
                <p>Taille: {item.size}</p>
                <p>Quantité: {item.quantity}</p>
                <p>Prix: {item.price}€</p>
              </div>
            </div>
          ))}
        </div>

        <div className="order-total">
          <h3>Total: {order.total}€</h3>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;