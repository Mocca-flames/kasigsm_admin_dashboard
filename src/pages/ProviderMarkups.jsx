import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import Table from '../components/Table';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';
import { getProviders, getProviderMarkups, setProviderMarkup, deleteProviderMarkup } from '../services/api';

const ProviderMarkups = () => {
  const [providers, setProviders] = useState([]);
  const [markups, setMarkups] = useState([]);
  const [selectedProviderId, setSelectedProviderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState({ isOpen: false, type: '', title: '', item: null });
  const [formData, setFormData] = useState({ category: '', price_markup: '' });

  useEffect(() => {
    loadProviders();
  }, []);

  useEffect(() => {
    if (selectedProviderId) {
      loadMarkups(selectedProviderId);
    }
  }, [selectedProviderId]);

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

  const loadMarkups = async (providerId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProviderMarkups(providerId);
      setMarkups(data);
    } catch {
      setError('Failed to load markups');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setModal({ isOpen: true, type: 'create', title: 'Add Markup', item: null });
    setFormData({ category: '', price_markup: '' });
  };

  const handleEdit = (row) => {
    setModal({ isOpen: true, type: 'edit', title: 'Edit Markup', item: row });
    setFormData({ category: row.category, price_markup: row.price_markup });
  };

  const handleDelete = async (row) => {
    const confirmed = window.confirm(`Remove markup for category '${row.category}'?`);
    if (!confirmed) return;
    try {
      setActionLoading(true);
      await deleteProviderMarkup(selectedProviderId, row.category);
      setMarkups(prev => prev.filter(m => m.id !== row.id));
    } catch (err) {
      setError(err?.response?.data?.detail || 'Failed to delete markup');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setActionLoading(true);
      const payload = {
        category: formData.category,
        price_markup: formData.price_markup ? Number(formData.price_markup) : null,
      };
      if (!payload.category || payload.price_markup === null) {
        setError('Category and price markup are required');
        return;
      }
      const created = await setProviderMarkup(selectedProviderId, payload.category, payload.price_markup);
      if (modal.type === 'create') {
        setMarkups(prev => [...prev, created]);
      } else {
        setMarkups(prev => prev.map(m => m.id === modal.item.id ? created : m));
      }
      setModal(prev => ({ ...prev, isOpen: false }));
      setError(null);
    } catch (err) {
      setError(err?.response?.data?.detail || 'Failed to save markup');
    } finally {
      setActionLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const columns = [
    { key: 'category', label: 'Category' },
    { key: 'price_markup', label: 'Markup' },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Provider Markups</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <Card>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Supplier</label>
          <select
            value={selectedProviderId}
            onChange={(e) => setSelectedProviderId(e.target.value)}
            className="input"
          >
            <option value="">Select a supplier...</option>
            {providers.map(provider => (
              <option key={provider.id} value={provider.id}>{provider.name}</option>
            ))}
          </select>
        </div>
        {selectedProviderId && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
            <Button variant="primary" onClick={handleAdd}>Add Markup</Button>
          </div>
        )}
        {loading ? (
          <div className="loading-state">Loading markups...</div>
        ) : (
          <Table
            columns={columns}
            data={markups}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </Card>

      <Modal
        isOpen={modal.isOpen}
        onClose={() => setModal(prev => ({ ...prev, isOpen: false }))}
        title={modal.title}
        size="md"
        actions={[
          { label: 'Cancel', onClick: () => setModal(prev => ({ ...prev, isOpen: false })), variant: 'secondary' },
          { label: 'Save', onClick: handleSubmit, variant: 'primary', disabled: actionLoading },
        ]}
      >
        <div className="form-grid">
          <Input
            label="Category"
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
            required
            disabled={modal.type === 'edit'}
          />
          <Input
            label="Price Markup"
            type="number"
            step="0.01"
            value={formData.price_markup}
            onChange={(e) => handleChange('price_markup', e.target.value)}
            required
          />
        </div>
      </Modal>
    </div>
  );
};

export default ProviderMarkups;
