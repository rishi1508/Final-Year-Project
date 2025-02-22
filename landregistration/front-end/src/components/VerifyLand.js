import React, { useState } from 'react';
import web3 from '../web3';
import LandRegistry from '../contracts/LandRegistry.json';

const VerifyLand = () => {
  const [landId, setLandId] = useState('');
  const [landDetails, setLandDetails] = useState(null);

  const verifyLand = async (event) => {
    event.preventDefault();

    const contract = new web3.eth.Contract(LandRegistry.abi, '0x577893A395a731aa549fa54Ac2146229312C6848');

    const details = await contract.methods.verifyLand(landId).call();

    setLandDetails(details);
  };

  return (
    <div>
      <h2>Verify Land</h2>
      <form onSubmit={verifyLand}>
        <div>
          <label>Land ID:</label>
          <input type="text" value={landId} onChange={(e) => setLandId(e.target.value)} />
        </div>
        <button type="submit">Verify</button>
      </form>
      {landDetails && (
        <div>
          <h3>Land Details</h3>
          <p>Location: {landDetails.location}</p>
          <p>Area: {landDetails.area}</p>
          <p>Owner: {landDetails.owner}</p>
        </div>
      )}
    </div>
  );
};

export default VerifyLand;