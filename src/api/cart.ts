import type { Cart, CartItem } from "../types/cart";
import type { ApiResponse } from "@/types/index";
import axiosInstance from "@/lib/axios";

export const cartApi = {
  createCart: async (userId: number): Promise<Cart> => {
    const response = await axiosInstance.post<ApiResponse<Cart>>(
      `/cart/${userId}`
    );
    return response.data.data;
  },

  // Get Cart by User ID
  getCart: async (userId: number): Promise<Cart> => {
    const response = await axiosInstance.get<ApiResponse<Cart>>(
      `/cart/${userId}`
    );
    return response.data.data;
  },

  addItemToCart: async (userId: number, itemId: number): Promise<CartItem> => {
    const response = await axiosInstance.post<ApiResponse<CartItem>>(
      `/cart_item_by_user_id/${userId}/${itemId}`
    );
    return response.data.data;
  },

  removeItemFromCart: async (userId: number, itemId: number): Promise<void> => {
    await axiosInstance.delete(`/cart_item/${userId}/${itemId}`);
  },

  // clearCart: async (userId: number): Promise<void> => {
  //   await axiosInstance.delete(`/cart_item/${userId}`);
  // },
};
