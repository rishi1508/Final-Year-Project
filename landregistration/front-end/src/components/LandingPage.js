import React, { useState } from 'react';
import Web3 from 'web3';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles.css';
import backgroundImage from '../assets/background-image.png';
import Navbar from './Navbar'; 
import About from './About';
import Features from './Features';
import Footer from './Footer';

const LandingPage = () => {
  const [isConnected, setIsConnected] = useState(false);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        setIsConnected(true);
        console.log('Connected to MetaMask');
      } catch (error) {
        console.error('Connection error:', error);
        alert('Failed to connect to MetaMask. Please try again.');
      }
    } else {
      alert('Please install MetaMask to use this feature.');
    }
  };

  return (
    <div>
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
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

      {/* About Us Section */}
      <About />

      {/* Features Section */}
      <Features />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;