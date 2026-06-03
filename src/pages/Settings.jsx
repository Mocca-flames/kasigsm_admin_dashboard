import React, { useState } from 'react';
import { Card } from '../components/Card';

const Settings = () => {
    const [settings, setSettings] = useState({
        shopName: 'KasI GSM',
        contactEmail: 'admin@phonefix.co.za',
        contactPhone: '',
        defaultLang: 'en',
        notificationsEnabled: true,
        smsNotifications: true,
        emailNotifications: true,
        autoAssignTechnician: true,
        enableWarrantyTracking: true,
        vatRate: '15',
        currency: 'ZAR',
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        console.log('Save settings:', settings);
        alert('Shop settings saved successfully!');
    };

    return (
        <div>
            <h1>Settings</h1>
            <p>Configure your phone repair shop — pricing, notifications, and workflow preferences.</p>

            <div className="grid grid-2" style={{ marginTop: '32px' }}>
                {/* General Settings */}
                <Card title="Shop Details">
                    <form onSubmit={handleSave}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                                Shop Name
                            </label>
                            <input
                                type="text"
                                name="shopName"
                                value={settings.shopName}
                                onChange={handleChange}
                                style={{
                                    width: '100%', padding: '10px 12px',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: 'var(--radius-sm)', fontSize: '14px'
                                }}
                            />
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                                Contact Email
                            </label>
                            <input
                                type="email"
                                name="contactEmail"
                                value={settings.contactEmail}
                                onChange={handleChange}
                                style={{
                                    width: '100%', padding: '10px 12px',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: 'var(--radius-sm)', fontSize: '14px'
                                }}
                            />
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                                Contact Phone
                            </label>
                            <input
                                type="tel"
                                name="contactPhone"
                                value={settings.contactPhone}
                                onChange={handleChange}
                                placeholder="+27 XX XXX XXXX"
                                style={{
                                    width: '100%', padding: '10px 12px',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: 'var(--radius-sm)', fontSize: '14px'
                                }}
                            />
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                                Currency
                            </label>
                            <select
                                name="currency"
                                value={settings.currency}
                                onChange={handleChange}
                                style={{
                                    width: '100%', padding: '10px 12px',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: 'var(--radius-sm)', fontSize: '14px'
                                }}
                            >
                                <option value="ZAR">ZAR – South African Rand</option>
                                <option value="USD">USD – US Dollar</option>
                                <option value="EUR">EUR – Euro</option>
                            </select>
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                                VAT / Tax Rate (%)
                            </label>
                            <input
                                type="number"
                                name="vatRate"
                                value={settings.vatRate}
                                onChange={handleChange}
                                step="0.1"
                                style={{
                                    width: '100%', padding: '10px 12px',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: 'var(--radius-sm)', fontSize: '14px'
                                }}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">
                            Save Changes
                        </button>
                    </form>
                </Card>

                {/* Preferences */}
                <Card title="Workflow Preferences">
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer', gap: '12px' }}>
                            <input
                                type="checkbox"
                                name="autoAssignTechnician"
                                checked={settings.autoAssignTechnician}
                                onChange={handleChange}
                                style={{ marginTop: '3px', width: '18px', height: '18px' }}
                            />
                            <div>
                                <div style={{ fontWeight: '500' }}>Auto-Assign Technician</div>
                                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                                    Automatically assign the next available technician when a ticket is created
                                </div>
                            </div>
                        </label>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer', gap: '12px' }}>
                            <input
                                type="checkbox"
                                name="enableWarrantyTracking"
                                checked={settings.enableWarrantyTracking}
                                onChange={handleChange}
                                style={{ marginTop: '3px', width: '18px', height: '18px' }}
                            />
                            <div>
                                <div style={{ fontWeight: '500' }}>Warranty Tracking</div>
                                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                                    Track warranty status for each device and flag under-warranty jobs
                                </div>
                            </div>
                        </label>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer', gap: '12px' }}>
                            <input
                                type="checkbox"
                                name="smsNotifications"
                                checked={settings.smsNotifications}
                                onChange={handleChange}
                                style={{ marginTop: '3px', width: '18px', height: '18px' }}
                            />
                            <div>
                                <div style={{ fontWeight: '500' }}>SMS Notifications</div>
                                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                                    Send SMS updates to customers when their repair status changes
                                </div>
                            </div>
                        </label>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer', gap: '12px' }}>
                            <input
                                type="checkbox"
                                name="emailNotifications"
                                checked={settings.emailNotifications}
                                onChange={handleChange}
                                style={{ marginTop: '3px', width: '18px', height: '18px' }}
                            />
                            <div>
                                <div style={{ fontWeight: '500' }}>Email Notifications</div>
                                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                                    Send email receipts and status updates to customers
                                </div>
                            </div>
                        </label>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer', gap: '12px' }}>
                            <input
                                type="checkbox"
                                name="notificationsEnabled"
                                checked={settings.notificationsEnabled}
                                onChange={handleChange}
                                style={{ marginTop: '3px', width: '18px', height: '18px' }}
                            />
                            <div>
                                <div style={{ fontWeight: '500' }}>All Notifications</div>
                                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                                    Master toggle for in-app notification badges
                                </div>
                            </div>
                        </label>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Settings;
