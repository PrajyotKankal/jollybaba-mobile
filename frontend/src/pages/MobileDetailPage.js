// MobileDetailPage.js
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMobile = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/mobiles`);
        const found = res.data.find((m) => m._id === id);
        if (found) setMobile(found);
        else setError('Mobile not found');
      } catch (err) {
        setError('Mobile not found');
      } finally {
        setLoading(false);
      }
    };

    fetchMobile();
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
              <SwiperSlide key={index}>
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
    </div>
  );
};

export default MobileDetailPage;
