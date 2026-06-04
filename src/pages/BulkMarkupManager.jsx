import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Table from '../components/Table';
import { getCategories, bulkCategoryMarkup, bulkCategoryMarkupPercentage } from '../services/api';

const BulkMarkupManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [mode, setMode] = useState('flat');
  const [value, setValue] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCategories();
      setCategories(data);
    } catch {
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName || !value) {
      setError('Category and value are required');
      return;
    }
    try {
      setActionLoading(true);
      setError(null);
      const numValue = Number(value);
      if (isNaN(numValue)) {
        setError('Value must be a number');
        return;
      }
      if (mode === 'percentage' && (numValue < 0 || numValue > 100)) {
        setError('Percentage must be between 0 and 100');
        return;
      }
      const res = mode === 'flat'
        ? await bulkCategoryMarkup(categoryName, numValue)
        : await bulkCategoryMarkupPercentage(categoryName, numValue);
      setResult(res);
      setValue('');
    } catch (err) {
      setError(err?.response?.data?.detail || 'Failed to apply bulk markup');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Bulk Markup Manager</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <Card>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Category</label>
            <select
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="input"
              disabled={loading}
            >
              <option value="">Select a category...</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Mode</label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="input"
            >
              <option value="flat">Flat ZAR</option>
              <option value="percentage">Percentage (%)</option>
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
              {mode === 'flat' ? 'Markup Amount (ZAR)' : 'Percentage (0-100)'}
            </label>
            <Input
              type="number"
              step={mode === 'flat' ? '0.01' : '1'}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required
            />
          </div>

          <Button variant="primary" type="submit" disabled={actionLoading || !categoryName || !value}>
            {actionLoading ? 'Applying...' : 'Apply Bulk Markup'}
          </Button>
        </form>
      </Card>

      {result && (
        <Card style={{ marginTop: '24px' }}>
          <h2 style={{ marginTop: 0, marginBottom: '12px' }}>Result</h2>
          <p><strong>Message:</strong> {result.message}</p>
          <p><strong>Category:</strong> {result.category}</p>
          <p><strong>Type:</strong> {result.markup_type}</p>
          <p><strong>Items Updated:</strong> {result.items_updated}</p>
          {result.updated_items && result.updated_items.length > 0 && (
            <div style={{ marginTop: '12px' }}>
              <h3 style={{ marginTop: 0 }}>Updated Items</h3>
              <Table
                columns={[
                  { key: 'title', label: 'Item' },
                  ...(result.markup_type === 'percentage' ? [{ key: 'cost_price', label: 'Cost Price' }] : []),
                  { key: 'new_price_markup', label: 'New Markup' },
                ]}
                data={result.updated_items}
              />
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default BulkMarkupManager;
