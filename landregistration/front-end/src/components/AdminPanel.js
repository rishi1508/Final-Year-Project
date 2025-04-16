import React, { useState, useEffect, useContext, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles.css';
import Navbar from './Navbar';
import Footer from './Footer';
import { WalletContext } from './WalletContext';
import ConfirmationDialog from './ConfirmationDialog';

// Define admin address as a constant to match LandRegistry.sol
const ADMIN_ADDRESS = process.env.REACT_APP_ADMIN_ADDRESS;

const AdminPanel = () => {
  const { isConnected, contract, account, connectWallet } = useContext(WalletContext);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminError, setAdminError] = useState('');
  const [allLands, setAllLands] = useState([]);
  const [pastOwners, setPastOwners] = useState([]);
  const [landIdForHistory, setLandIdForHistory] = useState('');
  const [activeSection, setActiveSection] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  const checkAdminStatus = useCallback(() => {
    if (!account) return;
    const isAdminAccount = account.toLowerCase() === ADMIN_ADDRESS.toLowerCase();
    setIsAdmin(isAdminAccount);
    setAdminError(isAdminAccount ? '' : 'This account does not have administrator privileges.');
  }, [account]);

  useEffect(() => {
    if (isConnected && account) {
      checkAdminStatus();
    }
  }, [isConnected, account, checkAdminStatus]);

  const fetchAllLands = useCallback(async () => {
    console.log('fetchAllLands called');
    console.log('Contract:', !!contract);
    console.log('isAdmin:', isAdmin);
    if (!contract || !isAdmin) {
      console.log('Cannot fetch lands: contract or admin status missing');
      setAdminError('Cannot fetch lands: Contract or admin status missing.');
      return;
    }
    try {
      console.log('Fetching all lands from contract at:', contract._address);
      console.log('Contract methods:', Object.keys(contract.methods));
      const landCount = await contract.methods.landCount().call();
      console.log('Land count:', landCount);
      const lands = await contract.methods.getAllLands().call();
      console.log('Lands fetched:', lands);
      setAllLands(lands);
      if (lands.length === 0) {
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
      alert('Failed to fetch lands: ' + errorMsg);
    }
  }, [contract, isAdmin]);

  const fetchPastOwners = useCallback(async () => {
    console.log('fetchPastOwners called');
    console.log('Contract:', !!contract);
    console.log('isAdmin:', isAdmin);
    console.log('Land ID:', landIdForHistory);
    if (!contract || !isAdmin || !landIdForHistory) {
      console.log('Cannot fetch history: missing contract, admin, or land ID');
      alert('Cannot fetch history: Missing required data.');
      return;
    }
    try {
      console.log('Checking if Land ID exists:', landIdForHistory);
      const land = await contract.methods.lands(landIdForHistory).call();
      console.log('Land details:', land);
      console.log('Fetching past ownership for Land ID:', landIdForHistory);
      const history = await contract.methods.getPastOwnershipDetails(landIdForHistory).call();
      console.log('History fetched:', history);
      setPastOwners(history);
      if (history.length === 0) {
        alert('No ownership history found for Land ID ' + landIdForHistory);
      }
    } catch (error) {
      console.error('Error fetching past owners:', error);
      let errorMsg = error.message || 'Unknown error';
      if (error.data && error.data.message) {
        errorMsg = error.data.message;
      }
      alert('Failed to fetch past ownership details: ' + errorMsg);
    }
  }, [contract, isAdmin, landIdForHistory]);

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
    setPastOwners([]);
    setLandIdForHistory('');
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
                  <button
                    onClick={connectWallet}
                    className="btn btn-primary mt-3"
                    aria-label="Connect Wallet"
                  >
                    Connect
                  </button>
                  {isConnected && !isAdmin && (
                    <p className="text-danger mt-2">
                      {adminError || 'This account does not have administrator privileges.'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
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
                <button className="btn btn-primary mb-3" onClick={fetchAllLands}>
                  Fetch All Lands
                </button>
                {allLands.length > 0 ? (
                  <div className="row">
                    {allLands.map((land) => (
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
                          </div>
                        </div>
                      </div>
                    ))}
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
                  <input
                    type="number"
                    className="form-control mb-2"
                    placeholder="Land ID"
                    value={landIdForHistory}
                    onChange={(e) => setLandIdForHistory(e.target.value)}
                  />
                  <button className="btn btn-primary w-100" onClick={fetchPastOwners}>
                    Submit
                  </button>
                  {pastOwners.length > 0 && (
                    <div className="mt-3">
                      <h5>Ownership History for Land ID: {landIdForHistory}</h5>
                      <ul className="list-group">
                        {pastOwners.map((owner, index) => (
                          <li key={index} className="list-group-item">
                            <p>Owner: {owner.owner}</p>
                            <p>Timestamp: {new Date(owner.timestamp * 1000).toLocaleString()}</p>
                          </li>
                        ))}
                      </ul>
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