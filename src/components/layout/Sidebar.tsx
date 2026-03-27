'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Briefcase, Users, UserCircle, Building2,
  CalendarCheck, FileText, BarChart2, Settings, ChevronRight,
  Shield, Flag, Key, Bell, CreditCard, Webhook, Globe,
  UserCog, Layers, Send, Gift, LogOut, Briefcase as BriefcaseIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';
import { getInitials } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  permission?: string;
  children?: NavItem[];
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: 'Main',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Recruitment',
    items: [
      { label: 'Jobs', href: '/dashboard/jobs', icon: Briefcase, permission: 'jobs' },
      { label: 'Candidates', href: '/dashboard/candidates', icon: UserCircle, permission: 'candidates' },
      { label: 'Applications', href: '/dashboard/applications', icon: Layers, permission: 'applications' },
      { label: 'Interviews', href: '/dashboard/interviews', icon: CalendarCheck, permission: 'interviews' },
      { label: 'Offers', href: '/dashboard/offers', icon: FileText, permission: 'offers' },
    ],
  },
  {
    label: 'Organization',
    items: [
      { label: 'Team', href: '/dashboard/users', icon: Users, permission: 'users' },
      { label: 'Clients', href: '/dashboard/clients', icon: Building2, permission: 'clients' },
      { label: 'Departments', href: '/dashboard/departments', icon: Globe, permission: 'departments' },
      { label: 'Referrals', href: '/dashboard/referrals', icon: Gift },
    ],
  },
  {
    label: 'Analytics',
    items: [
      { label: 'Reports', href: '/dashboard/reports', icon: BarChart2, permission: 'reports' },
    ],
  },
  {
    label: 'Administration',
    items: [
      { label: 'Roles & Permissions', href: '/dashboard/roles', icon: Shield, permission: 'roles' },
      { label: 'Feature Flags', href: '/dashboard/feature-flags', icon: Flag },
      { label: 'API Keys', href: '/dashboard/api-keys', icon: Key },
      { label: 'Webhooks', href: '/dashboard/webhooks', icon: Webhook },
      { label: 'Email Templates', href: '/dashboard/email-templates', icon: Send },
      { label: 'Billing', href: '/dashboard/billing', icon: CreditCard },
    ],
  },
  {
    label: 'Account',
    items: [
      { label: 'Settings', href: '/dashboard/settings', icon: Settings },
    ],
  },
];

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function Sidebar({ collapsed, mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, hasPermission, logout } = useAuthStore();

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === href : pathname.startsWith(href);

  const canSee = (item: NavItem) => {
    if (!item.permission) return true;
    return hasPermission(item.permission, 'canRead');
  };

  return (
    <>
      <aside
        className={cn(
          'flex flex-col h-full bg-surface border-r border-border z-30 transition-all duration-250 ease-out',
          'fixed lg:relative inset-y-0 left-0',
          collapsed ? 'w-16' : 'w-60',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        {/* Logo */}
        <div className={cn(
          'flex items-center gap-3 border-b border-border shrink-0',
          collapsed ? 'h-14 justify-center px-0' : 'h-14 px-4',
        )}>
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <BriefcaseIcon className="w-4 h-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="font-display font-semibold text-sm tracking-tight truncate">
              ATS Platform
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
          {navGroups.map((group) => {
            const visibleItems = group.items.filter(canSee);
            if (visibleItems.length === 0) return null;

            return (
              <div key={group.label}>
                {!collapsed && (
                  <p className="px-2 mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    {group.label}
                  </p>
                )}
                <ul className="space-y-0.5">
                  {visibleItems.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onMobileClose}
                        title={collapsed ? item.label : undefined}
                        className={cn(
                          'sidebar-item flex items-center gap-3 rounded-lg px-2 py-2 text-sm',
                          'text-muted-foreground transition-all duration-150',
                          isActive(item.href) && 'active',
                          collapsed && 'justify-center',
                        )}
                      >
                        <item.icon className={cn('w-4 h-4 shrink-0', isActive(item.href) ? 'text-primary' : '')} />
                        {!collapsed && (
                          <span className="flex-1 truncate">{item.label}</span>
                        )}
                        {!collapsed && item.badge !== undefined && item.badge > 0 && (
                          <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground px-1">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className={cn(
          'border-t border-border p-3 shrink-0',
          collapsed && 'flex justify-center',
        )}>
          {user && !collapsed ? (
            <div className="flex items-center gap-3">
              <Avatar name={user.name} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.role?.name}</p>
              </div>
              <button
                onClick={logout}
                className="text-muted-foreground hover:text-destructive transition-colors p-1 rounded"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : user ? (
            <button onClick={logout} title="Sign out">
              <Avatar name={user.name} size="sm" />
            </button>
          ) : null}
        </div>
      </aside>
    </>
  );
}

function Avatar({ name, size = 'sm' }: { name: string; size?: 'sm' | 'md' }) {
  const sizeClass = size === 'sm' ? 'w-7 h-7 text-xs' : 'w-9 h-9 text-sm';
  return (
    <div className={cn(
      sizeClass,
      'rounded-lg bg-primary-muted text-primary font-semibold flex items-center justify-center shrink-0',
    )}>
      {getInitials(name)}
    </div>
  );
}
