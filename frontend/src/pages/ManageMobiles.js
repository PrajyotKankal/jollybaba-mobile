// components/ManageMobiles.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ManageMobiles.css';

const ManageMobiles = ({ mobiles, search, setSearch, handleEdit, handleDelete }) => {
  const navigate = useNavigate();

  const filteredMobiles = mobiles.filter((m) =>
    `${m.brand} ${m.model}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="manage-mobiles">
      <h2>Uploaded Mobiles</h2>

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
            <div key={mobile._id} className="mobile-card">
              <img
                src={mobile.imageUrls?.[0] || '/no-image.png'}
                alt={`${mobile.brand} ${mobile.model}`}
                className="mobile-thumb"
              />
              <div className="mobile-details">
                <h3>{mobile.brand} {mobile.model}</h3>
                <div className="badge-id">{mobile.mobileId}</div>
                <p>{mobile.ram} / {mobile.storage}</p>
                <p>{mobile.color} — ₹{mobile.price}</p>

                <div className="action-buttons">
                  <button className="edit-btn" onClick={() => handleEdit(mobile)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(mobile._id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageMobiles;
