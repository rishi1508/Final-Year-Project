import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import MigrationsContract from './contracts/Migrations.json';
import './App.css';

const App = () => {
  const [account, setAccount] = useState('');
  const [migrations, setMigrations] = useState(null);

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const accounts = await web3.eth.getAccounts();
          setAccount(accounts[0]);

          const networkId = await web3.eth.net.getId();
          const deployedNetwork = MigrationsContract.networks[networkId];
          if (deployedNetwork) {
            const instance = new web3.eth.Contract(
              MigrationsContract.abi,
              deployedNetwork.address
            );
            setMigrations(instance);
          } else {
            console.error('Migrations contract not deployed to detected network.');
          }
        } catch (error) {
          console.error("User denied account access or there was an error");
        }
      } else if (window.web3) {
        const web3 = window.web3;
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);

        const networkId = await web3.eth.net.getId();
        const deployedNetwork = MigrationsContract.networks[networkId];
        if (deployedNetwork) {
          const instance = new web3.eth.Contract(
            MigrationsContract.abi,
            deployedNetwork.address
          );
          setMigrations(instance);
        } else {
          console.error('Migrations contract not deployed to detected network.');
        }
      } else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
      }
    };

    initWeb3();
  }, []);

  if (!migrations) {
    return <div>Loading Web3, accounts, and contract...</div>;
  }

  return (
    <div className="App">
      <h1>Migrations Contract</h1>
      <div>Account: {account}</div>
      {/* Add components that interact with the Migrations contract */}
    </div>
  );
};

export default App;