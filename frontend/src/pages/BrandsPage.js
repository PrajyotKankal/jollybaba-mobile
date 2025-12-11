import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import './BrandsPage.css';

const BrandMonogram = ({ name }) => {
    const initial = name ? name.charAt(0).toUpperCase() : '?';
    // Premium gradient backgrounds based on brand name length/char code
    const gradients = [
        'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', // Indigo-Purple
        'linear-gradient(135deg, #3b82f6 0%, #2dd4bf 100%)', // Blue-Teal
        'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)', // Amber-Red
        'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)', // Pink-Violet
        'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)', // Emerald-Blue
        'linear-gradient(135deg, #f43f5e 0%, #f97316 100%)', // Rose-Orange
    ];

    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % gradients.length;
    const background = gradients[index];

    return (
        <div className="brand-monogram" style={{ background }}>
            {initial}
        </div>
    );
};

const BrandLogo = ({ name }) => {
    const [error, setError] = useState(false);
    const logoPath = `/brands/${name.toLowerCase()}.png`;

    if (error) {
        return <BrandMonogram name={name} />;
    }

    // Special handling for Nothing and Honor brand (white logo needs dark background)
    const isDarkBgNeeded = ['nothing', 'honor'].includes(name.toLowerCase());
    const wrapperStyle = isDarkBgNeeded ? { backgroundColor: 'black' } : {};

    return (
        <div className="brand-logo-wrapper" style={wrapperStyle}>
            <img
                src={logoPath}
                alt={`${name} mobile brand logo - Buy ${name} phones in Pune`}
                className="brand-logo-img"
                onError={() => setError(true)}
                loading="lazy"
            />
        </div>
    );
};

const BrandsPage = () => {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchBrands();
    }, []);

    const fetchBrands = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://jollybaba-backend.onrender.com'}/api/mobiles`);
            const data = await response.json();

            // Count products per brand with normalization
            const brandMap = {};

            // Aliases map (lowercase -> canonical)
            const brandAliases = {
                'moto': 'Motorola',
                'motorola': 'Motorola',
                'cmf': 'Nothing',
                'cmf by nothing': 'Nothing',
                'nothing': 'Nothing',
                'nothing (r)': 'Nothing',
                'nothing(r)': 'Nothing',
                'one plus': 'OnePlus',
                'oneplus': 'OnePlus',
                'narzo': 'Narzo',
                'mi': 'Xiaomi',
                'redmi': 'Xiaomi'
            };

            data.forEach(mobile => {
                let rawBrand = mobile.brand || 'Other';
                let cleanBrand = rawBrand.trim();

                // Check aliases
                const lowerBrand = cleanBrand.toLowerCase();

                // Direct alias match
                if (brandAliases[lowerBrand]) {
                    cleanBrand = brandAliases[lowerBrand];
                }
                // Handle "Nothing (R)" if it wasn't caught by exact match
                else if (lowerBrand.includes('nothing') && lowerBrand.includes('(r)')) {
                    cleanBrand = 'Nothing';
                }
                else if (lowerBrand === 'one plus') {
                    cleanBrand = 'OnePlus';
                }

                // Normalize key: uppercase for grouping
                const key = cleanBrand.toUpperCase();

                if (!brandMap[key]) {
                    brandMap[key] = {
                        name: cleanBrand, // Use the canonical name
                        count: 0
                    };
                }

                brandMap[key].count += 1;
            });

            // Convert to array and sort by count
            const brandsArray = Object.values(brandMap)
                .sort((a, b) => b.count - a.count);

            setBrands(brandsArray);
        } catch (error) {
            console.error('Error fetching brands:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBrandClick = (brandName) => {
        // Navigate to home and set search query
        navigate(`/?brand=${encodeURIComponent(brandName)}`);
    };

    return (
        <main className="brands-page">
            <SEO
                title="Mobile Phone Brands - iPhone, Samsung, OnePlus, Vivo, Oppo"
                description="Shop all mobile phone brands at JollyBaba Mobiles Pune. iPhone, Samsung, OnePlus, Vivo, Oppo, Xiaomi, Realme, Motorola & more. Best prices on new & second hand phones in Deccan Gymkhana."
                keywords="iPhone Pune, Samsung mobile Pune, OnePlus Pune, Vivo Pune, Oppo Pune, Xiaomi Pune, mobile brands, second hand iPhone, second hand Samsung"
                canonical="https://jollybaba.in/brands"
            />
            {/* Hero Section */}
            <section className="brands-hero" aria-labelledby="brands-title">
                <div className="brands-hero-content">
                    <h1>Premium Collections</h1>
                    <p>Discover exceptional devices from world-class manufacturers</p>
                </div>
            </section>

            {/* Brands Grid */}
            <div className="brands-container">
                {loading ? (
                    <div className="brands-loading">
                        <div className="loading-spinner"></div>
                    </div>
                ) : (
                    <div className="brands-grid">
                        {brands.map((brand, index) => (
                            <div
                                key={index}
                                className="brand-card"
                                onClick={() => handleBrandClick(brand.name)}
                            >
                                <BrandLogo name={brand.name} />
                                <div className="brand-card-content">
                                    <h3 className="brand-name">{brand.name}</h3>
                                    <span className="brand-count">{brand.count} Devices</span>
                                </div>
                                <div className="brand-card-arrow">→</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
};

export default BrandsPage;
