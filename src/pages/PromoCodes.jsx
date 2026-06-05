import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import Table from '../components/Table';
import Input from '../components/Input';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Checkbox from '../components/Checkbox';
import Icon from '../components/Icons';
import {
  getPromoCodes,
  createPromoCode,
  updatePromoCode,
  deletePromoCode,
  getPromoCodeUsages,
} from '../services/api';
import './PromoCodes.css';

const DISCOUNT_TYPES = ['PERCENTAGE', 'FIXED_AMOUNT'];

const PromoCodes = () => {
  const [promoCodes, setPromoCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeOnly, setActiveOnly] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, type: '', title: '', data: null });
  const [usageModal, setUsageModal] = useState({ isOpen: false, promocode: null, usages: [], loading: false });
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discount_type: 'PERCENTAGE',
    discount_value: '',
    min_order_amount: '',
    max_discount_amount: '',
    max_uses: '',
    max_uses_per_user: 1,
    valid_from: '',
    valid_until: '',
    applicable_categories: '',
    applicable_items: '',
    is_active: true,
  });

  useEffect(() => {
    loadPromoCodes();
  }, [activeOnly]);

  const loadPromoCodes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPromoCodes(activeOnly);
      setPromoCodes(data);
    } catch {
      setError('Failed to load promo codes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setModal({ isOpen: true, type: 'create', title: 'Create Promo Code', data: null });
    setFormData({
      code: '',
      description: '',
      discount_type: 'PERCENTAGE',
      discount_value: '',
      min_order_amount: '',
      max_discount_amount: '',
      max_uses: '',
      max_uses_per_user: 1,
      valid_from: '',
      valid_until: '',
      applicable_categories: '',
      applicable_items: '',
      is_active: true,
    });
  };

  const handleEdit = (promo) => {
    setModal({ isOpen: true, type: 'edit', title: 'Edit Promo Code', data: promo });
    setFormData({
      code: promo.code || '',
      description: promo.description || '',
      discount_type: promo.discount_type || 'PERCENTAGE',
      discount_value: promo.discount_value || '',
      min_order_amount: promo.min_order_amount || '',
      max_discount_amount: promo.max_discount_amount || '',
      max_uses: promo.max_uses || '',
      max_uses_per_user: promo.max_uses_per_user || 1,
      valid_from: promo.valid_from || '',
      valid_until: promo.valid_until || '',
      applicable_categories: '',
      applicable_items: '',
      is_active: promo.is_active ?? true,
    });
  };

  const handleDelete = async (promo) => {
    if (window.confirm(`Delete promo code "${promo.code}"? This cannot be undone.`)) {
      try {
        await deletePromoCode(promo.id);
        setPromoCodes(promoCodes.filter(p => p.id !== promo.id));
        setSuccess(`Promo code "${promo.code}" deleted`);
      } catch {
        setError('Failed to delete promo code');
      }
    }
  };

  const handleToggleActive = async (promo) => {
    try {
      const updated = await updatePromoCode(promo.id, { is_active: !promo.is_active });
      setPromoCodes(promoCodes.map(p => p.id === promo.id ? { ...p, ...updated } : p));
    } catch {
      setError('Failed to update promo code status');
    }
  };

  const handleViewUsages = async (promo) => {
    setUsageModal({ isOpen: true, promocode: promo, usages: [], loading: true });
    try {
      const usages = await getPromoCodeUsages(promo.id);
      setUsageModal(prev => ({ ...prev, usages, loading: false }));
    } catch {
      setUsageModal(prev => ({ ...prev, loading: false }));
      setError('Failed to load usage data');
    }
  };

  const handleSubmit = async () => {
    try {
      setError(null);
      const payload = { ...formData };
      if (payload.discount_value) payload.discount_value = Number(payload.discount_value);
      if (payload.min_order_amount) payload.min_order_amount = String(payload.min_order_amount);
      if (payload.max_discount_amount) payload.max_discount_amount = String(payload.max_discount_amount);
      if (payload.max_uses) payload.max_uses = Number(payload.max_uses);
      if (payload.max_uses_per_user) payload.max_uses_per_user = Number(payload.max_uses_per_user);
      if (!payload.applicable_categories) delete payload.applicable_categories;
      if (!payload.applicable_items) delete payload.applicable_items;
      if (!payload.min_order_amount) delete payload.min_order_amount;
      if (!payload.max_discount_amount) delete payload.max_discount_amount;
      if (!payload.max_uses) delete payload.max_uses;

      if (modal.type === 'create') {
        const newPromo = await createPromoCode(payload);
        setPromoCodes([...promoCodes, newPromo]);
        setSuccess(`Promo code "${payload.code}" created`);
      } else {
        const updated = await updatePromoCode(modal.data.id, payload);
        setPromoCodes(promoCodes.map(p => p.id === modal.data.id ? { ...p, ...updated } : p));
        setSuccess(`Promo code "${payload.code}" updated`);
      }
      setModal({ ...modal, isOpen: false });
    } catch {
      setError(modal.type === 'create' ? 'Failed to create promo code' : 'Failed to update promo code');
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('en-ZA', {
        year: 'numeric', month: 'short', day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const isExpired = (validUntil) => {
    if (!validUntil) return false;
    return new Date(validUntil) < new Date();
  };

  const columns = [
    {
      key: 'code',
      label: 'Code',
      render: (row) => (
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontWeight: 600,
          color: 'var(--accent)',
          fontSize: 'var(--text-sm)',
        }}>
          {row.code}
        </span>
      ),
    },
    { key: 'description', label: 'Description' },
    {
      key: 'discount_type',
      label: 'Type',
      render: (row) => (
        <span className={`badge ${row.discount_type === 'PERCENTAGE' ? 'badge-accent' : 'badge-warning'}`}>
          {row.discount_type === 'PERCENTAGE' ? '%' : 'R'}
        </span>
      ),
    },
    {
      key: 'discount_value',
      label: 'Value',
      render: (row) => (
        <span className="mono">
          {row.discount_type === 'PERCENTAGE' ? `${row.discount_value}%` : `R${row.discount_value}`}
        </span>
      ),
    },
    {
      key: 'current_uses',
      label: 'Uses',
      render: (row) => {
        const ratio = row.max_uses ? (row.current_uses / row.max_uses * 100) : 0;
        const isFull = row.max_uses && row.current_uses >= row.max_uses;
        return (
          <span className={`mono ${isFull ? 'color-danger' : ''}`}>
            {row.current_uses || 0}{row.max_uses ? ` / ${row.max_uses}` : ''}
            {row.max_uses && (
              <span style={{ marginLeft: 6, opacity: 0.5 }}>({Math.round(ratio)}%)</span>
            )}
          </span>
        );
      },
    },
    {
      key: 'valid_until',
      label: 'Valid Until',
      render: (row) => {
        const expired = isExpired(row.valid_until);
        return (
          <span className={expired ? 'color-danger' : ''}>
            {formatDate(row.valid_until)}
            {expired && <span style={{ marginLeft: 4 }}>⚠</span>}
          </span>
        );
      },
    },
    {
      key: 'is_active',
      label: 'Active',
      render: (row) => (
        <button
          className={`action-btn ${row.is_active ? 'active' : ''}`}
          onClick={() => handleToggleActive(row)}
          title={row.is_active ? 'Deactivate' : 'Activate'}
        >
          {row.is_active ? <Icon name="check" size={14} /> : <Icon name="x" size={14} />}
        </button>
      ),
    },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Promo Codes</h1>
        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
          <Checkbox
            label="Active only"
            checked={activeOnly}
            onChange={(e) => setActiveOnly(e.target.checked)}
          />
          <Button variant="primary" onClick={handleCreate}>Add Promo Code</Button>
        </div>
      </div>

      {error && <div className="error-message" style={{ marginBottom: 'var(--space-4)' }}>{error}</div>}
      {success && <div className="success-message" style={{ marginBottom: 'var(--space-4)' }}>{success}</div>}

      <Card>
        {loading ? (
          <div className="loading-state">Loading promo codes...</div>
        ) : (
          <Table
            columns={columns}
            data={promoCodes}
            onEdit={handleEdit}
            onDelete={handleDelete}
            renderActions={(row) => (
              <button
                className="action-btn"
                onClick={() => handleViewUsages(row)}
                title="View usages"
                style={{ marginLeft: 4 }}
              >
                <Icon name="receipt" size={16} />
              </button>
            )}
          />
        )}
      </Card>

      <Modal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        title={modal.title}
        size="lg"
        actions={[
          { label: 'Cancel', onClick: () => setModal({ ...modal, isOpen: false }) },
          { label: 'Save', onClick: handleSubmit, variant: 'primary' },
        ]}
      >
        <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <Input
            label="Code"
            value={formData.code}
            onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
            placeholder="e.g. WELCOME20"
            required
          />
          <Input
            label="Description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="e.g. 20% off first order"
          />
          <div className="form-field" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <label className="input-label">Discount Type</label>
            <select
              className="input"
              value={formData.discount_type}
              onChange={(e) => handleChange('discount_type', e.target.value)}
            >
              {DISCOUNT_TYPES.map(t => (
                <option key={t} value={t}>{t === 'PERCENTAGE' ? 'Percentage (%)' : 'Fixed Amount (R)'}</option>
              ))}
            </select>
          </div>
          <Input
            label={formData.discount_type === 'PERCENTAGE' ? 'Discount %' : 'Discount Amount (R)'}
            type="number"
            value={formData.discount_value}
            onChange={(e) => handleChange('discount_value', e.target.value)}
            placeholder="e.g. 20"
            required
          />
          <Input
            label="Min Order Amount (R)"
            type="number"
            value={formData.min_order_amount}
            onChange={(e) => handleChange('min_order_amount', e.target.value)}
            placeholder="Leave empty for no minimum"
          />
          <Input
            label="Max Discount Amount (R)"
            type="number"
            value={formData.max_discount_amount}
            onChange={(e) => handleChange('max_discount_amount', e.target.value)}
            placeholder="For % discounts"
          />
          <Input
            label="Max Total Uses"
            type="number"
            value={formData.max_uses}
            onChange={(e) => handleChange('max_uses', e.target.value)}
            placeholder="Leave empty for unlimited"
          />
          <Input
            label="Max Uses Per User"
            type="number"
            value={formData.max_uses_per_user}
            onChange={(e) => handleChange('max_uses_per_user', e.target.value)}
          />
          <Input
            label="Valid From"
            type="datetime-local"
            value={formData.valid_from}
            onChange={(e) => handleChange('valid_from', e.target.value)}
          />
          <Input
            label="Valid Until"
            type="datetime-local"
            value={formData.valid_until}
            onChange={(e) => handleChange('valid_until', e.target.value)}
          />
          <Input
            label="Applicable Categories (comma-separated)"
            value={formData.applicable_categories}
            onChange={(e) => handleChange('applicable_categories', e.target.value)}
            placeholder="e.g. Tool Rental, Remote Services"
          />
          <Input
            label="Applicable Item IDs (comma-separated)"
            value={formData.applicable_items}
            onChange={(e) => handleChange('applicable_items', e.target.value)}
            placeholder="e.g. uuid1,uuid2"
          />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Checkbox
              label="Active"
              checked={formData.is_active}
              onChange={(e) => handleChange('is_active', e.target.checked)}
            />
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={usageModal.isOpen}
        onClose={() => setUsageModal({ isOpen: false, promocode: null, usages: [], loading: false })}
        title={`Usages: ${usageModal.promocode?.code || ''}`}
        size="lg"
      >
        {usageModal.loading ? (
          <div className="loading-state" style={{ padding: 'var(--space-8)', textAlign: 'center' }}>Loading usages...</div>
        ) : usageModal.usages.length === 0 ? (
          <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-muted)' }}>
            No usages recorded yet.
          </div>
        ) : (
          <div className="table-wrapper" style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            <table className="table" style={{ fontSize: 'var(--text-sm)' }}>
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Order ID</th>
                  <th>Discount</th>
                  <th>Order Amount</th>
                  <th>Used At</th>
                </tr>
              </thead>
              <tbody>
                {usageModal.usages.map((u, i) => (
                  <tr key={i}>
                    <td className="mono" style={{ fontSize: '11px' }}>{u.user_id?.slice(0, 8)}…</td>
                    <td className="mono" style={{ fontSize: '11px' }}>{u.order_id?.slice(0, 8)}…</td>
                    <td className="mono" style={{ color: 'var(--color-success)' }}>R{u.discount_amount}</td>
                    <td className="mono">R{u.order_amount}</td>
                    <td>{formatDate(u.used_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PromoCodes;