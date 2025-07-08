import React, { useState, useEffect, useRef } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import './AdminNavbar.css';

const AdminNavbar = ({ activeTab, setActiveTab }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

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

  return (
    <>
      <nav className="admin-navbar">
        <div className="admin-navbar-content">
          <div className="admin-navbar-logo">JB Admin</div>

          <div className="admin-navbar-buttons">
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
          </div>

          <div className="profile-icon-wrapper" onClick={() => setDropdownOpen((prev) => !prev)}>
            <FaUserCircle className="profile-icon" />
          </div>
        </div>
      </nav>

      {dropdownOpen && (
        <div className="profile-dropdown" ref={dropdownRef}>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </>
  );
};

export default AdminNavbar;
