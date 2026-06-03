import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import Table from '../components/Table';
import Input from '../components/Input';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { getBanners, createBanner, updateBanner, deleteBanner, toggleBannerActive } from '../services/api';

const Banners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState({ isOpen: false, type: '', title: '', data: null, banner: null });
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    content: '',
    image_url: '',
    link_url: '',
    is_active: true,
    is_dismissible: true,
    starts_at: '',
    ends_at: '',
  });

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getBanners();
      setBanners(data);
    } catch {
      setError('Failed to load banners');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setModal({ isOpen: true, type: 'create', title: 'Create Banner', data: null });
    setFormData({
      slug: '',
      title: '',
      content: '',
      image_url: '',
      link_url: '',
      is_active: true,
      is_dismissible: true,
      starts_at: '',
      ends_at: '',
    });
  };

  const handleEdit = (banner) => {
    setModal({ isOpen: true, type: 'edit', title: 'Edit Banner', banner });
    setFormData({
      slug: banner.slug || '',
      title: banner.title || '',
      content: banner.content || '',
      image_url: banner.image_url || '',
      link_url: banner.link_url || '',
      is_active: banner.is_active ?? true,
      is_dismissible: banner.is_dismissible ?? true,
      starts_at: banner.starts_at || '',
      ends_at: banner.ends_at || '',
    });
  };

  const handleDelete = async (banner) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      try {
        await deleteBanner(banner.id);
        setBanners(banners.filter(b => b.id !== banner.id));
      } catch {
        setError('Failed to delete banner');
      }
    }
  };

  const handleToggleActive = async (banner) => {
    try {
      await toggleBannerActive(banner.id, !banner.is_active);
      setBanners(banners.map(b => b.id === banner.id ? { ...b, is_active: !b.is_active } : b));
    } catch {
      setError('Failed to update banner status');
    }
  };

  const handleSubmit = async () => {
    try {
      if (modal.type === 'create') {
        const newBanner = await createBanner(formData);
        setBanners([...banners, newBanner]);
      } else {
        const updatedBanner = await updateBanner(modal.banner.id, formData);
        setBanners(banners.map(b => b.id === modal.banner.id ? updatedBanner : b));
      }
      setModal({ ...modal, isOpen: false });
    } catch {
      setError(modal.type === 'create' ? 'Failed to create banner' : 'Failed to update banner');
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'content', label: 'Content' },
    { key: 'slug', label: 'Slug' },
    {
      key: 'is_active',
      label: 'Active',
      render: (row) => (
        <button
          className={`action-btn ${row.is_active ? 'active' : ''}`}
          onClick={() => handleToggleActive(row)}
          title={row.is_active ? 'Deactivate' : 'Activate'}
        >
          {row.is_active ? '✓' : '✗'}
        </button>
      ),
    },
    {
      key: 'is_dismissible',
      label: 'Dismissible',
      render: (row) => (row.is_dismissible ? 'Yes' : 'No'),
    },
    { key: 'starts_at', label: 'Starts At' },
    { key: 'ends_at', label: 'Ends At' },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Banners</h1>
        <Button variant="primary" onClick={handleCreate}>Add Banner</Button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <Card>
        {loading ? (
          <div className="loading-state">Loading banners...</div>
        ) : (
          <Table
            columns={columns}
            data={banners}
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
            label="Content"
            value={formData.content}
            onChange={(e) => handleChange('content', e.target.value)}
            required
          />
          <Input
            label="Image URL"
            value={formData.image_url}
            onChange={(e) => handleChange('image_url', e.target.value)}
          />
          <Input
            label="Link URL"
            value={formData.link_url}
            onChange={(e) => handleChange('link_url', e.target.value)}
          />
          <div className="form-field">
            <label className="input-label">Is Active</label>
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => handleChange('is_active', e.target.checked)}
            />
          </div>
          <div className="form-field">
            <label className="input-label">Is Dismissible</label>
            <input
              type="checkbox"
              checked={formData.is_dismissible}
              onChange={(e) => handleChange('is_dismissible', e.target.checked)}
            />
          </div>
          <Input
            label="Starts At"
            type="datetime-local"
            value={formData.starts_at}
            onChange={(e) => handleChange('starts_at', e.target.value)}
          />
          <Input
            label="Ends At"
            type="datetime-local"
            value={formData.ends_at}
            onChange={(e) => handleChange('ends_at', e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Banners;