import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavbar';
import './EditMobilePage.css';

const EditMobilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [mobile, setMobile] = useState(null);
  const [form, setForm] = useState({
    brand: '',
    model: '',
    ram: '',
    storage: '',
    retailPrice: '',
    dealerPrice: '',
    color: ''
  });


  const [newImages, setNewImages] = useState([]); // { file, rotation }
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [existingImageRotations, setExistingImageRotations] = useState({}); // { publicId: rotation }

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchMobile = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/mobiles/${id}`);
        setMobile(res.data);
        setForm({
          brand: res.data.brand,
          model: res.data.model,
          ram: res.data.ram,
          storage: res.data.storage,
          retailPrice: res.data.retailPrice,
          dealerPrice: res.data.dealerPrice,
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
    setImagesToDelete((prev) =>
      prev.includes(publicId) ? prev.filter((id) => id !== publicId) : [...prev, publicId]
    );
  };

  const rotateFileWithCanvas = (file, degrees) => {
    return new Promise((resolve) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target.result;
      };

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const angle = (degrees * Math.PI) / 180;

        if (degrees % 180 === 0) {
          canvas.width = img.width;
          canvas.height = img.height;
        } else {
          canvas.width = img.height;
          canvas.height = img.width;
        }

        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(angle);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);

        canvas.toBlob((blob) => {
          const newFile = new File([blob], file.name, { type: file.type });
          resolve(newFile);
        }, file.type);
      };

      reader.readAsDataURL(file);
    });
  };

  const rotateImage = async (index) => {
    const { file, rotation = 0 } = newImages[index];
    const newRotation = (rotation + 90) % 360;
    const rotatedFile = await rotateFileWithCanvas(file, newRotation);

    const updated = [...newImages];
    updated[index] = { file: rotatedFile, rotation: newRotation };
    setNewImages(updated);
  };

  const removeNewImage = (index) => {
    const updated = newImages.filter((_, i) => i !== index);
    setNewImages(updated);
  };

  const rotateExistingImage = (publicId) => {
    setExistingImageRotations((prev) => ({
      ...prev,
      [publicId]: ((prev[publicId] || 0) + 90) % 360
    }));
  };

  const handleNewImageChange = (e) => {
    const files = Array.from(e.target.files).map((file) => ({
      file,
      rotation: 0
    }));
    setNewImages((prev) => [...prev, ...files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.entries(form).forEach(([key, val]) => formData.append(key, val));
    const rotations = newImages.map(() => 0); // ✅ Since images are pre-rotated via canvas
    newImages.forEach(({ file }) => formData.append('images', file));

    formData.append('rotations', JSON.stringify(rotations));
    formData.append('imagesToDelete', JSON.stringify(imagesToDelete));
    formData.append('existingRotations', JSON.stringify(existingImageRotations));

    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/mobiles/${id}`, formData, {
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
      <AdminNavbar activeTab="edit" setActiveTab={() => { }} />
      <h2>Edit Mobile</h2>
      {mobile && (
        <form onSubmit={handleSubmit} className="edit-form">
          {['brand', 'model', 'ram', 'storage', 'retailPrice', 'dealerPrice', 'color'].map((field) => (
            <input
              key={field}
              name={field}
             type={field.toLowerCase().includes('price') ? 'number' : 'text'}
min={field.toLowerCase().includes('price') ? 1 : undefined}

              value={form[field]}
              onChange={handleInputChange}
              placeholder={
                field === 'retailPrice'
                  ? 'Retail Price'
                  : field === 'dealerPrice'
                    ? 'Wholesale Price'
                    : field.charAt(0).toUpperCase() + field.slice(1)
              }
              required
            />
          ))}


          <label className="image-upload-btn">
            Upload New Images
            <input type="file" multiple accept="image/*" hidden onChange={handleNewImageChange} />
          </label>

          {newImages.length > 0 && (
            <div className="new-preview-grid">
              {newImages.map((img, i) => (
                <div key={i} className="preview-item">
                  <img
                    src={URL.createObjectURL(img.file)}
                    alt={`New Preview ${i}`}
                    className="preview-thumb"
                    style={{ transform: `rotate(${img.rotation}deg)` }}
                  />
                  <button type="button" className="rotate-btn" onClick={() => rotateImage(i)}>🔄</button>
                  <button type="button" className="preview-delete-btn" onClick={() => removeNewImage(i)}>❌</button>
                </div>
              ))}
            </div>
          )}

          <div className="existing-images">
            {mobile.imageUrls.map((url, i) => {
              const publicId = mobile.imagePublicIds[i];
              const rotation = existingImageRotations[publicId] || 0;
              return (
                <div
                  key={i}
                  className={`image-thumb ${imagesToDelete.includes(publicId) ? 'selected' : ''}`}
                  onClick={() => toggleDeleteImage(publicId)}
                >
                  <img
                    src={url}
                    alt={`Mobile ${i}`}
                    style={{ transform: `rotate(${rotation}deg)` }}
                  />
                  <button
                    type="button"
                    className="rotate-btn"
                    onClick={(e) => {
                      e.stopPropagation(); // prevent toggling delete
                      rotateExistingImage(publicId);
                    }}
                  >
                    🔄
                  </button>
                  <span className="delete-mark">
                    {imagesToDelete.includes(publicId) ? '❌' : '🗸'}
                  </span>
                </div>
              );
            })}
          </div>

          <button type="submit">Save Changes</button>
        </form>
      )}
    </div>
  );
};

export default EditMobilePage;
