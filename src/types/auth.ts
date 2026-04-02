export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

export interface LoginCredentials {
  email: string;
  password: string;
  tenantSlug: string;
}

export interface RegisterCredentials {
  companyName: string;
  tenantSlug: string;
  orgType: 'agency' | 'company';
  adminName: string;
  adminEmail: string;
  adminPassword: string;
}

export interface RegisterResponse {
  message: string;
  tenantSlug: string;
  workspaceUrl: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface JWTPayload {
  sub: string;
  tenantId: string;
  roleId: string;
  email: string;
  iat: number;
  exp: number;
}

export interface User {
  id: string;
  tenantId: string;
  email: string;
  name: string;
  phone?: string;
  avatarUrl?: string;
  status: 'active' | 'inactive' | 'invited';
  orgType: 'agency' | 'company';
  role: Role;
  createdAt: string;
  updatedAt: string;
}


export interface Role {
  id: string;
  tenantId: string;
  name: string;
  slug: string;
  isSystem: boolean;
  isActive: boolean;
  permissions: Permission[];
  userCount?: number;
  createdAt: string;
}

export interface Permission {
  id: string;
  roleId: string;
  permissionKey: string;
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  config?: Record<string, unknown>;
}

export type PermissionKey =
  | 'users' | 'roles' | 'jobs' | 'candidates' | 'applications'
  | 'interviews' | 'clients' | 'contracts' | 'submissions'
  | 'offers' | 'reports' | 'export' | 'email_templates'
  | 'pipeline' | 'custom_fields' | 'departments' | 'approvals'
  | 'files' | 'api_keys' | 'webhooks';