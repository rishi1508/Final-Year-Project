import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import "../styles.css";

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4 w-full mt-auto">
      <div className="container">
        {/* Navigation Links */}
        <div className="row">
          <div className="col-md-4 mb-3">
            <h5 className="border-bottom pb-2 mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="/Final-Year-Project/About" className="text-white text-decoration-none hover-link">
                  About
                </a>
              </li>
              <li className="mb-2">
                <a href="/Final-Year-Project/features" className="text-white text-decoration-none hover-link">
                  Features
                </a>
              </li>
              <li className="mb-2">
                <a href="/Final-Year-Project/contact" className="text-white text-decoration-none hover-link">
                  Contact
                </a>
              </li>
              <li className="mb-2">
                <a href="/Final-Year-Project/faq" className="text-white text-decoration-none hover-link">
                  FAQ
                </a>
              </li>
              <li className="mb-2">
                <a href="/Final-Year-Project/privacy" className="text-white text-decoration-none hover-link">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          <div className="col-md-4 mb-3">
            <h5 className="border-bottom pb-2 mb-3">About Us</h5>
            <p className="text-light">
              Land Registry using Blockchain is a revolutionary platform that ensures secure, transparent, and tamper-proof land registration and transfers using blockchain technology.
            </p>
            <div className="mt-2">
              <FaEnvelope className="me-2" />
              rishimishra1508@gmail.com
            </div>
          </div>

          <div className="col-md-4 text-center">
            <h5 className="border-bottom pb-2 mb-3">Connect With Us</h5>
            <p className="text-light mb-3">
              Follow us on social media to stay updated with the latest developments.
            </p>
            <div className="d-flex justify-content-center">
              <a href="https://github.com/Sanjay8602/Final-Year-Project" className="text-white me-3 social-icon">
                <FaGithub size={24} />
              </a>
              <a href="https://www.linkedin.com/in/rishimishra1508" className="text-white social-icon">
                <FaLinkedin size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <hr className="border-light my-3" />
        <div className="row">
          <div className="col-12 text-center">
            <p className="mb-0">
              © {new Date().getFullYear()} Land Registry using Blockchain. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
