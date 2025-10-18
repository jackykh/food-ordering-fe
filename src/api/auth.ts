import axiosInstance from "@/lib/axios";

export interface SignupRequest {
  userName: string;
}

export interface SignupResponse {
  userId: string;
  userName: string;
}

export const authApi = {
  signup: async (data: SignupRequest): Promise<SignupResponse> => {
    const response = await axiosInstance.post<SignupResponse>(
      "/auth/signup",
      data
    );
    return response.data;
  },

  login: async (data: SignupRequest): Promise<SignupResponse> => {
    const response = await axiosInstance.post<SignupResponse>(
      "/auth/login",
      data
    );
    return response.data;
  },
};
