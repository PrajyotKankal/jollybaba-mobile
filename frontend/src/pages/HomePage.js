import React, { useEffect, useState, useContext, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { SearchContext } from '../context/SearchContext';
import './HomePage.css';

const HomePage = () => {
  const [mobiles, setMobiles] = useState([]);
  const [filters, setFilters] = useState({ brand: [], ram: [], storage: []});
  const [filteredMobiles, setFilteredMobiles] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState({ brand: true, ram: false, storage: false });
  const [mobileFiltersVisible, setMobileFiltersVisible] = useState(false);
  const [loading, setLoading] = useState(true);


  const { searchQuery } = useContext(SearchContext);
  const sidebarRef = useRef();
  const overlayRef = useRef();
  const navigate = useNavigate();

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const mobilesPerPage = 20;

  useEffect(() => {
    const fetchMobiles = async () => {
      try {
        setLoading(true); // start loading
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/mobiles`);
        setMobiles(res.data);
        setFilteredMobiles(res.data);
      } catch (err) {
        console.error('Failed to load catalog:', err);
      } finally {
        setLoading(false); // stop loading
      }
    };
    fetchMobiles();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        mobileFiltersVisible &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target) &&
        overlayRef.current &&
        overlayRef.current.contains(e.target)
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

      // Apply checkbox filters
      Object.entries(filters).forEach(([key, values]) => {
        if (values.length > 0) {
          results = results.filter((m) => {
            const val = m[key];

            // Normalize RAM and Storage values
            if ((key === 'ram' || key === 'storage') && val) {
              const normalized = `${parseInt(val)} GB`; // convert '4gb' or '4 GB' → '4 GB'
              return values.includes(normalized);
            }

            // Normalize brand casing
            if (key === 'brand' && val) {
              const normalized = val.trim().toLowerCase();
              return values.map(v => v.toLowerCase()).includes(normalized);
            }

            // Default case
            return values.includes(val);
          });
        }
      });

      // Apply text search
      if (searchQuery.trim()) {
        const lower = searchQuery.toLowerCase();
        results = results.filter((m) =>
          [
            m.brand,
            m.model,
            m.ram,
            m.storage,
            m.color,
            String(m.price),
          ]
            .filter(Boolean)
            .some((field) => field.toLowerCase().includes(lower))
        );
      }

      setFilteredMobiles(results);
      setCurrentPage(1);
      setMobileFiltersVisible(false);
    };

    applyFilters();
  }, [searchQuery, filters, mobiles]);


  const unique = (key) => {
    let values = mobiles.map((m) => m[key]).filter(Boolean);

    if (key === 'ram' || key === 'storage') {
      const seen = new Set();
      return values
        .map((val) => {
          const num = parseInt(val); // Extract number from "128GB", "128 GB", etc.
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

  // Pagination logic
  const indexOfLast = currentPage * mobilesPerPage;
  const indexOfFirst = indexOfLast - mobilesPerPage;
  const currentMobiles = filteredMobiles.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredMobiles.length / mobilesPerPage);

  const renderPagination = () => (
    <div className="pagination">
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i + 1}
          onClick={() => setCurrentPage(i + 1)}
          className={currentPage === i + 1 ? 'active' : ''}
        >
          {i + 1}
        </button>
      ))}
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
          <button className="close-btn" onClick={() => setMobileFiltersVisible(false)}>✕</button>
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

        <button className="search-button">Apply Filters</button>
      </aside>

      <main className="catalog-section">
        <div className="filter-topbar">

          <button className="filter-toggle-btn" onClick={() => setMobileFiltersVisible(true)}>
            📋 Filter
          </button>

        </div>

        <h2>Available Mobiles</h2>
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
                    <img src={mobile.imageUrls?.[0] || '/no-image.png'} alt={mobile.model} />
                  </div>
                  <div className="card-text modern">
                    <p className="brand-text">{mobile.brand}</p>
                    <h4 className="model-text">{mobile.model}</h4>
                    <p className="price-text">₹{mobile.price}</p>
                  </div>
                </div>


              </div>
            ))
          ) : (
            <p>No mobiles found matching your search.</p>
          )}
        </div>

        {renderPagination()}
      </main>
    </div>
  );
};

export default HomePage;
