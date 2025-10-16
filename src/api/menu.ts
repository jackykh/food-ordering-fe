import axios from "axios";
import type { MenuItem } from "@/types/menu";
import API_BASE_URL from "@/utils/constant";

export const menuApi = {
  getMenuItems: async (): Promise<MenuItem[]> => {
    const response = await axios.get<MenuItem[]>(`${API_BASE_URL}/menu`);
    return response.data;
  },

  getMenuItem: async (id: string): Promise<MenuItem> => {
    const response = await axios.get<MenuItem>(`${API_BASE_URL}/menu/${id}`);
    return response.data;
  },
};
