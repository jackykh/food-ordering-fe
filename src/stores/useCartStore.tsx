import { create } from "zustand";
import type { CartItem } from "@/types/cart";

interface CartState {
  items: CartItem[];
  setItems: (items: CartItem[]) => void;
  addItem: (item: CartItem) => void;
  removeItem: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalQuantity: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  setItems: (items) => set({ items }),

  addItem: (item) =>
    set((state) => {
      const existingItem = state.items.find(
        (i) => i.items.id === item.items.id
      );
      if (existingItem) {
        return {
          items: state.items.map((i) =>
            i.items.id === item.items.id
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          ),
        };
      }
      return { items: [...state.items, item] };
    }),

  removeItem: (itemId) =>
    set((state) => ({
      items: state.items.filter((i) => i.items.id !== itemId),
    })),

  updateQuantity: (itemId, quantity) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.items.id === itemId ? { ...i, quantity } : i
      ),
    })),

  clearCart: () => set({ items: [] }),

  getTotalPrice: () => {
    const { items } = get();
    return items.reduce(
      (total, item) => total + parseFloat(item.items.price) * item.quantity,
      0
    );
  },

  getTotalQuantity: () => {
    const { items } = get();
    return items.reduce((total, item) => total + item.quantity, 0);
  },
}));
