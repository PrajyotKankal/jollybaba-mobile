import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination } from 'swiper/modules';
import { toast, ToastContainer } from 'react-toastify';
import { UserTypeContext } from '../context/UserTypeContext';

import 'react-toastify/dist/ReactToastify.css';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import './MobileDetailPage.css';

const MobileDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const { userType } = useContext(UserTypeContext);

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

        const suggestions = res.data.filter((m) => m._id !== id).slice(0, 4);
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

  const handleShare = async () => {
    const shareText = `Check out this mobile:\n${mobile.brand} ${mobile.model}\nPrice: ₹${mobile.price}\n\n${window.location.href}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${mobile.brand} ${mobile.model}`,
          text: shareText,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Sharing failed:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      } catch {
        alert('Could not copy the link');
      }
    }
  };

  if (loading) return <div className="mobile-detail-loading">Loading...</div>;
  if (error || !mobile) return <div className="mobile-detail-error">{error || 'Mobile not found'}</div>;

  return (
    <div className="mobile-detail-page">
      <div className="mobile-detail-card">
        <div className="mobile-detail-slider">
          <Swiper
            modules={[EffectCoverflow, Pagination]}
            effect="coverflow"
            grabCursor
            centeredSlides
            slidesPerView={'auto'}
            speed={600}
            pagination={{ clickable: true }}
            coverflowEffect={{
              rotate: 30,
              stretch: 0,
              depth: 120,
              modifier: 1.5,
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
                <div className="image-wrapper-with-watermark">
                  <img src={url} alt={`Mobile ${index}`} />
                  <div className="watermark-text">{mobile.mobileId}</div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="mobile-detail-info">
          <h2>{mobile.brand} {mobile.model}</h2>
          <p><strong>RAM:</strong> {mobile.ram}</p>
          <p><strong>Storage:</strong> {mobile.storage}</p>
          <p><strong>Color:</strong> {mobile.color}</p>
          <p><strong>Device Type:</strong> {mobile.deviceType}</p>
          <p><strong>Network:</strong> {mobile.networkType}</p>

          <p className="price">
            ₹{userType === 'Dealer' ? mobile.dealerPrice : mobile.retailPrice}
          </p>


          <div className="btn-group">
            <button className="share-button" onClick={handleShare}>🔗 Share</button>
            <button
              className="add-to-cart"
              onClick={() => {
                addToCart(mobile);
                toast.success(`${mobile.brand} ${mobile.model} added to cart!`, {
                  position: 'top-center',
                  autoClose: 1000,
                  hideProgressBar: true,
                  closeOnClick: true,
                  pauseOnHover: false,
                  draggable: false,
                  style: {
                    fontSize: '14px',
                    borderRadius: '8px',
                    textAlign: 'center',
                  },
                });

              }}
            >
              🛒 Add to Cart
            </button>
          </div>

          <a
            href={`https://wa.me/918055150475?text=${encodeURIComponent(
              `Hello, I'm interested in buying:\n\nModel: ${mobile.brand} ${mobile.model}\nRAM: ${mobile.ram}\nStorage: ${mobile.storage}\nColor: ${mobile.color}\nPrice: ₹${userType === 'Dealer' ? mobile.dealerPrice : mobile.retailPrice}\nModel ID: ${mobile.mobileId}\n\nView Product: ${window.location.href}`
            )}`}
            className="buy-now-button"
            target="_blank"
            rel="noopener noreferrer"
          >
            Buy Now
          </a>
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
                  <p className="price">
                    ₹{userType === 'Dealer' ? m.dealerPrice : m.retailPrice}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <ToastContainer newestOnTop closeButton={false} />

    </div>
  );
};

export default MobileDetailPage;
