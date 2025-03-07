import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const mailtoLink = `mailto:sutsun0606@gmail.com?subject=Contact Form Submission from ${formData.name}&body=${encodeURIComponent(formData.message)}%0A%0AFrom: ${formData.email}`;
    window.location.href = mailtoLink;
  };

  return (
    <div>
      {/* Navbar */}
      <Navbar />

      {/* Contact Content */}
      <div className="container my-5 pt-5">
        <h1 className="text-center mb-4 fade-in">Contact Us</h1>
        <div className="row">
          <div className="col-md-6 mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Name</label>
                <input 
                  type="text" className="form-control" id="name" placeholder="Your Name" 
                  value={formData.name} onChange={handleChange} required 
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input 
                  type="email" className="form-control" id="email" placeholder="Your Email" 
                  value={formData.email} onChange={handleChange} required 
                />
              </div>
              <div className="mb-3">
                <label htmlFor="message" className="form-label">Message</label>
                <textarea 
                  className="form-control" id="message" rows="4" placeholder="Your Message" 
                  value={formData.message} onChange={handleChange} required 
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ContactPage;
