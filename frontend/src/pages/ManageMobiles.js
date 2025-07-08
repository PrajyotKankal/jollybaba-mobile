// components/ManageMobiles.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ManageMobiles = ({ mobiles, search, setSearch, handleEdit, handleDelete }) => {
  const filteredMobiles = mobiles.filter((m) =>
    `${m.brand} ${m.model}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mobile-list">
      <h2>Uploaded Mobiles</h2>
      <input
        className="search-bar"
        type="text"
        placeholder="Search by brand or model..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filteredMobiles.length === 0 ? (
        <p>No mobiles found.</p>
      ) : (
        <div className="grid-view">
          {filteredMobiles.map((mobile) => (
            <div key={mobile._id} className="mobile-card">
              <img src={mobile.imageUrls?.[0] || '/no-image.png'} alt={mobile.model} />
              <div className="mobile-info">
                <h3>{mobile.brand} - {mobile.model}</h3>
                <div className="mobile-id-badge">{mobile.mobileId}</div>
                <p>{mobile.ram} / {mobile.storage}</p>
                <p>{mobile.color} — ₹{mobile.price}</p>
                <div className="action-buttons">
                  <button onClick={() => handleEdit(mobile)} className="edit-btn">Edit</button>
                  <button onClick={() => handleDelete(mobile._id)} className="delete-btn">Delete</button>
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
