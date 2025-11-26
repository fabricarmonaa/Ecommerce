import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
  image: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCart = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (i) => i.productId === item.productId && i.size === item.size && i.color === item.color
          );

          if (existingItemIndex > -1) {
            const newItems = [...state.items];
            newItems[existingItemIndex].quantity += item.quantity;
            return { items: newItems };
          }

          return { items: [...state.items, item] };
        }),
      removeItem: (productId, size, color) =>
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.productId === productId && item.size === size && item.color === color)
          ),
        })),
      updateQuantity: (productId, size, color, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId && item.size === size && item.color === color
              ? { ...item, quantity }
              : item
          ),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage',
    }
  )
);
