import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles.css';
import Navbar from './Navbar';
import Features from './Features';
import Footer from './Footer';

const FeaturesPage = () => {
  return (
    <div>
      {/* Navbar */}
      <Navbar />

      {/* Features Content */}
      <Features />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default FeaturesPage;