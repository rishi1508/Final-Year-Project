import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { WalletProvider } from './components/WalletContext';
import LandingPage from './components/LandingPage';
import AboutPage from './components/AboutPage';
import FeaturesPage from './components/FeaturesPage';
import ContactPage from './components/ContactPage';
import ManageLandPage from './components/ManageLandPage';
import AdminPanel from './components/AdminPanel';

function App() {
  return (
    <WalletProvider>
      <Router basename="/Final-Year-Project">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/manage-land" element={<ManageLandPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </Router>
    </WalletProvider>
  );
}

export default App;