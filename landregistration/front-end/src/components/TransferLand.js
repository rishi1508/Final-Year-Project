import React, { useState } from 'react';

const TransferLand = ({ landRegistry, account }) => {
  const [landId, setLandId] = useState('');
  const [newOwner, setNewOwner] = useState('');

  const transferLand = async (event) => {
    event.preventDefault();
    await landRegistry.methods.transferLand(landId, newOwner).send({ from: account });
    setLandId('');
    setNewOwner('');
  };

  return (
    <div>
      <h2>Transfer Land</h2>
      <form onSubmit={transferLand}>
        <input
          type="number"
          placeholder="Land ID"
          value={landId}
          onChange={(e) => setLandId(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="New Owner Address"
          value={newOwner}
          onChange={(e) => setNewOwner(e.target.value)}
          required
        />
        <button type="submit">Transfer</button>
      </form>
    </div>
  );
};

export default TransferLand;