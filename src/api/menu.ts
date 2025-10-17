import axiosInstance from "@/lib/axios";
import type { MenuItem } from "@/types/menu";

export const menuApi = {
  getMenuItems: async (): Promise<MenuItem[]> => {
    const response = await axiosInstance.get<MenuItem[]>("/menu");
    return response.data;
  },

  getMenuItem: async (id: string): Promise<MenuItem> => {
    const response = await axiosInstance.get<MenuItem>(`/menu/${id}`);
    return response.data;
  },
};
