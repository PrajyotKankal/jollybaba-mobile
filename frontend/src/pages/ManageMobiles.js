import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ManageMobiles.css';

const ITEMS_PER_PAGE = 20;

const ManageMobiles = ({ mobiles, search, setSearch, handleEdit, handleDelete }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const filteredMobiles = mobiles.filter((mobile) =>
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

      <input
        type="text"
        className="search-input"
        placeholder="Search by brand or model..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1); // Reset to page 1 when search changes
        }}
      />

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
              />
            ))}
          </div>

          <div className="pagination">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`page-button ${currentPage === i + 1 ? 'active' : ''}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const MobileCard = ({ mobile, navigate, handleEdit, handleDelete }) => {
  const handleCardClick = () => navigate(`/mobile/${mobile._id}`);
  const handleEditClick = (e) => {
    e.stopPropagation();
    handleEdit(mobile);
  };
  const handleDeleteClick = (e) => {
    e.stopPropagation();
    handleDelete(mobile._id);
  };

  return (
    <div className="mobile-card clickable-card" onClick={handleCardClick}>
      <div className="mobile-thumb-wrapper">
        <img
          src={mobile.imageUrls?.[0] || '/no-image.png'}
          alt={`${mobile.brand} ${mobile.model}`}
          className="mobile-thumb-image"
        />
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
        </div>
      </div>
    </div>
  );
};

export default ManageMobiles;
