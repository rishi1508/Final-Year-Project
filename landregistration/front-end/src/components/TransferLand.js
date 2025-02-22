import React, { useState } from 'react';
import web3 from '../web3';
import LandRegistry from '../contracts/LandRegistry.json';

const TransferLand = () => {
  const [landId, setLandId] = useState('');
  const [to, setTo] = useState('');
  const [message, setMessage] = useState('');

  const transferLand = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();
    const contract = new web3.eth.Contract(LandRegistry.abi, '0x577893A395a731aa549fa54Ac2146229312C6848');

    setMessage('Transferring land...');

    await contract.methods.transferLand(landId, to).send({ from: accounts[0] });

    setMessage('Land transferred successfully!');
  };

  return (
    <div>
      <h2>Transfer Land</h2>
      <form onSubmit={transferLand}>
        <div>
          <label>Land ID:</label>
          <input type="text" value={landId} onChange={(e) => setLandId(e.target.value)} />
        </div>
        <div>
          <label>To Address:</label>
          <input type="text" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
        <button type="submit">Transfer</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default TransferLand;