import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles.css';

const About = () => {
  return (
    <div className="container my-5">
      <h1 className="text-center mb-4 fade-in">About Us</h1>
      <div className="row">
        <div className="col-md-8 mx-auto">
          <p className="lead text-center">
            The Land Registry on Blockchain project is revolutionizing the way land ownership is managed worldwide. Our mission is to create a decentralized, secure, and transparent system that eliminates fraud and inefficiencies in traditional land registry processes.
          </p>
          <p className="text-center">
            By leveraging blockchain technology, we ensure that every transaction is immutable, verifiable, and accessible to authorized parties. Our vision is to empower individuals and governments with a trustworthy platform that protects property rights and simplifies land management.
          </p>
        </div>
      </div>
    </div>
  );
}; 

export default About;