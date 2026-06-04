export function slugToSearchTokens(slug) {
  return slug.toLowerCase().replace(/[_-]+/g, ' ').replace(/[^\w\s]/g, '').trim().split(/\s+/);
}

export function matchesSlugSearch(slug, query) {
  if (!query || !query.trim()) return true;
  const tokens = slugToSearchTokens(slug);
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  return terms.every(term => tokens.some(t => t.startsWith(term) || term.startsWith(t)));
}

export function getItemTypeLabel(item) {
  switch (item.item_type) {
    case 'PRODUCT': return 'Product';
    case 'SERVICE': return 'Service';
    default: return item.item_type;
  }
}

export const ITEM_TYPE_OPTIONS = [
  { value: '', label: 'All Types' },
  { value: 'SERVICE', label: 'Service' },
  { value: 'PRODUCT', label: 'Product' },
];

export const BRAND_OPTIONS = [
  { value: '', label: 'All Brands' },
  { value: 'iphone', label: 'iPhone' },
  { value: 'samsung', label: 'Samsung' },
  { value: 'xiaomi', label: 'Xiaomi' },
  { value: 'huawei', label: 'Huawei' },
  { value: 'oppo', label: 'Oppo' },
  { value: 'oneplus', label: 'OnePlus' },
  { value: 'pixel', label: 'Pixel' },
  { value: 'lg', label: 'LG' },
  { value: 'sony', label: 'Sony' },
  { value: 'motorola', label: 'Motorola' },
  { value: 'nokia', label: 'Nokia' },
  { value: 'zte', label: 'ZTE' },
  { value: 'vivo', label: 'Vivo' },
];

export const SERVICE_TYPE_OPTIONS = [
  { value: '', label: 'All Service Types' },
  { value: 'repair', label: 'Repair' },
  { value: 'unlock', label: 'Unlock / Bypass' },
  { value: 'icloud', label: 'iCloud Removal' },
  { value: 'frp', label: 'FRP Removal' },
  { value: 'coding', label: 'Mobile Coding' },
  { value: 'flash', label: 'Flash' },
  { value: 'microsoldering', label: 'Microsoldering' },
  { value: 'screen', label: 'Screen Replacement' },
  { value: 'battery', label: 'Battery Replacement' },
  { value: 'charging', label: 'Charging Port' },
  { value: 'water', label: 'Water Damage' },
  { value: 'data', label: 'Data Recovery' },
  { value: 'software', label: 'Software Problem' },
  { value: 'other', label: 'Other Service' },
];

export const PRODUCT_OPTIONS = [
  { value: '', label: 'All Categories' },
  { value: 'true', label: 'Products Only' },
  { value: 'false', label: 'Services Only' },
];

export const ACTION_OPTIONS = [
  { value: '', label: 'All Actions' },
  { value: 'repair', label: 'Repair' },
  { value: 'unlock', label: 'Unlock' },
  { value: 'bypass', label: 'Bypass' },
  { value: 'replace', label: 'Replace' },
  { value: 'flash', label: 'Flash' },
  { value: 'remove', label: 'Remove' },
  { value: 'fix', label: 'Fix' },
  { value: 'install', label: 'Install' },
  { value: 'restore', label: 'Restore' },
];

export const SORT_OPTIONS = [
  { value: 'alpha_asc', label: 'A → Z (Alphabetical)' },
  { value: 'alpha_desc', label: 'Z → A' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'stock_asc', label: 'Stock: Low → High' },
  { value: 'stock_desc', label: 'Stock: High → Low' },
];
