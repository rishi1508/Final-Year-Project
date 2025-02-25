import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles.css';

const Features = () => {
  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Features</h1>
      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Security</h5>
              <p className="card-text">
                Blockchain encryption ensures that all records are tamper-proof and secure from unauthorized access.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Transparency</h5>
              <p className="card-text">
                Every transaction is recorded on a public ledger, making ownership history fully traceable.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Efficiency</h5>
              <p className="card-text">
                Smart contracts automate processes, reducing paperwork and speeding up transactions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;