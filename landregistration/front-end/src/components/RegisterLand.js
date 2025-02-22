import React, { useState } from 'react';
import web3 from '../web3';
import LandRegistry from '../contracts/LandRegistry.json';

const RegisterLand = () => {
  const [location, setLocation] = useState('');
  const [area, setArea] = useState('');
  const [message, setMessage] = useState('');

  const registerLand = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();
    const contract = new web3.eth.Contract(LandRegistry.abi, '0x577893A395a731aa549fa54Ac2146229312C6848');

    setMessage('Registering land...');

    await contract.methods.registerLand(location, area).send({ from: accounts[0] });

    setMessage('Land registered successfully!');
  };

  return (
    <div>
      <h2>Register Land</h2>
      <form onSubmit={registerLand}>
        <div>
          <label>Location:</label>
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>
        <div>
          <label>Area:</label>
          <input type="text" value={area} onChange={(e) => setArea(e.target.value)} />
        </div>
        <button type="submit">Register</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default RegisterLand;