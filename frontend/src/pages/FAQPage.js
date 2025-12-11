import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import './FAQPage.css';

const faqs = [
    {
        category: 'Ordering',
        questions: [
            {
                q: 'How do I place an order at JollyBaba Mobiles?',
                a: 'Simply browse our catalog, add items to your cart, and click "Enquire via WhatsApp". Our team will respond within minutes to confirm your order.'
            },
            {
                q: 'Can I order multiple phones at once?',
                a: 'Yes! We specialize in wholesale orders. Add as many phones as you need to your cart and submit your inquiry.'
            },
            {
                q: 'Is there a minimum order quantity?',
                a: 'No minimum order required. We serve both individual customers and bulk buyers.'
            }
        ]
    },
    {
        category: 'Pricing & Payment',
        questions: [
            {
                q: 'What are your payment options?',
                a: 'We accept UPI, Bank Transfer, Cash on Delivery (for local orders in Pune), and all major payment methods. Details will be shared on WhatsApp.'
            },
            {
                q: 'Are your prices negotiable for bulk orders?',
                a: 'Yes! We offer special discounts for bulk and wholesale orders. Contact us for the best rates.'
            },
            {
                q: 'Do you offer dealer pricing?',
                a: 'Yes, registered dealers get access to special wholesale rates. Toggle the "Dealer" option on our website to see dealer prices.'
            }
        ]
    },
    {
        category: 'Delivery',
        questions: [
            {
                q: 'Do you deliver outside Pune?',
                a: 'Yes! We deliver across Maharashtra and all over India. Shipping charges may apply based on location.'
            },
            {
                q: 'How long does delivery take?',
                a: 'Local Pune orders: Same day or next day. Maharashtra: 1-2 days. Rest of India: 3-5 business days.'
            },
            {
                q: 'Is my order insured during shipping?',
                a: 'Yes, all orders are carefully packed and insured. We ensure safe delivery of your products.'
            }
        ]
    },
    {
        category: 'Products & Quality',
        questions: [
            {
                q: 'Are all products genuine at JollyBaba?',
                a: 'Absolutely! We only sell 100% genuine and verified products. All phones are thoroughly checked before dispatch.'
            },
            {
                q: 'Do phones come with warranty?',
                a: 'Brand new phones come with manufacturer warranty. For used/refurbished phones, warranty terms vary - please check our warranty policy.'
            },
            {
                q: 'Can I return a product?',
                a: 'Returns are accepted within 7 days if the product is defective or not as described. Check our return policy for details.'
            }
        ]
    }
];

// Generate FAQ Schema for SEO
const generateFAQSchema = () => {
    const faqItems = [];
    faqs.forEach(category => {
        category.questions.forEach(item => {
            faqItems.push({
                "@type": "Question",
                "name": item.q,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": item.a
                }
            });
        });
    });

    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqItems
    };
};

const FAQPage = () => {
    const [openItems, setOpenItems] = useState({});

    const toggleItem = (categoryIndex, questionIndex) => {
        const key = `${categoryIndex}-${questionIndex}`;
        setOpenItems(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    return (
        <main className="faq-page">
            <Helmet>
                <title>FAQs | JollyBaba Mobiles Pune - Second Hand Mobile Questions</title>
                <meta name="description" content="Frequently asked questions about JollyBaba Mobiles Pune. Learn about ordering, payment, delivery, warranty, and returns for second hand and new mobiles." />
                <meta name="keywords" content="JollyBaba FAQ, mobile shop questions Pune, second hand mobile delivery, mobile warranty Pune" />
                <link rel="canonical" href="https://jollybaba.in/faq" />
                <script type="application/ld+json">
                    {JSON.stringify(generateFAQSchema())}
                </script>
            </Helmet>

            {/* Hero Section */}
            <section className="faq-hero" aria-labelledby="faq-title">
                <h1 id="faq-title">Frequently Asked Questions</h1>
                <p>Find answers to common questions about our services</p>
            </section>

            {/* FAQ Content */}
            <article className="faq-content">
                {faqs.map((category, catIndex) => (
                    <section key={catIndex} className="faq-category" aria-labelledby={`category-${catIndex}`}>
                        <h2 id={`category-${catIndex}`}>{category.category}</h2>
                        <div className="faq-list" role="list">
                            {category.questions.map((item, qIndex) => {
                                const isOpen = openItems[`${catIndex}-${qIndex}`];
                                return (
                                    <div
                                        key={qIndex}
                                        className={`faq-item ${isOpen ? 'open' : ''}`}
                                        role="listitem"
                                        itemScope
                                        itemProp="mainEntity"
                                        itemType="https://schema.org/Question"
                                    >
                                        <button
                                            className="faq-question"
                                            onClick={() => toggleItem(catIndex, qIndex)}
                                            aria-expanded={isOpen}
                                            aria-controls={`answer-${catIndex}-${qIndex}`}
                                        >
                                            <span itemProp="name">{item.q}</span>
                                            <span className="faq-toggle" aria-hidden="true">{isOpen ? '−' : '+'}</span>
                                        </button>
                                        {isOpen && (
                                            <div
                                                className="faq-answer"
                                                id={`answer-${catIndex}-${qIndex}`}
                                                itemScope
                                                itemProp="acceptedAnswer"
                                                itemType="https://schema.org/Answer"
                                            >
                                                <p itemProp="text">{item.a}</p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                ))}

                {/* Internal Links Section */}
                <section className="faq-links">
                    <h3>Related Pages</h3>
                    <nav aria-label="Related pages">
                        <Link to="/brands">� Browse Brands</Link>
                        <Link to="/deals">� Today's Deals</Link>
                        <Link to="/contact">📞 Contact Us</Link>
                        <Link to="/about">ℹ️ About JollyBaba</Link>
                    </nav>
                </section>

                {/* Still have questions? */}
                <section className="faq-cta" aria-labelledby="cta-title">
                    <h3 id="cta-title">Still have questions?</h3>
                    <p>Our team is ready to help you on WhatsApp</p>
                    <a
                        href="https://wa.me/917891011841?text=Hi!%20I%20have%20a%20question."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="faq-whatsapp-btn"
                        aria-label="Chat with us on WhatsApp"
                    >
                        💬 Chat with us
                    </a>
                </section>
            </article>
        </main>
    );
};

export default FAQPage;
