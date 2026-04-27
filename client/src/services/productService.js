import api from './api';

export const getProductsAPI = (params = {}) => {
  const normalized = { ...params };
  // Chuyển array ['Elite','Pro'] → string 'Elite,Pro'
  ['tier', 'surfaceType', 'category'].forEach((key) => {
    if (Array.isArray(normalized[key])) {
      normalized[key].length > 0
        ? (normalized[key] = normalized[key].join(','))
        : delete normalized[key];
    }
  });
  return api.get('/products', { params: normalized });
};

export const getFeaturedProductsAPI = () => api.get('/products/featured');
export const getProductBySlugAPI = (slug) => api.get(`/products/slug/${slug}`);
export const getProductByIdAPI = (id) => api.get(`/products/${id}`);
export const getRelatedProductsAPI = (id) => api.get(`/products/${id}/related`);
export const addReviewAPI = (id, payload) =>
  api.post(`/products/${id}/reviews`, payload);

// Admin
export const createProductAPI = (payload) => api.post('/products', payload);
export const updateProductAPI = (id, payload) =>
  api.put(`/products/${id}`, payload);
export const deleteProductAPI = (id) => api.delete(`/products/${id}`);
