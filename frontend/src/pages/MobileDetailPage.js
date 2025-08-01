import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
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
  const isDealer = userType === 'Dealer';

  const [mobile, setMobile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMobiles = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/mobiles`);
        const found = res.data.find((m) => m._id === id);
        setMobile(found || null);
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
  if (!mobile) return;

  const price = isDealer ? mobile.dealerPrice : mobile.retailPrice;
  const shareText = `Check out this mobile:
${mobile.brand} ${mobile.model}
Price: ₹${price}

${window.location.href}`;

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
      alert('Product link copied to clipboard!');
    } catch {
      alert('Unable to copy the link');
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
            slidesPerView="auto"
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

          {/* Prices under slider - desktop only */}
          <div className="price-stock-wrapper price-under-slider">
            {isDealer ? (
              <div className="price-card small-dealer">
                <p className="price fancy-price small">
                  <span className="currency">₹</span>
                  <span className="amount">{mobile.dealerPrice}</span>
                  <span className="price-label">Dealer Price</span>
                </p>
                <p className="dealer-note">* To get dealer price, buy at least 5 mobiles</p>
              </div>
            ) : (
              <div className="price-card highlight-retail">
                <p className="price fancy-price">
                  <span className="currency">₹</span>
                  <span className="amount">{mobile.retailPrice}</span>
                  <span className="price-label">Retail Price</span>
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mobile-detail-info">
          <h2>{mobile.brand} {mobile.model}</h2>

          <table className="spec-table">
            <tbody>
              <tr><td>Brand</td><td>{mobile.brand}</td></tr>
              <tr><td>Model</td><td>{mobile.model}</td></tr>
              <tr><td>RAM</td><td>{mobile.ram}</td></tr>
              <tr><td>Storage</td><td>{mobile.storage}</td></tr>
              <tr><td>Color</td><td>{mobile.color}</td></tr>
              <tr><td>Device Type</td><td>{mobile.deviceType}</td></tr>
              <tr><td>Network</td><td>{mobile.networkType}</td></tr>
            </tbody>
          </table>

          {/* Prices below Network - mobile only */}
          <div className="price-stock-wrapper mobile-price-block">
            {isDealer ? (
              <div className="price-card small-dealer">
                <p className="price fancy-price small">
                  <span className="currency">₹</span>
                  <span className="amount">{mobile.dealerPrice}</span>
                  <span className="price-label">Dealer Price</span>
                </p>
                <p className="dealer-note">* To get dealer price, buy at least 5 mobiles</p>
              </div>
            ) : (
              <div className="price-card highlight-retail">
                <p className="price fancy-price">
                  <span className="currency">₹</span>
                  <span className="amount">{mobile.retailPrice}</span>
                  <span className="price-label">Retail Price</span>
                </p>
              </div>
            )}
          </div>

          {typeof mobile.isOutOfStock !== 'undefined' && (
            <span className={`stock-status ${mobile.isOutOfStock ? 'out-of-stock' : 'in-stock'}`}>
              {mobile.isOutOfStock ? 'Out of Stock' : '✔ In Stock'}
            </span>
          )}

          {mobile.description && (
            <div className="mobile-description-section">
              <h3>Description</h3>
              <p>{mobile.description}</p>
            </div>
          )}

          <div className="btn-group">
            <button className="share-button" onClick={handleShare}>🔗 Share</button>

            <button
              className="add-to-cart"
              disabled={mobile.isOutOfStock}
              style={mobile.isOutOfStock ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
              onClick={() => {
                if (mobile.isOutOfStock) return;
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
            href={`https://wa.me/917891011841?text=${encodeURIComponent(
              `Hello, I'm interested in buying:\n\nModel: ${mobile.brand} ${mobile.model}\nRAM: ${mobile.ram}\nStorage: ${mobile.storage}\nColor: ${mobile.color}\nPrice: ₹${isDealer ? mobile.dealerPrice : mobile.retailPrice}\nModel ID: ${mobile.mobileId}\n\nView Product: ${window.location.href}`
            )}`}
            className="buy-now-button"
            target="_blank"
            rel="noopener noreferrer"
            style={mobile.isOutOfStock ? { opacity: 0.6, pointerEvents: 'none' } : {}}
          >
            Buy Now
          </a>
        </div>
      </div>

      <ToastContainer newestOnTop closeButton={false} />
    </div>
  );
};

export default MobileDetailPage;
