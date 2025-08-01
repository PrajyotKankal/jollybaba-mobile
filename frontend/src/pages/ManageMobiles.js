import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ManageMobiles.css';

const ITEMS_PER_PAGE = 20;

const ManageMobiles = ({ mobiles, search, setSearch, handleEdit, handleDelete, handleToggleOutOfStock }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState(null);

  // Filter mobiles by selected category
  const filteredByCategory = activeCategory
    ? mobiles.filter(mobile => {
        const cat = activeCategory.toLowerCase();
        if (cat === 'mobiles') return mobile.deviceType?.toLowerCase() === 'mobile';
        if (cat === 'tablets') return mobile.deviceType?.toLowerCase() === 'tablet';
        if (cat === 'android') return mobile.brand?.toLowerCase() !== 'apple';
        if (cat === 'apple') return mobile.brand?.toLowerCase() === 'apple';
        return true;
      })
    : mobiles;

  // Then filter by search text (brand + model)
  const filteredMobiles = filteredByCategory.filter((mobile) =>
    `${mobile.brand} ${mobile.model}`.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredMobiles.length / ITEMS_PER_PAGE);
  const paginatedMobiles = filteredMobiles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="manage-mobiles">
      <h2 className="manage-title">Uploaded Mobiles</h2>

      {/* Category Pills */}
      

      <input
        type="text"
        className="search-input"
        placeholder="Search by brand or model..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
      />

      <div className="category-pills">
        {['Mobiles', 'Tablets', 'Android', 'Apple'].map((pill) => {
          const isActive = activeCategory === pill;
          return (
            <button
              key={pill}
              className={`pill-button ${isActive ? 'active' : ''}`}
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

      {paginatedMobiles.length === 0 ? (
        <p className="no-results">No mobiles found.</p>
      ) : (
        <>
          <div className="mobiles-grid">
            {paginatedMobiles.map((mobile) => (
              <MobileCard
                key={mobile._id}
                mobile={mobile}
                navigate={navigate}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                handleToggleOutOfStock={handleToggleOutOfStock}
              />
            ))}
          </div>

<div className="pagination">
  <button
    className="page-button"
    onClick={() => handlePageChange(currentPage - 1)}
    disabled={currentPage === 1}
  >
    ← Back
  </button>

  <span className="page-info">
    Page {currentPage} of {totalPages}
  </span>

  <button
    className="page-button"
    onClick={() => handlePageChange(currentPage + 1)}
    disabled={currentPage === totalPages}
  >
    Next →
  </button>
</div>

        </>
      )}
    </div>
  );
};

const MobileCard = ({ mobile, navigate, handleEdit, handleDelete, handleToggleOutOfStock }) => {
  const handleCardClick = () => navigate(`/mobile/${mobile._id}`);
  const handleEditClick = (e) => {
    e.stopPropagation();
    handleEdit(mobile);
  };
  const handleDeleteClick = (e) => {
    e.stopPropagation();
    handleDelete(mobile._id);
  };
  const handleStockToggle = (e) => {
    e.stopPropagation();
    handleToggleOutOfStock(mobile._id);
  };

  return (
    <div className="mobile-card clickable-card" onClick={handleCardClick}>
      <div className="mobile-thumb-wrapper">
        <img
          src={mobile.imageUrls?.[0] || '/no-image.png'}
          alt={`${mobile.brand} ${mobile.model}`}
          className="mobile-thumb-image"
        />
        {mobile.isOutOfStock && <div className="stock-label">Out of Stock</div>}
      </div>

      <div className="mobile-details">
        <h3 className="mobile-title">{mobile.brand} {mobile.model}</h3>
        <div className="badge-id">{mobile.mobileId}</div>
        <p className="spec-line">{mobile.ram} / {mobile.storage}</p>
        <p className="spec-line">
          {mobile.color} —{' '}
          <span className="price-label">Retail:</span> ₹{Number(mobile.retailPrice).toLocaleString('en-IN')}{' '}
          <span className="price-label">Dealer:</span> ₹{Number(mobile.dealerPrice).toLocaleString('en-IN')}
        </p>

        <div className="action-buttons">
          <button className="edit-btn" onClick={handleEditClick}>Edit</button>
          <button className="delete-btn" onClick={handleDeleteClick}>Delete</button>
          <button
            className={`stock-btn ${mobile.isOutOfStock ? 'out' : 'in'}`}
            onClick={handleStockToggle}
          >
            {mobile.isOutOfStock ? 'In Stock' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageMobiles;
