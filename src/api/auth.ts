import axios from "axios";
import API_BASE_URL from "@/utils/constant";

export interface SignupRequest {
  userName: string;
}

export interface SignupResponse {
  userId: string;
  userName: string;
}

export const authApi = {
  signup: async (data: SignupRequest): Promise<SignupResponse> => {
    const response = await axios.post<SignupResponse>(
      `${API_BASE_URL}/auth/signup`,
      data
    );
    return response.data;
  },

  login: async (data: SignupRequest): Promise<SignupResponse> => {
    const response = await axios.post<SignupResponse>(
      `${API_BASE_URL}/auth/login`,
      data
    );
    return response.data;
  },
};
