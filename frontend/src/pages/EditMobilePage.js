import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavbar'; // ✅ Import AdminNavbar
import './EditMobilePage.css';

const EditMobilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mobile, setMobile] = useState(null);
  const [form, setForm] = useState({ brand: '', model: '', ram: '', storage: '', price: '', color: '' });
  const [newImages, setNewImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchMobile = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/mobiles/${id}`);
        setMobile(res.data);
        setForm({
          brand: res.data.brand,
          model: res.data.model,
          ram: res.data.ram,
          storage: res.data.storage,
          price: res.data.price,
          color: res.data.color
        });
      } catch (err) {
        console.error('Error loading mobile:', err);
      }
    };
    fetchMobile();
  }, [id]);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleDeleteImage = (publicId) => {
    setImagesToDelete(prev =>
      prev.includes(publicId) ? prev.filter(id => id !== publicId) : [...prev, publicId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => formData.append(key, val));
    newImages.forEach((file) => formData.append('images', file));
    formData.append('imagesToDelete', JSON.stringify(imagesToDelete));

    try {
      await axios.put(`http://localhost:5000/api/mobiles/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Mobile updated successfully');
      navigate('/admin/manage');
    } catch (error) {
      console.error('Update failed:', error);
      alert('Update failed');
    }
  };

  return (
    <div className="edit-mobile-page">
      {/* <AdminNavbar activeTab="edit" setActiveTab={() => {}} /> ✅ Show Admin Navbar */}
      
      <h2>Edit Mobile</h2>
      {mobile && (
        <form onSubmit={handleSubmit} className="edit-form">
          {['brand', 'model', 'ram', 'storage', 'price', 'color'].map((field) => (
            <input
              key={field}
              name={field}
              value={form[field]}
              onChange={handleInputChange}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              required
            />
          ))}

          <label className="image-upload-btn">
            Upload New Images
            <input type="file" multiple accept="image/*" hidden onChange={(e) => setNewImages([...e.target.files])} />
          </label>

          {newImages.length > 0 && (
            <div className="new-preview-grid">
              {newImages.map((img, i) => (
                <img
                  key={i}
                  src={URL.createObjectURL(img)}
                  alt={`New Preview ${i}`}
                  className="preview-thumb"
                />
              ))}
            </div>
          )}

          <div className="existing-images">
            {mobile.imageUrls.map((url, i) => (
              <div
                key={i}
                className={`image-thumb ${imagesToDelete.includes(mobile.imagePublicIds[i]) ? 'selected' : ''}`}
                onClick={() => toggleDeleteImage(mobile.imagePublicIds[i])}
              >
                <img src={url} alt={`Mobile ${i}`} />
                <span className="delete-mark">
                  {imagesToDelete.includes(mobile.imagePublicIds[i]) ? '❌' : '🗸'}
                </span>
              </div>
            ))}
          </div>

          <button type="submit">Save Changes</button>
        </form>
      )}
    </div>
  );
};

export default EditMobilePage;
