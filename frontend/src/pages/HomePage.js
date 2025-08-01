import React, { useEffect, useState, useContext, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { SearchContext } from '../context/SearchContext';
import { UserTypeContext } from '../context/UserTypeContext';
import { CartContext } from '../context/CartContext';
import { toast } from 'react-toastify';


import './HomePage.css';

const HomePage = () => {
  const [mobiles, setMobiles] = useState([]);
    const [priceCap, setPriceCap] = useState(-1);

  const [filters, setFilters] = useState({ brand: [], ram: [], storage: [] });
  const [filteredMobiles, setFilteredMobiles] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState({ brand: true, ram: false, storage: false });
  const [mobileFiltersVisible, setMobileFiltersVisible] = useState(false);
const isFilterActive =
  Object.values(filters).some((arr) => arr.length > 0) || priceCap !== -1;  

  const [activeCategory, setActiveCategory] = useState(null);


  const [loading, setLoading] = useState(true);

  const { userType } = useContext(UserTypeContext);
  const isDealer = userType === 'Dealer';


  const { searchQuery, setSearchQuery } = useContext(SearchContext);

  const { addToCart } = useContext(CartContext);


  const sidebarRef = useRef();
  const overlayRef = useRef();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const mobilesPerPage = 20;

  useEffect(() => {
    const fetchMobiles = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/mobiles`);
        setMobiles(res.data);
        setFilteredMobiles(res.data);
      } catch (err) {
        console.error('Failed to load catalog:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMobiles();
  }, []);
  useEffect(() => {
    const handleOutsideClick = (e) => {
      const isMobile = window.innerWidth <= 768; // adjust breakpoint if needed

      if (
        mobileFiltersVisible &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target) &&
        overlayRef.current &&
        overlayRef.current.contains(e.target) &&
        !isMobile // ✅ prevent auto-close on mobile
      ) {
        setMobileFiltersVisible(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [mobileFiltersVisible]);


  useEffect(() => {
    const applyFilters = () => {
      let results = [...mobiles];

      // Brand, RAM, Storage filters
      Object.entries(filters).forEach(([key, values]) => {
        if (values.length > 0) {
          results = results.filter((m) => {
            const val = m[key];
            if ((key === 'ram' || key === 'storage') && val) {
              const normalized = `${parseInt(val)} GB`;
              return values.includes(normalized);
            }
            if (key === 'brand' && val) {
              const normalized = val.trim().toLowerCase();
              return values.map(v => v.toLowerCase()).includes(normalized);
            }
            return values.includes(val);
          });
        }
      });

      // Category pills
      if (activeCategory) {
        const cat = activeCategory.toLowerCase();
        if (cat === 'mobiles') {
          results = results.filter((m) => m.deviceType?.toLowerCase() === 'mobile');
        } else if (cat === 'tablets') {
          results = results.filter((m) => m.deviceType?.toLowerCase() === 'tablet');
        } else if (cat === 'android') {
          results = results.filter((m) => m.brand?.toLowerCase() !== 'apple');
        } else if (cat === 'apple') {
          results = results.filter((m) => m.brand?.toLowerCase() === 'apple');
        }
      }

      // Search query filter
      if (searchQuery.trim()) {
        const lower = searchQuery.toLowerCase();
        results = results.filter((m) =>
          [m.brand, m.model, m.ram, m.storage, m.color, String(m.retailPrice), String(m.dealerPrice)]
            .filter(Boolean)
            .some((field) => field.toLowerCase().includes(lower))
        );
      }

      // Price slider (retail/dealer)
      if (priceCap !== -1) {
        results = results.filter((m) => {
          const price = Number(isDealer ? m.dealerPrice : m.retailPrice);
          if (isNaN(price)) return false;

          if (priceCap === 200000) return price > 50000;
          return price <= priceCap;
        });
      }

      setFilteredMobiles(results);
      setCurrentPage(1);
    };

    applyFilters();
  }, [searchQuery, filters, mobiles, activeCategory, priceCap, isDealer]);

  const unique = (key) => {
    let values = mobiles.map((m) => m[key]).filter(Boolean);

    if (key === 'ram' || key === 'storage') {
      const seen = new Set();
      return values
        .map((val) => {
          const num = parseInt(val);
          return isNaN(num) ? null : num;
        })
        .filter((val) => val !== null && !seen.has(val) && seen.add(val))
        .sort((a, b) => a - b)
        .map((num) => `${num} GB`);
    }

    if (key === 'brand') {
      const seen = new Set();
      return values
        .map((val) => val.trim().toLowerCase())
        .filter((val) => !seen.has(val) && seen.add(val))
        .map((val) => val.charAt(0).toUpperCase() + val.slice(1));
    }

    return [...new Set(values)].sort();
  };

  const handleCheckboxChange = (type, value) => {
    setFilters((prev) => {
      const updated = prev[type].includes(value)
        ? prev[type].filter((item) => item !== value)
        : [...prev[type], value];
      return { ...prev, [type]: updated };
    });
  };

  const toggleDropdown = (type) => {
    setDropdownOpen((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  useEffect(() => {
    if (mobileFiltersVisible) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }
  }, [mobileFiltersVisible]);

  const indexOfLast = currentPage * mobilesPerPage;
  const indexOfFirst = indexOfLast - mobilesPerPage;
  const currentMobiles = filteredMobiles.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredMobiles.length / mobilesPerPage);

  const renderPagination = () => (
    <div className="pagination-nav">
      <button
        className="page-btn"
        onClick={() => {
          setCurrentPage((prev) => Math.max(prev - 1, 1));
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        disabled={currentPage === 1}
      >
        ⬅ Back
      </button>

      <span className="page-status">Page {currentPage} of {totalPages}</span>

      <button
        className="page-btn"
        onClick={() => {
          setCurrentPage((prev) => Math.min(prev + 1, totalPages));
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        disabled={currentPage === totalPages}
      >
        Next ➡
      </button>
    </div>
  );


  const handleCardClick = (id) => {
    navigate(`/mobile/${id}`);
  };

  return (
    <div className="homepage-grid">
      {loading && (
        <div className="spinner-overlay">
          <div className="elegant-spinner"></div>
          <div className="spinner-text">Loading Mobiles...</div>
        </div>
      )}

      {mobileFiltersVisible && <div className="overlay" ref={overlayRef}></div>}

      <aside className={`filter-sidebar ${mobileFiltersVisible ? 'visible' : ''}`} ref={sidebarRef}>

        <div className="filter-header-bar">
          <h3>Filters</h3>

          <div className="filter-header-actions">
            <button
              className="clear-text-btn"
              onClick={() => {
                setFilters({ brand: [], ram: [], storage: [] });
                setPriceCap(-1);
                setActiveCategory(null);
                setSearchQuery('');
                setCurrentPage(1);
              }}
            >
              Clear
            </button>

            <button
              className="close-btn mobile-only"
              onClick={() => setMobileFiltersVisible(false)}
            >
              ✕
            </button>
          </div>
        </div>


        {['brand', 'ram', 'storage'].map((type) => (
          <div key={type} className="filter-group">
            <div className="filter-header" onClick={() => toggleDropdown(type)}>
              <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
              <span className="arrow">{dropdownOpen[type] ? '▲' : '▼'}</span>
            </div>
            {dropdownOpen[type] && (
              <div className="filter-options">
                {unique(type).map((val) => (
                  <label key={val} className="checkbox">
                    <input
                      type="checkbox"
                      onChange={() => handleCheckboxChange(type, val)}
                      checked={filters[type].includes(val)}
                    />
                    <span>{val}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}

        <div className="price-slider">
          <label>
            Max Price:{' '}
            <strong>
              {priceCap === -1
                ? 'All'
                : priceCap === 200000
                  ? '> ₹50,000'
                  : `₹${priceCap.toLocaleString()}`}
            </strong>
          </label>
          <input
            type="range"
            min={0}
            max={6}
            step={1}
            value={[-1, 10000, 20000, 30000, 40000, 50000, 200000].indexOf(priceCap)}
            onChange={(e) => {
              const steps = [-1, 10000, 20000, 30000, 40000, 50000, 200000];
              setPriceCap(steps[parseInt(e.target.value)]);
              setCurrentPage(1);
            }}
          />
          <div className="slider-labels">
            {['All', '10K', '20K', '30K', '40K', '50K', '50K+'].map((label, i) => (
              <span key={i}>{label}</span>
            ))}
          </div>
        </div>

        <button
          className="search-button"
          onClick={() => {
            setMobileFiltersVisible(false);
          }}
        >
          Apply Filters
        </button>

      </aside>


      <main className="catalog-section">
        <div className="filter-topbar">
          <input
            type="text"
            className="mobile-searchbar"
            placeholder="Search mobiles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <button
            className={`filter-toggle-btn ${isFilterActive ? 'active' : ''}`}
            onClick={() => setMobileFiltersVisible(true)}
          >
            ☰
          </button>

          

        </div>




        <div className="pill-row">
          {['Mobiles', 'Tablets', 'Android', 'Apple'].map((pill) => {
            const isActive = activeCategory === pill;
            return (
              <button
                key={pill}
                className={`category-pill ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setActiveCategory(isActive ? null : pill);
                  setCurrentPage(1);
                }}
              >
                {pill}
              </button>
            );
          })}
        </div>


        {/* Desktop Grid View */}
        <div className="mobile-grid desktop-only">
          {currentMobiles.length > 0 ? (
            currentMobiles.map((mobile) => (
              <div
                key={mobile._id}
                className="mobile-card-link"
                onClick={() => handleCardClick(mobile._id)}
              >
                <div className="mobile-card">
                  <div className="image-wrapper">
                    <img src={mobile.imageUrls?.[0] || '/no-image.png'} alt={mobile.model} />
                  </div>

                  {mobile.isOutOfStock && (
                    <span className="stock-badge-corner out">Out of Stock</span>
                  )}

                  <div className="card-text modern">
                    <p className="brand-text">{mobile.brand}</p>
                    <h4 className="model-text">{mobile.model}</h4>
                    {/* In JSX */}
                    {isDealer ? (
                      <div className="retail-row">
                        <span className="retail-value">₹{mobile.dealerPrice}</span>
                      </div>
                    ) : (
                      <div className="retail-row">
                        <span className="retail-value">₹{mobile.retailPrice}</span>
                      </div>
                    )}



                    {!mobile.isOutOfStock && (
                      <button
                        className="corner-cart-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(mobile);
                          toast.success(`${mobile.brand} ${mobile.model} added to cart`, {
                            position: "top-center",
                            theme: "light",       // Premium light theme
                            autoClose: 1000,      // 1 second duration
                            hideProgressBar: true, // ❌ No animation bar
                            closeOnClick: true,
                            pauseOnHover: false,
                            draggable: false,
                            style: {
                              borderRadius: '12px',
                              padding: '10px 16px',
                              fontSize: '14px',
                              fontWeight: '500',
                              color: '#1f2d3d',
                              background: '#fefefe',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                            },
                          });
                        }}


                      >
                        🛒
                      </button>
                    )}
                    <div className="watermark">JollyBaba Mobiles</div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No mobiles found matching your search.</p>
          )}
        </div>

        {/* Mobile List View */}
        <div className="mobile-list-view mobile-only">
          {currentMobiles.length > 0 ? (
            currentMobiles.map((mobile) => (
              <div
                key={mobile._id}
                className="mobile-list-item"
                onClick={() => handleCardClick(mobile._id)}
              >
                <img
                  className="mobile-list-image"
                  src={mobile.imageUrls?.[0] || '/no-image.png'}
                  alt={mobile.model}
                />
                <div className="mobile-list-details">
                  <div className="mobile-list-title">{mobile.brand} {mobile.model}</div>

                  <div className="mobile-list-specs">
                    {mobile.ram ? `${mobile.ram} / ` : ''}
                    {mobile.storage ? mobile.storage : ''}
                  </div>

                  <div className="mobile-list-price">
                    ₹{isDealer ? mobile.dealerPrice : mobile.retailPrice}
                  </div>

                  <div className="watermark">JollyBaba Mobiles</div>

                  {mobile.isOutOfStock && (
                    <span className="mobile-out-badge">Out of Stock</span>
                  )}
                </div>


                {!mobile.isOutOfStock && (
                  <button
                    className="corner-cart-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(mobile);
                      toast.success(`${mobile.brand} ${mobile.model} added to cart`, {
                        position: "top-center",
                        theme: "light",
                        autoClose: 1000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: false,
                        style: {
                          borderRadius: '12px',
                          padding: window.innerWidth < 768 ? '8px 12px' : '10px 16px',
                          fontSize: window.innerWidth < 768 ? '12px' : '14px',
                          fontWeight: '500',
                          color: '#1f2d3d',
                          background: '#fefefe',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                          maxWidth: window.innerWidth < 768 ? '90%' : '400px',
                          margin: '0 auto',
                        },
                      });

                    }}



                  >
                    🛒
                  </button>
                )}
              </div>
            ))
          ) : (
            <p>No mobiles found.</p>
          )}
        </div>


        {renderPagination()}
      </main>
    </div>
  );
};

export default HomePage;
