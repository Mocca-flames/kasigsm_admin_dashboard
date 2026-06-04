import React, { useState, useEffect, useMemo } from 'react';
import {
  getItems,
  createItem,
  updateItem,
  toggleItemVisibility,
  archiveItem,
  getCategories,
} from '../services/api';
import {
  slugToSearchTokens,
  matchesSlugSearch,
  ITEM_TYPE_OPTIONS,
  BRAND_OPTIONS,
  SERVICE_TYPE_OPTIONS,
} from '../utils/itemHelpers';
import Icon from '../components/Icons';
import { Card } from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import Table from '../components/Table';
import Modal from '../components/Modal';
import DropZone from '../components/DropZone';

const PAGE_SIZE = 10;

const getItemTypeLabel = (item) => {
  switch (item.item_type) {
    case 'PRODUCT': return 'Product';
    case 'SERVICE': return 'Service';
    default: return item.item_type;
  }
};

const truncateSentences = (text, max = 2) => {
  if (!text) return '—';
  const s = String(text).replace(/\s+/g, ' ').trim();
  const matches = s.match(/([^.!?]*[.!?])/g);
  if (!matches || matches.length === 0) {
    const words = s.split(' ');
    return words.length > 30 ? words.slice(0, 30).join(' ') + '...' : s;
  }
  const joined = matches.slice(0, max).join(' ');
  if (matches.length > max) return joined + '...';
  return joined;
};

const Items = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [modal, setModal] = useState({ isOpen: false, type: '', title: '', data: null, item: null });
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    description: '',
    item_type: 'SERVICE',
    category: '',
    brand: '',
    service_type: '',
    thumbnail: '',
    price_markup: '',
    currency: 'ZAR',
    delivery_time: '',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [itemTypeFilter, setItemTypeFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [serviceTypeFilter, setServiceTypeFilter] = useState('');
  const [sortOption, setSortOption] = useState('alpha_asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedSlug, SetExpandedSlug] = useState({});

  const toggleSlugExpand = (itemId) => {
    SetExpandedSlug(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        console.log('Fetching items and categories...');
        const [itemsRes, categoriesRes] = await Promise.all([getItems({ offset: 0, limit: 100, with_media: true }), getCategories()]);
        console.log('Items response:', itemsRes);
        console.log('Categories response:', categoriesRes);
        if (!cancelled) {
          // API may return an array or an object { items: [...], count }
          const itemsList = Array.isArray(itemsRes) ? itemsRes : (itemsRes.items || itemsRes.data || []);
          setItems(itemsList || []);
          setCategories(categoriesRes || []);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to load items:', err);
          setError('Failed to load items');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const handleEdit = (item) => {
    setModal({ isOpen: true, type: 'edit', title: 'Edit Item', data: null, item });
    setFormData({
      slug: item.slug || '',
      title: item.title || '',
      description: item.description || '',
      item_type: item.item_type || 'SERVICE',
      category: item.category || '',
      brand: item.brand || '',
      service_type: item.service_type || '',
      thumbnail: item.thumbnail || item.media_url || '',
      price_markup: item.price_markup || '',
      currency: item.currency || 'ZAR',
      delivery_time: item.delivery_time || '',
    });
  };

  const handleDelete = async (item) => {
    if (window.confirm(`Archive "${item.title || item.slug}"?`)) {
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
      const payload = {
        ...formData,
        price_markup: formData.price_markup === '' ? 0 : Number(formData.price_markup),
      };
      if (modal.type === 'create') {
        const newItem = await createItem(payload);
        setItems([newItem, ...items]);
      } else {
        const updatedItem = await updateItem(modal.item.id, payload);
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

  const resetFilters = () => {
    setSearchQuery('');
    setItemTypeFilter('');
    setBrandFilter('');
    setServiceTypeFilter('');
    setSortOption('alpha_asc');
  };

  const activeFilterCount = [itemTypeFilter, brandFilter, serviceTypeFilter].filter(Boolean).length;

const filteredItems = useMemo(() => {
    if (!items || items.length === 0) return [];
    return items.filter(item => {
      if (itemTypeFilter && item.item_type !== itemTypeFilter) return false;
      if (brandFilter && item.brand !== brandFilter) return false;
      if (serviceTypeFilter && item.service_type !== serviceTypeFilter) return false;
      if (searchQuery && searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const title = (item.title || '').toLowerCase();
        const description = (item.description || '').toLowerCase();
        const category = (item.category || '').toLowerCase();
        const brand = (item.brand || '').toLowerCase();
        const slugMatches = matchesSlugSearch(item.slug || '', searchQuery);
        if (!slugMatches && !title.includes(q) && !description.includes(q) && !category.includes(q) && !brand.includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [items, searchQuery, itemTypeFilter, brandFilter, serviceTypeFilter]);

  const sortedItems = useMemo(() => {
    if (!filteredItems || filteredItems.length === 0) return [];
    const sorted = [...filteredItems];
    switch (sortOption) {
      case 'price_asc':
        sorted.sort((a, b) => Number(a.price_final || 0) - Number(b.price_final || 0));
        break;
      case 'price_desc':
        sorted.sort((a, b) => Number(b.price_final || 0) - Number(a.price_final || 0));
        break;
      case 'alpha_desc':
        sorted.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        break;
      default:
        sorted.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    }
    return sorted;
  }, [filteredItems, sortOption]);

  const slugTokens = useMemo(() => {
    if (!searchQuery || !filteredItems || filteredItems.length === 0) return null;
    const example = filteredItems[0]?.slug;
    if (!example) return null;
    return slugToSearchTokens(example).slice(0, 8);
  }, [searchQuery, filteredItems]);

  const pagedItems = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return sortedItems.slice(start, start + PAGE_SIZE);
  }, [sortedItems, currentPage]);

  const columns = [
    {
      key: 'thumbnail',
      label: '',
      render: (row) => (
        <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-sm)', overflow: 'hidden', flexShrink: 0 }}>
          {row.media_url || row.thumbnail ? (
            <img
              src={row.media_url || row.thumbnail}
              alt={row.title}
              style={{ width: 44, height: 44, objectFit: 'cover', display: 'block' }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ) : (
            <div style={{
              width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'var(--bg-input)', color: 'var(--text-muted)',
            }}>
              <Icon name="image" size={18} />
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'title',
      label: 'Title / Slug',
      render: (row) => {
        const isExpanded = expandedSlug[row.id];
        const shortTitle = truncateSentences(row.title, 2);
        const shortSlug = truncateSentences(row.slug.replace(/-/g, ' '), 2);
        const hasMore = (row.title || '').split(/[.!?]/).filter(Boolean).length > 2 ||
          (row.slug || '').split('-').length > 6;
        return (
          <div>
            <div
              style={{
                fontWeight: 'var(--weight-medium)',
                color: 'var(--text-primary)',
                lineHeight: 1.3,
                cursor: hasMore ? 'pointer' : 'default',
              }}
              onClick={hasMore ? () => toggleSlugExpand(row.id) : undefined}
            >
              {shortTitle}
              {hasMore && !isExpanded && (
                <button
                  type="button"
                  onClick={() => toggleSlugExpand(row.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent)',
                    cursor: 'pointer',
                    fontSize: 'inherit',
                    fontWeight: 'inherit',
                    marginLeft: 4,
                    padding: 0,
                  }}
                >
                  <Icon name="chevronDown" size={14} />
                </button>
              )}
            </div>
            {isExpanded ? (
              <div style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-mono)',
                marginTop: 3,
                maxWidth: 350,
                wordBreak: 'break-all',
                cursor: 'pointer',
              }}>
                {row.slug || '—'}
                <button
                  type="button"
                  onClick={() => toggleSlugExpand(row.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    marginLeft: 4,
                    padding: 0,
                    fontSize: 'inherit',
                  }}
                >
                  <Icon name="chevronUp" size={12} />
                </button>
              </div>
            ) : (
              <div style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-mono)',
                marginTop: 2,
                maxWidth: 300,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }} title={row.slug}>
                {shortSlug}
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: 'price_final',
      label: 'Price',
      render: (row) => (
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 'var(--weight-medium)' }}>
          {Number(row.price_final || 0).toFixed(2)} {row.currency || 'ZAR'}
        </span>
      ),
    },
    {
      key: 'markup',
      label: 'Markup',
      render: (row) => (
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontWeight: 'var(--weight-semibold)',
          color: row.markup_source === 'provider_category' ? 'var(--color-warning)' : 'var(--text-secondary)',
        }}>
          {Number(row.effective_markup || row.price_markup || 0).toFixed(2)} ZAR
        </span>
      ),
    },
    {
      key: 'item_type',
      label: 'Type',
      render: (row) => getItemTypeLabel(row),
    },
    {
      key: 'category',
      label: 'Category',
      render: (row) => <span style={{ color: 'var(--accent)', fontSize: 'var(--text-sm)' }}>{row.category || '—'}</span>,
    },
{
       key: 'is_visible',
       label: 'Visible',
       render: (row) => (
         <button
           className={`toggle-btn ${row.is_visible ? 'toggle-on' : 'toggle-off'}`}
           onClick={() => handleVisibilityToggle(row)}
           title={row.is_visible ? 'Hide item' : 'Show item'}
         >
           {row.is_visible ? <Icon name="check" size={14} /> : <Icon name="x" size={14} />}
         </button>
       ),
     },
   ];

  return (
    <div className="page-container">
      {/* Page header sits above the two-column layout so it doesn't shift */}
      <div className="items-header">
        <div className="items-title-row">
          <h1>Items</h1>
          <div className="items-header-actions">
            <Button variant="secondary" size="sm" title="Refresh" onClick={() => window.location.reload()}>
              <Icon name="refresh" size={16} />
            </Button>
            <Button variant="primary" title="Add Item" onClick={() => setModal({ isOpen: true, type: 'create', title: 'Add Item', data: null, item: null })}>
              <Icon name="plus" size={16} style={{ marginRight: 6 }} />
              Add Item
            </Button>
          </div>
        </div>

        <div className="items-toolbar">
          <div className="items-toolbar-left">
            <span className="results-count">
              {loading ? 'Loading...' : `${filteredItems.length} item${filteredItems.length === 1 ? '' : 's'}`}
            </span>
          </div>
          {filteredItems.length > 0 && (
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="input input-sm"
            >
              {[
                { value: 'alpha_asc', label: 'A → Z (Alphabetical)' },
                { value: 'alpha_desc', label: 'Z → A' },
                { value: 'price_asc', label: 'Price: Low → High' },
                { value: 'price_desc', label: 'Price: High → Low' },
              ].map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className={`items-layout`}>
        {/* Sidebar Filters */}
        <aside className={`filter-sidebar ${sidebarOpen ? 'filter-sidebar-open' : 'filter-sidebar-closed'}`}>
          <div className="filter-inner">
            <div className="filter-sidebar-header">
            <Icon name="filter" size={16} />
            <strong>Filters</strong>
            {activeFilterCount > 0 && (
              <span className="filter-count">{activeFilterCount}</span>
            )}
            <button
              className="filter-sidebar-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              title={sidebarOpen ? 'Collapse filters' : 'Expand filters'}
            >
              <Icon name={sidebarOpen ? 'chevronLeft' : 'chevronRight'} size={14} />
            </button>
          </div>

            {sidebarOpen && (
              <>
                <div className="filter-group">
                <label className="filter-label">Search</label>
                <Input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="title, slug, model, brand..."
                  icon={<Icon name="search" size={16} />}
                  fullWidth
                />
                <div className="filter-hint">
                  Try: <em>"iphone 15 pro unlock"</em> or <em>"samsung s24 bypass"</em>
                </div>
                {slugTokens && searchQuery.trim() && (
                  <div className="slug-tokens-display">
                    <span className="slug-tokens-label">Detected from slug:</span>{' '}
                    {slugTokens.map((t, i) => (
                      <span key={i} className="slug-token">{t}</span>
                    ))}
                  </div>
                )}
                </div>

              <div className="filter-group">
                <label className="filter-label">Type</label>
                <select
                  value={itemTypeFilter}
                  onChange={(e) => setItemTypeFilter(e.target.value)}
                  className="input"
                >
                  <option value="">All Types (SERVICE + PRODUCT)</option>
                  <option value="SERVICE">SERVICE</option>
                  <option value="PRODUCT">PRODUCT</option>
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">Brand / Phone</label>
                <select
                  value={brandFilter}
                  onChange={(e) => setBrandFilter(e.target.value)}
                  className="input"
                >
                  <option value="">All Brands</option>
                  {BRAND_OPTIONS.slice(1).map(b => (
                    <option key={b.value} value={b.value}>{b.label}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">Service Type</label>
                <select
                  value={serviceTypeFilter}
                  onChange={(e) => setServiceTypeFilter(e.target.value)}
                  className="input"
                >
                  <option value="">All Service Types</option>
                  {SERVICE_TYPE_OPTIONS.slice(1).map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>

                {(activeFilterCount > 0 || searchQuery) && (
                  <Button variant="ghost" size="sm" onClick={resetFilters} fullWidth>
                    Clear all filters
                  </Button>
                )}
              </>
            )}
          </div>
        </aside>

        {/* Sidebar collapsed toggle */}
        {!sidebarOpen && (
          <button
            className="filter-sidebar-expand"
            onClick={() => setSidebarOpen(true)}
            title="Expand filters"
          >
            <Icon name="filter" size={18} />
          </button>
        )}

        {/* Main Content */}
        <div className="items-main">
          {error && <div className="error-message">{error}</div>}

          <Card>
            {loading ? (
              <div className="loading-state">
                <Icon name="loader" size={24} className="loading-icon" />
                Loading items...
              </div>
            ) : (
              <>
<Table
                  columns={columns}
                  data={pagedItems}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
                {sortedItems.length > PAGE_SIZE && (
                  <div className="pagination">
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={currentPage <= 1}
                      onClick={() => setCurrentPage(p => p - 1)}
                    >
                      ← Previous
                    </Button>
                    <span className="pagination-info">
                      Page <strong>{currentPage}</strong>
                    </span>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setCurrentPage(p => p + 1)}
                    >
                      Next →
                    </Button>
                  </div>
                )}
              </>
            )}
          </Card>

          <Modal
            isOpen={modal.isOpen}
            onClose={() => setModal({ ...modal, isOpen: false })}
            title={modal.title}
            size="xl"
            actions={[
              { label: 'Cancel', onClick: () => setModal({ ...modal, isOpen: false }) },
              { label: 'Save', onClick: handleSubmit, variant: 'primary' },
            ]}
          >
            <div className="form-grid">
              <div className="form-group form-group-full">
                <label className="form-label">
                  Slug <span className="slug-hint" title="Format: service-name-[brand]-[model]-action, e.g. unlock-iphone-15-pro-bypass">ℹ️</span>
                </label>
                <Input
                  value={formData.slug}
                  onChange={(e) => handleChange('slug', e.target.value)}
                  placeholder="e.g. unlock-iphone-15-pro-bypass"
                  required
                  fullWidth
                />
                {formData.slug && matchesSlugSearch(formData.slug, '') && (
                  <div className="slug-tokens-display slug-tokens-inline">
                    {slugToSearchTokens(formData.slug).slice(0, 12).map((t, i) => (
                      <span key={i} className="slug-token">{t}</span>
                    ))}
                  </div>
                )}
              </div>

              <Input
                label="Title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                required
                fullWidth
              />

              <div className="form-group">
                <label className="form-label">Type</label>
                <div className="radio-group">
                  {ITEM_TYPE_OPTIONS.filter(o => o.value).map(opt => (
                    <label key={opt.value} className="radio-label">
                      <input
                        type="radio"
                        name="item_type"
                        value={opt.value}
                        checked={formData.item_type === opt.value}
                        onChange={(e) => handleChange('item_type', e.target.value)}
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Input
                label="Category"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                list="categories-list"
                required
                fullWidth
              />
              <datalist id="categories-list">
                {categories.map(c => <option key={c.id} value={c.name} />)}
              </datalist>

              {(formData.item_type === 'SERVICE') && (
                <>
                  <div className="form-group">
                    <label className="form-label">Service Type</label>
                    <select
                      value={formData.service_type}
                      onChange={(e) => handleChange('service_type', e.target.value)}
                      className="input"
                    >
                      <option value="">-- Select service type --</option>
                      {SERVICE_TYPE_OPTIONS.filter(o => o.value).map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Brand / Device</label>
                    <select
                      value={formData.brand}
                      onChange={(e) => handleChange('brand', e.target.value)}
                      className="input"
                    >
                      <option value="">-- Select brand --</option>
                      {BRAND_OPTIONS.filter(b => b.value).map(b => (
                        <option key={b.value} value={b.value}>{b.label}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <Input
                label="Description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                fullWidth
              />

              <DropZone
                label="Thumbnail"
                value={formData.thumbnail}
                onFileSelected={(url) => handleChange('thumbnail', url)}
                onClear={() => handleChange('thumbnail', '')}
                fullWidth
              />

              <Input
                label="Price Markup (ZAR)"
                type="number"
                step="0.01"
                value={formData.price_markup}
                onChange={(e) => handleChange('price_markup', e.target.value)}
                fullWidth
              />

              <Input
                label="Currency"
                value={formData.currency}
                onChange={(e) => handleChange('currency', e.target.value)}
                fullWidth
              />

              <Input
                label="Delivery Time"
                value={formData.delivery_time}
                onChange={(e) => handleChange('delivery_time', e.target.value)}
                fullWidth
              />
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Items;
