import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User, Tenant } from '@/types';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  tenant: Tenant | null;
  isAuthenticated: boolean;
  permissions: Record<string, { canCreate: boolean; canRead: boolean; canUpdate: boolean; canDelete: boolean }>;

  // Actions
  setAuth: (tokens: { accessToken: string; refreshToken: string }, user: User) => void;
  setAccessToken: (token: string) => void;
  setUser: (user: User) => void;
  setTenant: (tenant: Tenant) => void;
  logout: () => void;
  hasPermission: (key: string, action: 'canCreate' | 'canRead' | 'canUpdate' | 'canDelete') => boolean;
  hasFeature: (flagKey: string) => boolean;
}

// Build a flat permissions lookup from user's role
const buildPermissionsMap = (user: User) => {
  const map: AuthState['permissions'] = {};
  if (!user?.role?.permissions) return map;
  for (const p of user.role.permissions) {
    map[p.permissionKey] = {
      canCreate: p.canCreate,
      canRead: p.canRead,
      canUpdate: p.canUpdate,
      canDelete: p.canDelete,
    };
  }
  return map;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      tenant: null,
      isAuthenticated: false,
      permissions: {},

      setAuth: ({ accessToken, refreshToken }, user) => {
        set({
          accessToken,
          refreshToken,
          user,
          isAuthenticated: true,
          permissions: buildPermissionsMap(user),
        });
      },

      setAccessToken: (token) => set({ accessToken: token }),

      setUser: (user) =>
        set({ user, permissions: buildPermissionsMap(user) }),

      setTenant: (tenant) => set({ tenant }),

      logout: () => {
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          tenant: null,
          isAuthenticated: false,
          permissions: {},
        });
        // Redirect to login
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      },

      hasPermission: (key, action) => {
        const { user, permissions } = get();
        // Super admin and tenant admin bypass permission checks
        if (user?.role?.slug === 'super_admin' || user?.role?.slug === 'admin') return true;
        return permissions[key]?.[action] ?? false;
      },

      hasFeature: (_flagKey) => {
        // Feature flags are checked server-side (403 from API)
        // This is for UI-level hiding only (best-effort)
        return true;
      },
    }),
    {
      name: 'ats-auth',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? localStorage : {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        }
      ),
      // Only persist tokens and user (not derived state)
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        tenant: state.tenant,
        isAuthenticated: state.isAuthenticated,
        permissions: state.permissions,
      }),
    },
  ),
);
