import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

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
