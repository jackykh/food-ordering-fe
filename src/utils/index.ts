import type { CartItem } from "@/types/cart";

export const getTotalPrice = (cartItems: CartItem[]) => {
  return cartItems.reduce((total, item) => {
    return total + parseFloat(item.items.price) * item.quantity;
  }, 0);
};
export const getTotalQuantity = (cartItems: CartItem[]) => {
  return cartItems.reduce((total, item) => {
    return total + item.quantity;
  }, 0);
};
