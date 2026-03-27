import apiClient from './axios';
import type {
  AuthTokens, LoginCredentials, User, Role, Permission,
  Job, Candidate, Application, Interview, Client, Offer,
  Department, FeatureFlag, Notification, DashboardStats,
  PipelineStage, PaginatedResponse, ListQueryParams,
} from '@/types';

// ─── Auth ─────────────────────────────────────────────────────────
export const authApi = {
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

// ─── Users ────────────────────────────────────────────────────────
export const usersApi = {
  list: (params?: ListQueryParams) =>
    apiClient.get<PaginatedResponse<User>>('/users', { params }).then((r) => r.data),
  get: (id: string) => apiClient.get<User>(`/users/${id}`).then((r) => r.data),
  create: (data: Partial<User> & { roleId: string }) =>
    apiClient.post<User>('/users', data).then((r) => r.data),
  update: (id: string, data: Partial<User>) =>
    apiClient.patch<User>(`/users/${id}`, data).then((r) => r.data),
  delete: (id: string) => apiClient.delete(`/users/${id}`).then((r) => r.data),
  invite: (data: { email: string; roleId: string }) =>
    apiClient.post('/users/invite', data).then((r) => r.data),
  activate: (id: string) => apiClient.patch(`/users/${id}/activate`).then((r) => r.data),
  deactivate: (id: string) => apiClient.patch(`/users/${id}/deactivate`).then((r) => r.data),
};

// ─── Roles & Permissions ──────────────────────────────────────────
export const rolesApi = {
  list: () => apiClient.get<Role[]>('/roles').then((r) => r.data),
  get: (id: string) => apiClient.get<Role>(`/roles/${id}`).then((r) => r.data),
  create: (data: { name: string; permissions?: Partial<Permission>[] }) =>
    apiClient.post<Role>('/roles', data).then((r) => r.data),
  delete: (id: string) => apiClient.delete(`/roles/${id}`).then((r) => r.data),
  duplicate: (id: string, newName: string) =>
    apiClient.post<Role>(`/roles/${id}/duplicate`, { newName }).then((r) => r.data),
  updatePermissions: (id: string, permissions: Partial<Permission>[]) =>
    apiClient.patch<Role>(`/roles/${id}/permissions`, { permissions }).then((r) => r.data),
  allPermissionKeys: () =>
    apiClient.get<string[]>('/permissions/all').then((r) => r.data),
};

// ─── Jobs ─────────────────────────────────────────────────────────
export const jobsApi = {
  list: (params?: ListQueryParams & { status?: string; assignee?: string }) =>
    apiClient.get<PaginatedResponse<Job>>('/jobs', { params }).then((r) => r.data),
  get: (id: string) => apiClient.get<Job>(`/jobs/${id}`).then((r) => r.data),
  create: (data: Partial<Job>) => apiClient.post<Job>('/jobs', data).then((r) => r.data),
  update: (id: string, data: Partial<Job>) =>
    apiClient.patch<Job>(`/jobs/${id}`, data).then((r) => r.data),
  delete: (id: string) => apiClient.delete(`/jobs/${id}`).then((r) => r.data),
  publish: (id: string) => apiClient.post<Job>(`/jobs/${id}/publish`).then((r) => r.data),
  close: (id: string, reason?: string) =>
    apiClient.post<Job>(`/jobs/${id}/close`, { reason }).then((r) => r.data),
  duplicate: (id: string) => apiClient.post<Job>(`/jobs/${id}/duplicate`).then((r) => r.data),
  pipelineBoard: (id: string) =>
    apiClient.get<{ stages: PipelineStage[]; applications: Application[] }>(`/jobs/${id}/pipeline-board`).then((r) => r.data),
  requestApproval: (id: string, approverId: string) =>
    apiClient.post(`/jobs/${id}/request-approval`, { approverId }).then((r) => r.data),
};

// ─── Pipeline Stages ─────────────────────────────────────────────
export const pipelineApi = {
  stages: (jobId?: string) =>
    apiClient.get<PipelineStage[]>('/pipeline-stages', { params: { jobId } }).then((r) => r.data),
  create: (data: Partial<PipelineStage>) =>
    apiClient.post<PipelineStage>('/pipeline-stages', data).then((r) => r.data),
  update: (id: string, data: Partial<PipelineStage>) =>
    apiClient.patch<PipelineStage>(`/pipeline-stages/${id}`, data).then((r) => r.data),
  delete: (id: string) => apiClient.delete(`/pipeline-stages/${id}`).then((r) => r.data),
  reorder: (orderedIds: string[]) =>
    apiClient.post('/pipeline-stages/reorder', { orderedIds }).then((r) => r.data),
};

// ─── Candidates ───────────────────────────────────────────────────
export const candidatesApi = {
  list: (params?: ListQueryParams & { status?: string }) =>
    apiClient.get<PaginatedResponse<Candidate>>('/candidates', { params }).then((r) => r.data),
  get: (id: string) => apiClient.get<Candidate>(`/candidates/${id}`).then((r) => r.data),
  create: (data: Partial<Candidate>) =>
    apiClient.post<Candidate>('/candidates', data).then((r) => r.data),
  update: (id: string, data: Partial<Candidate>) =>
    apiClient.patch<Candidate>(`/candidates/${id}`, data).then((r) => r.data),
  delete: (id: string) => apiClient.delete(`/candidates/${id}`).then((r) => r.data),
  uploadResume: (id: string, file: File) => {
    const form = new FormData();
    form.append('file', file);
    return apiClient.post(`/candidates/${id}/resume`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data);
  },
  applications: (id: string) =>
    apiClient.get<Application[]>(`/candidates/${id}/applications`).then((r) => r.data),
  timeline: (id: string) =>
    apiClient.get(`/candidates/${id}/timeline`).then((r) => r.data),
};

// ─── Applications ─────────────────────────────────────────────────
export const applicationsApi = {
  apply: (jobId: string, candidateId: string, stageId?: string) =>
    apiClient.post<Application>(`/jobs/${jobId}/apply/${candidateId}`, { stageId }).then((r) => r.data),
  moveStage: (id: string, stageId: string) =>
    apiClient.patch<Application>(`/applications/${id}/stage`, { stageId }).then((r) => r.data),
  disqualify: (id: string, reason: string) =>
    apiClient.patch(`/applications/${id}/disqualify`, { reason }).then((r) => r.data),
  reactivate: (id: string) =>
    apiClient.post(`/applications/${id}/reactivate`).then((r) => r.data),
  get: (id: string) => apiClient.get<Application>(`/applications/${id}`).then((r) => r.data),
  notes: (id: string) => apiClient.get(`/applications/${id}/notes`).then((r) => r.data),
  addNote: (id: string, content: string, visibility: string) =>
    apiClient.post(`/applications/${id}/notes`, { content, visibility }).then((r) => r.data),
};

// ─── Interviews ───────────────────────────────────────────────────
export const interviewsApi = {
  list: (params?: ListQueryParams) =>
    apiClient.get<PaginatedResponse<Interview>>('/interviews', { params }).then((r) => r.data),
  get: (id: string) => apiClient.get<Interview>(`/interviews/${id}`).then((r) => r.data),
  create: (data: {
    applicationId: string; scheduledAt: string; durationMin: number;
    mode: string; interviewerIds: string[]; meetingLink?: string;
  }) => apiClient.post<Interview>('/interviews', data).then((r) => r.data),
  update: (id: string, data: Partial<Interview>) =>
    apiClient.patch<Interview>(`/interviews/${id}`, data).then((r) => r.data),
  cancel: (id: string, reason: string) =>
    apiClient.post(`/interviews/${id}/cancel`, { reason }).then((r) => r.data),
  submitFeedback: (id: string, data: {
    rating: number; recommendation: string; criteriaScores?: unknown[]
  }) => apiClient.post(`/interviews/${id}/feedback`, data).then((r) => r.data),
  feedback: (id: string) =>
    apiClient.get(`/interviews/${id}/feedback`).then((r) => r.data),
};

// ─── Feature Flags ────────────────────────────────────────────────
export const featureFlagsApi = {
  list: () =>
    apiClient.get<FeatureFlag[]>('/admin/feature-flags').then((r) => r.data),
  update: (key: string, enabled: boolean, config?: object) =>
    apiClient.patch<FeatureFlag>(`/admin/feature-flags/${key}`, { enabled, config }).then((r) => r.data),
  history: (key: string) =>
    apiClient.get(`/admin/feature-flags/${key}/history`).then((r) => r.data),
  resetToDefault: (key: string) =>
    apiClient.delete(`/admin/feature-flags/${key}/override`).then((r) => r.data),
};

// ─── Notifications ────────────────────────────────────────────────
export const notificationsApi = {
  list: (params?: { unreadOnly?: boolean }) =>
    apiClient.get<PaginatedResponse<Notification>>('/notifications', { params }).then((r) => r.data),
  markRead: (id: string) =>
    apiClient.patch(`/notifications/${id}/read`).then((r) => r.data),
  markAllRead: () =>
    apiClient.patch('/notifications/read-all').then((r) => r.data),
};

// ─── Reports / Dashboard ──────────────────────────────────────────
export const reportsApi = {
  dashboard: () =>
    apiClient.get<DashboardStats>('/reports/dashboard').then((r) => r.data),
  timeToHire: (params?: object) =>
    apiClient.get('/reports/time-to-hire', { params }).then((r) => r.data),
  funnel: (params?: object) =>
    apiClient.get('/reports/pipeline-funnel', { params }).then((r) => r.data),
  sources: (params?: object) =>
    apiClient.get('/reports/source-analysis', { params }).then((r) => r.data),
};

// ─── Departments ──────────────────────────────────────────────────
export const departmentsApi = {
  list: () => apiClient.get<Department[]>('/departments').then((r) => r.data),
  create: (data: Partial<Department>) =>
    apiClient.post<Department>('/departments', data).then((r) => r.data),
  update: (id: string, data: Partial<Department>) =>
    apiClient.patch<Department>(`/departments/${id}`, data).then((r) => r.data),
};

// ─── Clients (Agency) ─────────────────────────────────────────────
export const clientsApi = {
  list: (params?: ListQueryParams) =>
    apiClient.get<PaginatedResponse<Client>>('/clients', { params }).then((r) => r.data),
  get: (id: string) => apiClient.get<Client>(`/clients/${id}`).then((r) => r.data),
  create: (data: Partial<Client>) =>
    apiClient.post<Client>('/clients', data).then((r) => r.data),
  update: (id: string, data: Partial<Client>) =>
    apiClient.patch<Client>(`/clients/${id}`, data).then((r) => r.data),
};

// ─── Offers ───────────────────────────────────────────────────────
export const offersApi = {
  list: (params?: ListQueryParams) =>
    apiClient.get<PaginatedResponse<Offer>>('/offers', { params }).then((r) => r.data),
  create: (data: { applicationId: string; offeredSalary: number; offerDate: string; expiryDate: string }) =>
    apiClient.post<Offer>('/offers', data).then((r) => r.data),
  approve: (id: string) =>
    apiClient.post(`/offers/${id}/approve`).then((r) => r.data),
  send: (id: string) =>
    apiClient.post(`/offers/${id}/send`).then((r) => r.data),
};
