import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import Table from '../components/Table';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import DropZone from '../components/DropZone';
import { getProviders, toggleProviderStatus, updateProviderLogo, updateProvider } from '../services/api';

const Providers = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editModal, setEditModal] = useState({ isOpen: false, provider: null });
  const [editForm, setEditForm] = useState({
    name: '',
    base_url: '',
    notes: '',
    logo: '',
  });
  const [logoUploading, setLogoUploading] = useState(false);

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

  const handleEditOpen = (provider) => {
    setEditModal({ isOpen: true, provider });
    setEditForm({
      name: provider.name || '',
      base_url: provider.base_url || '',
      notes: provider.notes || '',
      logo: provider.logo || '',
    });
    setLogoUploading(false);
  };

  const handleEditChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const handleEditSubmit = async () => {
    if (!editModal.provider) return;
    try {
      await updateProvider(editModal.provider.id, {
        name: editForm.name,
        base_url: editForm.base_url,
        notes: editForm.notes,
        is_active: editModal.provider.is_active,
      });
      if (editForm.logo !== (editModal.provider.logo || '')) {
        setLogoUploading(true);
        const formData = new FormData();
        formData.append('file', editForm.logo);
        await updateProviderLogo(editModal.provider.id, formData);
        setLogoUploading(false);
      }
      setProviders(providers.map(p => p.id === editModal.provider.id ? { ...p, ...editForm } : p));
      setEditModal({ ...editModal, isOpen: false });
    } catch {
      setError('Failed to update provider');
      setLogoUploading(false);
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
    {
      key: 'logo',
      label: 'Logo',
      render: (row) => (
        row.logo ? (
          <img src={row.logo} alt="" style={{ width: 32, height: 32, objectFit: 'contain', borderRadius: 4, border: '1px solid var(--border-color)' }} />
        ) : (
          <span style={{ color: 'var(--text-muted)' }}>—</span>
        )
      ),
    },
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
              <div style={{ display: 'flex', gap: 6, flexWrap: 'nowrap' }}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditOpen(row)}
                  title="Edit supplier"
                >
                  Edit
                </Button>
                <Button
                  variant={row.is_active ? 'outline' : 'primary'}
                  size="sm"
                  onClick={() => handleToggleStatus(row)}
                  title={row.is_active ? 'Deactivate' : 'Activate'}
                >
                  {row.is_active ? 'Inactivate' : 'Activate'}
                </Button>
              </div>
            )}
          />
        )}
      </Card>

      <Modal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ ...editModal, isOpen: false })}
        title="Edit Supplier"
        size="lg"
        actions={[
          { label: 'Cancel', onClick: () => setEditModal({ ...editModal, isOpen: false }) },
          { label: 'Save', onClick: handleEditSubmit, variant: 'primary', disabled: !editForm.name || logoUploading },
        ]}
      >
        <div className="form-grid">
          <Input
            label="Name"
            value={editForm.name}
            onChange={(e) => handleEditChange('name', e.target.value)}
            required
          />
          <Input
            label="Base URL"
            value={editForm.base_url}
            onChange={(e) => handleEditChange('base_url', e.target.value)}
          />
          <Input
            label="Notes"
            value={editForm.notes}
            onChange={(e) => handleEditChange('notes', e.target.value)}
          />
          <DropZone
            label="Logo"
            value={editForm.logo}
            onFileSelected={(url) => handleEditChange('logo', url)}
            onClear={() => handleEditChange('logo', '')}
            disabled={logoUploading}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Providers;

