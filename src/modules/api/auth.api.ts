import apiClient from "./axiosConfig";

export interface LoginRequest {
  emailOrUsername: string;
  password: string;
}

export interface LoginData {
  accessToken: string;
  refreshToken: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  errorCode: string | null;
  data: T;
  errors: unknown | null;
}

export const authApi = {
  login: async (payload: LoginRequest): Promise<ApiResponse<LoginData>> => {
    const response = await apiClient.post<ApiResponse<LoginData>>(
      "/auth/login",
      payload,
    );
    return response.data;
  },
};
