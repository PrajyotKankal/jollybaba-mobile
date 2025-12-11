// src/components/Navbar.jsx
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { SearchContext } from "../context/SearchContext";
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminPage = location.pathname.startsWith("/admin");

  const { cart } = React.useContext(CartContext);
  const { searchQuery, setSearchQuery } = React.useContext(SearchContext);

  return (
    <nav className="navbar">
      <div className="navbar-row">
        {/* Image-only logo from /public */}
        <Link to="/" className="navbar-logo" onClick={() => navigate("/")}>
          <img
            src="/jb-logo.png"     /* place file at public/jb-logo.png */
            alt="JollyBaba"
            className="navbar-logo-img"
            decoding="async"
            loading="eager"
          />
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
              />
            </div>
          )}

          {!isAdminPage && (
            <Link to="/cart" className="cart-button">
              🛒
              {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
            </Link>
          )}

          <a href="/apk/jollybaba.apk" download className="apk-btn">
            <svg
              className="apk-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              aria-label="Download APK"
              role="img"
            >
              <path d="M12 3v8" />
              <path d="M8.5 9.5L12 13l3.5-3.5" />
              <path d="M5 14v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3" />
            </svg>
            <span className="apk-text">Get App</span>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
