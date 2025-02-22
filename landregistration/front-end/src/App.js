import React from 'react';
import RegisterLand from './components/RegisterLand';
import TransferLand from './components/TransferLand';
import VerifyLand from './components/VerifyLand';

const App = () => {
  return (
    <div>
      <h1>Land Registry System</h1>
      <RegisterLand />
      <TransferLand />
      <VerifyLand />
    </div>
  );
};

export default App;