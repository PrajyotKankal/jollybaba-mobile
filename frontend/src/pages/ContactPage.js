import React, { useState } from 'react';
import SEO from '../components/SEO';
import './ContactPage.css';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        message: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Create WhatsApp message with form data
        const message = `👋 New Inquiry from Website%0A%0A*Name:* ${formData.name}%0A*Phone:* ${formData.phone}%0A*Message:* ${formData.message}`;
        window.open(`https://wa.me/917891011841?text=${message}`, '_blank');
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="contact-page">
            <SEO
                title="Contact Us"
                description="Contact JollyBaba Mobiles Pune. Call +91 78910 11841 or WhatsApp us. Visit our shop at Deccan Gymkhana, JM Road, Pune. Open 10AM to 9PM daily."
                keywords="contact JollyBaba, mobile shop phone number Pune, JollyBaba WhatsApp, Deccan mobile shop contact"
                canonical="https://jollybaba.in/contact"
            />
            {/* Hero Section */}
            <section className="contact-hero">
                <h1>Contact Us</h1>
                <p>We'd love to hear from you!</p>
            </section>

            <div className="contact-content">
                {/* Contact Form */}
                <section className="contact-form-section">
                    <h2>Send us a message</h2>
                    <form onSubmit={handleSubmit} className="contact-form">
                        <div className="form-group">
                            <label>Your Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your name"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Enter your phone number"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Message</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="How can we help you?"
                                rows="4"
                                required
                            />
                        </div>
                        <button type="submit" className="submit-btn">
                            📩 Send via WhatsApp
                        </button>
                    </form>
                </section>

                {/* Contact Info */}
                <section className="contact-info-section">
                    <h2>Get in Touch</h2>

                    <div className="contact-cards">
                        <a
                            href="https://wa.me/917891011841"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="contact-card whatsapp"
                        >
                            <span className="contact-icon">💬</span>
                            <div>
                                <strong>WhatsApp</strong>
                                <p>+91 78910 11841</p>
                            </div>
                        </a>

                        <a href="tel:+917891011841" className="contact-card">
                            <span className="contact-icon">📞</span>
                            <div>
                                <strong>Call Us</strong>
                                <p>+91 78910 11841</p>
                            </div>
                        </a>

                        <div className="contact-card">
                            <span className="contact-icon">📍</span>
                            <div>
                                <strong>Location</strong>
                                <p>Deccan Gymkhana, Pune, Maharashtra</p>
                            </div>
                        </div>

                        <div className="contact-card">
                            <span className="contact-icon">🕐</span>
                            <div>
                                <strong>Business Hours</strong>
                                <p>Mon - Sat: 10 AM - 8 PM</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick WhatsApp Button */}
                    <a
                        href="https://wa.me/917891011841?text=Hi!%20I%20want%20to%20inquire%20about%20mobiles."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="whatsapp-cta"
                    >
                        💬 Chat on WhatsApp Now
                    </a>
                </section>
            </div>
        </div>
    );
};

export default ContactPage;
