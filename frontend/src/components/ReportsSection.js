import React, { useMemo, useState } from 'react';
import {
    PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import * as XLSX from 'xlsx';
import { FaDownload, FaBoxOpen, FaTags, FaChartPie, FaMobileAlt, FaTabletAlt, FaSignal } from 'react-icons/fa';
import './ReportsSection.css';

const COLORS = ['#009087', '#00b8ad', '#00d4c8', '#4ade80', '#22c55e', '#16a34a', '#15803d', '#166534'];

const ReportsSection = ({ mobiles }) => {
    const [activeReport, setActiveReport] = useState('overview');
    const [searchTerm, setSearchTerm] = useState('');

    // Calculate statistics
    const stats = useMemo(() => {
        const totalDevices = mobiles.length;
        const inStock = mobiles.filter(m => !m.isOutOfStock).length;
        const outOfStock = mobiles.filter(m => m.isOutOfStock).length;
        const uniqueBrands = [...new Set(mobiles.map(m => m.brand))].length;
        const avgRetailPrice = totalDevices > 0
            ? Math.round(mobiles.reduce((sum, m) => sum + (m.retailPrice || 0), 0) / totalDevices)
            : 0;
        const avgDealerPrice = totalDevices > 0
            ? Math.round(mobiles.reduce((sum, m) => sum + (m.dealerPrice || 0), 0) / totalDevices)
            : 0;
        const totalMobiles = mobiles.filter(m => m.deviceType === 'Mobile').length;
        const totalTablets = mobiles.filter(m => m.deviceType === 'Tablet').length;

        return { totalDevices, inStock, outOfStock, uniqueBrands, avgRetailPrice, avgDealerPrice, totalMobiles, totalTablets };
    }, [mobiles]);

    // Brand distribution data
    const brandData = useMemo(() => {
        const brandCounts = {};
        mobiles.forEach(m => {
            brandCounts[m.brand] = (brandCounts[m.brand] || 0) + 1;
        });
        return Object.entries(brandCounts)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 8);
    }, [mobiles]);

    // Stock status data
    const stockData = useMemo(() => [
        { name: 'In Stock', value: stats.inStock },
        { name: 'Out of Stock', value: stats.outOfStock }
    ], [stats]);

    // Device type data
    const deviceTypeData = useMemo(() => [
        { name: 'Mobile', value: stats.totalMobiles },
        { name: 'Tablet', value: stats.totalTablets }
    ], [stats]);

    // Network type data
    const networkData = useMemo(() => {
        const networkCounts = { '5G': 0, '4G': 0, '3G': 0, '2G': 0 };
        mobiles.forEach(m => {
            if (m.networkType && networkCounts[m.networkType] !== undefined) {
                networkCounts[m.networkType]++;
            }
        });
        return Object.entries(networkCounts).map(([name, value]) => ({ name, value }));
    }, [mobiles]);

    // Price range data
    const priceRangeData = useMemo(() => {
        const ranges = [
            { name: '< ₹5K', min: 0, max: 5000, value: 0 },
            { name: '₹5K-10K', min: 5000, max: 10000, value: 0 },
            { name: '₹10K-20K', min: 10000, max: 20000, value: 0 },
            { name: '₹20K-30K', min: 20000, max: 30000, value: 0 },
            { name: '₹30K-50K', min: 30000, max: 50000, value: 0 },
            { name: '> ₹50K', min: 50000, max: Infinity, value: 0 }
        ];
        mobiles.forEach(m => {
            const price = m.retailPrice || 0;
            for (const range of ranges) {
                if (price >= range.min && price < range.max) {
                    range.value++;
                    break;
                }
            }
        });
        return ranges.map(({ name, value }) => ({ name, value }));
    }, [mobiles]);

    // Filtered mobiles for inventory table
    const filteredMobiles = useMemo(() => {
        if (!searchTerm) return mobiles;
        const term = searchTerm.toLowerCase();
        return mobiles.filter(m =>
            m.brand?.toLowerCase().includes(term) ||
            m.model?.toLowerCase().includes(term) ||
            m.mobileId?.toLowerCase().includes(term)
        );
    }, [mobiles, searchTerm]);

    // Export to Excel
    const exportToExcel = () => {
        const exportData = mobiles.map(m => ({
            'Mobile ID': m.mobileId,
            'Brand': m.brand,
            'Model': m.model,
            'RAM': m.ram,
            'Storage': m.storage,
            'Color': m.color,
            'Retail Price': m.retailPrice,
            'Dealer Price': m.dealerPrice,
            'Device Type': m.deviceType,
            'Network Type': m.networkType,
            'Stock Status': m.isOutOfStock ? 'Out of Stock' : 'In Stock',
            'Created At': new Date(m.createdAt).toLocaleDateString()
        }));

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Inventory Report');
        XLSX.writeFile(wb, `JollyBaba_Inventory_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    return (
        <div className="reports-section">
            {/* Report Navigation */}
            <div className="reports-nav">
                <button
                    className={activeReport === 'overview' ? 'active' : ''}
                    onClick={() => setActiveReport('overview')}
                >
                    <FaChartPie /> Overview
                </button>
                <button
                    className={activeReport === 'inventory' ? 'active' : ''}
                    onClick={() => setActiveReport('inventory')}
                >
                    <FaBoxOpen /> Inventory
                </button>
                <button
                    className={activeReport === 'analytics' ? 'active' : ''}
                    onClick={() => setActiveReport('analytics')}
                >
                    <FaTags /> Analytics
                </button>
            </div>

            {/* Overview Report */}
            {activeReport === 'overview' && (
                <div className="report-content">
                    <div className="report-header">
                        <h2>📊 Dashboard Overview</h2>
                        <button className="export-btn" onClick={exportToExcel}>
                            <FaDownload /> Export All
                        </button>
                    </div>

                    {/* Stat Cards */}
                    <div className="stats-grid">
                        <div className="stat-card gradient-1">
                            <div className="stat-icon"><FaBoxOpen /></div>
                            <div className="stat-info">
                                <span className="stat-value">{stats.totalDevices}</span>
                                <span className="stat-label">Total Devices</span>
                            </div>
                        </div>
                        <div className="stat-card gradient-2">
                            <div className="stat-icon"><FaTags /></div>
                            <div className="stat-info">
                                <span className="stat-value">{stats.uniqueBrands}</span>
                                <span className="stat-label">Unique Brands</span>
                            </div>
                        </div>
                        <div className="stat-card gradient-3">
                            <div className="stat-icon"><FaMobileAlt /></div>
                            <div className="stat-info">
                                <span className="stat-value">{stats.inStock}</span>
                                <span className="stat-label">In Stock</span>
                            </div>
                        </div>
                        <div className="stat-card gradient-4">
                            <div className="stat-icon"><FaTabletAlt /></div>
                            <div className="stat-info">
                                <span className="stat-value">{stats.outOfStock}</span>
                                <span className="stat-label">Out of Stock</span>
                            </div>
                        </div>
                    </div>

                    {/* Charts Grid */}
                    <div className="charts-grid">
                        {/* Brand Distribution */}
                        <div className="chart-card">
                            <h3>Brand Distribution</h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={brandData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={90}
                                        paddingAngle={3}
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                    >
                                        {brandData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Stock Status */}
                        <div className="chart-card">
                            <h3>Stock Status</h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={stockData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={90}
                                        paddingAngle={5}
                                        dataKey="value"
                                        label={({ name, value }) => `${name}: ${value}`}
                                    >
                                        <Cell fill="#22c55e" />
                                        <Cell fill="#ef4444" />
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}

            {/* Inventory Report */}
            {activeReport === 'inventory' && (
                <div className="report-content">
                    <div className="report-header">
                        <h2>📦 Inventory Report</h2>
                        <div className="header-actions">
                            <input
                                type="text"
                                placeholder="Search by brand, model, ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                            <button className="export-btn" onClick={exportToExcel}>
                                <FaDownload /> Export Excel
                            </button>
                        </div>
                    </div>

                    <div className="inventory-summary">
                        <span>Showing <strong>{filteredMobiles.length}</strong> of {mobiles.length} devices</span>
                    </div>

                    <div className="inventory-table-wrapper">
                        <table className="inventory-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Brand</th>
                                    <th>Model</th>
                                    <th>RAM/Storage</th>
                                    <th>Retail Price</th>
                                    <th>Dealer Price</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMobiles.slice(0, 50).map((mobile) => (
                                    <tr key={mobile._id}>
                                        <td className="id-cell">{mobile.mobileId}</td>
                                        <td>{mobile.brand}</td>
                                        <td>{mobile.model}</td>
                                        <td>{mobile.ram}/{mobile.storage}</td>
                                        <td className="price-cell">₹{mobile.retailPrice?.toLocaleString()}</td>
                                        <td className="price-cell">₹{mobile.dealerPrice?.toLocaleString()}</td>
                                        <td>
                                            <span className={`status-badge ${mobile.isOutOfStock ? 'out-of-stock' : 'in-stock'}`}>
                                                {mobile.isOutOfStock ? 'Out of Stock' : 'In Stock'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Analytics Report */}
            {activeReport === 'analytics' && (
                <div className="report-content">
                    <div className="report-header">
                        <h2>📈 Analytics</h2>
                    </div>

                    <div className="analytics-grid">
                        {/* Device Types */}
                        <div className="chart-card">
                            <h3><FaMobileAlt /> Device Types</h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={deviceTypeData}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#009087" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Network Distribution */}
                        <div className="chart-card">
                            <h3><FaSignal /> Network Types</h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={networkData}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#00b8ad" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Price Range Distribution */}
                        <div className="chart-card full-width">
                            <h3>💰 Price Range Distribution</h3>
                            <ResponsiveContainer width="100%" height={280}>
                                <BarChart data={priceRangeData}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="value" name="Devices" fill="#22c55e" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Additional Stats */}
                    <div className="analytics-stats">
                        <div className="analytics-stat-card">
                            <span className="analytics-label">Avg Retail Price</span>
                            <span className="analytics-value">₹{stats.avgRetailPrice.toLocaleString()}</span>
                        </div>
                        <div className="analytics-stat-card">
                            <span className="analytics-label">Avg Dealer Price</span>
                            <span className="analytics-value">₹{stats.avgDealerPrice.toLocaleString()}</span>
                        </div>
                        <div className="analytics-stat-card">
                            <span className="analytics-label">Stock Rate</span>
                            <span className="analytics-value">
                                {stats.totalDevices > 0 ? Math.round((stats.inStock / stats.totalDevices) * 100) : 0}%
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportsSection;
