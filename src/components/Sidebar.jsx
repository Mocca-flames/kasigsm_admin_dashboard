import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Sidebar.css';

const Sidebar = () => {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const navItems = [
        {
            section: 'Overview',
            items: [
                { path: '/', icon: '📊', label: 'Dashboard' },
            ]
        },
        {
            section: 'Catalog',
            items: [
                { path: '/items', icon: '📦', label: 'Items' },
                { path: '/services', icon: '📋', label: 'Services & Pricing' },
                { path: '/suppliers', icon: '🏭', label: 'Suppliers' },
                { path: '/categories', icon: '🗂️', label: 'Categories' },
                { path: '/provider-markups', icon: '🏷️', label: 'Provider Markups' },
            ]
        },
        {
            section: 'Orders',
            items: [
                { path: '/orders', icon: '🛒', label: 'Orders' },
                { path: '/repair-orders', icon: '🔧', label: 'Repair Orders' },
            ]
        },
        {
            section: 'People',
            items: [
                { path: '/customers', icon: '👥', label: 'Customers' },
                { path: '/users', icon: '👤', label: 'Users' },
                { path: '/technicians', icon: '🔧', label: 'Technicians' },
            ]
        },
        {
            section: 'Tools',
            items: [
                { path: '/credentials', icon: '🔐', label: 'Credentials' },
                { path: '/banners', icon: '📢', label: 'Banners' },
                { path: '/settings', icon: '⚙️', label: 'Settings' },
            ]
        }
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <div className="logo-icon">PF</div>
                <h2>KasI GSM</h2>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((section, idx) => (
                    <div key={idx} className="nav-section">
                        <div className="nav-section-title">{section.section}</div>
                        <ul>
                            {section.items.map((item) => (
                                <li key={item.path} className="nav-item">
                                    <Link
                                        to={item.path}
                                        className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                                    >
                                        <span className="nav-icon">{item.icon}</span>
                                        <span>{item.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
