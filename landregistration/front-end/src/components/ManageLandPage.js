import React, { useState, useEffect, useContext, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles.css';
import Navbar from './Navbar';
import Footer from './Footer';
import { WalletContext } from './WalletContext';
import LoadingSpinner from './LoadingSpinner';
import Tooltip from './Tooltip';
import ConfirmationDialog from './ConfirmationDialog';

const ManageLandPage = () => {
  const { isConnected, contract, account, connectWallet, getAccountName } = useContext(WalletContext);
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
  
  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState({
    show: false,
    title: '',
    message: '',
    onConfirm: () => {},
    onCancel: () => {},
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel'
  });
  
  // New state variables for improved UX
  const [isLoading, setIsLoading] = useState(false);
  const [sectionLoading, setSectionLoading] = useState({
    register: false,
    verify: false,
    show: false,
    explore: false,
    approve: false
  });
  const [formErrors, setFormErrors] = useState({});
  const [transactionStatus, setTransactionStatus] = useState(null);

  const fetchUserLands = useCallback(async (userAccount) => {
    if (!contract || !userAccount) return;
    try {
      setSectionLoading(prev => ({ ...prev, show: true }));
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
            owner: getAccountName(land.owner),
            isForSale: land.isForSale,
          };
        })
      );
      setUserLands(lands);
    } catch (error) {
      console.error('Error fetching user lands:', error);
      setTransactionStatus({
        type: 'error',
        message: 'Failed to fetch your lands: ' + (error.message || 'Unknown error')
      });
    } finally {
      setSectionLoading(prev => ({ ...prev, show: false }));
    }
  }, [contract, getAccountName]);

  const fetchLandsForSale = useCallback(async () => {
    if (!contract) return;
    try {
      setSectionLoading(prev => ({ ...prev, explore: true }));
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
            owner: getAccountName(land.owner),
          });
        }
      }
      setLandsForSale(lands);
    } catch (error) {
      console.error('Error fetching lands for sale:', error);
      setTransactionStatus({
        type: 'error',
        message: 'Failed to fetch lands for sale: ' + (error.message || 'Unknown error')
      });
    } finally {
      setSectionLoading(prev => ({ ...prev, explore: false }));
    }
  }, [contract, getAccountName]);

  const fetchPendingRequests = useCallback(async (userAccount) => {
    if (!contract || !userAccount) return;
    try {
      setSectionLoading(prev => ({ ...prev, approve: true }));
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
            owner: getAccountName(land.owner),
            requester: getAccountName(land.transferRequest),
          };
        })
      );
      setPendingRequests(requests);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
      setTransactionStatus({
        type: 'error',
        message: 'Failed to fetch pending requests: ' + (error.message || 'Unknown error')
      });
    } finally {
      setSectionLoading(prev => ({ ...prev, approve: false }));
    }
  }, [contract, getAccountName]);

  useEffect(() => {
    if (isConnected && account) {
      fetchUserLands(account);
      fetchLandsForSale();
      fetchPendingRequests(account);
    }
  }, [isConnected, account, contract, fetchUserLands, fetchLandsForSale, fetchPendingRequests]);

  const validateForm = () => {
    const errors = {};
    if (!plotNumber.trim()) errors.plotNumber = 'Plot number is required';
    if (!area.trim()) errors.area = 'Area is required';
    if (!district.trim()) errors.district = 'District is required';
    if (!city.trim()) errors.city = 'City is required';
    if (!state.trim()) errors.state = 'State is required';
    if (!areaSqYd || areaSqYd <= 0) errors.areaSqYd = 'Valid area in sq. yards is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handles the confirmation decision for land registration
  const handleRegisterLandConfirmation = () => {
    if (!validateForm()) return;

    setConfirmDialog({
      show: true,
      title: 'Confirm Land Registration',
      message: `Are you sure you want to register this land with the following details?
      \nPlot Number: ${plotNumber}
      \nArea: ${area}
      \nDistrict: ${district}
      \nCity: ${city}
      \nState: ${state}
      \nArea (sq. yd): ${areaSqYd}`,
      onConfirm: performRegisterLand,
      onCancel: () => setConfirmDialog({ ...confirmDialog, show: false }),
      confirmButtonText: 'Register',
      cancelButtonText: 'Cancel'
    });
  };

  // Actually performs the land registration
  const performRegisterLand = async () => {
    setConfirmDialog({ ...confirmDialog, show: false });

    if (!contract || !account) {
      setTransactionStatus({
        type: 'error',
        message: !contract 
          ? 'Contract not initialized. Please ensure the wallet is connected.'
          : 'No wallet connected. Please connect your wallet.'
      });
      return;
    }

    try {
      setIsLoading(true);
      setSectionLoading(prev => ({ ...prev, register: true }));
      setTransactionStatus({ type: 'pending', message: 'Registering land...' });
      
      const tx = await contract.methods
        .registerLand(plotNumber, area, district, city, state, areaSqYd)
        .send({ from: account, gas: 3000000 });
      
      setTransactionStatus({ 
        type: 'success', 
        message: 'Land registered successfully!',
        hash: tx.transactionHash
      });
      
      setPlotNumber('');
      setArea('');
      setDistrict('');
      setCity('');
      setState('');
      setAreaSqYd('');
      setFormErrors({});
      fetchUserLands(account);
      
    } catch (error) {
      console.error('Error registering land:', error);
      setTransactionStatus({ 
        type: 'error', 
        message: 'Failed to register land: ' + (error.message || 'Unknown error')
      });
    } finally {
      setIsLoading(false);
      setSectionLoading(prev => ({ ...prev, register: false }));
    }
  };

  // Handle confirmation for putting land for sale
  const handlePutLandForSaleConfirmation = (landId, plotNum) => {
    setConfirmDialog({
      show: true,
      title: 'Confirm Land For Sale',
      message: `Are you sure you want to put Land ID ${landId} (Plot Number: ${plotNum}) for sale? This will allow other users to request ownership transfer.`,
      onConfirm: () => performPutLandForSale(landId),
      onCancel: () => setConfirmDialog({ ...confirmDialog, show: false }),
      confirmButtonText: 'Put For Sale',
      cancelButtonText: 'Cancel'
    });
  };

  // Actually puts the land for sale
  const performPutLandForSale = async (landId) => {
    setConfirmDialog({ ...confirmDialog, show: false });
    
    if (!contract || !account || !landId) return;
    try {
      setIsLoading(true);
      setTransactionStatus({ type: 'pending', message: 'Setting land for sale...' });
      
      const tx = await contract.methods.putLandForSale(landId).send({ from: account });
      
      setTransactionStatus({ 
        type: 'success', 
        message: `Land ID ${landId} marked for sale!`,
        hash: tx.transactionHash
      });
      
      fetchUserLands(account);
      fetchLandsForSale();
      fetchPendingRequests(account);
      
    } catch (error) {
      console.error('Error putting land for sale:', error);
      setTransactionStatus({ 
        type: 'error', 
        message: 'Failed to mark land for sale: ' + (error.message || 'Unknown error')
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle confirmation for requesting land transfer
  const handleRequestTransferConfirmation = (landId, plotNum, owner) => {
    setConfirmDialog({
      show: true,
      title: 'Confirm Transfer Request',
      message: `Are you sure you want to request ownership transfer for Land ID ${landId} (Plot Number: ${plotNum}) from ${owner}?`,
      onConfirm: () => performRequestTransfer(landId),
      onCancel: () => setConfirmDialog({ ...confirmDialog, show: false }),
      confirmButtonText: 'Request Transfer',
      cancelButtonText: 'Cancel'
    });
  };

  // Actually performs the transfer request
  const performRequestTransfer = async (landId) => {
    setConfirmDialog({ ...confirmDialog, show: false });
    
    if (!contract || !account || !landId) return;
    try {
      setIsLoading(true);
      setTransactionStatus({ type: 'pending', message: 'Requesting transfer...' });
      
      const tx = await contract.methods.requestTransfer(landId).send({ from: account });
      
      setTransactionStatus({ 
        type: 'success', 
        message: `Transfer request submitted for Land ID ${landId}!`,
        hash: tx.transactionHash
      });
      
      fetchLandsForSale();
      fetchPendingRequests(account);
      
    } catch (error) {
      console.error('Error requesting transfer:', error);
      setTransactionStatus({ 
        type: 'error', 
        message: 'Failed to request transfer: ' + (error.message || 'Unknown error')
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle confirmation for approving a transfer
  const handleApproveTransferConfirmation = (landId, requester) => {
    setConfirmDialog({
      show: true,
      title: 'Confirm Ownership Transfer',
      message: `Are you sure you want to approve the ownership transfer of Land ID ${landId} to ${requester}? This action is irreversible.`,
      onConfirm: () => performApproveTransfer(landId),
      onCancel: () => setConfirmDialog({ ...confirmDialog, show: false }),
      confirmButtonText: 'Approve Transfer',
      cancelButtonText: 'Cancel'
    });
  };

  // Actually approves the transfer
  const performApproveTransfer = async (landId) => {
    setConfirmDialog({ ...confirmDialog, show: false });
    
    if (!contract || !account || !landId) return;
    try {
      setIsLoading(true);
      setTransactionStatus({ type: 'pending', message: 'Approving transfer...' });
      
      const tx = await contract.methods.approveTransfer(landId).send({ from: account });
      
      setTransactionStatus({ 
        type: 'success', 
        message: `Transfer approved for Land ID ${landId}!`,
        hash: tx.transactionHash
      });
      
      fetchUserLands(account);
      fetchLandsForSale();
      fetchPendingRequests(account);
      
    } catch (error) {
      console.error('Error approving transfer:', error);
      setTransactionStatus({ 
        type: 'error', 
        message: 'Failed to approve transfer: ' + (error.message || 'Unknown error')
      });
    } finally {
      setIsLoading(false);
    }
  };

  const denyTransfer = async (landId) => {
    if (!contract || !account || !landId) return;
    try {
      setIsLoading(true);
      setTransactionStatus({ type: 'pending', message: 'Denying transfer...' });
      
      const tx = await contract.methods.denyTransfer(landId).send({ from: account });
      
      setTransactionStatus({ 
        type: 'success', 
        message: `Transfer denied for Land ID ${landId}!`,
        hash: tx.transactionHash
      });
      
      fetchPendingRequests(account);
      fetchLandsForSale();
      
    } catch (error) {
      console.error('Error denying transfer:', error);
      setTransactionStatus({ 
        type: 'error', 
        message: 'Failed to deny transfer: ' + (error.message || 'Unknown error')
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyLand = async () => {
    if (!contract || !landIdToVerify) {
      setVerificationError('Please enter a valid Land ID');
      return;
    }
    
    try {
      setSectionLoading(prev => ({ ...prev, verify: true }));
      setVerificationError('');
      setVerificationResult(null);
      
      const result = await contract.methods.verifyLand(landIdToVerify).call();
      
      if (result[6] === '0x0000000000000000000000000000000000000000') {
        setVerificationError('The given Land ID is not associated with any registered land in the records.');
      } else {
        setVerificationResult({
          plotNumber: result[0],
          area: result[1],
          district: result[2],
          city: result[3],
          state: result[4],
          areaSqYd: result[5],
          owner: getAccountName(result[6]),
        });
      }
    } catch (error) {
      console.error('Error verifying land:', error);
      setVerificationError('Failed to verify land. Please check the Land ID.');
    } finally {
      setSectionLoading(prev => ({ ...prev, verify: false }));
    }
  };

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
    setVerificationResult(null);
    setVerificationError('');
    setTransactionStatus(null);
    setFormErrors({});
  };

  return (
    <div>
      <Navbar />
      <div className="container my-5 pt-5">
        <h1 className="text-center mb-4 fade-in">Manage Land</h1>
        
        {!isConnected ? (
          <div className="text-center">
            <button
              onClick={connectWallet}
              className="btn btn-primary btn-lg"
              aria-label="Connect to Ethereum Wallet"
              disabled={isLoading}
            >
              {isLoading ? <LoadingSpinner /> : 'Connect to Ethereum Wallet'}
            </button>
          </div>
        ) : (
          <div>
            {/* Transaction Status */}
            {transactionStatus && (
              <div className={`alert alert-${
                transactionStatus.type === 'success' ? 'success' : 
                transactionStatus.type === 'error' ? 'danger' : 
                'warning'
              } mb-4`}>
                <p>{transactionStatus.message}</p>
                {transactionStatus.hash && (
                  <small>Transaction Hash: {transactionStatus.hash}</small>
                )}
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="d-flex flex-wrap justify-content-center gap-3 mb-4">
              <button 
                className="btn btn-primary" 
                onClick={() => toggleSection('register')}
                disabled={isLoading}
              >
                Register Land
              </button>
              <button 
                className="btn btn-primary" 
                onClick={() => toggleSection('verify')}
                disabled={isLoading}
              >
                Verify Land Ownership
              </button>
              <button 
                className="btn btn-primary" 
                onClick={() => toggleSection('show')}
                disabled={isLoading}
              >
                Show Lands
              </button>
              <button 
                className="btn btn-primary" 
                onClick={() => toggleSection('explore')}
                disabled={isLoading}
              >
                Explore Lands
              </button>
              <button 
                className="btn btn-primary" 
                onClick={() => toggleSection('approve')}
                disabled={isLoading}
              >
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
                    className={`form-control mb-2 ${formErrors.plotNumber ? 'is-invalid' : ''}`}
                    placeholder="Plot Number"
                    value={plotNumber}
                    onChange={(e) => setPlotNumber(e.target.value)}
                    disabled={sectionLoading.register}
                  />
                  {formErrors.plotNumber && (
                    <div className="invalid-feedback mb-2">{formErrors.plotNumber}</div>
                  )}
                  
                  <input
                    type="text"
                    className={`form-control mb-2 ${formErrors.area ? 'is-invalid' : ''}`}
                    placeholder="Area"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    disabled={sectionLoading.register}
                  />
                  {formErrors.area && (
                    <div className="invalid-feedback mb-2">{formErrors.area}</div>
                  )}
                  
                  <input
                    type="text"
                    className={`form-control mb-2 ${formErrors.district ? 'is-invalid' : ''}`}
                    placeholder="District"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    disabled={sectionLoading.register}
                  />
                  {formErrors.district && (
                    <div className="invalid-feedback mb-2">{formErrors.district}</div>
                  )}
                  
                  <input
                    type="text"
                    className={`form-control mb-2 ${formErrors.city ? 'is-invalid' : ''}`}
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    disabled={sectionLoading.register}
                  />
                  {formErrors.city && (
                    <div className="invalid-feedback mb-2">{formErrors.city}</div>
                  )}
                  
                  <input
                    type="text"
                    className={`form-control mb-2 ${formErrors.state ? 'is-invalid' : ''}`}
                    placeholder="State"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    disabled={sectionLoading.register}
                  />
                  {formErrors.state && (
                    <div className="invalid-feedback mb-2">{formErrors.state}</div>
                  )}
                  
                  <input
                    type="number"
                    className={`form-control mb-2 ${formErrors.areaSqYd ? 'is-invalid' : ''}`}
                    placeholder="Area (sq. yd)"
                    value={areaSqYd}
                    onChange={(e) => setAreaSqYd(e.target.value)}
                    disabled={sectionLoading.register}
                  />
                  {formErrors.areaSqYd && (
                    <div className="invalid-feedback mb-2">{formErrors.areaSqYd}</div>
                  )}
                  
                  <button 
                    className="btn btn-primary w-100" 
                    onClick={handleRegisterLandConfirmation}
                    disabled={sectionLoading.register}
                  >
                    {sectionLoading.register ? <LoadingSpinner /> : 'Register Land'}
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
                    disabled={sectionLoading.verify}
                  />
                  <button 
                    className="btn btn-primary w-100" 
                    onClick={verifyLand}
                    disabled={sectionLoading.verify}
                  >
                    {sectionLoading.verify ? <LoadingSpinner /> : 'Verify Land'}
                  </button>
                  
                  {verificationResult && (
                    <div className="mt-3 card">
                      <div className="card-body">
                        <h5 className="card-title">Land ID: {landIdToVerify}</h5>
                        <p className="card-text">Plot Number: {verificationResult.plotNumber}</p>
                        <p className="card-text">Area: {verificationResult.area}</p>
                        <p className="card-text">District: {verificationResult.district}</p>
                        <p className="card-text">City: {verificationResult.city}</p>
                        <p className="card-text">State: {verificationResult.state}</p>
                        <p className="card-text">Area (sq. yd): {verificationResult.areaSqYd}</p>
                        <p className="card-text">
                          Owner: {verificationResult.owner} <Tooltip text="This is the current owner of the land." />
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {verificationError && (
                    <div className="alert alert-danger mt-3">{verificationError}</div>
                  )}
                </div>
              </div>
            )}

            {/* Show Lands Section */}
            {activeSection === 'show' && (
              <div className="mb-4">
                <h4>Show Lands</h4>
                
                {sectionLoading.show ? (
                  <div className="text-center py-5">
                    <LoadingSpinner size="medium" />
                    <p className="mt-3">Loading your lands...</p>
                  </div>
                ) : userLands.length > 0 ? (
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
                            <p className="card-text">
                              Owner: {land.owner} <Tooltip text="This is the current owner of the land." />
                            </p>
                            <p className="card-text">
                              For Sale: <span className={land.isForSale ? 'text-success' : 'text-danger'}>
                                {land.isForSale ? 'Yes' : 'No'}
                              </span>
                            </p>
                            {!land.isForSale && (
                              <button
                                className="btn btn-primary w-100"
                                onClick={() => handlePutLandForSaleConfirmation(land.id, land.plotNumber)}
                                disabled={isLoading}
                              >
                                {isLoading ? <LoadingSpinner /> : 'Put for Sale'}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="alert alert-info">No lands owned by this account.</div>
                )}
              </div>
            )}

            {/* Explore Lands Section */}
            {activeSection === 'explore' && (
              <div className="mb-4">
                <h4>Explore Lands for Sale</h4>
                
                {sectionLoading.explore ? (
                  <div className="text-center py-5">
                    <LoadingSpinner size="medium" />
                    <p className="mt-3">Loading lands for sale...</p>
                  </div>
                ) : landsForSale.length > 0 ? (
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
                            <p className="card-text">
                              Owner: {land.owner} <Tooltip text="This is the current owner of the land." />
                            </p>
                            {land.owner !== getAccountName(account) && (
                              <button
                                className="btn btn-primary w-100 mt-2"
                                onClick={() => handleRequestTransferConfirmation(land.id, land.plotNumber, land.owner)}
                                disabled={isLoading}
                              >
                                {isLoading ? <LoadingSpinner /> : 'Request Transfer'}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="alert alert-info">No lands available for sale.</div>
                )}
              </div>
            )}

            {/* Approve Transfer Section */}
            {activeSection === 'approve' && (
              <div className="mb-4">
                <h4>Approve Transfer Requests</h4>
                
                {sectionLoading.approve ? (
                  <div className="text-center py-5">
                    <LoadingSpinner size="medium" />
                    <p className="mt-3">Loading transfer requests...</p>
                  </div>
                ) : pendingRequests.length > 0 ? (
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
                            <p className="card-text">
                              Owner: {request.owner} <Tooltip text="This is the current owner of the land." />
                            </p>
                            <p className="card-text">
                              Requester: {request.requester} <Tooltip text="This is the user requesting the transfer." />
                            </p>
                            <div className="d-flex gap-2 mt-2">
                              <button
                                className="btn btn-success w-50"
                                onClick={() => handleApproveTransferConfirmation(request.id, request.requester)}
                                disabled={isLoading}
                              >
                                {isLoading ? <LoadingSpinner /> : 'Approve'}
                              </button>
                              <button
                                className="btn btn-danger w-50"
                                onClick={() => denyTransfer(request.id)}
                                disabled={isLoading}
                              >
                                {isLoading ? <LoadingSpinner /> : 'Deny'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="alert alert-info">No pending transfer requests.</div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
      
      {/* Confirmation Dialog */}
      <ConfirmationDialog
        show={confirmDialog.show}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={confirmDialog.onCancel}
        confirmButtonText={confirmDialog.confirmButtonText}
        cancelButtonText={confirmDialog.cancelButtonText}
      />
    </div>
  );
};

export default ManageLandPage;