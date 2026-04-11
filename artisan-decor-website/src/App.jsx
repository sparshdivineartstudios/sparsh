import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import SplashScreen from './components/SplashScreen';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Favorites from './pages/Favorites';
import AdminAddProduct from './pages/AdminAddProduct';
import AdminEditProduct from './pages/AdminEditProduct';
import ShippingPolicy from './pages/ShippingPolicy';
import CareInstructions from './pages/CareInstructions';
import ReturnsRefunds from './pages/ReturnsRefunds';
import Cart from './pages/Cart';
import CheckoutShipping from './pages/CheckoutShipping';
import CheckoutReview from './pages/CheckoutReview';
import CheckoutPayment from './pages/CheckoutPayment';
import OrderConfirmation from './pages/OrderConfirmation';
import OrderHistory from './pages/OrderHistory';
import OrderDetail from './pages/OrderDetail';
import Account from './pages/Account';
import Privacy from './pages/Privacy';
import NotFound from './pages/NotFound';
import ScrollToTop from './components/ScrollToTop';
import CursorGlow from './components/CursorGlow';
import PrivateRoute from './components/PrivateRoute';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

function App() {
  // Show splash only on first load per session
  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem('sparsh_visited');
  });

  const handleSplashDone = () => {
    sessionStorage.setItem('sparsh_visited', '1');
    setShowSplash(false);
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          {/* Splash — rendered outside router so it truly covers everything */}
          {showSplash && <SplashScreen onDone={handleSplashDone} />}

          <Router>
            <ScrollToTop />
            <CursorGlow />
            <div className="bg-stone-50 dark:bg-stone-950 min-h-screen text-stone-900 dark:text-stone-50 transition-colors duration-500 font-sans selection:bg-amber-600 selection:text-white relative z-10">
              <NavBar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/account" element={<PrivateRoute><Account /></PrivateRoute>} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/favorites" element={<PrivateRoute><Favorites /></PrivateRoute>} />
                <Route path="/shipping-policy" element={<ShippingPolicy />} />
                <Route path="/care-instructions" element={<CareInstructions />} />
                <Route path="/returns-refunds" element={<ReturnsRefunds />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout/shipping" element={<CheckoutShipping />} />
                <Route path="/checkout/review" element={<CheckoutReview />} />
                <Route path="/checkout/payment" element={<CheckoutPayment />} />
                <Route path="/order-confirmation" element={<OrderConfirmation />} />
                <Route path="/order-history" element={<OrderHistory />} />
                <Route path="/order/:orderId" element={<OrderDetail />} />
                <Route path="/admin/add" element={<PrivateRoute><AdminAddProduct /></PrivateRoute>} />
                <Route path="/admin/edit/:id" element={<PrivateRoute><AdminEditProduct /></PrivateRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Footer />
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
