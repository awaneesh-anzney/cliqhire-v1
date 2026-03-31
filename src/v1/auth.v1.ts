import apiClient from "@/lib/axios";
import { LoginCredentials, RegisterCredentials, RegisterResponse, User, AuthTokens, ApiResponse } from "@/types/auth";

export const authApi = {
  register: async (data: RegisterCredentials) => {
    const response = await apiClient.post<ApiResponse<RegisterResponse>>('/auth/register', data);
    return response.data.data;
  },

  login: async (data: LoginCredentials) => {
    const response = await apiClient.post<ApiResponse<AuthTokens>>('/auth/login', data);
    return response.data.data;
  },

  logout: async () => {
    const response = await apiClient.post<ApiResponse<null>>('/auth/logout');
    return response.data.data;
  },

  refresh: async (refreshToken: string) => {
    const response = await apiClient.post<ApiResponse<{ accessToken: string }>>('/auth/refresh', { refreshToken });
    return response.data.data;
  },

  me: async () => {
    const response = await apiClient.get<ApiResponse<User>>('/auth/me');
    return response.data.data;
  },

  forgotPassword: async (email: string, tenantSlug: string) => {
    const response = await apiClient.post<ApiResponse<null>>('/auth/forgot-password', { email, tenantSlug });
    return response.data.data;
  },

  resetPassword: async (token: string, newPassword: string) => {
    const response = await apiClient.post<ApiResponse<null>>('/auth/reset-password', { token, newPassword });
    return response.data.data;
  },

  changePassword: async (oldPassword: string, newPassword: string) => {
    const response = await apiClient.patch<ApiResponse<null>>('/auth/change-password', { oldPassword, newPassword });
    return response.data.data;
  },

  enable2FA: async () => {
    const response = await apiClient.post<ApiResponse<{ qrCode: string; secret: string }>>('/auth/2fa/enable');
    return response.data.data;
  },

  verify2FA: async (code: string) => {
    const response = await apiClient.post<ApiResponse<null>>('/auth/2fa/verify', { code });
    return response.data.data;
  },
};