import api from './axiosClient';

export const registerAPI = (payload) => api.post('/auth/register', payload);
export const loginAPI = (payload) => api.post('/auth/login', payload);
export const googleLoginAPI = (payload) => api.post('/auth/google-login', payload);
export const getMeAPI = () => api.get('/auth/me');
export const updateMeAPI = (payload) => api.put('/auth/me', payload);
export const changePasswordAPI = (payload) =>
  api.put('/auth/change-password', payload);
export const toggleWishlistAPI = (productId) =>
  api.post(`/auth/wishlist/${productId}`);

// Admin
export const getAllUsersAPI = () => api.get('/auth/admin/users');
export const updateUserByAdminAPI = (id, payload) =>
  api.put(`/auth/admin/users/${id}`, payload);
export const deleteUserByAdminAPI = (id) =>
  api.delete(`/auth/admin/users/${id}`);
