import React, { createContext, useState, useEffect } from 'react';
import Web3 from 'web3';
import LandRegistry from '../contracts/LandRegistry.json';

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');

  console.log('WalletContext.js LOADED - Version 3.1'); // Updated version

  useEffect(() => {
    console.log('useEffect triggered in WalletContext.js');
    const initWeb3 = async () => {
      if (!window.ethereum) {
        alert('Please install MetaMask.');
        console.error('MetaMask not detected');
        return;
      }

      console.log('Initializing Web3...');
      try {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        console.log('Web3 set:', !!web3Instance);

        const networkId = await web3Instance.eth.net.getId();
        console.log('Network ID:', networkId);
        // Fix: Check if network IS Sepolia (11155111)
        if (Number(networkId) !== 11155111) { // Convert BigInt to Number for comparison
          alert('Please switch to the Sepolia testnet in MetaMask.');
          console.error('Wrong network:', networkId);
          return;
        }
        console.log('Network confirmed as Sepolia');

        const contractAddress = '0xE2B49B1a6fc0b97c64252Ca617779Ccb14a965bf';
        console.log('Contract address:', contractAddress);
        const landContract = new web3Instance.eth.Contract(LandRegistry.abi, contractAddress);
        setContract(landContract);
        console.log('Contract set:', !!landContract);

        const accounts = await web3Instance.eth.getAccounts();
        console.log('Initial accounts:', accounts);
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
        }
      } catch (error) {
        console.error('Error in initWeb3:', error);
        alert('Initialization error: ' + error.message);
      }
    };

    initWeb3();

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        setAccount(accounts[0] || '');
        setIsConnected(!!accounts[0]);
        console.log('Accounts changed:', accounts);
      });
      window.ethereum.on('chainChanged', () => window.location.reload());
    }
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask.');
      return;
    }
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      setIsConnected(true);
      console.log('Connected account:', accounts[0]);
    } catch (error) {
      console.error('Connect error:', error);
      alert('Connect failed: ' + error.message);
    }
  };

  return (
    <WalletContext.Provider value={{ isConnected, web3, contract, account, connectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};