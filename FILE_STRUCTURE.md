# ATS Frontend — Complete Next.js File Structure
# Stack: Next.js 14 + TypeScript + TanStack Query + Axios + Zustand + Tailwind

ats-frontend/
│
├── .env.local                          # API URL, app name (copy from .env.example)
├── .env.example                        # Template (commit this)
├── .gitignore
├── package.json                        # All dependencies
├── tsconfig.json                       # TypeScript config with @/* alias
├── next.config.js                      # Cloudinary image domain, env
├── tailwind.config.js                  # Custom design system tokens
├── postcss.config.js
│
└── src/
    │
    ├── styles/
    │   └── globals.css                 # CSS variables, dark mode, scrollbar, skeleton
    │
    ├── types/
    │   └── index.ts                    # ALL TypeScript types (matches backend 1:1)
    │                                   # User, Role, Permission, Job, Candidate,
    │                                   # Application, Interview, Client, Offer,
    │                                   # Department, FeatureFlag, Notification, etc.
    │
    ├── lib/
    │   ├── axios.ts                    # Axios instance + interceptors
    │   │                               # — attaches Bearer token on every request
    │   │                               # — auto-refresh on 401 (queues failed requests)
    │   │                               # — logout on refresh failure
    │   ├── api.ts                      # All API functions grouped by domain
    │   │                               # authApi, usersApi, rolesApi, jobsApi,
    │   │                               # candidatesApi, applicationsApi, interviewsApi,
    │   │                               # featureFlagsApi, notificationsApi, reportsApi,
    │   │                               # departmentsApi, clientsApi, offersApi
    │   ├── query-provider.tsx          # TanStack QueryClient + DevTools provider
    │   ├── query-keys.ts               # ALL query keys factory (centralised)
    │   │                               # queryKeys.jobs.list(params)
    │   │                               # queryKeys.roles.detail(id) etc.
    │   └── utils.ts                    # cn(), formatDate(), timeAgo(), getInitials(),
    │                                   # formatCurrency(), statusColors map
    │
    ├── store/
    │   └── auth.store.ts               # Zustand store (persisted to localStorage)
    │                                   # — accessToken, refreshToken, user, tenant
    │                                   # — permissions flat map (built from role.permissions)
    │                                   # — hasPermission(key, action) helper
    │                                   # — logout() clears state + redirects
    │
    ├── components/
    │   └── layout/
    │       ├── Sidebar.tsx             # Full sidebar with:
    │       │                           # — Collapsible (icon-only mode)
    │       │                           # — Mobile drawer support
    │       │                           # — Permission-based nav item visibility
    │       │                           # — Active route highlighting
    │       │                           # — User avatar + logout button
    │       │                           # — Nav groups: Main, Recruitment, Org, Analytics, Admin, Account
    │       └── TopBar.tsx              # Top header with:
    │                                   # — Sidebar toggle (desktop) + menu (mobile)
    │                                   # — Global search bar
    │                                   # — Quick "New Job" action button
    │                                   # — Live notification bell (30s polling)
    │                                   # — Mark all read mutation
    │                                   # — User info display
    │
    └── app/
        ├── layout.tsx                  # Root layout: QueryProvider + Toaster
        ├── page.tsx                    # Redirect → /dashboard
        │
        ├── login/
        │   └── page.tsx                # Login page
        │                               # — tenantSlug + email + password form
        │                               # — Zod validation
        │                               # — Left branding panel (desktop)
        │                               # — useMutation → authApi.login → setAuth
        │                               # — Auto-redirect to /dashboard on success
        │
        └── (dashboard)/               # Route group — auth-protected layout
            ├── layout.tsx             # DashboardLayout
            │                          # — Auth check (redirect if not logged in)
            │                          # — Sidebar + TopBar + main content area
            │                          # — Mobile overlay for sidebar
            │
            └── dashboard/
                ├── page.tsx           # HOME DASHBOARD
                │                      # — Greeting with time of day
                │                      # — 4 stat cards (jobs, candidates, interviews, hired)
                │                      # — Pipeline funnel bar chart (Recharts)
                │                      # — Candidate source pie chart (Recharts)
                │                      # — Recent activity feed
                │                      # — Key metrics panel
                │                      # — Offer acceptance rate progress bar
                │
                ├── roles/
                │   └── page.tsx       # ROLES & PERMISSIONS
                │                      # — Left panel: role list with create/duplicate/delete
                │                      # — Inline create form (no modal needed)
                │                      # — Right panel: CRUD permission matrix
                │                      # — Toggle per CRUD bit (checkbox)
                │                      # — Toggle entire row (switch)
                │                      # — Grant All / Revoke All buttons
                │                      # — System roles are read-only (locked)
                │                      # — Save Changes button appears when dirty
                │                      # — User count badge per role
                │
                ├── jobs/
                │   └── page.tsx       # JOBS LIST
                │                      # — Search + status tab filters
                │                      # — Table: title, department, type/mode, status, count, date
                │                      # — Row actions: view, edit, publish, close, delete
                │                      # — Pagination
                │
                ├── candidates/
                │   └── page.tsx       # CANDIDATES
                │                      # — Search + status filter
                │                      # — Card grid: avatar, name, email, title, status, skills
                │                      # — Import CSV button
                │                      # — Row actions: view profile, remove
                │                      # — Pagination
                │
                ├── users/
                │   └── page.tsx       # TEAM MEMBERS
                │                      # — Invite modal (email + role select)
                │                      # — Table: avatar, name/email, role, status, joined
                │                      # — Actions: activate, deactivate, remove
                │
                ├── interviews/
                │   └── page.tsx       # INTERVIEWS
                │                      # — Status filter tabs
                │                      # — Card list: date block, candidate, job, mode, time, interviewers
                │                      # — Join meeting link
                │                      # — Cancel action
                │
                └── feature-flags/
                    └── page.tsx       # FEATURE FLAGS ADMIN
                                       # — Grouped: Agency / Company / Common
                                       # — Toggle switch per flag (immediate update)
                                       # — Override badge vs Plan Default badge
                                       # — Reset to plan default button
                                       # — Description for each flag
                                       # — Search flags
                                       # — Enabled count per group

# ─── Additional pages to build (same pattern) ─────────────────────────────────
#
# dashboard/applications/page.tsx   → Kanban board by pipeline stage
# dashboard/offers/page.tsx         → Offers list with approve/send actions
# dashboard/clients/page.tsx        → Client list (agency only, feature flag gated)
# dashboard/departments/page.tsx    → Department tree view
# dashboard/reports/page.tsx        → Time-to-hire, funnel, source charts
# dashboard/settings/page.tsx       → Tenant settings, SMTP config
# dashboard/billing/page.tsx        → Plan info, invoices, upgrade
# dashboard/api-keys/page.tsx       → Generate, list, revoke API keys
# dashboard/webhooks/page.tsx       → Webhook CRUD + test + delivery logs
# dashboard/jobs/[id]/page.tsx      → Job detail with pipeline board
# dashboard/candidates/[id]/page.tsx → Candidate profile with timeline
