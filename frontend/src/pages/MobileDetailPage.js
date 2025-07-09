import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import './MobileDetailPage.css';

const MobileDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const [mobile, setMobile] = useState(null);
  const [suggestedMobiles, setSuggestedMobiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMobiles = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/mobiles`);
        const found = res.data.find((m) => m._id === id);
        setMobile(found || null);

        // Filter out current and show top 4 recent
        const suggestions = res.data
          .filter((m) => m._id !== id)
          .slice(0, 4);
        setSuggestedMobiles(suggestions);

        if (!found) setError('Mobile not found');
      } catch (err) {
        setError('Mobile not found');
      } finally {
        setLoading(false);
      }
    };

    fetchMobiles();
  }, [id]);

  if (loading) return <div className="mobile-detail-loading">Loading...</div>;
  if (error || !mobile) return <div className="mobile-detail-error">{error || 'Mobile not found'}</div>;

  return (
    <div className="mobile-detail-page">
      <div className="mobile-detail-card">
        <div className="mobile-detail-slider">
          <Swiper
            modules={[EffectCoverflow, Pagination]}
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={'auto'}
            pagination={{ clickable: true }}
            coverflowEffect={{
              rotate: 30,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true,
            }}
          >
            {mobile.imageUrls?.map((url, index) => (
              <SwiperSlide
                key={index}
                className="zoom-container"
                onMouseMove={(e) => {
                  const img = e.currentTarget.querySelector('img');
                  const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - left) / width) * 100;
                  const y = ((e.clientY - top) / height) * 100;
                  img.style.transformOrigin = `${x}% ${y}%`;
                }}
                onMouseLeave={(e) => {
                  const img = e.currentTarget.querySelector('img');
                  img.style.transformOrigin = 'center center';
                }}
              >
                <img src={url} alt={`Mobile ${index}`} />
              </SwiperSlide>

            ))}

          </Swiper>
        </div>

        <div className="mobile-detail-info">
          <h2>{mobile.brand} {mobile.model}</h2>
          <div className="mobile-id-badge">{mobile.mobileId}</div>
          <p><strong>RAM:</strong> {mobile.ram}</p>
          <p><strong>Storage:</strong> {mobile.storage}</p>
          <p><strong>Color:</strong> {mobile.color}</p>
          <p className="price">₹{mobile.price}</p>
          <button className="add-to-cart" onClick={() => addToCart(mobile)}>
            🛒 Add to Cart
          </button>
        </div>
      </div>

      {suggestedMobiles.length > 0 && (
        <div className="suggested-section">
          <h3>You Might Also Like</h3>
          <div className="suggested-grid">
            {suggestedMobiles.map((m) => (
              <div key={m._id} className="suggested-card" onClick={() => navigate(`/mobile/${m._id}`)}>
                <img src={m.imageUrls?.[0]} alt={m.model} />
                <div className="suggested-info">
                  <p className="brand">{m.brand}</p>
                  <p className="model">{m.model}</p>
                  <p className="price">₹{m.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileDetailPage;
