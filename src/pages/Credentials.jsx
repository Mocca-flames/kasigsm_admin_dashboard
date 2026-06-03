import React, { useState } from 'react';
import { Card } from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { getCredentialPool, uploadCredentials } from '../services/api';

const Credentials = () => {
  const [itemId, setItemId] = useState('');
  const [pool, setPool] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleLoadPool = async () => {
    if (!itemId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getCredentialPool(itemId);
      setPool(data);
    } catch {
      setError('Failed to load credential pool');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !itemId) return;
    try {
      setUploading(true);
      setError(null);
      const formData = new FormData();
      formData.append('credentials_file', file);
      const result = await uploadCredentials(itemId, formData);
      setSuccess(`${result.credentials_added} credentials added`);
      setPool(prev => prev ? { ...prev, total: result.credentials_added } : null);
    } catch {
      setError('Failed to upload credentials');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="page-container">
      <h1>Credential Pool</h1>

      <Card title="Load Credential Pool">
        <div className="form-grid">
          <Input
            label="Item ID (UUID)"
            value={itemId}
            onChange={(e) => setItemId(e.target.value)}
            placeholder="Enter service item UUID"
          />
          <Button variant="primary" onClick={handleLoadPool} loading={loading}>
            Load Pool
          </Button>
        </div>
      </Card>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {pool && (
        <Card title={`Credentials for: ${pool.item_title}`}>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Total</div>
              <div className="stat-value">{pool.total}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Used</div>
              <div className="stat-value">{pool.used}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Remaining</div>
              <div className="stat-value">{pool.remaining}</div>
            </div>
          </div>
          {pool.low_stock && (
            <div className="warning-message" style={{ marginTop: '1rem' }}>
              Low stock alert: Only {pool.remaining} credentials remaining
            </div>
          )}
        </Card>
      )}

      <Card title="Bulk Upload Credentials">
        <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
          Upload credentials as JSON or CSV file for a service item.
        </p>
        <input
          type="file"
          accept=".json,.csv"
          onChange={handleUpload}
          disabled={uploading || !itemId}
          style={{ marginBottom: '0.5rem' }}
        />
        {uploading && <div>Uploading...</div>}
      </Card>
    </div>
  );
};

export default Credentials;