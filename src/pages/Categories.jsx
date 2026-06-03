import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import Table from '../components/Table';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';
import { getCategories, createCategory, updateCategory, deactivateCategory } from '../services/api';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState({ isOpen: false, type: '', title: '', data: null, item: null });
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [actionLoading, setActionLoading] = useState(false);

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

  const handleCreate = () => {
    setModal({ isOpen: true, type: 'create', title: 'Create Category', data: null, item: null });
    setFormData({ name: '', description: '' });
  };

  const handleEdit = (item) => {
    setModal({ isOpen: true, type: 'edit', title: 'Edit Category', data: null, item });
    setFormData({ name: item.name || '', description: item.description || '' });
  };

  const handleDelete = async (item) => {
    const confirmed = window.confirm(`Deactivate category '${item.name}'?`);
    if (!confirmed) return;
    try {
      setActionLoading(true);
      await deactivateCategory(item.id);
      setCategories(prev => prev.map(c => c.id === item.id ? { ...c, is_active: false } : c));
    } catch (err) {
      setError(err?.response?.data?.detail || 'Failed to deactivate category');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setActionLoading(true);
      if (modal.type === 'create') {
        const created = await createCategory(formData.name, formData.description);
        setCategories(prev => [...prev, created]);
      } else {
        const updated = await updateCategory(modal.item.id, {
          name: formData.name,
          ...(formData.description !== undefined ? { description: formData.description } : {}),
        });
        setCategories(prev => prev.map(c => c.id === modal.item.id ? updated : c));
      }
      setModal(prev => ({ ...prev, isOpen: false }));
    } catch (err) {
      setError(err?.response?.data?.detail || (modal.type === 'create' ? 'Failed to create category' : 'Failed to update category'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const columns = [
    { key: 'name', label: 'Name', render: (row) => <span style={{ fontWeight: 600 }}>{row.name}</span> },
    { key: 'slug', label: 'Slug' },
    { key: 'description', label: 'Description', render: (row) => row.description || '-' },
    {
      key: 'is_active',
      label: 'Active',
      render: (row) => (
        <span className={`status-badge ${row.is_active ? 'active' : 'inactive'}`}>
          {row.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Categories</h1>
        <Button variant="primary" onClick={handleCreate}>Add Category</Button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <Card>
        {loading ? (
          <div className="loading-state">Loading categories...</div>
        ) : (
          <Table
            columns={columns}
            data={categories}
            onEdit={handleEdit}
            onDelete={handleDelete}
            renderActions={(row) =>
              row.is_active ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(row)}
                  disabled={actionLoading}
                >
                  Deactivate
                </Button>
              ) : null
            }
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
            label="Name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
          />
          <Input
            label="Description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Categories;
