import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// Layout
import MainLayout from './components/layout/MainLayout';

// Contexts
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { WishlistProvider } from './contexts/WishlistContext';

// Pages
import HomePage from './pages/home/HomePage';
import WomenPage from './pages/women/WomenPage';
import KidsPage from './pages/kids/KidsPage';
import MenPage from './pages/Men/MenPage';
import NewPage from './pages/New/NewPage';
import ProductPage from './pages/product/ProductPage';
import CollectionsPage from './pages/collections/CollectionsPage';
import CollectionPage from './pages/collections/CollectionPage';
import CartPage from './pages/cart/CartPage';
import CheckoutPage from './pages/checkout/CheckoutPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import AccountPage from './pages/account/AccountPage';
import OrdersPage from './pages/account/OrdersPage';
import OrderDetailPage from './pages/account/OrderDetailPage';
import WishlistPage from './pages/account/WishlistPage';
import AboutPage from './pages/about/AboutPage';
import ContactPage from './pages/contact/ContactPage';
import NotFoundPage from './pages/NotFoundPage';
// import TestSection from './pages/TestSection';

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <ThemeProvider>
                <Routes>
                <Route path="/" element={<MainLayout />}>
                  {/* Public routes */}
                  <Route index element={<HomePage />} />
                  {/* <Route path="test" element={<TestSection />} /> */}
                  <Route path="product/:id" element={<ProductPage />} />
                  <Route path="men" element={<MenPage />} />
                  <Route path="women" element={<WomenPage />} />
                  <Route path="kids" element={<KidsPage />} />
                  <Route path="new" element={<NewPage />} />
                  <Route path="product/:productId" element={<ProductPage />} />
                  <Route path="collections" element={<CollectionsPage />} />
                  <Route path="collection/:collectionId" element={<CollectionPage />} />
                  <Route path="cart" element={<CartPage />} />
                  <Route path="checkout" element={<CheckoutPage />} />
                  <Route path="login" element={<LoginPage />} />
                  <Route path="register" element={<RegisterPage />} />
                  <Route path="forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="about" element={<AboutPage />} />
                  <Route path="contact" element={<ContactPage />} />
                  
                  {/* Account routes */}
                  <Route path="account" element={<AccountPage />} />
                  <Route path="account/orders" element={<OrdersPage />} />
                  <Route path="account/orders/:orderId" element={<OrderDetailPage />} />
                  <Route path="account/wishlist" element={<WishlistPage />} />
                  
                  {/* Test route */}
                  {/* <Route path="test-section" element={<TestSection />} /> */}
                  
                  {/* 404 and redirects */}
                  <Route path="404" element={<NotFoundPage />} />
                  <Route path="*" element={<Navigate to="/404" replace />} />
                </Route>
              </Routes>
                </ThemeProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;