import React from 'react';
import './PolicyPages.css';

const TermsOfServicePage = () => {
    return (
        <div className="policy-page">
            <div className="policy-hero">
                <h1>Terms of Service</h1>
                <p>Last updated: December 2024</p>
            </div>

            <div className="policy-container">
                <section className="policy-section">
                    <h2>1. Acceptance of Terms</h2>
                    <p>By accessing and using the JollyBaba Mobiles website and services, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
                </section>

                <section className="policy-section">
                    <h2>2. Products and Services</h2>
                    <p>JollyBaba Mobiles offers:</p>
                    <ul>
                        <li>New and pre-owned mobile phones</li>
                        <li>Wholesale and retail sales</li>
                        <li>Mobile accessories</li>
                        <li>Phone exchange services</li>
                    </ul>
                    <p>All products are subject to availability. We reserve the right to limit quantities and discontinue products at any time.</p>
                </section>

                <section className="policy-section">
                    <h2>3. Pricing and Payment</h2>
                    <ul>
                        <li>All prices are in Indian Rupees (INR)</li>
                        <li>Prices are subject to change without notice</li>
                        <li>Full payment is required before delivery</li>
                        <li>We accept cash, UPI, and bank transfers</li>
                    </ul>
                </section>

                <section className="policy-section">
                    <h2>4. Product Authenticity</h2>
                    <p>We guarantee that all products sold by JollyBaba Mobiles are 100% genuine. Pre-owned devices are thoroughly tested and verified before sale. Each device comes with proper documentation and IMEI verification.</p>
                </section>

                <section className="policy-section">
                    <h2>5. Delivery</h2>
                    <ul>
                        <li>Delivery is available across Pune and Maharashtra</li>
                        <li>Delivery times may vary based on location</li>
                        <li>Shipping charges may apply for certain areas</li>
                        <li>Store pickup is available at no extra cost</li>
                    </ul>
                </section>

                <section className="policy-section">
                    <h2>6. User Conduct</h2>
                    <p>Users agree not to:</p>
                    <ul>
                        <li>Use the service for any unlawful purpose</li>
                        <li>Provide false or misleading information</li>
                        <li>Attempt to gain unauthorized access to our systems</li>
                        <li>Interfere with the proper functioning of the website</li>
                    </ul>
                </section>

                <section className="policy-section">
                    <h2>7. Limitation of Liability</h2>
                    <p>JollyBaba Mobiles shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services or products.</p>
                </section>

                <section className="policy-section">
                    <h2>8. Contact Information</h2>
                    <p>For questions about these Terms of Service:</p>
                    <p><strong>Phone:</strong> +91 78910 11841</p>
                    <p><strong>Address:</strong> Ground Floor, Bhosale Shinde Arcade, Shop No. 79, JM Road, Pulachi Wadi, Deccan Gymkhana, Pune, Maharashtra 411004</p>
                </section>
            </div>
        </div>
    );
};

export default TermsOfServicePage;
