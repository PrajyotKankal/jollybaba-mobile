import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserTypeContext } from '../context/UserTypeContext';
import SEO from '../components/SEO';
import './DealsPage.css';

const DealsPage = () => {
    const [mobiles, setMobiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const { userType } = useContext(UserTypeContext);
    const isDealer = userType === 'Dealer';
    const navigate = useNavigate();

    useEffect(() => {
        fetchMobiles();
    }, []);

    const fetchMobiles = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://jollybaba-backend.onrender.com'}/api/mobiles`);
            const data = await response.json();
            const availablePhones = data
                .filter(m => !m.isOutOfStock)
                .sort((a, b) => (a.retailPrice || 0) - (b.retailPrice || 0))
                .slice(0, 20);
            setMobiles(availablePhones);
        } catch (error) {
            console.error('Error fetching mobiles:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCardClick = (id) => {
        navigate(`/mobile/${id}`);
    };

    return (
        <main className="deals-page">
            <SEO
                title="Best Mobile Deals & Offers in Pune"
                description="Get the best deals on second hand mobiles in Pune. Wholesale rates, bulk discounts, and special offers on iPhone, Samsung, OnePlus & more at JollyBaba Mobiles Deccan."
                keywords="mobile deals Pune, cheap phones Pune, wholesale mobile Pune, second hand mobile offers, discount mobile Pune, best price mobile"
                canonical="https://jollybaba.in/deals"
            />
            <section className="deals-hero" aria-labelledby="deals-title">
                <div className="deals-hero-content">
                    <span className="deals-badge">🔥 Hot Deals</span>
                    <h1>Special Offers</h1>
                    <p>Best prices on quality mobile phones</p>
                </div>
            </section>

            <section className="deals-banner">
                <div className="banner-card">
                    <span className="banner-icon">💰</span>
                    <div>
                        <strong>Wholesale Rates</strong>
                        <p>Best prices for dealers</p>
                    </div>
                </div>
                <div className="banner-card">
                    <span className="banner-icon">📦</span>
                    <div>
                        <strong>Bulk Discounts</strong>
                        <p>Special rates on bulk orders</p>
                    </div>
                </div>
                <div className="banner-card">
                    <span className="banner-icon">✅</span>
                    <div>
                        <strong>Quality Assured</strong>
                        <p>All phones verified</p>
                    </div>
                </div>
            </section>

            <div className="deals-content">
                <h2>Today's Best Deals</h2>

                {loading ? (
                    <div className="deals-loading">Loading deals...</div>
                ) : (
                    <div className="deals-grid">
                        {mobiles.map((mobile, index) => (
                            <div
                                key={mobile._id}
                                className="deal-card"
                                onClick={() => handleCardClick(mobile._id)}
                            >
                                {index < 5 && <span className="deal-tag">🔥 Hot</span>}
                                <div className="deal-image">
                                    <img src={mobile.imageUrls?.[0] || '/no-image.png'} alt={mobile.model} />
                                </div>
                                <div className="deal-info">
                                    <span className="deal-brand">{mobile.brand}</span>
                                    <h3 className="deal-model">{mobile.model}</h3>
                                    <div className="deal-specs">
                                        {mobile.storage && <span>{mobile.storage}</span>}
                                        {mobile.condition && <span>{mobile.condition}</span>}
                                    </div>
                                    <p className="deal-price">
                                        ₹{isDealer ? mobile.dealerPrice?.toLocaleString() : mobile.retailPrice?.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <section className="deals-cta">
                    <h3>Want even better deals?</h3>
                    <p>Contact us on WhatsApp for exclusive wholesale pricing</p>
                    <a
                        href="https://wa.me/917891011841?text=Hi!%20I%20want%20to%20know%20about%20special%20deals."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="deals-whatsapp-btn"
                    >
                        💬 Get Best Quote
                    </a>
                </section>
            </div>
        </main>
    );
};

export default DealsPage;
