import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import Table from '../components/Table';
import Input from '../components/Input';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { getItems, createItem, updateItem, toggleItemVisibility, archiveItem } from '../services/api';

const Items = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState({ isOpen: false, type: '', title: '', data: null, item: null });
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    description: '',
    item_type: 'SERVICE',
    category: '',
    thumbnail: '',
    price_markup: '',
    currency: 'ZAR',
    delivery_time: '',
    stock: '',
  });

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getItems();
      setItems(data);
    } catch {
      setError('Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setModal({ isOpen: true, type: 'create', title: 'Create Item', data: null });
    setFormData({
      slug: '',
      title: '',
      description: '',
      item_type: 'SERVICE',
      category: '',
      thumbnail: '',
      price_markup: '',
      currency: 'ZAR',
      delivery_time: '',
      stock: '',
    });
  };

  const handleEdit = (item) => {
    setModal({ isOpen: true, type: 'edit', title: 'Edit Item', item });
    setFormData({
      slug: item.slug || '',
      title: item.title || '',
      description: item.description || '',
      item_type: item.item_type || 'SERVICE',
      category: item.category || '',
      thumbnail: item.thumbnail || '',
      price_markup: item.price_markup || '',
      currency: item.currency || 'ZAR',
      delivery_time: item.delivery_time || '',
      stock: item.stock || '',
    });
  };

  const handleDelete = async (item) => {
    if (window.confirm('Are you sure you want to archive this item?')) {
      try {
        await archiveItem(item.id);
        setItems(items.filter(i => i.id !== item.id));
      } catch {
        setError('Failed to archive item');
      }
    }
  };

  const handleVisibilityToggle = async (item) => {
    try {
      await toggleItemVisibility(item.id, !item.is_visible);
      setItems(items.map(i => i.id === item.id ? { ...i, is_visible: !i.is_visible } : i));
    } catch {
      setError('Failed to update visibility');
    }
  };

  const handleSubmit = async () => {
    try {
      if (modal.type === 'create') {
        const newItem = await createItem(formData);
        setItems([...items, newItem]);
      } else {
        const updatedItem = await updateItem(modal.item.id, formData);
        setItems(items.map(i => i.id === modal.item.id ? updatedItem : i));
      }
      setModal({ ...modal, isOpen: false });
    } catch {
      setError(modal.type === 'create' ? 'Failed to create item' : 'Failed to update item');
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const columns = [
    { key: 'slug', label: 'Slug' },
    { key: 'title', label: 'Title' },
    { key: 'item_type', label: 'Type' },
    { key: 'category', label: 'Category' },
    { key: 'price_final', label: 'Price' },
    {
      key: 'effective_markup',
      label: 'Effective Markup',
      render: (row) => row.effective_markup || '-',
    },
    {
      key: 'markup_source',
      label: 'Markup Source',
      render: (row) => {
        if (!row.markup_source) return '-';
        const label = row.markup_source === 'provider_category' ? 'Provider override' : 'Item';
        const className = row.markup_source === 'provider_category' ? 'status-badge active' : 'status-badge inactive';
        return <span className={className}>{label}</span>;
      },
    },
    { key: 'currency', label: 'Currency' },
    { key: 'stock', label: 'Stock' },
    {
      key: 'is_visible',
      label: 'Visible',
      render: (row) => (
        <button
          className={`action-btn ${row.is_visible ? 'active' : ''}`}
          onClick={() => handleVisibilityToggle(row)}
          title={row.is_visible ? 'Hide' : 'Show'}
        >
          {row.is_visible ? '✓' : '✗'}
        </button>
      ),
    },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Items</h1>
        <Button variant="primary" onClick={handleCreate}>Add Item</Button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <Card>
        {loading ? (
          <div className="loading-state">Loading items...</div>
        ) : (
          <Table
            columns={columns}
            data={items}
            onEdit={handleEdit}
            onDelete={handleDelete}
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
        <div className="form-grid">
          <Input
            label="Slug"
            value={formData.slug}
            onChange={(e) => handleChange('slug', e.target.value)}
            required
          />
          <Input
            label="Title"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            required
          />
          <Input
            label="Description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
          />
          <select
            value={formData.item_type}
            onChange={(e) => handleChange('item_type', e.target.value)}
            className="input"
          >
            <option value="SERVICE">SERVICE</option>
            <option value="PRODUCT">PRODUCT</option>
          </select>
          <Input
            label="Category"
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
            required
          />
          <Input
            label="Thumbnail URL"
            value={formData.thumbnail}
            onChange={(e) => handleChange('thumbnail', e.target.value)}
          />
          <Input
            label="Price Markup"
            type="number"
            step="0.01"
            value={formData.price_markup}
            onChange={(e) => handleChange('price_markup', e.target.value)}
          />
          <Input
            label="Currency"
            value={formData.currency}
            onChange={(e) => handleChange('currency', e.target.value)}
          />
          <Input
            label="Delivery Time"
            value={formData.delivery_time}
            onChange={(e) => handleChange('delivery_time', e.target.value)}
          />
          <Input
            label="Stock"
            type="number"
            value={formData.stock}
            onChange={(e) => handleChange('stock', e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Items;