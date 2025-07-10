import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ManageMobiles.css';

const ManageMobiles = ({ mobiles, search, setSearch, handleEdit, handleDelete }) => {
  const navigate = useNavigate();

  const filteredMobiles = mobiles.filter((mobile) =>
    `${mobile.brand} ${mobile.model}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="manage-mobiles">
      <h2 className="manage-title">Uploaded Mobiles</h2>

      <input
        type="text"
        className="search-input"
        placeholder="Search by brand or model..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filteredMobiles.length === 0 ? (
        <p className="no-results">No mobiles found.</p>
      ) : (
        <div className="mobiles-grid">
          {filteredMobiles.map((mobile) => (
            <MobileCard
              key={mobile._id}
              mobile={mobile}
              navigate={navigate}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          ))}
        </div>
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
        <p className="spec-line">{mobile.color} — ₹{mobile.price}</p>

        <div className="action-buttons">
          <button className="edit-btn" onClick={handleEditClick}>Edit</button>
          <button className="delete-btn" onClick={handleDeleteClick}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default ManageMobiles;
