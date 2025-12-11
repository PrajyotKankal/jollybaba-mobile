import React from 'react';
import './PolicyPages.css';

const PrivacyPolicyPage = () => {
    return (
        <div className="policy-page">
            <div className="policy-hero">
                <h1>Privacy Policy for JollyBaba Mobiles</h1>
                <p>Effective Date: December 10, 2025</p>
            </div>

            <div className="policy-container">
                <section className="policy-section">
                    <h2>1. Introduction</h2>
                    <p>Welcome to JollyBaba Mobiles ("we," "our," or "us"). We are committed to protecting your privacy. This Privacy Policy explains how our mobile application handles your information.</p>
                </section>

                <section className="policy-section">
                    <h2>2. Data We Collect</h2>
                    <p>Our application does NOT require user registration, login, or account creation.</p>
                    <ul>
                        <li><strong>Device Information:</strong> We may collect non-personal information such as your device model and operating system version to ensure app compatibility.</li>
                        <li><strong>No Personal Data Storage:</strong> We do not store your name, email, phone number, or location data on our servers.</li>
                    </ul>
                </section>

                <section className="policy-section">
                    <h2>3. How We Use Your Information</h2>
                    <ul>
                        <li><strong>Enquiries & Orders:</strong> Our app functions as a digital catalog. When you click "Enquire on WhatsApp" or "Order via WhatsApp," the app opens the WhatsApp application on your device.</li>
                        <li><strong>Third-Party Transactions:</strong> Any message, phone number, or data you share via WhatsApp is subject to WhatsApp's Privacy Policy and is sent directly to the seller. We do not intercept or store these messages in the app.</li>
                    </ul>
                </section>

                <section className="policy-section">
                    <h2>4. Third-Party Links and Services</h2>
                    <ul>
                        <li><strong>WhatsApp:</strong> The primary function of this app is to facilitate communication via WhatsApp. We are not responsible for the privacy practices of WhatsApp.</li>
                        <li><strong>External Links:</strong> The app may contain links to third-party shipping or payment providers managed by the seller. We are not responsible for the content or privacy practices of these external sites.</li>
                    </ul>
                </section>

                <section className="policy-section">
                    <h2>5. Service Providers (Refurbished/Third-Party Goods)</h2>
                    <p>JollyBaba Mobiles lists products from third-party sellers. We do not directly hold inventory or process payments within the app. All warranties (if any) are provided directly by the seller as agreed upon during the WhatsApp conversation.</p>
                </section>

                <section className="policy-section">
                    <h2>6. Children's Privacy</h2>
                    <p>Our app is not intended for use by anyone under the age of 13. We do not knowingly collect personal information from children.</p>
                </section>

                <section className="policy-section">
                    <h2>7. Changes to This Policy</h2>
                    <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
                </section>

                <section className="policy-section">
                    <h2>8. Contact Us</h2>
                    <p>If you have any questions about this Privacy Policy, please contact us at:</p>
                    <ul>
                        <li><strong>Email:</strong> jollybaba30@gmail.com</li>
                        <li><strong>WhatsApp:</strong> +91 70207 08747</li>
                    </ul>
                </section>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;

