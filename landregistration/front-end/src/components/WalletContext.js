import React, { createContext, useState, useEffect } from 'react';
import Web3 from 'web3';
import LandRegistry from '../contracts/LandRegistry.json';
import config from '../config';

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [networkError, setNetworkError] = useState('');
  
  console.log('WalletContext.js LOADED');

  useEffect(() => {
    const initWeb3 = async () => {
      if (!window.ethereum) {
        setNetworkError('Please install MetaMask to use this application.');
        console.error('MetaMask not detected');
        return;
      }

      try {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        
        // Check if we're on the correct network
        const networkId = await web3Instance.eth.net.getId();
        
        if (Number(networkId) !== config.NETWORK_ID) {
          setNetworkError(`Please switch to the ${config.NETWORK_NAME} testnet in MetaMask.`);
          console.error('Wrong network:', networkId);
          
          // Try to switch network automatically
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: Web3.utils.toHex(config.NETWORK_ID) }],
            });
          } catch (switchError) {
            // This error code indicates that the chain has not been added to MetaMask
            if (switchError.code === 4902) {
              console.log('Network needs to be added to MetaMask');
            }
          }
          return;
        }

        // Contract initialization
        const contractAddress = config.CONTRACT_ADDRESS;
        const landContract = new web3Instance.eth.Contract(LandRegistry.abi, contractAddress);
        setContract(landContract);
        
        // Check if already connected
        const accounts = await web3Instance.eth.getAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
          setNetworkError('');
        }
      } catch (error) {
        console.error('Error in initWeb3:', error);
        setNetworkError('Failed to initialize: ' + error.message);
      }
    };

    initWeb3();

    // Event listeners for MetaMask
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        setAccount(accounts[0] || '');
        setIsConnected(!!accounts[0]);
        console.log('Accounts changed:', accounts);
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      setNetworkError('Please install MetaMask.');
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      setAccount(accounts[0]);
      setIsConnected(true);
      setNetworkError('');
      
      console.log('Connected account:', accounts[0]);
    } catch (error) {
      console.error('Connect error:', error);
      setNetworkError('Connect failed: ' + error.message);
    }
  };

  return (
    <WalletContext.Provider value={{ 
      isConnected, 
      web3, 
      contract, 
      account, 
      connectWallet,
      networkError
    }}>
      {children}
    </WalletContext.Provider>
  );
};