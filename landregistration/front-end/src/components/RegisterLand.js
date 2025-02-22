import React, { useState } from 'react';

const RegisterLand = ({ landRegistry, account }) => {
  const [location, setLocation] = useState('');
  const [size, setSize] = useState('');

  const registerLand = async (event) => {
    event.preventDefault();
    await landRegistry.methods.registerLand(location, size).send({ from: account });
    setLocation('');
    setSize('');
  };

  return (
    <div>
      <h2>Register Land</h2>
      <form onSubmit={registerLand}>
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Size"
          value={size}
          onChange={(e) => setSize(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterLand;