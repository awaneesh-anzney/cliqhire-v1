import apiClient from "@/lib/axios";
import { LoginCredentials, RegisterCredentials, RegisterResponse, User, AuthTokens, ApiResponse } from "@/types/auth";

export const authApi = {
  register: (data: RegisterCredentials) =>
    apiClient.post<ApiResponse<RegisterResponse>>('/auth/register', data).then((r) => r.data.data),
  login: (data: LoginCredentials) =>
    apiClient.post<ApiResponse<AuthTokens>>('/auth/login', data).then((r) => r.data.data),
  logout: () => apiClient.post<ApiResponse<null>>('/auth/logout').then((r) => r.data.data),
  refresh: (refreshToken: string) =>
    apiClient.post<ApiResponse<{ accessToken: string }>>('/auth/refresh', { refreshToken }).then((r) => r.data.data),
  me: () => apiClient.get<ApiResponse<User>>('/auth/me').then((r) => r.data.data),
  forgotPassword: (email: string, tenantSlug: string) =>
    apiClient.post<ApiResponse<null>>('/auth/forgot-password', { email, tenantSlug }).then((r) => r.data.data),
  resetPassword: (token: string, newPassword: string) =>
    apiClient.post<ApiResponse<null>>('/auth/reset-password', { token, newPassword }).then((r) => r.data.data),
  changePassword: (oldPassword: string, newPassword: string) =>
    apiClient.patch<ApiResponse<null>>('/auth/change-password', { oldPassword, newPassword }).then((r) => r.data.data),
  enable2FA: () => apiClient.post<ApiResponse<{ qrCode: string; secret: string }>>('/auth/2fa/enable').then((r) => r.data.data),
  verify2FA: (code: string) => apiClient.post<ApiResponse<null>>('/auth/2fa/verify', { code }).then((r) => r.data.data),
};