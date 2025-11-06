import type { Order } from "../types/cart";
import type { ApiResponse } from "@/types/index";
import axiosInstance from "@/lib/axios";

export interface CreateOrderRequest {
  user_id: number;
  items: Array<{
    menuId: number;
    quantity: number;
  }>;
  fulfillment_type: "dine-in" | "pickup" | "delivery";
}

export const ordersApi = {
  // Get ALL Orders
  getOrders: async (user_id: string): Promise<Order[]> => {
    const response = await axiosInstance.get<ApiResponse<Order[]>>(
      `/orders/${user_id}`
    );
    return response.data.data;
  },

  // Create A New Order
  createOrder: async (data: CreateOrderRequest): Promise<Order> => {
    const response = await axiosInstance.post<ApiResponse<Order>>(
      `/orders/from_cart/${data.user_id}`,
      { menuIds: data.items.map((item) => item.menuId) },
      {
        params: { fulfillmentType: data.fulfillment_type },
      }
    );
    return response.data.data;
  },
};
