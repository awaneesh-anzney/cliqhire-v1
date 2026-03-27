// ============================================================
//  ATS Frontend — Core Types (matches NestJS backend exactly)
// ============================================================

// ─── Auth ────────────────────────────────────────────────────────
export interface LoginCredentials {
  email: string;
  password: string;
  tenantSlug: string;
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

// ─── User & Roles ────────────────────────────────────────────────
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

// ─── Jobs ────────────────────────────────────────────────────────
export interface Job {
  id: string;
  tenantId: string;
  title: string;
  description?: string;
  status: 'draft' | 'pending_approval' | 'published' | 'closed' | 'archived';
  jobType: 'full_time' | 'part_time' | 'contract' | 'internship' | 'freelance';
  workMode: 'onsite' | 'remote' | 'hybrid';
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  departmentId?: string;
  department?: Department;
  clientId?: string;
  postedBy: string;
  approvedBy?: string;
  assignees: JobAssignee[];
  applicationCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface JobAssignee {
  userId: string;
  user: Pick<User, 'id' | 'name' | 'avatarUrl' | 'email'>;
  role: 'lead' | 'member';
}

// ─── Candidates ──────────────────────────────────────────────────
export interface Candidate {
  id: string;
  tenantId: string;
  fullName: string;
  email: string;
  phone?: string;
  status: 'active' | 'inactive' | 'blacklisted';
  source: string;
  currentTitle?: string;
  currentCompany?: string;
  location?: string;
  skills?: string[];
  resumeUrl?: string;
  linkedinUrl?: string;
  files: CandidateFile[];
  applicationCount?: number;
  createdAt: string;
}

export interface CandidateFile {
  id: string;
  fileType: 'resume' | 'cover_letter' | 'other';
  cloudinaryUrl: string;
  originalName: string;
  createdAt: string;
}

// ─── Pipeline & Applications ─────────────────────────────────────
export interface PipelineStage {
  id: string;
  tenantId: string;
  jobId?: string;
  name: string;
  type: 'applied' | 'screening' | 'interview' | 'assessment' | 'offer' | 'hired' | 'rejected';
  sortOrder: number;
  isDefault: boolean;
  color?: string;
  applicationCount?: number;
}

export interface Application {
  id: string;
  tenantId: string;
  jobId: string;
  job?: Pick<Job, 'id' | 'title' | 'status'>;
  candidateId: string;
  candidate?: Pick<Candidate, 'id' | 'fullName' | 'email' | 'avatarUrl' | 'currentTitle'>;
  stageId: string;
  stage?: PipelineStage;
  status: 'active' | 'disqualified' | 'hired' | 'withdrawn';
  disqualifiedReason?: string;
  appliedAt: string;
  updatedAt: string;
}

// ─── Interviews ──────────────────────────────────────────────────
export interface Interview {
  id: string;
  tenantId: string;
  applicationId: string;
  application?: Application;
  scheduledAt: string;
  durationMin: number;
  mode: 'video' | 'phone' | 'onsite';
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  meetingLink?: string;
  interviewers: Pick<User, 'id' | 'name' | 'avatarUrl'>[];
  feedback?: InterviewFeedback[];
  createdAt: string;
}

export interface InterviewFeedback {
  id: string;
  interviewerId: string;
  interviewer: Pick<User, 'id' | 'name' | 'avatarUrl'>;
  rating: number;
  recommendation: 'strong_yes' | 'yes' | 'neutral' | 'no' | 'strong_no';
  notes?: string;
  submittedAt: string;
}

// ─── Clients (Agency) ────────────────────────────────────────────
export interface Client {
  id: string;
  tenantId: string;
  companyName: string;
  status: 'active' | 'inactive' | 'prospect';
  industry?: string;
  accountManagerId?: string;
  accountManager?: Pick<User, 'id' | 'name'>;
  contacts?: ClientContact[];
  jobCount?: number;
  createdAt: string;
}

export interface ClientContact {
  id: string;
  clientId: string;
  name: string;
  email: string;
  phone?: string;
  isPrimary: boolean;
}

// ─── Offers ──────────────────────────────────────────────────────
export interface Offer {
  id: string;
  tenantId: string;
  applicationId: string;
  application?: Application;
  status: 'draft' | 'pending_approval' | 'approved' | 'sent' | 'accepted' | 'rejected' | 'revoked';
  offeredSalary: number;
  offerDate: string;
  expiryDate: string;
  approvedBy?: string;
  createdAt: string;
}

// ─── Departments ─────────────────────────────────────────────────
export interface Department {
  id: string;
  tenantId: string;
  name: string;
  parentId?: string;
  parent?: Pick<Department, 'id' | 'name'>;
  headUserId?: string;
  headUser?: Pick<User, 'id' | 'name'>;
  children?: Department[];
}

// ─── Feature Flags ───────────────────────────────────────────────
export interface FeatureFlag {
  key: string;
  enabled: boolean;
  source: 'plan' | 'override';
  config?: Record<string, unknown>;
}

// ─── Notifications ───────────────────────────────────────────────
export interface Notification {
  id: string;
  tenantId: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  isRead: boolean;
  entityType?: string;
  entityId?: string;
  createdAt: string;
}

// ─── Reports / Dashboard ─────────────────────────────────────────
export interface DashboardStats {
  activeJobs: number;
  totalCandidates: number;
  openApplications: number;
  scheduledInterviews: number;
  offersExtended: number;
  hiredThisMonth: number;
  timeToHireAvg: number;
  sourceBreakdown: { source: string; count: number }[];
  pipelineFunnel: { stage: string; count: number }[];
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  performedBy: Pick<User, 'id' | 'name' | 'avatarUrl'>;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

// ─── API Response Wrappers ───────────────────────────────────────
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error: string;
}

// ─── Plans & Tenant ──────────────────────────────────────────────
export interface Tenant {
  id: string;
  name: string;
  slug: string;
  orgType: 'agency' | 'company';
  status: 'active' | 'trial' | 'suspended' | 'cancelled';
  plan: Plan;
  settings?: Record<string, unknown>;
  trialEndsAt?: string;
  createdAt: string;
}

export interface Plan {
  id: string;
  name: string;
  slug: string;
  priceMonthly: number;
  priceYearly: number;
  features: { featureKey: string; enabled: boolean }[];
}

// ─── Query Params ────────────────────────────────────────────────
export interface ListQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}
