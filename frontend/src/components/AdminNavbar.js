import React, { useState, useEffect, useRef } from 'react';
import { FaUserCircle, FaSun, FaMoon, FaBars, FaTimes } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import './AdminNavbar.css';

const AdminNavbar = ({ activeTab, setActiveTab }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef();
  const { isDarkMode, toggleTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Close mobile menu when tab changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [activeTab]);

  return (
    <>
      <nav className="admin-navbar">
        <div className="admin-navbar-content">
          <div className="navbar-left">
            <button
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
            <div className="admin-navbar-logo">JB Admin</div>
          </div>

          {/* Desktop Menu */}
          <div className="admin-navbar-buttons desktop-only">
            <button
              className={activeTab === 'upload' ? 'active' : ''}
              onClick={() => setActiveTab('upload')}
            >
              Upload
            </button>
            <button
              className={activeTab === 'manage' ? 'active' : ''}
              onClick={() => setActiveTab('manage')}
            >
              Manage
            </button>
            <button
              className={activeTab === 'reports' ? 'active' : ''}
              onClick={() => setActiveTab('reports')}
            >
              Reports
            </button>
          </div>

          <div className="admin-navbar-actions">
            <button className="theme-toggle-btn" onClick={toggleTheme} title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
              {isDarkMode ? <FaSun /> : <FaMoon />}
            </button>
            <div className="profile-icon-wrapper" onClick={() => setDropdownOpen((prev) => !prev)}>
              <FaUserCircle className="profile-icon" />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`mobile-drawer-overlay ${mobileMenuOpen ? 'open' : ''}`} onClick={() => setMobileMenuOpen(false)} />
      <div className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <h3>Menu</h3>
          <button onClick={() => setMobileMenuOpen(false)}><FaTimes /></button>
        </div>
        <div className="drawer-content">
          <button
            className={`drawer-item ${activeTab === 'upload' ? 'active' : ''}`}
            onClick={() => setActiveTab('upload')}
          >
            Upload Product
          </button>
          <button
            className={`drawer-item ${activeTab === 'manage' ? 'active' : ''}`}
            onClick={() => setActiveTab('manage')}
          >
            Manage Inventory
          </button>
          <button
            className={`drawer-item ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            Reports & Analytics
          </button>
        </div>
        <div className="drawer-footer">
          <button onClick={handleLogout} className="drawer-logout">Logout</button>
        </div>
      </div>

      {dropdownOpen && (
        <div className="profile-dropdown" ref={dropdownRef}>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </>
  );
};

export default AdminNavbar;
