import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { SearchContext } from '../context/SearchContext';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const isAdminPage = location.pathname.startsWith('/admin');
  const { cart } = useContext(CartContext);
  const { searchQuery, setSearchQuery } = useContext(SearchContext);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const triggerSearch = () => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const searchBtn = document.querySelector('.search-button');
        if (searchBtn) searchBtn.click();
      }, 100);
    } else {
      const searchBtn = document.querySelector('.search-button');
      if (searchBtn) searchBtn.click();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      triggerSearch();
    }
  };

 const handleLogoClick = (e) => {
  if (location.pathname === '/') {
    e.preventDefault(); // prevent re-routing if already on home
    const searchBtn = document.querySelector('.search-button');
    if (searchBtn) searchBtn.click(); // re-trigger search on homepage
  }
};


  return (
    <nav className="navbar">
      <div className="navbar-row">
        <Link to="/" className="navbar-logo" onClick={handleLogoClick}>
  JB
</Link>


        <div className="navbar-right">
          {!isAdminPage && (
            <div className="search-container">
              <input
                type="text"
                className="navbar-search"
                placeholder="Search mobiles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              {/* <button className="search-btn search-button" onClick={triggerSearch}>
                🔍
              </button> */}
            </div>
          )}

          {!isAdminPage && (
           <Link to="/cart" className="cart-button">
  🛒
  {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
</Link>


          )}
        </div>
      </div>

      {isAdminPage && token && (
        <div className="navbar-actions">
          <Link to="/admin">
            <button className="nav-btn">Upload</button>
          </Link>
          <Link to="/admin/manage">
            <button className="nav-btn">Manage</button>
          </Link>
          <button className="nav-btn logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
