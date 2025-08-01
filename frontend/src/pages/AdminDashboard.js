import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavbar';
import ManageMobiles from '../pages/ManageMobiles';
import imageCompression from 'browser-image-compression';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [mobiles, setMobiles] = useState([]);
  const [images, setImages] = useState([]);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    brand: '',
    model: '',
    ram: '',
    storage: '',
    retailPrice: '',
    dealerPrice: '',
    color: '',
    deviceType: 'Mobile',
    networkType: '4G'
  });


  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const API = process.env.REACT_APP_API_URL;

  const fetchMobiles = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API}/api/mobiles`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMobiles(data);
    } catch (error) {
      console.error('Failed to fetch mobiles:', error);
    } finally {
      setLoading(false);
    }
  }, [API, token]);

  useEffect(() => {
    if (!token) navigate('/login');
    else fetchMobiles();
  }, [token, navigate, fetchMobiles]);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => formData.append(key, val));

    const rotations = images.map((img) => img.rotation || 0);
    images.forEach(({ file }) => {
      formData.append('images', file);
    });
    formData.append('rotations', JSON.stringify(rotations));

    try {
      setLoading(true);
      await axios.post(`${API}/api/mobiles/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      alert('Mobile uploaded successfully!');
      resetForm();
      fetchMobiles();
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload mobile.');
    } finally {
      setLoading(false);
    }
  };

const handleToggleOutOfStock = async (id) => {
  const confirm = window.confirm('Are you sure you want to toggle the stock status of this mobile?');
  if (!confirm) return;

  try {
    await axios.patch(`${API}/api/mobiles/${id}/out-of-stock`, null, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // Refresh list after toggle
    fetchMobiles();
  } catch (error) {
    console.error('Failed to toggle stock status:', error);
    alert('Failed to update stock status.');
  }
};


  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => formData.append(key, val));

    const rotations = images.map((img) => img.rotation || 0);
    images.forEach(({ file }) => formData.append('images', file));
    formData.append('rotations', JSON.stringify(rotations));

    try {
      setLoading(true);
      await axios.put(`${API}/api/mobiles/${editId}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Mobile updated successfully!');
      resetForm();
      fetchMobiles();
    } catch (error) {
      console.error('Update failed:', error);
      alert('Failed to update mobile.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (mobile) => {
    navigate(`/admin/edit/${mobile._id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this mobile?')) return;
    try {
      setLoading(true);
      await axios.delete(`${API}/api/mobiles/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMobiles(mobiles.filter((m) => m._id !== id));
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete mobile.');
    } finally {
      setLoading(false);
    }
  };
  const handleFileInput = async (e) => {
    const files = Array.from(e.target.files);

    const options = {
      fileType: 'image/webp',         // ✅ This ensures conversion to .webp
      maxSizeMB: 0.5,
      maxWidthOrHeight: 800,
      useWebWorker: true
    };

    const compressedImages = await Promise.all(
      files.map(async (file) => {
        try {
          const compressed = await imageCompression(file, options);
          return { file: compressed, rotation: 0 };
        } catch (err) {
          console.error('Compression error:', err);
          return { file, rotation: 0 }; // fallback to original if compression fails
        }
      })
    );

    setImages((prev) => [...prev, ...compressedImages]);
  };


  const resetForm = () => {
    setForm({
      brand: '',
      model: '',
      ram: '',
      storage: '',
      retailPrice: '',
      dealerPrice: '',
      color: '',
      deviceType: 'Mobile',
      networkType: '4G'
    });
    setImages([]);
    setEditId(null);
  };


  return (
    <div className="admin-dashboard">
      {loading && (
        <div className="spinner-overlay">
          <div className="elegant-spinner"></div>
          <div className="spinner-text">Please wait...</div>
        </div>
      )}

      <AdminNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="admin-content">
        {activeTab === 'upload' && (
          <form className="upload-form" onSubmit={editId ? handleUpdate : handleUpload}>
            <h2>{editId ? 'Edit Mobile' : 'Upload Mobile'}</h2>

            <input
              name="brand"
              placeholder="Brand"
              value={form.brand}
              onChange={handleInputChange}
              required
              className="form-input"
            />
            <input
              name="model"
              placeholder="Model"
              value={form.model}
              onChange={handleInputChange}
              required
              className="form-input"
            />
            <input
              name="ram"
              placeholder="RAM"
              value={form.ram}
              onChange={handleInputChange}
              required
              className="form-input"
            />
            <input
              name="storage"
              placeholder="Storage"
              value={form.storage}
              onChange={handleInputChange}
              required
              className="form-input"
            />
            <input
              name="retailPrice"
              type="number"
              placeholder="Retail Price"
              value={form.retailPrice}
              onChange={handleInputChange}
              required
              className="form-input"
            />
            <input
              name="dealerPrice"
              type="number"
              placeholder="Wholesale Price"
              value={form.dealerPrice}
              onChange={handleInputChange}
              required
              className="form-input"
            />
            <input
              name="color"
              placeholder="Color"
              value={form.color}
              onChange={handleInputChange}
              required
              className="form-input"
            />

            <textarea
              name="description"
              placeholder="Enter product description..."
              value={form.description}
              onChange={handleInputChange}
              rows={5}
              className="textarea-description"
            />



            <select name="deviceType" value={form.deviceType} onChange={handleInputChange}>
              <option value="Mobile">Mobile</option>
              <option value="Tablet">Tablet</option>
            </select>

            <select name="networkType" value={form.networkType} onChange={handleInputChange}>
              <option value="5G">5G</option>
              <option value="4G">4G</option>
              <option value="3G">3G</option>
              <option value="2G">2G</option>
            </select>

            <div className="image-upload-options">

              <label className="upload-button">
                Capture from Camera
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  multiple
                  hidden
                  onChange={handleFileInput}
                />
              </label>

              <label className="upload-button">
                Select from Gallery
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={handleFileInput}
                />
              </label>

            </div>



            {images.length > 0 && (
              <div className="preview-grid">
                {images.map((img, i) => (
                  <div key={i} className="preview-item">
                    <img
                      src={URL.createObjectURL(img.file)}
                      alt={`Preview ${i}`}
                      className="preview-thumb"
                      style={{ transform: `rotate(${img.rotation}deg)` }}
                    />
                    <button
                      type="button"
                      className="rotate-btn"
                      onClick={() => {
                        const updated = [...images];
                        updated[i].rotation = (updated[i].rotation + 90) % 360;
                        setImages(updated);
                      }}
                    >
                      🔄
                    </button>
                    <button
                      type="button"
                      className="preview-delete-btn"
                      onClick={() => {
                        const updated = images.filter((_, index) => index !== i);
                        setImages(updated);
                      }}
                    >
                      ❌
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button type="submit">{editId ? 'Update Mobile' : 'Upload Mobile'}</button>
            {editId && (
              <button type="button" className="cancel-btn" onClick={resetForm}>
                Cancel Edit
              </button>
            )}
          </form>
        )}

        {activeTab === 'manage' && (
          <ManageMobiles
            mobiles={mobiles}
            search={search}
            setSearch={setSearch}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            handleToggleOutOfStock={handleToggleOutOfStock} // 🔁 Add this

          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
