import React, { useState, useEffect, useContext, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles.css';
import Navbar from './Navbar';
import Footer from './Footer';
import { WalletContext } from './WalletContext';

const ManageLandPage = () => {
  const { isConnected, contract, account, connectWallet } = useContext(WalletContext);
  const [plotNumber, setPlotNumber] = useState('');
  const [area, setArea] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [areaSqYd, setAreaSqYd] = useState('');
  const [landIdToVerify, setLandIdToVerify] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [verificationError, setVerificationError] = useState('');
  const [userLands, setUserLands] = useState([]);
  const [landsForSale, setLandsForSale] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [activeSection, setActiveSection] = useState(null);

  const fetchUserLands = useCallback(async (userAccount) => {
    if (!contract || !userAccount) return;
    try {
      const landIds = await contract.methods.getLandsByOwner(userAccount).call();
      const lands = await Promise.all(
        landIds.map(async (id) => {
          const land = await contract.methods.lands(id).call();
          return {
            id,
            plotNumber: land.plotNumber,
            area: land.area,
            district: land.district,
            city: land.city,
            state: land.state,
            areaSqYd: land.areaSqYd,
            owner: land.owner,
            isForSale: land.isForSale,
          };
        })
      );
      setUserLands(lands);
    } catch (error) {
      console.error('Error fetching user lands:', error);
    }
  }, [contract]);

  const fetchLandsForSale = useCallback(async () => {
    if (!contract) return;
    try {
      const totalLands = await contract.methods.landCount().call();
      const lands = [];
      for (let i = 1; i <= totalLands; i++) {
        const land = await contract.methods.lands(i).call();
        if (land.isForSale) {
          lands.push({
            id: i,
            plotNumber: land.plotNumber,
            area: land.area,
            district: land.district,
            city: land.city,
            state: land.state,
            areaSqYd: land.areaSqYd,
            owner: land.owner,
          });
        }
      }
      setLandsForSale(lands);
    } catch (error) {
      console.error('Error fetching lands for sale:', error);
    }
  }, [contract]);

  const fetchPendingRequests = useCallback(async (userAccount) => {
    if (!contract || !userAccount) return;
    try {
      const pendingIds = await contract.methods.getPendingTransferRequests(userAccount).call();
      const requests = await Promise.all(
        pendingIds.map(async (id) => {
          const land = await contract.methods.lands(id).call();
          return {
            id,
            plotNumber: land.plotNumber,
            area: land.area,
            district: land.district,
            city: land.city,
            state: land.state,
            areaSqYd: land.areaSqYd,
            owner: land.owner,
            requester: land.transferRequest,
          };
        })
      );
      setPendingRequests(requests);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
    }
  }, [contract]);

  useEffect(() => {
    if (isConnected && account) {
      fetchUserLands(account);
      fetchLandsForSale();
      fetchPendingRequests(account);
    }
  }, [isConnected, account, contract, fetchUserLands, fetchLandsForSale, fetchPendingRequests]);

  const registerLand = async () => {
    console.log('registerLand called');
    console.log('Contract:', !!contract);
    console.log('Account:', account);
    console.log('Land details:', { plotNumber, area, district, city, state, areaSqYd });
  
    if (!contract) {
      console.log('Contract not initialized');
      alert('Contract not initialized. Please ensure the wallet is connected and the app is loaded correctly.');
      return;
    }
    if (!account) {
      console.log('No account connected');
      alert('No wallet connected. Please connect your wallet.');
      return;
    }
    if (!plotNumber || !area || !district || !city || !state || !areaSqYd) {
      console.log('Missing required fields');
      alert('Please fill in all land details.');
      return;
    }
  
    try {
      console.log('Sending transaction to register land...');
      const tx = await contract.methods
        .registerLand(plotNumber, area, district, city, state, areaSqYd)
        .send({ from: account, gas: 3000000 });
      console.log('Transaction successful:', tx.transactionHash);
      alert('Land registered successfully!');
      setPlotNumber('');
      setArea('');
      setDistrict('');
      setCity('');
      setState('');
      setAreaSqYd('');
      fetchUserLands(account);
      setActiveSection(null);
    } catch (error) {
      console.error('Error registering land:', error);
      alert('Failed to register land: ' + (error.message || 'Unknown error'));
    }
  };

  const putLandForSale = async (landId) => {
    if (!contract || !account || !landId) return;
    try {
      await contract.methods.putLandForSale(landId).send({ from: account });
      alert(`Land ID ${landId} marked for sale!`);
      fetchUserLands(account);
      fetchLandsForSale();
      fetchPendingRequests(account);
    } catch (error) {
      console.error('Error putting land for sale:', error);
      alert('Failed to mark land for sale.');
    }
  };

  const requestTransfer = async (landId) => {
    if (!contract || !account || !landId) return;
    try {
      await contract.methods.requestTransfer(landId).send({ from: account });
      alert(`Transfer request submitted for Land ID ${landId}!`);
      fetchLandsForSale();
      fetchPendingRequests(account);
    } catch (error) {
      console.error('Error requesting transfer:', error);
      alert('Failed to request transfer.');
    }
  };

  const approveTransfer = async (landId) => {
    if (!contract || !account || !landId) return;
    try {
      await contract.methods.approveTransfer(landId).send({ from: account });
      alert(`Transfer approved for Land ID ${landId}!`);
      fetchUserLands(account);
      fetchLandsForSale();
      fetchPendingRequests(account);
    } catch (error) {
      console.error('Error approving transfer:', error);
      alert('Failed to approve transfer.');
    }
  };

  const denyTransfer = async (landId) => {
    if (!contract || !account || !landId) return;
    try {
      await contract.methods.denyTransfer(landId).send({ from: account });
      alert(`Transfer denied for Land ID ${landId}!`);
      fetchPendingRequests(account);
      fetchLandsForSale();
    } catch (error) {
      console.error('Error denying transfer:', error);
      alert('Failed to deny transfer.');
    }
  };

  const verifyLand = async () => {
    if (!contract || !landIdToVerify) return;
    try {
      const result = await contract.methods.verifyLand(landIdToVerify).call();
      if (result[6] === '0x0000000000000000000000000000000000000000') {
        setVerificationError('The given Land ID is not associated with any registered land in the records.');
        setVerificationResult(null);
      } else {
        setVerificationResult({
          plotNumber: result[0],
          area: result[1],
          district: result[2],
          city: result[3],
          state: result[4],
          areaSqYd: result[5],
          owner: result[6],
        });
        setVerificationError('');
      }
    } catch (error) {
      console.error('Error verifying land:', error);
      setVerificationError('Failed to verify land. Please check the Land ID.');
      setVerificationResult(null);
    }
  };

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
    setVerificationResult(null);
    setVerificationError('');
  };

  return (
    <div>
      <Navbar />
      <div className="container my-5 pt-5">
        <h1 className="text-center mb-4">Manage Land</h1>
        {!isConnected ? (
          <div className="text-center">
            <button
              onClick={connectWallet}
              className="btn btn-primary btn-lg"
              aria-label="Connect to Ethereum Wallet"
            >
              Connect to Ethereum Wallet
            </button>
          </div>
        ) : (
          <div>
            {/* Action Buttons */}
            <div className="d-flex flex-wrap justify-content-center gap-3 mb-4">
              <button className="btn btn-primary" onClick={() => toggleSection('register')}>
                Register Land
              </button>
              <button className="btn btn-primary" onClick={() => toggleSection('verify')}>
                Verify Land Ownership
              </button>
              <button className="btn btn-primary" onClick={() => toggleSection('show')}>
                Show Lands
              </button>
              <button className="btn btn-primary" onClick={() => toggleSection('explore')}>
                Explore Lands
              </button>
              <button className="btn btn-primary" onClick={() => toggleSection('approve')}>
                Approve Transfer
              </button>
            </div>

            {/* Register Land Section */}
            {activeSection === 'register' && (
              <div className="row justify-content-center">
                <div className="col-md-6 mb-4">
                  <h4>Register Land</h4>
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Plot Number"
                    value={plotNumber}
                    onChange={(e) => setPlotNumber(e.target.value)}
                  />
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Area"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                  />
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="District"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                  />
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="State"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  />
                  <input
                    type="number"
                    className="form-control mb-2"
                    placeholder="Area (sq. yd)"
                    value={areaSqYd}
                    onChange={(e) => setAreaSqYd(e.target.value)}
                  />
                  <button className="btn btn-primary w-100" onClick={registerLand}>
                    Register Land
                  </button>
                </div>
              </div>
            )}

            {/* Verify Land Section */}
            {activeSection === 'verify' && (
              <div className="row justify-content-center">
                <div className="col-md-6 mb-4">
                  <h4>Verify Land Ownership</h4>
                  <input
                    type="number"
                    className="form-control mb-2"
                    placeholder="Land ID"
                    value={landIdToVerify}
                    onChange={(e) => setLandIdToVerify(e.target.value)}
                  />
                  <button className="btn btn-primary w-100" onClick={verifyLand}>
                    Verify Land
                  </button>
                  {verificationResult && (
                    <div className="mt-2">
                      <p>Land ID: {landIdToVerify}</p>
                      <p>Plot Number: {verificationResult.plotNumber}</p>
                      <p>Area: {verificationResult.area}</p>
                      <p>District: {verificationResult.district}</p>
                      <p>City: {verificationResult.city}</p>
                      <p>State: {verificationResult.state}</p>
                      <p>Area (sq. yd): {verificationResult.areaSqYd}</p>
                      <p>Owner: {verificationResult.owner}</p>
                    </div>
                  )}
                  {verificationError && (
                    <p className="text-danger mt-2">{verificationError}</p>
                  )}
                </div>
              </div>
            )}

            {/* Show Lands Section */}
            {activeSection === 'show' && (
              <div className="mb-4">
                <h4>Show Lands</h4>
                {userLands.length > 0 ? (
                  <div className="row">
                    {userLands.map((land) => (
                      <div key={land.id} className="col-md-4 mb-3">
                        <div className="card h-100">
                          <div className="card-body">
                            <h5 className="card-title">Land ID: {land.id}</h5>
                            <p className="card-text">Plot Number: {land.plotNumber}</p>
                            <p className="card-text">Area: {land.area}</p>
                            <p className="card-text">District: {land.district}</p>
                            <p className="card-text">City: {land.city}</p>
                            <p className="card-text">State: {land.state}</p>
                            <p className="card-text">Area (sq. yd): {land.areaSqYd}</p>
                            <p className="card-text">Owner: {land.owner}</p>
                            <p className="card-text">For Sale: {land.isForSale ? 'Yes' : 'No'}</p>
                            {!land.isForSale && (
                              <button
                                className="btn btn-primary w-100"
                                onClick={() => putLandForSale(land.id)}
                              >
                                Put for Sale
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center">No lands owned by this account.</p>
                )}
              </div>
            )}

            {/* Explore Lands Section */}
            {activeSection === 'explore' && (
              <div className="mb-4">
                <h4>Explore Lands for Sale</h4>
                {landsForSale.length > 0 ? (
                  <div className="row">
                    {landsForSale.map((land) => (
                      <div key={land.id} className="col-md-4 mb-3">
                        <div className="card h-100">
                          <div className="card-body">
                            <h5 className="card-title">Land ID: {land.id}</h5>
                            <p className="card-text">Plot Number: {land.plotNumber}</p>
                            <p className="card-text">Area: {land.area}</p>
                            <p className="card-text">District: {land.district}</p>
                            <p className="card-text">City: {land.city}</p>
                            <p className="card-text">State: {land.state}</p>
                            <p className="card-text">Area (sq. yd): {land.areaSqYd}</p>
                            <p className="card-text">Owner: {land.owner}</p>
                            {land.owner !== account && (
                              <button
                                className="btn btn-primary w-100 mt-2"
                                onClick={() => requestTransfer(land.id)}
                              >
                                Request Transfer
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center">No lands available for sale.</p>
                )}
              </div>
            )}

            {/* Approve Transfer Section */}
            {activeSection === 'approve' && (
              <div className="mb-4">
                <h4>Approve Transfer Requests</h4>
                {pendingRequests.length > 0 ? (
                  <div className="row">
                    {pendingRequests.map((request) => (
                      <div key={request.id} className="col-md-4 mb-3">
                        <div className="card h-100">
                          <div className="card-body">
                            <h5 className="card-title">Land ID: {request.id}</h5>
                            <p className="card-text">Plot Number: {request.plotNumber}</p>
                            <p className="card-text">Area: {request.area}</p>
                            <p className="card-text">District: {request.district}</p>
                            <p className="card-text">City: {request.city}</p>
                            <p className="card-text">State: {request.state}</p>
                            <p className="card-text">Area (sq. yd): {request.areaSqYd}</p>
                            <p className="card-text">Owner: {request.owner}</p>
                            <p className="card-text">Requester: {request.requester}</p>
                            <div className="d-flex gap-2 mt-2">
                              <button
                                className="btn btn-success w-50"
                                onClick={() => approveTransfer(request.id)}
                              >
                                Approve
                              </button>
                              <button
                                className="btn btn-danger w-50"
                                onClick={() => denyTransfer(request.id)}
                              >
                                Deny
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center">No pending transfer requests.</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ManageLandPage;