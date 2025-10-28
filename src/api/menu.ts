import axiosInstance from "@/lib/axios";
import type { MenuItem } from "@/types/menu";
import type { ApiResponse } from "@/types/index";

type MenuResponse = ApiResponse<MenuItem[]>;

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
