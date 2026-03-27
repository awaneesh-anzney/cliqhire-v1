"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Briefcase,
  Users,
  UserCircle,
  Building2,
  CalendarCheck,
  FileText,
  BarChart2,
  Settings,
  Shield,
  Flag,
  Key,
  Bell,
  CreditCard,
  Webhook,
  Globe,
  Layers,
  Send,
  Gift,
  LogOut,
} from "lucide-react"
import { cn, getInitials } from "@/lib/utils"
import { useAuthStore } from "@/store/auth.store"
import {
  Sidebar as SidebarRoot,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

/* ── Nav config ──────────────────────────────────────────────── */

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
  permission?: string
}

interface NavGroup {
  label: string
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    label: "Main",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Recruitment",
    items: [
      { label: "Jobs", href: "/dashboard/jobs", icon: Briefcase, permission: "jobs" },
      { label: "Candidates", href: "/dashboard/candidates", icon: UserCircle, permission: "candidates" },
      { label: "Applications", href: "/dashboard/applications", icon: Layers, permission: "applications" },
      { label: "Interviews", href: "/dashboard/interviews", icon: CalendarCheck, permission: "interviews" },
      { label: "Offers", href: "/dashboard/offers", icon: FileText, permission: "offers" },
    ],
  },
  {
    label: "Organization",
    items: [
      { label: "Team", href: "/dashboard/users", icon: Users, permission: "users" },
      { label: "Clients", href: "/dashboard/clients", icon: Building2, permission: "clients" },
      { label: "Departments", href: "/dashboard/departments", icon: Globe, permission: "departments" },
      { label: "Referrals", href: "/dashboard/referrals", icon: Gift },
    ],
  },
  {
    label: "Analytics",
    items: [
      { label: "Reports", href: "/dashboard/reports", icon: BarChart2, permission: "reports" },
    ],
  },
  {
    label: "Administration",
    items: [
      { label: "Roles & Permissions", href: "/dashboard/roles", icon: Shield, permission: "roles" },
      { label: "Feature Flags", href: "/dashboard/feature-flags", icon: Flag },
      { label: "API Keys", href: "/dashboard/api-keys", icon: Key },
      { label: "Webhooks", href: "/dashboard/webhooks", icon: Webhook },
      { label: "Email Templates", href: "/dashboard/email-templates", icon: Send },
      { label: "Billing", href: "/dashboard/billing", icon: CreditCard },
    ],
  },
  {
    label: "Account",
    items: [
      { label: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
]

/* ── Component ───────────────────────────────────────────────── */

export default function Sidebar() {
  const pathname = usePathname()
  const { user, hasPermission, logout } = useAuthStore()
  const { collapsed, mobileOpen, setMobileOpen } = useSidebar()

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href)

  const canSee = (item: NavItem) => {
    if (!item.permission) return true
    return hasPermission(item.permission, "canRead")
  }

  return (
    <>
      <SidebarRoot>
        {/* ── Logo ───────────────────────────────────────────── */}
        <SidebarHeader
          className={cn(
            collapsed ? "h-14 justify-center px-0" : "h-14 px-4",
          )}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
              <Briefcase className="w-4 h-4 text-primary-foreground" />
            </div>
            {!collapsed && (
              <span className="font-semibold text-sm tracking-tight truncate text-sidebar-foreground">
                CliqHire
              </span>
            )}
          </div>
        </SidebarHeader>

        {/* ── Navigation groups ──────────────────────────────── */}
        <SidebarContent>
          {navGroups.map((group) => {
            const visibleItems = group.items.filter(canSee)
            if (visibleItems.length === 0) return null

            return (
              <SidebarGroup key={group.label}>
                <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
                <SidebarMenu>
                  {visibleItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive(item.href)}
                        onClick={() => setMobileOpen(false)}
                        title={collapsed ? item.label : undefined}
                      >
                        <Link href={item.href}>
                          <item.icon
                            className={cn(
                              "w-4 h-4 shrink-0",
                              isActive(item.href) ? "text-sidebar-primary" : "",
                            )}
                          />
                          {!collapsed && (
                            <span className="flex-1 truncate">{item.label}</span>
                          )}
                          {!collapsed && item.badge !== undefined && item.badge > 0 && (
                            <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground px-1">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroup>
            )
          })}
        </SidebarContent>

        {/* ── User footer ────────────────────────────────────── */}
        <SidebarFooter className={cn(collapsed && "flex justify-center")}>
          {user && !collapsed ? (
            <div className="flex items-center gap-3">
              <Avatar size="sm">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold rounded-lg">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-sidebar-foreground">{user.name}</p>
                <p className="text-xs text-sidebar-foreground/50 truncate">{user.role?.name}</p>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={logout}
                title="Sign out"
                className="text-sidebar-foreground/50 hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="w-3.5 h-3.5" />
              </Button>
            </div>
          ) : user ? (
            <button onClick={logout} title="Sign out" className="rounded-full">
              <Avatar size="sm">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold rounded-lg">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
            </button>
          ) : null}
        </SidebarFooter>
      </SidebarRoot>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  )
}
