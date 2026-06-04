import React from 'react';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../contexts/useAuth';
import '../styles/Header.css';
import Icon from './Icons';

const Header = () => {
    const { logout } = useAuth();

    return (
        <header className="header">
            <div className="header-search">
                <span className="search-icon"><Icon name="search" size={16} /></span>
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search repair orders, customers, devices..."
                />
            </div>

            <div className="header-actions">
                <button className="header-icon-btn">
                    <span><Icon name="bell" size={16} /></span>
                    <span className="notification-badge">5</span>
                </button>

                <button className="header-icon-btn">
                    <span><Icon name="message" size={16} /></span>
                    <span className="notification-badge">3</span>
                </button>

                <ThemeToggle />

                <div className="header-profile" onClick={logout} style={{ cursor: 'pointer' }}>
                    <div className="profile-avatar">SA</div>
                    <div className="profile-info">
                        <h4>Shop Admin</h4>
                        <p>Administrator</p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
