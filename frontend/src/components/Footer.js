import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserTypeContext } from '../context/UserTypeContext';
import { FaEllipsisV } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const { userType, toggleUserType } = useContext(UserTypeContext);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <footer className="footer">
  <div className="footer-container">
    {/* Row 1: Centered full width */}
    <div className="footer-row footer-row-1">
      <p>© {new Date().getFullYear()} JollyBaba Mobiles. All rights reserved.</p>
    </div>

    {/* Row 2: Admin login left, menu right */}
    <div className="footer-row footer-row-2">
      <div className="footer-left">
        <Link to="/login" className="footer-admin-link">AL</Link>
      </div>

      <div className="footer-right">
        <div className="footer-menu-wrapper">
          <button className="footer-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
            <FaEllipsisV size={18} />
          </button>

          {menuOpen && (
            <div className="footer-popup">
              <span className="toggle-label">{userType === 'Dealer' ? 'Dealer Mode' : 'Retail Mode'}</span>
              <div className="custom-toggle" onClick={toggleUserType}>
                <div className={`toggle-thumb ${userType === 'Dealer' ? 'enabled' : 'disabled'}`}>
                  <div className="thumb-circle" />
                </div>
                <div className="toggle-labels">
                  <span>Off</span>
                  <span>On</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
</footer>


  );
};

export default Footer;
