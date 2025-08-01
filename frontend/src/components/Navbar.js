import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { SearchContext } from '../context/SearchContext';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminPage = location.pathname.startsWith('/admin');
  const { cart } = useContext(CartContext);
  const { searchQuery, setSearchQuery } = useContext(SearchContext);

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
    e.preventDefault();
    setSearchQuery(''); // ✅ Clear search
    navigate('/');
    setTimeout(() => {
      const searchBtn = document.querySelector('.search-button');
      if (searchBtn) searchBtn.click();
    }, 100);
  };




  return (
    <>

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
          </div>
        </div>

      </nav>
    </>
  );
};

export default Navbar;
