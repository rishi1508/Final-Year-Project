import React, { useState, useEffect, useContext, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles.css';
import Navbar from './Navbar';
import Footer from './Footer';
import { WalletContext } from './WalletContext';
import ConfirmationDialog from './ConfirmationDialog';
import config from '../config'; // Import config

// Use admin address from config
const ADMIN_ADDRESS = config.ADMIN_ADDRESS;

const AdminPanel = () => {
  const { isConnected, contract, account, connectWallet } = useContext(WalletContext);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminError, setAdminError] = useState('');
  const [allLands, setAllLands] = useState([]);
  const [pastOwners, setPastOwners] = useState([]);
  const [landIdForHistory, setLandIdForHistory] = useState('');
  const [activeSection, setActiveSection] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const checkAdminStatus = useCallback(() => {
    if (!account) return;
    
    // Check if the current account matches the admin address (case-insensitive comparison)
    const isAdminAccount = account.toLowerCase() === ADMIN_ADDRESS.toLowerCase();
    console.log('Current account:', account);
    console.log('Admin address:', ADMIN_ADDRESS);
    console.log('Is admin:', isAdminAccount);
    
    setIsAdmin(isAdminAccount);
    setAdminError(isAdminAccount ? '' : 'This account does not have administrator privileges.');
  }, [account]);

  useEffect(() => {
    if (isConnected && account) {
      checkAdminStatus();
    }
  }, [isConnected, account, checkAdminStatus]);

  const fetchAllLands = useCallback(async () => {
    setIsLoading(true);
    console.log('fetchAllLands called');
    console.log('Contract:', !!contract);
    console.log('isAdmin:', isAdmin);
    
    if (!contract) {
      console.log('Cannot fetch lands: contract missing');
      setAdminError('Cannot fetch lands: Contract missing.');
      setIsLoading(false);
      return;
    }
    
    if (!isAdmin) {
      console.log('User is not admin. Current account:', account);
      console.log('Expected admin address:', ADMIN_ADDRESS);
      setAdminError('Only admin can perform this action. Please connect with the admin account.');
      setIsLoading(false);
      return;
    }
    
    try {
      console.log('Fetching all lands from contract at:', contract._address);
      const landCount = await contract.methods.landCount().call();
      console.log('Land count:', landCount);
      
      // Only proceed if the account is admin
      const allLands = await contract.methods.getAllLands().call({ from: account });
      console.log('Lands fetched:', allLands);
      setAllLands(allLands);
      
      if (allLands.length === 0) {
        setAdminError('No lands registered on the contract yet.');
      } else {
        setAdminError('');
      }
    } catch (error) {
      console.error('Error fetching all lands:', error);
      let errorMsg = error.message || 'Unknown error';
      if (error.data && error.data.message) {
        errorMsg = error.data.message;
      }
      setAdminError('Failed to fetch lands: ' + errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [contract, isAdmin, account]);

  const fetchPastOwners = useCallback(async () => {
    if (!landIdForHistory) {
      alert('Please enter a Land ID');
      return;
    }
    
    setIsLoading(true);
    console.log('fetchPastOwners called');
    console.log('Contract:', !!contract);
    console.log('isAdmin:', isAdmin);
    console.log('Land ID:', landIdForHistory);
    
    if (!contract) {
      console.log('Cannot fetch history: missing contract');
      alert('Cannot fetch history: Missing contract connection.');
      setIsLoading(false);
      return;
    }
    
    if (!isAdmin) {
      console.log('User is not admin. Current account:', account);
      console.log('Expected admin address:', ADMIN_ADDRESS);
      alert('Only admin can perform this action. Please connect with the admin account.');
      setIsLoading(false);
      return;
    }
    
    try {
      console.log('Checking if Land ID exists:', landIdForHistory);
      const land = await contract.methods.lands(landIdForHistory).call();
      console.log('Land details:', land);
      
      if (land.id === '0') {
        alert('Land ID does not exist');
        setIsLoading(false);
        return;
      }
      
      console.log('Fetching past ownership for Land ID:', landIdForHistory);
      const history = await contract.methods.getPastOwnershipDetails(landIdForHistory).call({ from: account });
      console.log('History fetched:', history);
      
      // Convert BigInt values to regular numbers to avoid type mixing issues
      const processedHistory = history.map(item => ({
        owner: item.owner,
        // Convert BigInt timestamp to Number to avoid type mixing
        timestamp: Number(item.timestamp)
      }));
      
      setPastOwners(processedHistory);
      
      if (processedHistory.length === 0) {
        alert('No ownership history found for Land ID ' + landIdForHistory);
      }
    } catch (error) {
      console.error('Error fetching past owners:', error);
      let errorMsg = error.message || 'Unknown error';
      if (error.data && error.data.message) {
        errorMsg = error.data.message;
      }
      alert('Failed to fetch past ownership details: ' + errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [contract, isAdmin, landIdForHistory, account]);

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
    setPastOwners([]);
    setLandIdForHistory('');
    setAllLands([]);
    setAdminError('');
  };

  return (
    <div>
      <Navbar />
      <div className="container my-5 pt-5">
        <h1 className="text-center mb-4 fade-in">Admin Panel</h1>
        {!isConnected || !isAdmin ? (
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card text-center">
                <div className="card-body">
                  <h5 className="card-title">Kindly login with an account with administrator privileges</h5>
                  {!isConnected ? (
                    <button
                      onClick={connectWallet}
                      className="btn btn-primary mt-3"
                      aria-label="Connect Wallet"
                    >
                      Connect
                    </button>
                  ) : (
                    <>
                      <p className="alert alert-warning mt-3">
                        Your current account: {account}<br/>
                        Admin address: {ADMIN_ADDRESS}
                      </p>
                      <p className="text-danger mt-2">
                        {adminError || 'This account does not have administrator privileges.'}
                      </p>
                      <button
                        onClick={connectWallet}
                        className="btn btn-primary mt-3"
                        aria-label="Connect Another Wallet"
                      >
                        Connect Different Account
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="alert alert-success mb-4">
              <strong>Connected as Admin:</strong> {account}
            </div>
            
            <div className="d-flex flex-wrap justify-content-center gap-3 mb-4">
              <button className="btn btn-primary" onClick={() => toggleSection('show')}>
                Show Lands
              </button>
              <button className="btn btn-primary" onClick={() => toggleSection('history')}>
                Past Ownership Details
              </button>
            </div>

            {activeSection === 'show' && (
              <div className="mb-4">
                <h4>All Lands</h4>
                <button 
                  className="btn btn-primary mb-3" 
                  onClick={fetchAllLands}
                  disabled={isLoading}
                >
                  {isLoading ? 'Loading...' : 'Fetch All Lands'}
                </button>
                {adminError && <div className="alert alert-danger mb-3">{adminError}</div>}
                
                {allLands.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered">
                      <thead className="table-dark">
                        <tr>
                          <th>Land ID</th>
                          <th>Plot Number</th>
                          <th>Area</th>
                          <th>District</th>
                          <th>City</th>
                          <th>State</th>
                          <th>Area (sq. yd)</th>
                          <th>Owner</th>
                          <th>For Sale</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allLands.map((land) => (
                          <tr key={land.id}>
                            <td>{land.id}</td>
                            <td>{land.plotNumber}</td>
                            <td>{land.area}</td>
                            <td>{land.district}</td>
                            <td>{land.city}</td>
                            <td>{land.state}</td>
                            <td>{land.areaSqYd}</td>
                            <td title={land.owner}>{config.shortenAddress(land.owner)}</td>
                            <td>{land.isForSale ? 'Yes' : 'No'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center">
                    {adminError || 'No lands fetched yet. Click "Fetch All Lands" to load.'}
                  </p>
                )}
              </div>
            )}

            {activeSection === 'history' && (
              <div className="row justify-content-center">
                <div className="col-md-6 mb-4">
                  <h4>Past Ownership Details</h4>
                  <div className="input-group mb-3">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Land ID"
                      value={landIdForHistory}
                      onChange={(e) => setLandIdForHistory(e.target.value)}
                    />
                    <button 
                      className="btn btn-primary" 
                      onClick={fetchPastOwners}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Loading...' : 'Submit'}
                    </button>
                  </div>
                  
                  {pastOwners.length > 0 && (
                    <div className="mt-3">
                      <h5>Ownership History for Land ID: {landIdForHistory}</h5>
                      <div className="table-responsive">
                        <table className="table table-striped table-bordered">
                          <thead className="table-dark">
                            <tr>
                              <th>#</th>
                              <th>Owner</th>
                              <th>Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {pastOwners.map((owner, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td title={owner.owner}>{config.shortenAddress(owner.owner)}</td>
                                <td>{new Date(owner.timestamp * 1000).toLocaleString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <ConfirmationDialog
              show={showDialog}
              title="Confirm Action"
              message="Are you sure you want to perform this action?"
              onConfirm={() => {
                setShowDialog(false);
                alert('Action confirmed!');
              }}
              onCancel={() => setShowDialog(false)}
            />
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AdminPanel;