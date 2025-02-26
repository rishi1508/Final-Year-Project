import React, { useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles.css';
import backgroundImage from '../assets/background-image.png';
import Navbar from './Navbar';
import About from './About';
import Features from './Features';
import Footer from './Footer';
import { WalletContext } from './WalletContext';

const LandingPage = () => {
  const { isConnected, connectWallet } = useContext(WalletContext);

  return (
    <div>
      <Navbar />
      <div
        className="hero min-vh-100 d-flex flex-column justify-content-center align-items-center text-center text-white"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="banner">
          <h1 className="display-4">Land Registry on Blockchain</h1>
          <p className="lead">Secure and transparent land ownership records</p>
          <button
            onClick={connectWallet}
            className="btn btn-primary btn-lg mt-3"
            disabled={isConnected}
            aria-label={isConnected ? 'Wallet Connected' : 'Connect to Ethereum Wallet'}
          >
            {isConnected ? 'Connected' : 'Connect to Ethereum Wallet'}
          </button>
        </div>
      </div>
      <About />
      <Features />
      <Footer />
    </div>
  );
};

export default LandingPage;