// ── Query Keys Factory ──────────────────────────────────────────
// Centralised keys prevent typos and enable targeted invalidation.

export const queryKeys = {
  // Auth
  me: ['auth', 'me'] as const,

  // Users
  users: {
    all: ['users'] as const,
    list: (params?: object) => ['users', 'list', params] as const,
    detail: (id: string) => ['users', 'detail', id] as const,
    activity: (id: string) => ['users', 'activity', id] as const,
  },

  // Roles & Permissions
  roles: {
    all: ['roles'] as const,
    list: () => ['roles', 'list'] as const,
    detail: (id: string) => ['roles', 'detail', id] as const,
    permissions: () => ['roles', 'permissions', 'all'] as const,
  },

  // Jobs
  jobs: {
    all: ['jobs'] as const,
    list: (params?: object) => ['jobs', 'list', params] as const,
    detail: (id: string) => ['jobs', 'detail', id] as const,
    assignees: (id: string) => ['jobs', id, 'assignees'] as const,
    applications: (id: string, params?: object) => ['jobs', id, 'applications', params] as const,
    pipelineBoard: (id: string) => ['jobs', id, 'pipeline-board'] as const,
  },

  // Candidates
  candidates: {
    all: ['candidates'] as const,
    list: (params?: object) => ['candidates', 'list', params] as const,
    detail: (id: string) => ['candidates', 'detail', id] as const,
    applications: (id: string) => ['candidates', id, 'applications'] as const,
    timeline: (id: string) => ['candidates', id, 'timeline'] as const,
    files: (id: string) => ['candidates', id, 'files'] as const,
    duplicateCheck: (q: string) => ['candidates', 'duplicate', q] as const,
  },

  // Pipeline
  pipeline: {
    stages: (jobId?: string) => ['pipeline', 'stages', jobId ?? 'templates'] as const,
  },

  // Applications
  applications: {
    detail: (id: string) => ['applications', 'detail', id] as const,
    notes: (id: string) => ['applications', id, 'notes'] as const,
  },

  // Interviews
  interviews: {
    list: (params?: object) => ['interviews', 'list', params] as const,
    detail: (id: string) => ['interviews', 'detail', id] as const,
    feedback: (id: string) => ['interviews', id, 'feedback'] as const,
    availability: (params?: object) => ['interviews', 'availability', params] as const,
  },

  // Clients
  clients: {
    list: (params?: object) => ['clients', 'list', params] as const,
    detail: (id: string) => ['clients', 'detail', id] as const,
    contacts: (id: string) => ['clients', id, 'contacts'] as const,
  },

  // Offers
  offers: {
    list: (params?: object) => ['offers', 'list', params] as const,
    detail: (id: string) => ['offers', 'detail', id] as const,
  },

  // Departments
  departments: {
    list: () => ['departments'] as const,
  },

  // Feature Flags
  featureFlags: {
    all: () => ['feature-flags'] as const,
    history: (key: string) => ['feature-flags', key, 'history'] as const,
  },

  // Notifications
  notifications: {
    list: (params?: object) => ['notifications', 'list', params] as const,
  },

  // Reports
  reports: {
    dashboard: () => ['reports', 'dashboard'] as const,
    timeToHire: (params?: object) => ['reports', 'time-to-hire', params] as const,
    funnel: (params?: object) => ['reports', 'funnel', params] as const,
    sources: (params?: object) => ['reports', 'sources', params] as const,
  },

  // Tenant
  tenant: {
    current: () => ['tenant', 'current'] as const,
    featureFlags: () => ['tenant', 'feature-flags'] as const,
  },
} as const;
