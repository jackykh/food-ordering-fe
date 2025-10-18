import axiosInstance from "@/lib/axios";
import type { MenuItem } from "@/types/menu";

export interface MenuResponse {
  success: boolean;
  message: string;
  data: MenuItem[];
}

export const menuApi = {
  getMenuItems: async (): Promise<MenuItem[]> => {
    const response = await axiosInstance.get<MenuResponse>("/menu");
    return response.data.data;
  },

  getMenuItem: async (id: string): Promise<MenuItem> => {
    const response = await axiosInstance.get<MenuResponse>(`/menu/${id}`);
    return response.data.data[0];
  },
};
