import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles.css';
import { WalletContext } from './WalletContext';

const Navbar = () => {
  const { isConnected, accountName } = useContext(WalletContext);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-navy fixed-top">
      <div className="container">
        <NavLink className="navbar-brand" to="/">Land Registry</NavLink>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" end>Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/manage-land">Manage Land</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/admin">Admin</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/about">About</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/features">Features</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/contact">Contact Us</NavLink>
            </li>
          </ul>
          
          {isConnected && (
            <div className="ms-lg-3 mt-2 mt-lg-0">
              <span className="badge bg-light text-dark p-2">
                <i className="bi bi-wallet2 me-1"></i>
                {accountName}
              </span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;