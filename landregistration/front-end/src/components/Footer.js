import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaFacebook, FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";
import "../styles.css";

const Footer = () => {
  return (
    <footer className="bg-dark text-white text-center py-4 w-full">
      <div className="container">
        {/* Navigation Links */}
        <div className="row">
          <div className="col-md-4 mb-3">
            <h5>About Us</h5>
          </div>

          <div className="col-md-4 mb-3">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <a href="./About" className="text-white text-decoration-none">
                  About
                </a>
              </li>
              <li>
                <a href="/services" className="text-white text-decoration-none">
                  Services
                </a>
              </li>
              <li>
                <a href="/contact" className="text-white text-decoration-none">
                  Contact
                </a>
              </li>
              <li>
                <a href="/faq" className="text-white text-decoration-none">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div className="col-md-4">
            <h5>Follow Us</h5>
            <div className="d-flex justify-content-center gap-3">
              <a href="https://facebook.com" className="text-white">
                <FaFacebook size={24} />
              </a>
              <a href="https://twitter.com" className="text-white">
                <FaTwitter size={24} />
              </a>
              <a href="https://linkedin.com" className="text-white">
                <FaLinkedin size={24} />
              </a>
              <a href="https://github.com/Sanjay8602/Final-Year-Project" className="text-white">
                <FaGithub size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <hr className="border-light my-3" />
        <p className="mb-0">
          © {new Date().getFullYear()} Land Registry using Blockchain. All
          rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
