import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavbar';
import ManageMobiles from '../pages/ManageMobiles';
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
    price: '',
    color: ''
  });

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchMobiles = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('${process.env.REACT_APP_API_URL}/api/mobiles', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMobiles(data);
    } catch (error) {
      console.error('Failed to fetch mobiles:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

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
    images.forEach((file) => formData.append('images', file));

    try {
      setLoading(true);
      await axios.post('${process.env.REACT_APP_API_URL}/api/mobiles/upload', formData, {
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

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => formData.append(key, val));
      images.forEach((file) => formData.append('images', file));

      await axios.put(`${process.env.REACT_APP_API_URL}/api/mobiles/${editId}`, formData, {
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
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/mobiles/${id}`, {
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

  const resetForm = () => {
    setForm({ brand: '', model: '', ram: '', storage: '', price: '', color: '' });
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
            {['brand', 'model', 'ram', 'storage', 'price', 'color'].map((field) => (
              <input
                key={field}
                name={field}
                type={field === 'price' ? 'number' : 'text'}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={form[field]}
                onChange={handleInputChange}
                required
              />
            ))}

            <label className="upload-button">
              Select Images
              <input
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={(e) => setImages(Array.from(e.target.files))}
              />
            </label>

            {images.length > 0 && (
              <div className="preview-grid">
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={URL.createObjectURL(img)}
                    alt={`Preview ${i}`}
                    className="preview-thumb"
                  />
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
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
