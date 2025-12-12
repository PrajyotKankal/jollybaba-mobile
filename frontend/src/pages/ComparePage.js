import React, { useState, useEffect, useContext, useRef } from 'react';
import { UserTypeContext } from '../context/UserTypeContext';
import { CartContext } from '../context/CartContext';
import { toast } from 'react-toastify';
import SEO from '../components/SEO';
import './ComparePage.css';

const ComparePage = () => {
    const [mobiles, setMobiles] = useState([]);
    const [selectedPhones, setSelectedPhones] = useState([null, null, null]);
    const [searchQueries, setSearchQueries] = useState(['', '', '']);
    const [showDropdown, setShowDropdown] = useState([false, false, false]);
    const { userType } = useContext(UserTypeContext);
    const { addToCart } = useContext(CartContext);
    const isDealer = userType === 'Dealer';

    // Refs for click outside handling
    const dropdownRefs = useRef([]);

    useEffect(() => {
        fetchMobiles();
        // Load saved comparison from local storage
        const saved = localStorage.getItem('compareList');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length === 3) {
                    setSelectedPhones(parsed);
                }
            } catch (e) {
                console.error('Error parsing saved comparison', e);
            }
        }
    }, []);

    // Save to local storage whenever selection changes
    useEffect(() => {
        localStorage.setItem('compareList', JSON.stringify(selectedPhones));
    }, [selectedPhones]);

    // Handle click outside to close dropdowns
    useEffect(() => {
        const handleClickOutside = (event) => {
            const newDropdown = [...showDropdown];
            let changed = false;

            dropdownRefs.current.forEach((node, index) => {
                if (showDropdown[index] && node && !node.contains(event.target)) {
                    newDropdown[index] = false;
                    changed = true;
                }
            });

            if (changed) {
                setShowDropdown(newDropdown);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown]);

    const fetchMobiles = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://jollybaba-backend.onrender.com'}/api/mobiles`);
            const data = await response.json();
            setMobiles(data);
        } catch (error) {
            console.error('Error fetching mobiles:', error);
        }
    };

    const handleSearch = (index, value) => {
        const newQueries = [...searchQueries];
        newQueries[index] = value;
        setSearchQueries(newQueries);

        const newDropdown = [...showDropdown];
        newDropdown[index] = value.length > 0;
        setShowDropdown(newDropdown);
    };

    const selectPhone = (index, phone) => {
        const newSelected = [...selectedPhones];
        newSelected[index] = phone;
        setSelectedPhones(newSelected);

        const newQueries = [...searchQueries];
        newQueries[index] = '';
        setSearchQueries(newQueries);

        const newDropdown = [...showDropdown];
        newDropdown[index] = false;
        setShowDropdown(newDropdown);
    };

    const removePhone = (index) => {
        const newSelected = [...selectedPhones];
        newSelected[index] = null;
        setSelectedPhones(newSelected);
    };

    const getFilteredMobiles = (query) => {
        if (!query) return [];
        return mobiles
            .filter(m =>
                `${m.brand} ${m.model}`.toLowerCase().includes(query.toLowerCase())
            )
            .slice(0, 5);
    };

    const handleAddToCart = (phone) => {
        if (!phone) return;
        addToCart(phone, 1);
        toast.success(`${phone.brand} ${phone.model} added to cart!`);
    };

    const selectedCount = selectedPhones.filter(p => p !== null).length;

    return (
        <main className="compare-page">
            <SEO
                title="Compare Mobile Phones - Side by Side Comparison"
                description="Compare mobile phones side by side at JollyBaba Mobiles Pune. Compare specs, prices, RAM, storage of iPhone, Samsung, OnePlus & more. Make informed buying decisions."
                keywords="compare phones Pune, mobile comparison, phone specs comparison, iPhone vs Samsung, compare mobile prices"
                canonical="https://jollybaba.in/compare"
            />
            <section className="compare-hero" aria-labelledby="compare-title">
                <h1>Compare Phones</h1>
                <p>Select up to 3 phones to compare side by side</p>
            </section>

            <div className="compare-content">
                <div className="compare-grid">
                    {[0, 1, 2].map((index) => (
                        <div key={index} className="compare-slot">
                            {selectedPhones[index] ? (
                                <div className="compare-phone">
                                    <button className="remove-btn" onClick={() => removePhone(index)}>✕</button>
                                    <div className="phone-image">
                                        <img
                                            src={selectedPhones[index].imageUrls?.[0] || '/no-image.png'}
                                            alt={selectedPhones[index].model}
                                        />
                                    </div>
                                    <h3>{selectedPhones[index].brand}</h3>
                                    <p className="phone-model">{selectedPhones[index].model}</p>
                                    <p className="phone-price">
                                        ₹{isDealer
                                            ? selectedPhones[index].dealerPrice?.toLocaleString()
                                            : selectedPhones[index].retailPrice?.toLocaleString()}
                                    </p>
                                    <button
                                        className="compare-add-cart-btn"
                                        onClick={() => handleAddToCart(selectedPhones[index])}
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            ) : (
                                <div className="compare-empty" ref={el => (dropdownRefs.current[index] = el)}>
                                    <div className="search-wrapper">
                                        <input
                                            type="text"
                                            placeholder="Search phone..."
                                            value={searchQueries[index]}
                                            onChange={(e) => handleSearch(index, e.target.value)}
                                            onFocus={() => {
                                                if (searchQueries[index].length > 0) {
                                                    const newDropdown = [...showDropdown];
                                                    newDropdown[index] = true;
                                                    setShowDropdown(newDropdown);
                                                }
                                            }}
                                        />
                                        {showDropdown[index] && (
                                            <div className="search-dropdown">
                                                {getFilteredMobiles(searchQueries[index]).map((mobile) => (
                                                    <div
                                                        key={mobile._id}
                                                        className="dropdown-item"
                                                        onClick={() => selectPhone(index, mobile)}
                                                    >
                                                        <img src={mobile.imageUrls?.[0] || '/no-image.png'} alt={mobile.model} />
                                                        <div>
                                                            <strong>{mobile.brand}</strong>
                                                            <span>{mobile.model}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                                {getFilteredMobiles(searchQueries[index]).length === 0 && (
                                                    <div className="dropdown-empty">No phones found</div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <p>Select a phone to compare</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {selectedCount >= 2 && (
                    <div className="compare-table">
                        <h2>Specifications Comparison</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Feature</th>
                                    {selectedPhones.map((phone, i) => (
                                        phone && <th key={i}>{phone.brand} {phone.model}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Brand</td>
                                    {selectedPhones.map((phone, i) => phone && <td key={i}>{phone.brand}</td>)}
                                </tr>
                                <tr>
                                    <td>Model</td>
                                    {selectedPhones.map((phone, i) => phone && <td key={i}>{phone.model}</td>)}
                                </tr>
                                <tr>
                                    <td>Price</td>
                                    {selectedPhones.map((phone, i) => (
                                        phone && (
                                            <td key={i} className="price-cell">
                                                ₹{isDealer ? phone.dealerPrice?.toLocaleString() : phone.retailPrice?.toLocaleString()}
                                            </td>
                                        )
                                    ))}
                                </tr>
                                <tr>
                                    <td>RAM</td>
                                    {selectedPhones.map((phone, i) => phone && <td key={i}>{phone.ram || '-'}</td>)}
                                </tr>
                                <tr>
                                    <td>Storage</td>
                                    {selectedPhones.map((phone, i) => phone && <td key={i}>{phone.storage || '-'}</td>)}
                                </tr>
                                <tr>
                                    <td>Color</td>
                                    {selectedPhones.map((phone, i) => phone && <td key={i}>{phone.color || '-'}</td>)}
                                </tr>
                                <tr>
                                    <td>Network</td>
                                    {selectedPhones.map((phone, i) => phone && <td key={i}>{phone.networkType || '-'}</td>)}
                                </tr>
                                <tr>
                                    <td>Device Type</td>
                                    {selectedPhones.map((phone, i) => phone && <td key={i}>{phone.deviceType || '-'}</td>)}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}

                {selectedCount < 2 && (
                    <div className="compare-hint">
                        <p>👆 Select at least 2 phones to see the comparison</p>
                    </div>
                )}
            </div>
        </main>
    );
};

export default ComparePage;
