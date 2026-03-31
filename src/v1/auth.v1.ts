import apiClient from "@/lib/axios";
import { LoginCredentials, RegisterCredentials, RegisterResponse, User, AuthTokens } from "@/types/auth";

export const authApi = {
  register: (data: RegisterCredentials) =>
    apiClient.post<RegisterResponse>('/auth/register', data).then((r) => r.data),
  login: (data: LoginCredentials) =>
    apiClient.post<AuthTokens>('/auth/login', data).then((r) => r.data),
  logout: () => apiClient.post('/auth/logout').then((r) => r.data),
  refresh: (refreshToken: string) =>
    apiClient.post<{ accessToken: string }>('/auth/refresh', { refreshToken }).then((r) => r.data),
  me: () => apiClient.get<User>('/auth/me').then((r) => r.data),
  forgotPassword: (email: string, tenantSlug: string) =>
    apiClient.post('/auth/forgot-password', { email, tenantSlug }).then((r) => r.data),
  resetPassword: (token: string, newPassword: string) =>
    apiClient.post('/auth/reset-password', { token, newPassword }).then((r) => r.data),
  changePassword: (oldPassword: string, newPassword: string) =>
    apiClient.patch('/auth/change-password', { oldPassword, newPassword }).then((r) => r.data),
  enable2FA: () => apiClient.post<{ qrCode: string; secret: string }>('/auth/2fa/enable').then((r) => r.data),
  verify2FA: (code: string) => apiClient.post('/auth/2fa/verify', { code }).then((r) => r.data),
};