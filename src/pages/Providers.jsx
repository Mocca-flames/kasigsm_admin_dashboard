import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import Table from '../components/Table';
import Button from '../components/Button';
import { getProviders, toggleProviderStatus } from '../services/api';

const Providers = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProviders();
      setProviders(data);
    } catch {
      setError('Failed to load providers');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (provider) => {
    try {
      await toggleProviderStatus(provider.id, !provider.is_active);
      setProviders(providers.map(p => p.id === provider.id ? { ...p, is_active: !p.is_active } : p));
    } catch {
      setError('Failed to update provider status');
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (row) => <span style={{ fontWeight: 600 }}>{row.name}</span>,
    },
    {
      key: 'is_active',
      label: 'Active',
      render: (row) => (
        <span className={`status-badge ${row.is_active ? 'active' : 'inactive'}`}>
          {row.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'base_url',
      label: 'Base URL',
      render: (row) => (
        <a href={row.base_url} target="_blank" rel="noreferrer" style={{ color: '#4f46e5', textDecoration: 'none' }}>
          {row.base_url}
        </a>
      ),
    },
    { key: 'notes', label: 'Notes', render: (row) => row.notes || '-' },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Suppliers</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <Card>
        {loading ? (
          <div className="loading-state">Loading suppliers...</div>
        ) : (
          <Table
            columns={columns}
            data={providers}
            renderActions={(row) => (
              <Button
                variant={row.is_active ? 'outline' : 'primary'}
                size="sm"
                onClick={() => handleToggleStatus(row)}
                title={row.is_active ? 'Deactivate' : 'Activate'}
              >
                {row.is_active ? 'Inactivate' : 'Activate'}
              </Button>
            )}
          />
        )}
      </Card>
    </div>
  );
};

export default Providers;
