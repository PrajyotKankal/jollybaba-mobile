import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { SearchContext } from '../context/SearchContext';
import { UserTypeContext } from '../context/UserTypeContext';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const isAdminPage = location.pathname.startsWith('/admin');
  const { cart } = useContext(CartContext);
  const { searchQuery, setSearchQuery } = useContext(SearchContext);
  const { userType, setUserType } = useContext(UserTypeContext);

  const [showDealerNote, setShowDealerNote] = useState(false);

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
      e.preventDefault();
      const searchBtn = document.querySelector('.search-button');
      if (searchBtn) searchBtn.click();
    }
  };

  const toggleUserType = () => {
    setUserType((prev) => (prev === 'Retailer' ? 'Dealer' : 'Retailer'));
  };

  useEffect(() => {
    if (userType === 'Dealer') {
      setShowDealerNote(true);
      const timer = setTimeout(() => {
        setShowDealerNote(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [userType]);

  return (
    <>
      {!isAdminPage && userType === 'Dealer' && showDealerNote && (
        <div className="dealer-banner">
          <span>
            Buy at least 5 mobiles to unlock dealer pricing.
          </span>
          <button className="close-banner" onClick={() => setShowDealerNote(false)}>✕</button>
        </div>
      )}

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
              </div>
            )}

            {!isAdminPage && (
              <Link to="/cart" className="cart-button">
                🛒
                {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
              </Link>
            )}

            {!isAdminPage && (
              <div className="user-type-toggle">
                <button className="user-type-button" onClick={toggleUserType}>
                  {userType === 'Retailer' ? '👤 Retail View' : '💼 Dealer View'}
                </button>
              </div>

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
    </>
  );
};

export default Navbar;
