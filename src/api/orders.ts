import type { Order } from "../types/cart";
import type { ApiResponse } from "@/types/index";
import axiosInstance from "@/lib/axios";

export interface CreateOrderRequest {
  user_id: number;
  items: Array<{
    item_id: number;
    quantity: number;
  }>;
  fulfillment_type: "dine-in" | "takeaway";
}

export const ordersApi = {
  // Get ALL Orders
  getOrders: async (): Promise<Order[]> => {
    const response = await axiosInstance.get<ApiResponse<Order[]>>(`/orders/`);
    return response.data.data;
  },

  // Create A New Order
  createOrder: async (data: CreateOrderRequest): Promise<Order> => {
    const response = await axiosInstance.post<ApiResponse<Order>>(
      `/orders/`,
      data
    );
    return response.data.data;
  },
};
