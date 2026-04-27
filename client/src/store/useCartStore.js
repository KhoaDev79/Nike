import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      // Thêm vào giỏ — nếu đã có cùng _id + size thì tăng qty
      addItem: (product, quantity = 1) => {
        const { items } = get();
        const existed = items.find(
          (i) =>
            i._id === product._id && i.selectedSize === product.selectedSize,
        );
        if (existed) {
          set({
            items: items.map((i) =>
              i._id === product._id && i.selectedSize === product.selectedSize
                ? { ...i, quantity: i.quantity + quantity }
                : i,
            ),
          });
        } else {
          set({ items: [...items, { ...product, quantity }] });
        }
      },

      // Xoá 1 item
      removeItem: (productId, selectedSize) => {
        set({
          items: get().items.filter(
            (i) => !(i._id === productId && i.selectedSize === selectedSize),
          ),
        });
      },

      // Cập nhật số lượng — qty < 1 thì xoá
      updateQty: (productId, selectedSize, quantity) => {
        if (quantity < 1) {
          get().removeItem(productId, selectedSize);
          return;
        }
        set({
          items: get().items.map((i) =>
            i._id === productId && i.selectedSize === selectedSize
              ? { ...i, quantity }
              : i,
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      totalQty: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    { name: 'nike-cart' }, // persist vào localStorage
  ),
);

export default useCartStore;
