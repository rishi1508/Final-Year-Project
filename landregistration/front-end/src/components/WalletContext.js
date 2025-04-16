import React, { createContext, useState, useEffect } from 'react';
import Web3 from 'web3';
import LandRegistry from '../contracts/LandRegistry.json';
import config from '../config';

// Account names mapping - this is now moved to WalletContext for central management
const accountNames = {
  "0x7F585D7A9751a7388909Ed940E29732306A98f0c": "Admin",
  "0x9Fa8A01E6005607B3BCbaEB2c0f4c39a73A9AFbE": "User 1",
  "0xA8dCae3255147e26250F4b38f8dFfe3705F39F7a": "User 2",
};

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [accountName, setAccountName] = useState('');
  const [networkError, setNetworkError] = useState('');
  
  console.log('WalletContext.js LOADED');

  // Update account name whenever the account changes
  useEffect(() => {
    if (account) {
      setAccountName(accountNames[account] || config.shortenAddress(account));
    } else {
      setAccountName('');
    }
  }, [account]);

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

        // Fallback: Reload the page to ensure account name updates
        if (accounts[0]) {
          window.location.reload();
        }
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

  // Add a helper function to get name for any account
  const getAccountName = (addr) => {
    return accountNames[addr] || config.shortenAddress(addr);
  };

  return (
    <WalletContext.Provider value={{ 
      isConnected, 
      web3, 
      contract, 
      account,
      accountName,
      connectWallet,
      networkError,
      getAccountName,
      accountNames
    }}>
      {children}
    </WalletContext.Provider>
  );
};