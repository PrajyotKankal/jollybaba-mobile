import React from 'react';
import { FaCheckCircle, FaTag, FaTruck, FaHeadset, FaMapMarkerAlt, FaPhone, FaWhatsapp, FaStore } from 'react-icons/fa';
import SEO from '../components/SEO';
import './AboutUsPage.css';

const AboutUsPage = () => {
    return (
        <div className="about-page">
            <SEO
                title="About Us"
                description="JollyBaba Mobiles - Pune's most trusted mobile shop since 2019. Located in Deccan Gymkhana, we offer genuine new & second hand phones at best prices. 5★ rated on Google with 42+ reviews. Visit us at Shop No. 79, JM Road."
                keywords="JollyBaba Mobiles, mobile shop Pune, about JollyBaba, Deccan mobile shop, trusted mobile dealer Pune"
                canonical="https://jollybaba.in/about"
            />
            {/* Premium Hero Section */}
            <section className="about-hero">
                <div className="hero-content">
                    <span className="hero-badge">Since 2019</span>
                    <h1>Redefining Mobile Retail</h1>
                    <p>Your trusted partner for premium mobile devices, delivering excellence and authenticity in every box.</p>
                </div>
                <div className="hero-pattern"></div>
            </section>

            {/* Story Section (Split Layout) */}
            <section className="about-section story-section">
                <div className="about-container">
                    <div className="story-grid">
                        <div className="story-content">
                            <span className="section-subtitle">Our Journey</span>
                            <h2>From Humble Beginnings to Market Leaders</h2>
                            <p>
                                JollyBaba Mobiles was founded with a singular vision: to bridge the gap between premium technology and affordability.
                                Based in the vibrant city of Pune, Maharashtra, we started as a small retail outlet with a big dream.
                            </p>
                            <p>
                                Today, we stand as a beacon of trust in the mobile retail industry. We specialize in both wholesale and retail,
                                serving a diverse clientele ranging from individual tech enthusiasts to large-scale business partners.
                                Our growth is a testament to our unwavering commitment to quality and customer satisfaction.
                            </p>
                            <div className="story-signature">
                                <p>The JollyBaba Team</p>
                            </div>
                        </div>
                        <div className="story-visual">
                            <div className="visual-card">
                                <FaStore className="visual-icon" />
                                <div className="visual-overlay"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section (Floating Strip) */}
            <section className="stats-section">
                <div className="about-container">
                    <div className="stats-grid">
                        <div className="stat-item">
                            <span className="stat-number">500+</span>
                            <span className="stat-label">Premium Models</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <span className="stat-number">10k+</span>
                            <span className="stat-label">Happy Customers</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <span className="stat-number">50+</span>
                            <span className="stat-label">Top Brands</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <span className="stat-number">5+</span>
                            <span className="stat-label">Years of Trust</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="about-section values-section">
                <div className="about-container">
                    <div className="section-header">
                        <span className="section-subtitle">Why Choose Us</span>
                        <h2>The JollyBaba Promise</h2>
                        <p>We don't just sell phones; we deliver peace of mind.</p>
                    </div>

                    <div className="values-grid">
                        <div className="value-card">
                            <div className="icon-wrapper">
                                <FaCheckCircle />
                            </div>
                            <h3>100% Genuine</h3>
                            <p>Authenticity is our hallmark. Every device is verified and sourced from trusted global partners.</p>
                        </div>
                        <div className="value-card">
                            <div className="icon-wrapper">
                                <FaTag />
                            </div>
                            <h3>Unbeatable Prices</h3>
                            <p>We offer competitive wholesale and retail rates that challenge the market standards.</p>
                        </div>
                        <div className="value-card">
                            <div className="icon-wrapper">
                                <FaTruck />
                            </div>
                            <h3>Express Delivery</h3>
                            <p>Secure and swift shipping across Maharashtra and India, ensuring your device reaches you safely.</p>
                        </div>
                        <div className="value-card">
                            <div className="icon-wrapper">
                                <FaHeadset />
                            </div>
                            <h3>Expert Support</h3>
                            <p>Our dedicated support team is just a message away to assist you with any queries.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Google Reviews Section */}
            <section className="about-section reviews-section">
                <div className="about-container">
                    <div className="section-header">
                        <span className="section-subtitle">Customer Love</span>
                        <h2>What Our Customers Say</h2>
                        <div className="google-rating-badge">
                            <span className="rating-stars">⭐⭐⭐⭐⭐</span>
                            <span className="rating-text">5.0 Rating • 42 Reviews on Google</span>
                        </div>
                    </div>

                    <div className="reviews-grid">
                        <div className="review-card">
                            <div className="review-header">
                                <div className="reviewer-avatar">VG</div>
                                <div className="reviewer-info">
                                    <h4>Vijayraj Ghadge</h4>
                                    <span className="review-stars">⭐⭐⭐⭐⭐</span>
                                </div>
                            </div>
                            <p>"The most trustable shop for second hand phones. Every phone is properly tested by experts before selling. The phones are as good as new."</p>
                        </div>

                        <div className="review-card">
                            <div className="review-header">
                                <div className="reviewer-avatar">AB</div>
                                <div className="reviewer-info">
                                    <h4>Akshay Bangar</h4>
                                    <span className="review-stars">⭐⭐⭐⭐⭐</span>
                                </div>
                            </div>
                            <p>"Purchase poco f3 gt gaming phone 2 yrs back at reasonable rate. Still doing fine. Great seller for all mobile phone."</p>
                        </div>

                        <div className="review-card">
                            <div className="review-header">
                                <div className="reviewer-avatar">CC</div>
                                <div className="reviewer-info">
                                    <h4>Chetan Chavan</h4>
                                    <span className="review-stars">⭐⭐⭐⭐⭐</span>
                                </div>
                            </div>
                            <p>"I bought OnePlus 9 12gb in 22000 still using it. Nice prices and offers!"</p>
                        </div>

                        <div className="review-card">
                            <div className="review-header">
                                <div className="reviewer-avatar">DC</div>
                                <div className="reviewer-info">
                                    <h4>Deepak Chavan</h4>
                                    <span className="review-stars">⭐⭐⭐⭐⭐</span>
                                </div>
                            </div>
                            <p>"All phones are available in good condition and also in affordable prices. Service is best!"</p>
                        </div>

                        <div className="review-card">
                            <div className="review-header">
                                <div className="reviewer-avatar">PJ</div>
                                <div className="reviewer-info">
                                    <h4>Pawan Jadhav</h4>
                                    <span className="review-stars">⭐⭐⭐⭐⭐</span>
                                </div>
                            </div>
                            <p>"Worthy and genuine shop for a good mobile. Wants to visit again! 👍✌️"</p>
                        </div>

                        <div className="review-card">
                            <div className="review-header">
                                <div className="reviewer-avatar">MP</div>
                                <div className="reviewer-info">
                                    <h4>Manoj Parmar</h4>
                                    <span className="review-stars">⭐⭐⭐⭐⭐</span>
                                </div>
                            </div>
                            <p>"Best mobile store for selling my mobile phone in best price! 😊 You will also get best price for your mobile phone."</p>
                        </div>
                    </div>

                    <a
                        href="https://www.google.com/maps/place/JollyBaba/data=!4m7!3m6!1s0x3bc2c1f545762b17:0x7b1a2a9cba36955e!8m2!3d18.5171487!4d73.8434366"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="view-all-reviews-btn"
                    >
                        View All Reviews on Google →
                    </a>
                </div>
            </section>

            {/* Location / Contact Section */}
            <section className="about-section location-section">
                <div className="about-container">
                    <div className="location-card">
                        <div className="location-content">
                            <h2>Visit Our Store</h2>
                            <p>Experience our premium collection in person.</p>

                            <div className="contact-details">
                                <div className="contact-item">
                                    <FaMapMarkerAlt className="contact-icon" />
                                    <div>
                                        <strong>Address</strong>
                                        <p>Ground Floor, Bhosale Shinde Arcade, Shop No. 79, JM Road, Pulachi Wadi, Deccan Gymkhana, Pune, Maharashtra 411004</p>
                                    </div>
                                </div>
                                <div className="contact-item">
                                    <FaPhone className="contact-icon" />
                                    <div>
                                        <strong>Phone</strong>
                                        <p>+91 78910 11841</p>
                                    </div>
                                </div>
                                <div className="contact-item">
                                    <FaWhatsapp className="contact-icon" />
                                    <div>
                                        <strong>WhatsApp</strong>
                                        <p>+91 78910 11841</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="location-map-placeholder">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d945.5076847!2d73.8428891!3d18.5171487!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c1f545762b17%3A0x7b1a2a9cba36955e!2sJollyBaba!5e0!3m2!1sen!2sin!4v1702149600000!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                style={{ border: 0, minHeight: '300px' }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="JollyBaba Store Location"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutUsPage;
