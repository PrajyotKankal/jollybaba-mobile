import React, { useEffect, useState, useContext, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { SearchContext } from '../context/SearchContext';
import './HomePage.css';

const HomePage = () => {
  const [mobiles, setMobiles] = useState([]);
  const [filters, setFilters] = useState({ brand: [], ram: [], storage: [], condition: [] });
  const [filteredMobiles, setFilteredMobiles] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState({ brand: true, ram: false, storage: false, condition: false });
  const [mobileFiltersVisible, setMobileFiltersVisible] = useState(false);
  
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
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/mobiles`);

        setMobiles(res.data);
        setFilteredMobiles(res.data);
      } catch (err) {
        console.error('Failed to load catalog:', err);
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
      Object.entries(filters).forEach(([key, values]) => {
        if (values.length > 0) {
          results = results.filter((m) => values.includes(m[key]));
        }
      });

      if (searchQuery.trim()) {
        const lower = searchQuery.toLowerCase();
        results = results.filter(
          (m) =>
            m.brand.toLowerCase().includes(lower) ||
            m.model.toLowerCase().includes(lower)
        );
      }

      setFilteredMobiles(results);
      setCurrentPage(1);
      setMobileFiltersVisible(false);
    };

    applyFilters();
  }, [searchQuery, filters, mobiles]);

  const unique = (key) => [...new Set(mobiles.map((m) => m[key]))];

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
      {mobileFiltersVisible && <div className="overlay" ref={overlayRef}></div>}

      <aside className={`filter-sidebar ${mobileFiltersVisible ? 'visible' : ''}`} ref={sidebarRef}>
        <div className="filter-header-bar">
          <h3>Filters</h3>
          <button className="close-btn" onClick={() => setMobileFiltersVisible(false)}>✕</button>
        </div>

        {['brand', 'ram', 'storage', 'condition'].map((type) => (
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
            🔽 Sort
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
                  <div className="card-text">
                    <h4>{mobile.brand} - {mobile.model}</h4>
                    <p>Click for details</p>
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
