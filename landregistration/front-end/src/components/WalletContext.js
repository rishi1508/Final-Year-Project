import React, { createContext, useState, useEffect } from 'react';
import Web3 from 'web3';
import LandRegistry from '../contracts/LandRegistry.json';

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        const networkId = await web3Instance.eth.net.getId();
        const deployedNetwork = LandRegistry.networks[networkId];
        const contractAddress = deployedNetwork && deployedNetwork.address;

        if (contractAddress) {
          const landContract = new web3Instance.eth.Contract(LandRegistry.abi, contractAddress);
          setContract(landContract);

          // Check if already connected
          const accounts = await web3Instance.eth.getAccounts();
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setIsConnected(true);
          }
        }
      }
    };

    initWeb3();

    // Handle account/network changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        setAccount(accounts[0] || '');
        setIsConnected(!!accounts[0]);
      });
      window.ethereum.on('chainChanged', () => window.location.reload());
    }
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        setIsConnected(true);
      } catch (error) {
        console.error('Connection error:', error);
        alert('Failed to connect to MetaMask. Please try again.');
      }
    } else {
      alert('Please install MetaMask to use this feature.');
    }
  };

  return (
    <WalletContext.Provider value={{ isConnected, web3, contract, account, connectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};