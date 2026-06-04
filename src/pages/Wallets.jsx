import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import Table from '../components/Table';

const Wallets = () => {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadWallets = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('admin_token');
      const useProxy = import.meta.env.VITE_USE_PROXY === 'true';
      const baseURL = useProxy ? '' : (import.meta.env.VITE_API_URL || 'https://3ac2-102-254-178-13.ngrok-free.app');
      const response = await fetch(`${baseURL}/wallet/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to load wallets');
      }
      const data = await response.json();
      setWallets(data);
    } catch {
      setError('Failed to load wallets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWallets();
  }, []);

  const columns = [
    { key: 'id', label: 'Wallet ID' },
    { key: 'email', label: 'Email' },
    { key: 'client_ref', label: 'Client Ref' },
    { key: 'balance', label: 'Balance' },
    { key: 'status', label: 'Status' },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>All Wallets</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          View all registered wallets and their balances.
        </p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <Card>
        {loading ? (
          <div className="loading-state">Loading wallets...</div>
        ) : (
          <Table
            columns={columns}
            data={wallets}
            keyExtractor={(row) => row.id}
          />
        )}
      </Card>
    </div>
  );
};

export default Wallets;
