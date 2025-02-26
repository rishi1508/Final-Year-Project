import React, { useState, useEffect, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles.css';
import Navbar from './Navbar';
import Footer from './Footer';
import { WalletContext } from './WalletContext';

const AdminPanel = () => {
  const { isConnected, contract, account, connectWallet } = useContext(WalletContext);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminError, setAdminError] = useState('');
  const [allLands, setAllLands] = useState([]);
  const [pastOwners, setPastOwners] = useState([]);
  const [landIdForHistory, setLandIdForHistory] = useState('');
  const [activeSection, setActiveSection] = useState(null);

  // Replace with your admin address (the one used to deploy the contract)
  const ADMIN_ADDRESS = '0xYourAdminAddressHere'; // Update this!

  useEffect(() => {
    if (isConnected && account && contract) {
      checkAdminStatus();
    }
  }, [isConnected, account, contract]);

  const checkAdminStatus = async () => {
    try {
      const contractAdmin = await contract.methods.admin().call();
      if (account.toLowerCase() === contractAdmin.toLowerCase()) {
        setIsAdmin(true);
        setAdminError('');
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
    }
  };

  const fetchAllLands = async () => {
    if (!contract || !isAdmin) return;
    try {
      const lands = await contract.methods.getAllLands().call();
      setAllLands(lands);
    } catch (error) {
      console.error('Error fetching all lands:', error);
    }
  };

  const fetchPastOwners = async () => {
    if (!contract || !isAdmin || !landIdForHistory) return;
    try {
      const history = await contract.methods.getPastOwnershipDetails(landIdForHistory).call();
      setPastOwners(history);
    } catch (error) {
      console.error('Error fetching past owners:', error);
      alert('Failed to fetch past ownership details.');
    }
  };

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
    setPastOwners([]);
    setLandIdForHistory('');
  };

  return (
    <div>
      <Navbar />
      <div className="container my-5 pt-5">
        <h1 className="text-center mb-4">Admin Panel</h1>
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
                      This account does not have administrator privileges. Kindly login with an account with administrator privileges.
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

            {/* Show Lands Section */}
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
                  <p className="text-center">No lands fetched yet. Click "Fetch All Lands" to load.</p>
                )}
              </div>
            )}

            {/* Past Ownership Details Section */}
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
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AdminPanel;