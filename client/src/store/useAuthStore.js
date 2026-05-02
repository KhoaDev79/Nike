import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  loginAPI,
  registerAPI,
  googleLoginAPI,
  getMeAPI,
  updateMeAPI,
  toggleWishlistAPI,
} from '../api/authApi';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      error: null,

      register: async (name, email, password) => {
        set({ loading: true, error: null });
        try {
          const { data } = await registerAPI({ name, email, password });
          set({ user: data.data, loading: false });
          return { success: true };
        } catch (err) {
          const message = err.response?.data?.message || 'Đăng ký thất bại.';
          set({ error: message, loading: false });
          return { success: false, message };
        }
      },

      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const { data } = await loginAPI({ email, password });
          set({ user: data.data, loading: false });
          return { success: true };
        } catch (err) {
          const message = err.response?.data?.message || 'Đăng nhập thất bại.';
          set({ error: message, loading: false });
          return { success: false, message };
        }
      },

      googleLogin: async (email, name, avatar) => {
        set({ loading: true, error: null });
        try {
          const { data } = await googleLoginAPI({ email, name, avatar });
          set({ user: data.data, loading: false });
          return { success: true };
        } catch (err) {
          const message = err.response?.data?.message || 'Đăng nhập Google thất bại.';
          set({ error: message, loading: false });
          return { success: false, message };
        }
      },

      fetchMe: async () => {
        try {
          const { data } = await getMeAPI();
          set({ user: { ...get().user, ...data.data } });
        } catch {
          set({ user: null }); // token hết hạn
        }
      },

      updateProfile: async (payload) => {
        set({ loading: true, error: null });
        try {
          const { data } = await updateMeAPI(payload);
          set({ user: { ...get().user, ...data.data }, loading: false });
          return { success: true };
        } catch (err) {
          const message = err.response?.data?.message || 'Cập nhật thất bại.';
          set({ error: message, loading: false });
          return { success: false, message };
        }
      },

      toggleWishlist: async (productId) => {
        try {
          const { data } = await toggleWishlistAPI(productId);
          const newUser = { ...get().user };
          // data.wishlist contains array of IDs from backend
          newUser.wishlist = data.wishlist;
          set({ user: newUser });
          return { success: true, wishlisted: data.wishlisted };
        } catch (err) {
          return { success: false };
        }
      },

      logout: () => set({ user: null, error: null }),
      clearError: () => set({ error: null }),
      isLoggedIn: () => !!get().user,
      isAdmin: () => get().user?.role === 'admin',
      getToken: () => get().user?.token || null,
    }),
    {
      name: 'nike-auth',
      partialize: (state) => ({ user: state.user }), // chỉ persist user
    },
  ),
);

export default useAuthStore;
