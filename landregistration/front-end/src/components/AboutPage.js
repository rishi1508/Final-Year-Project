import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles.css';
import Navbar from './Navbar'; // Import Navbar component
import About from './About';
import Footer from './Footer';

const AboutPage = () => {
  return (
    <div>
      {/* Navbar */}
      <Navbar />

      {/* About Content */}
      <About />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AboutPage;