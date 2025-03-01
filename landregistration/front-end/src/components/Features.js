import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles.css';

const Features = () => {
  return (
    <div className="container my-5">
      <h1 className="text-center mb-4 fade-in">Features</h1>
      <div className="row">
        {featuresData.map((feature, index) => (
          <div key={index} className="col-md-4 mb-4">
            <div className="card feature-card h-100 text-center">
              <div className="card-body">
                <div className="icon-container">
                  <i className={feature.icon}></i>
                </div>
                <h5 className="card-title">{feature.title}</h5>
                <p className="card-text">{feature.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const featuresData = [
  {
    title: 'Security',
    description: 'Blockchain encryption ensures that all records are tamper-proof and secure from unauthorized access.',
    icon: 'bi bi-shield-lock', 
  },
  {
    title: 'Transparency',
    description: 'Every transaction is recorded on a public ledger, making ownership history fully traceable.',
    icon: 'bi bi-eye', 
  },
  {
    title: 'Efficiency',
    description: 'Smart contracts automate processes, reducing paperwork and speeding up transactions.',
    icon: 'bi bi-lightning-charge',
  },
];

export default Features;
