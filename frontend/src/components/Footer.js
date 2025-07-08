// src/components/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>© {new Date().getFullYear()} JollyBaba Mobiles. All rights reserved.</p>
        <Link to="/login" className="footer-admin-link">Admin Login</Link>
      </div>
    </footer>
  );
};

export default Footer;
