// src/components/Navbar.jsx
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaSun, FaMoon } from "react-icons/fa";
import { CartContext } from "../context/CartContext";
import { SearchContext } from "../context/SearchContext";
import { useTheme } from "../context/ThemeContext";
import "./Navbar.css";

const Navbar = ({
  isDetailPage = false,
  productTitle = "",
  onShare = null
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminPage = location.pathname.startsWith("/admin");

  const { cart } = React.useContext(CartContext);
  const { searchQuery, setSearchQuery } = React.useContext(SearchContext);
  const { isDarkMode, toggleTheme } = useTheme();

  // Detail Page Layout
  if (isDetailPage) {
    return (
      <nav className="navbar navbar-detail">
        <div className="navbar-container">
          {/* Back Button */}
          <button
            className="back-button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span className="back-text">Back</span>
          </button>

          {/* Product Title */}
          <div className="product-title-wrapper">
            <span className="product-title">{productTitle}</span>
          </div>

          {/* Right Actions */}
          <div className="navbar-actions detail-actions">
            {/* Theme Toggle */}
            <button
              className="icon-button theme-toggle-btn"
              onClick={toggleTheme}
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? <FaSun /> : <FaMoon />}
            </button>

            {/* Share Button */}
            {onShare && (
              <button
                className="icon-button share-nav-btn"
                onClick={onShare}
                aria-label="Share product"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
              </button>
            )}

            {/* Cart */}
            <Link to="/cart" className="icon-button cart-button">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  // Default Layout
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Premium Text Logo */}
        <Link to="/" className="navbar-brand" onClick={() => navigate("/")}>
          <span className="brand-text">JollyBaba</span>
          <span className="brand-tagline">Mobiles</span>
        </Link>

        {/* Center - Search Bar (Desktop) */}
        {!isAdminPage && (
          <div className="navbar-search-wrapper">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              className="navbar-search"
              placeholder="Search mobiles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}

        {/* Right Side Actions */}
        <div className="navbar-actions">
          {/* Theme Toggle */}
          <button
            className="theme-toggle-navbar"
            onClick={toggleTheme}
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>

          {!isAdminPage && (
            <Link to="/cart" className="cart-button">
              <svg className="cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
            </Link>
          )}

          <a href="/apk/jollybaba.apk" download className="apk-button">
            <svg className="download-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span className="apk-text">Get App</span>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
