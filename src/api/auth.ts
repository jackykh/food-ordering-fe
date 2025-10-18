import axiosInstance from "@/lib/axios";

export interface SignupRequest {
  userName: string;
}

export interface SignupResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    name: string;
  };
}

export const authApi = {
  signup: async (data: SignupRequest): Promise<SignupResponse> => {
    const response = await axiosInstance.post<SignupResponse>(
      "/auth/signup",
      data,
      {
        params: {
          user_name: data.userName,
        },
      }
    );
    return response.data;
  },

  login: async (data: SignupRequest): Promise<SignupResponse> => {
    const response = await axiosInstance.post<SignupResponse>(
      "/auth/login",
      data,
      {
        params: {
          user_name: data.userName,
        },
      }
    );
    return response.data;
  },
};
