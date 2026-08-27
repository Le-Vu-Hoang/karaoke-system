import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  title: string;
  price: string; // E.g. "350k VND"
  imageUrl: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

// Hàm hỗ trợ chuyển đổi giá từ chuỗi (vd: "350k VND" hoặc "1,100k VND") sang số để tính tổng
const parsePrice = (priceStr: string): number => {
  // Loại bỏ "k", "VND", dấu phẩy và khoảng trắng
  const cleaned = priceStr
    .toLowerCase()
    .replace(/vnd/g, '')
    .replace(/k/g, '000')
    .replace(/,/g, '')
    .trim();
  const num = parseInt(cleaned, 10);
  return isNaN(num) ? 0 : num;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.id === newItem.id
          );

          if (existingItemIndex > -1) {
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex].quantity += 1;
            return { items: updatedItems };
          }

          return { items: [...state.items, { ...newItem, quantity: 1 }] };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + parsePrice(item.price) * item.quantity,
          0
        );
      },
    }),
    {
      name: 'ktv-cart-storage', // Key lưu trong localStorage
    }
  )
);
