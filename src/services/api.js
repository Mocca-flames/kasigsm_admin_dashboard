import axios from "axios";

const API_BASE_URL = "https://api.kasigsm.co.za";

const getAuthHeaders = () => {
  const token = localStorage.getItem("admin_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const api = axios.create({
  baseURL: API_BASE_URL
});

api.interceptors.request.use((config) => {
  config.headers = { ...config.headers, ...getAuthHeaders() };
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem("admin_token");
      window.dispatchEvent(new Event("auth-change"));
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const login = async (email, password) => {
  const baseURL = API_BASE_URL;
  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);
  const response = await axios.post(baseURL + "/auth/login", formData, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("admin_token");
  window.dispatchEvent(new Event("auth-change"));
};

export const getItems = async ({ offset = 0, limit = 100, q = '', category = '', brand = '', service = '', service_type = '', with_media = true, alphabetize = true }) => {
  const params = { offset, limit, with_media, alphabetize };
  if (q) params.q = q;
  if (category) params.category = category;
  if (brand) params.brand = brand;
  if (service) params.service = service;
  if (service_type) params.service_type = service_type;
  const response = await api.get('/admin/items', { params });
  return response.data;
};

export const createItem = async (itemData) => {
  const response = await api.post("/admin/items", itemData);
  return response.data;
};

export const updateItem = async (itemId, itemData) => {
  const response = await api.patch(`/admin/items/${itemId}`, itemData);
  return response.data;
};

export const setItemMarkup = async (itemId, markup) => {
  const response = await api.patch(`/admin/items/${itemId}/markup?markup=${markup}`);
  return response.data;
};

export const toggleItemVisibility = async (itemId, isVisible) => {
  const response = await api.patch(`/admin/items/${itemId}/visibility?is_visible=${isVisible}`);
  return response.data;
};

export const archiveItem = async (itemId) => {
  const response = await api.delete(`/admin/items/${itemId}`);
  return response.data;
};

export const getUsers = async () => {
  const response = await api.get("/admin/users");
  return response.data;
};

export const updateUserStatus = async (userId, isActive) => {
  const response = await api.patch(`/admin/users/${userId}?is_active=${isActive}`);
  return response.data;
};

export const getOrders = async (status) => {
  const url = status ? `/admin/orders?status=${status}` : "/admin/orders";
  const response = await api.get(url);
  return response.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const response = await api.patch(`/admin/orders/${orderId}/status?status=${status}`);
  return response.data;
};

export const uploadMedia = async (formData) => {
  const response = await api.post('/admin/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const updateItemThumbnail = async (itemId, formData) => {
  const response = await api.patch(`/admin/items/${itemId}/thumbnail`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const updateProviderLogo = async (providerId, formData) => {
  const response = await api.patch(`/admin/providers/${providerId}/logo`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const getCredentialPool = async (itemId) => {
  const response = await api.get(`/admin/credentials/${itemId}`);
  return response.data;
};

export const getStatsSummary = async (days = 30) => {
  const response = await api.get(`/admin/stats/summary?days=${days}`);
  return response.data;
};

export const getAllOrders = async () => {
  const response = await api.get("/admin/orders");
  return response.data;
};

export const getAllClients = async () => {
  const response = await api.get("/admin/clients");
  return response.data;
};

export const uploadCredentials = async (itemId, formData) => {
  const response = await api.post(`/admin/credentials/bulk?item_id=${itemId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getVisitorSummary = async () => {
  const response = await api.get('/admin/analytics/visitors');
  return response.data;
};

export const getBanners = async () => {
  const response = await api.get("/admin/banners");
  return response.data;
};

export const createBanner = async (bannerData) => {
  const response = await api.post("/admin/banners", bannerData);
  return response.data;
};

export const updateBanner = async (bannerId, bannerData) => {
  const response = await api.patch(`/admin/banners/${bannerId}`, bannerData);
  return response.data;
};

export const deleteBanner = async (bannerId) => {
  const response = await api.delete(`/admin/banners/${bannerId}`);
  return response.data;
};

export const toggleBannerActive = async (bannerId, isActive) => {
  const response = await api.patch(`/admin/banners/${bannerId}/toggle?is_active=${isActive}`);
  return response.data;
};

export const getProviders = async () => {
  const response = await api.get("/admin/providers");
  return response.data;
};

export const toggleProviderStatus = async (providerId, isActive) => {
  const response = await api.patch(`/admin/providers/${providerId}?is_active=${isActive}`);
  return response.data;
};

export const updateProvider = async (providerId, updates) => {
  const response = await api.patch(`/admin/providers/${providerId}`, null, { params: updates });
  return response.data;
};

export const requestTechnicianRole = async (specialization) => {
  const token = localStorage.getItem("admin_token");
  const response = await axios.post(
    `${API_BASE_URL}/technician/technicians/request`,
    { specialization },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const getTechnicianRequests = async () => {
  const response = await api.get("/admin/technicians/requests");
  return response.data;
};

export const getAllTechnicians = async () => {
  const response = await api.get("/admin/technicians");
  return response.data;
};

export const reviewTechnicianRequest = async (techId, action) => {
  const response = await api.post(`/admin/technicians/${techId}/review`, { action });
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get('/admin/categories');
  return response.data;
};

export const createCategory = async (name, description = '') => {
  const response = await api.post('/admin/categories', null, {
    params: { name, description },
  });
  return response.data;
};

export const updateCategory = async (id, updates) => {
  const response = await api.patch(`/admin/categories/${id}`, null, {
    params: updates,
  });
  return response.data;
};

export const deactivateCategory = async (id) => {
  const response = await api.delete(`/admin/categories/${id}`);
  return response.data;
};

export const getFulfillmentQueue = async () => {
  const response = await api.get("/admin/orders/fulfillment-queue");
  return response.data;
};

export const getOrderReadiness = async (orderId) => {
  const response = await api.get(`/admin/orders/${orderId}/ready`);
  return response.data;
};

export const fulfillOrder = async (orderId, credentials) => {
  const response = await api.post(`/admin/orders/${orderId}/fulfill`, { credentials });
  return response.data;
};

export const rejectOrder = async (orderId) => {
  const response = await api.post(`/admin/orders/${orderId}/reject`);
  return response.data;
};

export const getProviderMarkups = async (providerId) => {
  const response = await api.get(`/admin/providers/${providerId}/markups`);
  return response.data;
};

export const setProviderMarkup = async (providerId, category, priceMarkup) => {
  const response = await api.post(`/admin/providers/${providerId}/markups`, null, {
    params: { category, price_markup: priceMarkup },
  });
  return response.data;
};

export const deleteProviderMarkup = async (providerId, category) => {
  const response = await api.delete(`/admin/providers/${providerId}/markups/${encodeURIComponent(category)}`);
  return response.data;
};

export const getPresetPrices = async () => {
  const response = await api.get("/admin/preset-prices");
  return response.data;
};

export const applyPresetPrice = async (presetName) => {
  const response = await api.post(`/admin/preset-prices/apply`, null, {
    params: { preset_name: presetName },
  });
  return response.data;
};

export const calculatePricePreview = async (distance_km, rate_per_km, minimum_fare) => {
  const response = await api.post("/admin/pricing/preview", null, {
    params: {
      distance_km: String(distance_km),
      ...(rate_per_km !== null && { rate_per_km: String(rate_per_km) }),
      ...(minimum_fare !== null && { minimum_fare: String(minimum_fare) }),
    },
  });
  return response.data;
};

export const overrideOrderPrice = async (orderId, newPrice, reason) => {
  const response = await api.patch(`/admin/orders/${orderId}/price`, null, {
    params: {
      new_price: String(newPrice),
      ...(reason && { reason }),
    },
  });
  return response.data;
};

export const getOrderPriceBreakdown = async (orderId) => {
  const response = await api.get(`/admin/orders/${orderId}/price-breakdown`);
  return response.data;
};

export const bulkCategoryMarkup = async (categoryName, markup) => {
  const response = await api.post(`/admin/categories/${encodeURIComponent(categoryName)}/markup/bulk`, null, {
    params: { markup: String(markup) },
  });
  return response.data;
};

export const bulkCategoryMarkupPercentage = async (categoryName, percentage) => {
  const response = await api.post(`/admin/categories/${encodeURIComponent(categoryName)}/markup/bulk-percentage`, null, {
    params: { percentage: String(percentage) },
  });
  return response.data;
};

export const getPromoCodes = async (activeOnly = false) => {
  const params = {};
  if (activeOnly) params.active_only = true;
  const response = await api.get('/promo-codes', { params });
  return response.data;
};

export const getPromoCode = async (promoId) => {
  const response = await api.get(`/promo-codes/${promoId}`);
  return response.data;
};

export const createPromoCode = async (promoData) => {
  const response = await api.post('/promo-codes', promoData);
  return response.data;
};

export const updatePromoCode = async (promoId, promoData) => {
  const response = await api.patch(`/promo-codes/${promoId}`, promoData);
  return response.data;
};

export const deletePromoCode = async (promoId) => {
  const response = await api.delete(`/promo-codes/${promoId}`);
  return response.data;
};

export const getPromoCodeUsages = async (promoId, offset = 0, limit = 100) => {
  const response = await api.get(`/promo-codes/${promoId}/usages`, {
    params: { offset, limit },
  });
  return response.data;
};
