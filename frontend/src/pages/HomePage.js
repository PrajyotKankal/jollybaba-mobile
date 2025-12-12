import React, { useEffect, useState, useContext, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import fuzzysort from 'fuzzysort';
import { SearchContext } from '../context/SearchContext';
import { UserTypeContext } from '../context/UserTypeContext';
import { CartContext } from '../context/CartContext';
import { toast } from 'react-toastify';
import SEO from '../components/SEO';



import './HomePage.css';

const HomePage = () => {
  const [mobiles, setMobiles] = useState([]);
  const [priceCap, setPriceCap] = useState(-1);

  const [filters, setFilters] = useState({ brand: [], ram: [], storage: [] });
  const [filteredMobiles, setFilteredMobiles] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState({ brand: false, ram: false, storage: false });
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
  const pillRowRef = useRef();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const mobilesPerPage = 20;

  useEffect(() => {
    const fetchMobiles = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/mobiles`,
          { withCredentials: true } // set to false if you DON'T use cookies
        );
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

      // Search query filter - using fuzzy search
      if (searchQuery.trim()) {
        const query = searchQuery.trim();

        // Prepare searchable targets for each mobile
        const searchTargets = results.map(m => ({
          mobile: m,
          searchText: [m.brand, m.model, m.ram, m.storage, m.color]
            .filter(Boolean)
            .join(' ')
        }));

        // Use fuzzysort to find matches
        const fuzzyResults = fuzzysort.go(query, searchTargets, {
          key: 'searchText',
          threshold: -10000, // Lower = more lenient matching
          limit: 500
        });

        // If we have fuzzy results, use them
        if (fuzzyResults.length > 0) {
          results = fuzzyResults.map(r => r.obj.mobile);
        } else {
          // Fallback: if no fuzzy match, try exact includes as last resort
          const lower = query.toLowerCase();
          results = results.filter((m) =>
            [m.brand, m.model, m.ram, m.storage, m.color, String(m.retailPrice), String(m.dealerPrice)]
              .filter(Boolean)
              .some((field) => field.toLowerCase().includes(lower))
          );
        }
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

  const scrollToPills = () => {
    if (pillRowRef.current) {
      pillRowRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const renderPagination = () => (
    <div className="pagination-nav">
      <button
        className="page-btn"
        onClick={() => {
          setCurrentPage((prev) => Math.max(prev - 1, 1));
          scrollToPills();
        }}
        disabled={currentPage === 1}
      >
        Back
      </button>

      <span className="page-status">Page {currentPage} of {totalPages}</span>

      <button
        className="page-btn"
        onClick={() => {
          setCurrentPage((prev) => Math.min(prev + 1, totalPages));
          scrollToPills();
        }}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );


  const handleCardClick = (id) => {
    navigate(`/mobile/${id}`);
  };

  return (
    <div className="homepage-container">
      <SEO
        title="Best Second Hand Mobile Shop in Pune Deccan"
        description="Buy genuine new & second hand mobile phones at best prices in Pune. iPhone, Samsung, OnePlus, Vivo, Oppo available. Wholesale & retail. 5★ rated on Google. JollyBaba Mobiles, Deccan Gymkhana, JM Road."
        keywords="second hand mobile Pune, used phone Pune, mobile shop Deccan, JollyBaba Mobiles, refurbished phones Pune, iPhone Pune, Samsung Pune, OnePlus Pune, mobile dealer Pune, wholesale mobile Pune"
        canonical="https://jollybaba.in/"
      />

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

            <h3>Filters</h3>

            <button
              className="close-btn mobile-only"
              onClick={() => setMobileFiltersVisible(false)}
            >
              ✕
            </button>
          </div>


          <div className="filter-sidebar-content">
            {/* Brand Filter (Custom Checkboxes) */}
            <div className="filter-group">
              <div className="filter-header" onClick={() => toggleDropdown('brand')}>
                <span>Brand</span>
                <span className="arrow">{dropdownOpen.brand ? '−' : '+'}</span>
              </div>
              <div className={`filter-content ${dropdownOpen.brand ? 'open' : ''}`}>
                <div className="filter-options">
                  {unique('brand').map((val) => (
                    <label key={val} className="custom-checkbox-row">
                      <input
                        type="checkbox"
                        onChange={() => handleCheckboxChange('brand', val)}
                        checked={filters.brand.includes(val)}
                      />
                      <span className="checkmark"></span>
                      <span className="label-text">{val}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* RAM Filter (Pills) */}
            <div className="filter-group">
              <div className="filter-header" onClick={() => toggleDropdown('ram')}>
                <span>RAM</span>
                <span className="arrow">{dropdownOpen.ram ? '−' : '+'}</span>
              </div>
              <div className={`filter-content ${dropdownOpen.ram ? 'open' : ''}`}>
                <div className="filter-options-pills">
                  {unique('ram').map((val) => (
                    <button
                      key={val}
                      className={`filter-pill ${filters.ram.includes(val) ? 'active' : ''}`}
                      onClick={() => handleCheckboxChange('ram', val)}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Storage Filter (Pills) */}
            <div className="filter-group">
              <div className="filter-header" onClick={() => toggleDropdown('storage')}>
                <span>Storage</span>
                <span className="arrow">{dropdownOpen.storage ? '−' : '+'}</span>
              </div>
              <div className={`filter-content ${dropdownOpen.storage ? 'open' : ''}`}>
                <div className="filter-options-pills">
                  {unique('storage').map((val) => (
                    <button
                      key={val}
                      className={`filter-pill ${filters.storage.includes(val) ? 'active' : ''}`}
                      onClick={() => handleCheckboxChange('storage', val)}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            </div>

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

          <div className="pill-row" ref={pillRowRef}>
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

          {/* Catalog Controls - Sort & Results */}
          <div className="catalog-controls">
            <div className="results-count">
              Showing {currentMobiles.length} of {filteredMobiles.length} products
            </div>

            <select
              className="sort-dropdown"
              onChange={(e) => {
                const value = e.target.value;
                const sorted = [...filteredMobiles];
                if (value === 'price-low') sorted.sort((a, b) => (isDealer ? a.dealerPrice : a.retailPrice) - (isDealer ? b.dealerPrice : b.retailPrice));
                else if (value === 'price-high') sorted.sort((a, b) => (isDealer ? b.dealerPrice : b.retailPrice) - (isDealer ? a.dealerPrice : a.retailPrice));
                else if (value === 'name') sorted.sort((a, b) => `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`));
                setFilteredMobiles(sorted);
              }}
            >
              <option value="">Sort By</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>

          {/* Active Filter Chips */}
          {isFilterActive && (
            <div className="active-filters">
              {Object.entries(filters).map(([key, values]) =>
                values.map(value => (
                  <span key={`${key}-${value}`} className="filter-chip">
                    {value}
                    <button
                      className="chip-remove"
                      onClick={() => {
                        setFilters(prev => ({
                          ...prev,
                          [key]: prev[key].filter(v => v !== value)
                        }));
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))
              )}
              {priceCap !== -1 && (
                <span className="filter-chip">
                  Price: ₹{priceCap.toLocaleString()}
                  <button className="chip-remove" onClick={() => setPriceCap(-1)}>×</button>
                </span>
              )}
            </div>
          )}

          {/* Unified Grid View */}
          <div className="mobile-grid">
            {currentMobiles.length > 0 ? (
              currentMobiles.map((mobile) => (
                <div
                  key={mobile._id}
                  className="mobile-card-link"
                  onClick={() => handleCardClick(mobile._id)}
                >
                  <div className="mobile-card">
                    <div className="image-wrapper">
                      <img
                        src={mobile.imageUrls?.[0] || '/no-image.png'}
                        alt={`${mobile.brand} ${mobile.model} - Second hand mobile phone in Pune at JollyBaba Mobiles`}
                        loading="lazy"
                      />
                    </div>

                    {mobile.isOutOfStock && (
                      <span className="stock-badge-corner out">Out of Stock</span>
                    )}

                    <div className="card-text modern">
                      <p className="brand-text">{mobile.brand}</p>
                      <h4 className="model-text">{mobile.model}</h4>
                      {(mobile.ram || mobile.storage) && (
                        <p className="specs-text">
                          {mobile.ram && <span>{mobile.ram}</span>}
                          {mobile.ram && mobile.storage && <span className="specs-divider">•</span>}
                          {mobile.storage && <span>{mobile.storage}</span>}
                        </p>
                      )}
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
                              theme: "light",
                              autoClose: 1000,
                              hideProgressBar: true,
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
                    </div>
                    <div className="watermark">JollyBaba Mobiles</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">📱</div>
                <h3>No Products Found</h3>
                <p>We couldn't find any products matching your filters. Try adjusting your search or clearing filters.</p>
                <button
                  className="empty-state-btn"
                  onClick={() => {
                    setFilters({ brand: [], ram: [], storage: [] });
                    setPriceCap(-1);
                    setSearchQuery('');
                    setActiveCategory(null);
                  }}
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>


          {renderPagination()}
        </main>

      </div>

      {/* Featured Products Carousel - At Bottom */}
      {!loading && filteredMobiles.length > 0 && (
        <section className="featured-section">
          <div className="featured-container">
            <div className="featured-header">
              <h2>Featured Products</h2>
              <p>Handpicked premium smartphones just for you</p>
            </div>
            <div className="featured-carousel">
              {filteredMobiles.slice(0, 8).map((mobile) => (
                <div
                  key={mobile._id}
                  className="featured-card"
                  onClick={() => handleCardClick(mobile._id)}
                >
                  <div className="featured-image">
                    <img
                      src={mobile.imageUrls?.[0] || '/no-image.png'}
                      alt={`Buy ${mobile.brand} ${mobile.model} at best price in Pune`}
                      loading="lazy"
                    />
                    {mobile.isOutOfStock && (
                      <span className="featured-badge out">Out of Stock</span>
                    )}
                    {!mobile.isOutOfStock && Math.random() > 0.7 && (
                      <span className="featured-badge new">New</span>
                    )}
                  </div>
                  <div className="featured-info">
                    <p className="featured-brand">{mobile.brand}</p>
                    <h4 className="featured-model">{mobile.model}</h4>
                    <p className="featured-price">
                      ₹{isDealer ? mobile.dealerPrice?.toLocaleString() : mobile.retailPrice?.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;
