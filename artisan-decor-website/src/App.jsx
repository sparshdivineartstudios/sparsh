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
import ScrollToTop from './components/ScrollToTop';
import CursorGlow from './components/CursorGlow';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

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
              <Route path="/favorites" element={<Favorites />} />
            </Routes>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
