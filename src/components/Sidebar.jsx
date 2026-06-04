import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Sidebar.css';
import Icon from './Icons';

const Sidebar = () => {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const navItems = [
        {
            section: 'Overview',
            items: [
                { path: '/', icon: <Icon name="barchart" size={16} />, label: 'Dashboard' },
            ]
        },
        {
            section: 'Catalog',
            items: [
                { path: '/items', icon: <Icon name="package" size={16} />, label: 'Items' },
                { path: '/services', icon: <Icon name="bank" size={16} />, label: 'Services & Pricing' },
                { path: '/suppliers', icon: <Icon name="truck" size={16} />, label: 'Suppliers' },
                { path: '/categories', icon: <Icon name="tag" size={16} />, label: 'Categories' },
                { path: '/provider-markups', icon: <Icon name="percent" size={16} />, label: 'Provider Markups' },
            ]
        },
        {
            section: 'Orders',
            items: [
                { path: '/orders', icon: <Icon name="clipboard" size={16} />, label: 'Orders' },
                { path: '/repair-orders', icon: <Icon name="wrench" size={16} />, label: 'Repair Orders' },
            ]
        },
        {
            section: 'People',
            items: [
                { path: '/customers', icon: <Icon name="user" size={16} />, label: 'Customers' },
                { path: '/users', icon: <Icon name="users" size={16} />, label: 'Users' },
                { path: '/technicians', icon: <Icon name="wrench" size={16} />, label: 'Technicians' },
            ]
        },
        {
            section: 'Tools',
            items: [
                { path: '/credentials', icon: <Icon name="key" size={16} />, label: 'Credentials' },
                { path: '/banners', icon: <Icon name="image" size={16} />, label: 'Banners' },
                { path: '/settings', icon: <Icon name="settings" size={16} />, label: 'Settings' },
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
