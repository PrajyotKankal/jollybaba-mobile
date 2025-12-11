import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserTypeContext } from '../context/UserTypeContext';
import { FaEllipsisV, FaFacebook, FaInstagram, FaYoutube, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const { userType, toggleUserType } = useContext(UserTypeContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Top Section: Brand & Social */}
        <div className="footer-top">
          <div className="footer-brand-column">
            <h2 className="footer-logo">JollyBaba</h2>
            <p className="footer-tagline">Your trusted partner for premium mobile devices and accessories.</p>
            <div className="social-icons">
              <a href="https://www.facebook.com/groups/2601578463318934" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Follow us on Facebook"><FaFacebook /></a>
              <a href="https://www.instagram.com/jollybaba_mobiles/" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Follow us on Instagram"><FaInstagram /></a>
              <a href="https://www.youtube.com/user/akshaygamehai" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Subscribe on YouTube"><FaYoutube /></a>
            </div>
          </div>

          {/* Desktop Grid / Mobile Accordion */}
          <div className="footer-nav-grid">

            {/* Shop Column */}
            <div className={`footer-column ${expandedSection === 'shop' ? 'open' : ''}`}>
              <div className="footer-column-header" onClick={() => toggleSection('shop')}>
                <h4>Shop</h4>
                <span className="accordion-icon">
                  {expandedSection === 'shop' ? <FaChevronUp /> : <FaChevronDown />}
                </span>
              </div>
              <div className="footer-links-list">
                <Link to="/">All Mobiles</Link>
                <Link to="/deals">Best Sellers</Link>
                <Link to="/">New Arrivals</Link>
                <Link to="/compare">Compare</Link>
              </div>
            </div>

            {/* Support Column */}
            <div className={`footer-column ${expandedSection === 'support' ? 'open' : ''}`}>
              <div className="footer-column-header" onClick={() => toggleSection('support')}>
                <h4>Support</h4>
                <span className="accordion-icon">
                  {expandedSection === 'support' ? <FaChevronUp /> : <FaChevronDown />}
                </span>
              </div>
              <div className="footer-links-list">
                <Link to="/contact">Contact Us</Link>
                <Link to="/faq">FAQs</Link>
                <Link to="/compare">Compare Phones</Link>
                <Link to="/deals">Today's Deals</Link>
              </div>
            </div>

            {/* Company Column */}
            <div className={`footer-column ${expandedSection === 'company' ? 'open' : ''}`}>
              <div className="footer-column-header" onClick={() => toggleSection('company')}>
                <h4>Company</h4>
                <span className="accordion-icon">
                  {expandedSection === 'company' ? <FaChevronUp /> : <FaChevronDown />}
                </span>
              </div>
              <div className="footer-links-list">
                <Link to="/about">About Us</Link>
                <Link to="/brands">Our Brands</Link>
                <Link to="/privacy-policy">Privacy Policy</Link>
                <Link to="/terms-of-service">Terms of Service</Link>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <p className="copyright">© {new Date().getFullYear()} JollyBaba Mobiles. All rights reserved.</p>

          <div className="footer-controls">
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
                  <div className="admin-link-wrapper">
                    <Link to="/login" className="footer-admin-link">Admin Login</Link>
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
