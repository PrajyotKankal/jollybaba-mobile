// src/pages/MobileDetailPage.jsx
import React, {
  useEffect,
  useMemo,
  useState,
  useContext,
  useCallback,
  useRef,
} from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { UserTypeContext } from '../context/UserTypeContext';

import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './MobileDetailPage.css';

/* ================= Utils ================= */
const API_BASE = process.env.REACT_APP_API_URL;

const formatINR = (value) => {
  const n = Number(value);
  return Number.isFinite(n)
    ? new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(n)
    : value ?? '';
};

const U = (v) => (v ? String(v).toUpperCase() : '-');

// Build canonical URL from current domain (no hardcoding)
const getCanonicalProductUrl = (id) =>
  typeof window !== 'undefined'
    ? new URL(`/mobile/${id}`, window.location.origin).href
    : `/mobile/${id}`;

const isMobileUA = () =>
  typeof navigator !== 'undefined' &&
  (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    navigator.userAgentData?.mobile === true);

/* === Share button text — EXACT emojis/order/spacing as requested === */
const buildShareMessage = (mobile, price, url) => {
  const lines = [
    'Check out this mobile:',
    `📱 Model: ${U(`${mobile?.brand ?? ''} ${mobile?.model ?? ''}`.trim())}`,
    `🆔 Model ID: ${mobile?.mobileId ?? '-'}`,
    `💰 Price: ₹${formatINR(price ?? '-')}`,
    '',
    '   Specifications: ',
    `• 📦 RAM: ${U(mobile?.ram ?? '-')}`,
    `• 📀 Storage: ${U(mobile?.storage ?? '-')}`,
    `• 🎨 Color: ${U(mobile?.color ?? '-')}`,
    `• 🔌 Device Type: ${U(mobile?.deviceType ?? '-')}`,
    `• 📶 Network: ${U(mobile?.networkType ?? '-')}`,
    '',
    `🔗 View Details: ${url || ''}`,
  ];
  return lines.join('\n').replace(/\r?\n/g, '\n');
};

/* === Buy Now text — EXACT emojis/order/spacing as requested === */
const buildBuyNowMessage = (mobile, price, url) => {
  const lines = [
    "Hello, I'm interested in buying:",
    '',
    `📱 Model: ${U(`${mobile?.brand ?? ''} ${mobile?.model ?? ''}`.trim())}`,
    `🆔 Model ID: ${mobile?.mobileId ?? '-'}`,
    `💰 Price: ₹${formatINR(price ?? '-')}`,
    '',
    '   Specifications: ',
    `• 📦 RAM: ${U(mobile?.ram ?? '-')}`,
    `• 📀 Storage: ${U(mobile?.storage ?? '-')}`,
    `• 🎨 Color: ${U(mobile?.color ?? '-')}`,
    `• 🔌 Device Type: ${U(mobile?.deviceType ?? '-')}`,
    `• 📶 Network: ${U(mobile?.networkType ?? '-')}`,
    '',
    `🔗 View Details: ${url || ''}`,
  ];
  return lines.join('\n').replace(/\r?\n/g, '\n');
};

/* =============== Component =============== */
const MobileDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const { userType } = useContext(UserTypeContext);
  const isDealer = userType === 'Dealer';

  const [mobile, setMobile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [similarProducts, setSimilarProducts] = useState([]);
  const swiperRef = useRef(null);

  // New feature states
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('overview');

  // NEW: backend-provided short link (with fallback to canonical)
  const [shareLink, setShareLink] = useState('');
  const [linkLoading, setLinkLoading] = useState(false);

  // Scroll to top on id change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [id]);

  // Load mobile
  useEffect(() => {
    if (!API_BASE) {
      setError('API base URL missing: set REACT_APP_API_URL');
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const startTime = Date.now();
    setLoading(true);
    setError('');
    setMobile(null);

    (async () => {
      try {
        try {
          const res = await axios.get(`${API_BASE}/api/mobiles/${id}`, {
            signal: controller.signal,
          });
          setMobile(res.data);
        } catch {
          const resAll = await axios.get(`${API_BASE}/api/mobiles`, {
            signal: controller.signal,
          });
          const found = Array.isArray(resAll.data)
            ? resAll.data.find((m) => String(m._id) === String(id))
            : null;
          setMobile(found || null);
          if (!found) setError('Mobile not found');
        }
      } catch (e) {
        if (!axios.isCancel(e)) setError('Failed to load mobile');
      } finally {
        // Ensure minimum 3 seconds loading time
        const elapsed = Date.now() - startTime;
        const remainingTime = Math.max(0, 3000 - elapsed);

        setTimeout(() => {
          setLoading(false);
        }, remainingTime);
      }
    })();

    return () => controller.abort();
  }, [id]);

  // NEW: Fetch backend short link; if it fails we'll fall back to canonical
  useEffect(() => {
    if (!API_BASE || !id) return;
    const ac = new AbortController();
    setLinkLoading(true);
    setShareLink('');
    (async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/api/mobiles/${id}/link`, {
          signal: ac.signal,
        });
        if (data?.link) setShareLink(String(data.link));
      } catch {
        // ignore; fallback used below
      } finally {
        setLinkLoading(false);
      }
    })();
    return () => ac.abort();
  }, [id]);

  // Title
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (mobile?.brand || mobile?.model) {
      document.title = `${mobile?.brand ?? ''} ${mobile?.model ?? ''} • JOLLYBABA`;
    } else {
      document.title = 'Mobile • JOLLYBABA';
    }
  }, [mobile]);

  // Fetch similar products
  useEffect(() => {
    if (!mobile || !API_BASE) return;

    (async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/mobiles`);
        if (Array.isArray(res.data)) {
          // Get similar products from same brand, excluding current product
          const similar = res.data
            .filter(m => m.brand === mobile.brand && m._id !== mobile._id)
            .slice(0, 6); // Get max 6 similar products
          setSimilarProducts(similar);
        }
      } catch (error) {
        // Silently fail - similar products are optional
        console.error('Failed to load similar products:', error);
      }
    })();
  }, [mobile]);

  // Track recently viewed products
  useEffect(() => {
    if (!mobile) return;

    const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    const productData = {
      _id: mobile._id,
      brand: mobile.brand,
      model: mobile.model,
      imageUrls: mobile.imageUrls,
      retailPrice: mobile.retailPrice,
      dealerPrice: mobile.dealerPrice,
    };

    // Remove if already exists
    const filtered = recentlyViewed.filter(p => p._id !== mobile._id);
    // Add to beginning
    const updated = [productData, ...filtered].slice(0, 8); // Keep max 8
    localStorage.setItem('recentlyViewed', JSON.stringify(updated));
  }, [mobile]);


  const images = useMemo(() => {
    const srcs =
      mobile?.imageUrls?.length && Array.isArray(mobile.imageUrls)
        ? mobile.imageUrls
        : ['/fallback-mobile.png'];
    return srcs.slice(0, 8);
  }, [mobile?.imageUrls]);

  const displayPrice = useMemo(() => {
    const val = isDealer ? mobile?.dealerPrice : mobile?.retailPrice;
    const n = Number(val);
    return Number.isFinite(n) ? n : undefined;
  }, [isDealer, mobile?.dealerPrice, mobile?.retailPrice]);

  const canonicalUrl = getCanonicalProductUrl(id);
  const productUrl = shareLink || canonicalUrl; // prefer backend link

  /* Share via Native Share sheet (TEXT ONLY; URL embedded) */
  const handleShare = useCallback(async () => {
    if (!mobile) return;
    const msg = buildShareMessage(mobile, displayPrice, productUrl);

    const shareAction = async () => {
      try {
        if (navigator?.canShare && navigator.canShare({ text: msg })) {
          await navigator.share({ text: msg });
          return;
        }
        if (navigator?.share) {
          await navigator.share({ text: msg });
          return;
        }
      } catch (e) {
        if (e?.name === 'AbortError') return; // user cancelled
      }

      // Fallback (desktop / older browsers): copy + open WA with prefill
      try {
        await navigator.clipboard.writeText(msg);
        toast.info('Message copied. Paste in WhatsApp.', { autoClose: 1400 });
      } catch { }
      const enc = encodeURIComponent(msg);
      const href = isMobileUA()
        ? `https://wa.me/?text=${enc}`
        : `https://web.whatsapp.com/send?text=${enc}`;
      window.open(href, '_blank', 'noopener,noreferrer');
    };

    setTimeout(shareAction, 150);
  }, [mobile, displayPrice, productUrl]);

  /* Keep the anchor position; just change the message it sends */
  const whatsappSellerHref = useMemo(() => {
    const msg = mobile ? buildBuyNowMessage(mobile, displayPrice, productUrl) : '';
    const phone = '917891011841'; // your business number (no '+')
    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  }, [mobile, displayPrice, productUrl]);

  if (loading) {
    return (
      <div className="mobile-detail-loading">
        <div className="loading-spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error || !mobile) {
    return (
      <div className="mobile-detail-error">
        <h3>Product Not Found</h3>
        <p>{error || 'This mobile is not available or has been removed.'}</p>
        <button className="back-button" onClick={() => window.history.back()}>
          Go Back
        </button>
      </div>
    );
  }

  // Optional JSON-LD (for SEO) — use canonical URL, not short link
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${mobile?.brand ?? ''} ${mobile?.model ?? ''}`.trim(),
    sku: mobile?.mobileId ?? undefined,
    productID: mobile?._id ?? undefined,
    brand: mobile?.brand ? { '@type': 'Brand', name: String(mobile.brand) } : undefined,
    description: mobile?.description ?? undefined,
    image: images?.filter(Boolean),
    url: canonicalUrl,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: Number.isFinite(displayPrice) ? String(displayPrice) : undefined,
      availability: mobile?.isOutOfStock ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
      url: canonicalUrl,
    },
  };

  return (
    <div className="mobile-detail-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <div className="mobile-detail-card">
        {/* LEFT: Gallery */}
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
              rotate: 20,
              stretch: 0,
              depth: 140,
              modifier: 1.2,
              slideShadows: true,
            }}
            className="detail-swiper"
            onSwiper={(swiper) => { swiperRef.current = swiper; }}
            onSlideChange={(swiper) => setSelectedImageIndex(swiper.activeIndex)}
          >
            {images.map((url, idx) => (
              <SwiperSlide
                key={`${url}-${idx}`}
                className="zoom-container"
                onMouseMove={(e) => {
                  const img = e.currentTarget.querySelector('img');
                  if (!img) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * 100;
                  const y = ((e.clientY - rect.top) / rect.height) * 100;
                  img.style.transformOrigin = `${x}% ${y}%`;
                }}
                onMouseLeave={(e) => {
                  const img = e.currentTarget.querySelector('img');
                  if (img) img.style.transformOrigin = 'center center';
                }}
              >
                <div className="image-wrapper-with-watermark">
                  <img
                    src={url}
                    alt={`${mobile?.brand ?? ''} ${mobile?.model ?? ''} - ${idx + 1}`}
                    loading={idx === 0 ? 'eager' : 'lazy'}
                    onError={(ev) => {
                      if (ev.currentTarget.dataset.fallback === '1') return;
                      ev.currentTarget.dataset.fallback = '1';
                      ev.currentTarget.src = '/fallback-mobile.png';
                    }}
                  />
                  <div className="watermark-text">
                    {mobile?.mobileId ?? 'JOLLYBABA MOBILES'}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Image Thumbnails */}
          {images.length > 1 && (
            <div className="image-thumbnails">
              {images.map((url, idx) => (
                <div
                  key={`thumb-${idx}`}
                  className={`thumbnail ${idx === selectedImageIndex ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedImageIndex(idx);
                    swiperRef.current?.slideTo(idx);
                  }}
                >
                  <img src={url} alt={`Thumbnail ${idx + 1}`} />
                </div>
              ))}
            </div>
          )}


          {/* Price below slider on wide screens */}
          <div
            className="price-stock-wrapper price-under-slider"
            aria-live="polite"
          >
            {isDealer ? (
              <div className="price-card small-dealer">
                <p className="price fancy-price small">
                  <span className="currency">₹</span>
                  <span className="amount">
                    {formatINR(mobile?.dealerPrice)}
                  </span>
                  <span className="price-label">Dealer Price</span>
                </p>
                <p className="dealer-note">
                  * To get dealer price, buy at least 5 mobiles
                </p>
              </div>
            ) : (
              <div className="price-card highlight-retail">
                <p className="price fancy-price">
                  <span className="currency">₹</span>
                  <span className="amount">
                    {formatINR(mobile?.retailPrice)}
                  </span>
                  <span className="price-label">Retail Price</span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Info & Actions */}
        <div className="mobile-detail-info">
          {/* Breadcrumbs */}
          <nav className="breadcrumbs">
            <a href="/" className="breadcrumb-link">Home</a>
            <span className="breadcrumb-separator">›</span>
            <a href="/" className="breadcrumb-link">Mobiles</a>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">{mobile?.brand}</span>
          </nav>

          <h2 className="detail-title">
            {mobile?.brand} {mobile?.model}
          </h2>

          {/* Social Proof */}
          <div className="social-proof-badges">
            <span className="social-proof-item">
              Popular Item
            </span>
            <span className="social-proof-item">
              Verified Product
            </span>
          </div>

          {/* Specification Pills */}
          <div className="spec-pills">
            <span className="spec-pill">
              {mobile?.ram || 'N/A'} RAM
            </span>
            <span className="spec-pill">
              {mobile?.storage || 'N/A'} Storage
            </span>
            <span className="spec-pill">
              {mobile?.color || 'N/A'}
            </span>
            <span className="spec-pill">
              {mobile?.deviceType || 'N/A'}
            </span>
            <span className="spec-pill">
              {mobile?.networkType || 'N/A'}
            </span>
          </div>

          {/* Price card in mobile column */}
          <div
            className="price-stock-wrapper mobile-price-block"
            aria-live="polite"
          >
            {isDealer ? (
              <div className="price-card small-dealer">
                <p className="price fancy-price small">
                  <span className="currency">₹</span>
                  <span className="amount">
                    {formatINR(mobile?.dealerPrice)}
                  </span>
                  <span className="price-label">Dealer Price</span>
                </p>
                <p className="dealer-note">
                  * To get dealer price, buy at least 5 mobiles
                </p>
              </div>
            ) : (
              <div className="price-card highlight-retail">
                <p className="price fancy-price">
                  <span className="currency">₹</span>
                  <span className="amount">
                    {formatINR(mobile?.retailPrice)}
                  </span>
                  <span className="price-label">Retail Price</span>
                </p>
              </div>
            )}
          </div>

          {/* Stock */}
          {typeof mobile?.isOutOfStock !== 'undefined' && (
            <span
              className={`stock-status ${mobile.isOutOfStock ? 'out-of-stock' : 'in-stock'
                }`}
              data-stock={mobile.isOutOfStock ? 'out' : 'in'}
              aria-live="polite"
            >
              {mobile.isOutOfStock ? 'Out of Stock' : '✔ In Stock'}
            </span>
          )}


          {/* Quantity Selector */}
          <div className="quantity-selector">
            <span className="quantity-label">Quantity:</span>
            <button
              className="quantity-btn"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              −
            </button>
            <div className="quantity-display">{quantity}</div>
            <button
              className="quantity-btn"
              onClick={() => setQuantity(Math.min(10, quantity + 1))}
              disabled={quantity >= 10}
            >
              +
            </button>
          </div>

          {/* Tabbed Content Section */}
          <div className="tabs-container">
            <div className="tabs-header">
              <button
                className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button
                className={`tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
                onClick={() => setActiveTab('specs')}
              >
                Full Specifications
              </button>
              <button
                className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
                onClick={() => setActiveTab('description')}
              >
                Description
              </button>
            </div>

            <div className="tab-content">
              {/* Overview Tab */}
              <div className={`tab-panel ${activeTab === 'overview' ? 'active' : ''}`}>
                <h3>Key Highlights</h3>
                <ul style={{ lineHeight: '1.8', color: '#374151' }}>
                  <li>Brand: {mobile?.brand}</li>
                  <li>Model: {mobile?.model}</li>
                  <li>RAM: {mobile?.ram}</li>
                  <li>Storage: {mobile?.storage}</li>
                  <li>Color: {mobile?.color}</li>
                  <li>Network: {mobile?.networkType}</li>
                </ul>
                <h3 style={{ marginTop: '24px' }}>What's in the Box</h3>
                <ul style={{ lineHeight: '1.8', color: '#374151' }}>
                  <li>1 x {mobile?.brand} {mobile?.model}</li>
                  <li>1 x USB Cable</li>
                  <li>1 x Charger</li>
                  <li>1 x User Manual</li>
                  <li>1 x Warranty Card</li>
                </ul>
              </div>

              {/* Full Specifications Tab */}
              <div className={`tab-panel ${activeTab === 'specs' ? 'active' : ''}`}>
                <table className="spec-table" role="table">
                  <tbody>
                    <tr>
                      <td>Brand</td>
                      <td>{mobile?.brand ?? '-'}</td>
                    </tr>
                    <tr>
                      <td>Model</td>
                      <td>{mobile?.model ?? '-'}</td>
                    </tr>
                    <tr>
                      <td>RAM</td>
                      <td>{mobile?.ram ?? '-'}</td>
                    </tr>
                    <tr>
                      <td>Storage</td>
                      <td>{mobile?.storage ?? '-'}</td>
                    </tr>
                    <tr>
                      <td>Color</td>
                      <td>{mobile?.color ?? '-'}</td>
                    </tr>
                    <tr>
                      <td>Device Type</td>
                      <td>{mobile?.deviceType ?? '-'}</td>
                    </tr>
                    <tr>
                      <td>Network</td>
                      <td>{mobile?.networkType ?? '-'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Description Tab */}
              <div className={`tab-panel ${activeTab === 'description' ? 'active' : ''}`}>
                {mobile?.description ? (
                  <div>
                    <h3>About This Product</h3>
                    <p style={{ lineHeight: '1.7', color: '#374151' }}>{mobile.description}</p>
                  </div>
                ) : (
                  <p style={{ color: '#9ca3af' }}>No description available.</p>
                )}
              </div>
            </div>
          </div>


          {/* Actions */}
          <div className="btn-group">
            <button className="share-button" onClick={handleShare} type="button" title="Share details">
              <span>Share</span>
            </button>

            <button
              className="add-to-cart"
              type="button"
              disabled={Boolean(mobile?.isOutOfStock)}
              aria-disabled={Boolean(mobile?.isOutOfStock)}
              onClick={() => {
                if (mobile?.isOutOfStock) return;
                // Add to cart with quantity
                addToCart(mobile, quantity);
                toast.success(
                  `${quantity} x ${mobile?.brand ?? ''} ${mobile?.model ?? ''} added to cart!`,
                  {
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
                  }
                );
                // Reset quantity after adding
                setQuantity(1);
              }}
            >
              Add to Cart
            </button>
          </div>


          {/* Buy Now (WhatsApp) */}
          <a
            href={whatsappSellerHref}
            className="buy-now-button"
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={Boolean(mobile?.isOutOfStock)}
            style={
              mobile?.isOutOfStock ? { opacity: 0.6, pointerEvents: 'none' } : {}
            }
          >
            Buy Now
          </a>

          {linkLoading ? (
            <small style={{ display: 'block', marginTop: 8, opacity: 0.7 }}>Preparing link…</small>
          ) : shareLink ? (
            <small style={{ display: 'block', marginTop: 8, opacity: 0.7 }}>Using backend link</small>
          ) : (
            <small style={{ display: 'block', marginTop: 8, opacity: 0.7 }}>Using canonical link</small>
          )}
        </div>
      </div >

      {/* Similar Products Section */}
      {
        similarProducts.length > 0 && (
          <div className="similar-products-section">
            <div className="similar-products-header">
              <h3>You May Also Like</h3>
              <p>Similar products from {mobile?.brand}</p>
            </div>
            <div className="similar-products-grid">
              {similarProducts.map((product) => (
                <div
                  key={product._id}
                  className="similar-product-card"
                  onClick={() => window.location.href = `/mobile/${product._id}`}
                >
                  <div className="similar-product-image">
                    <img
                      src={product.imageUrls?.[0] || '/no-image.png'}
                      alt={`${product.brand} ${product.model} - Buy at JollyBaba Mobiles Pune`}
                      loading="lazy"
                    />
                  </div>
                  <div className="similar-product-info">
                    <div className="similar-product-name">
                      {product.brand} {product.model}
                    </div>
                    <div className="similar-product-price">
                      ₹{formatINR(isDealer ? product.dealerPrice : product.retailPrice)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      }

      {/* Recently Viewed Products */}
      {
        (() => {
          const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
          const filtered = recentlyViewed.filter(p => p._id !== mobile?._id).slice(0, 4);

          if (filtered.length === 0) return null;

          return (
            <div className="similar-products-section">
              <div className="similar-products-header">
                <h3>Recently Viewed</h3>
                <p>Products you've looked at</p>
              </div>
              <div className="similar-products-grid">
                {filtered.map((product) => (
                  <div
                    key={product._id}
                    className="similar-product-card"
                    onClick={() => window.location.href = `/mobile/${product._id}`}
                  >
                    <div className="similar-product-image">
                      <img
                        src={product.imageUrls?.[0] || '/no-image.png'}
                        alt={`${product.brand} ${product.model} - Second hand mobile Pune`}
                        loading="lazy"
                      />
                    </div>
                    <div className="similar-product-info">
                      <div className="similar-product-name">
                        {product.brand} {product.model}
                      </div>
                      <div className="similar-product-price">
                        ₹{formatINR(isDealer ? product.dealerPrice : product.retailPrice)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()
      }

      {/* Sticky Bottom Bar (Mobile Only) */}
      <div className="sticky-bottom-bar">
        <div className="sticky-bottom-bar-price">
          <div className="sticky-price">
            ₹{formatINR(displayPrice)}
          </div>
        </div>
        <button
          className="sticky-bottom-bar-btn"
          disabled={Boolean(mobile?.isOutOfStock)}
          onClick={() => {
            if (mobile?.isOutOfStock) return;
            addToCart(mobile);
            toast.success('Added to cart!', {
              position: 'top-center',
              autoClose: 1000,
            });
          }}
        >
          {mobile?.isOutOfStock ? 'Out of Stock' : 'Add to Cart 🛒'}
        </button>
      </div>

      <ToastContainer newestOnTop closeButton={false} />
    </div >
  );
};

export default MobileDetailPage;
