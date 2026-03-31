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
      { label: "Pipeline", href: "/dashboard/pipeline", icon: Layers, permission: "pipeline" },
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
            "border-b border-border/40 transition-all duration-200",
            collapsed ? "h-16 justify-center px-0" : "h-16 px-6",
          )}
        >
          <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-md shadow-primary/20 flex items-center justify-center shrink-0 transition-transform hover:scale-105">
              <Briefcase className="w-4 h-4 text-primary-foreground" strokeWidth={2.5} />
            </div>
            {!collapsed && (
              <span className="font-extrabold text-sm tracking-tight truncate text-sidebar-foreground">
                CliqHire
              </span>
            )}
          </Link>
        </SidebarHeader>

        {/* ── Navigation groups ──────────────────────────────── */}
        <SidebarContent className="px-3 py-4 gap-6">
          {navGroups.map((group) => {
            const visibleItems = group.items.filter(canSee)
            if (visibleItems.length === 0) return null

            return (
              <SidebarGroup key={group.label}>
                <SidebarGroupLabel className="px-2 text-[10px] uppercase font-bold tracking-wider text-sidebar-foreground/50 mb-1">{group.label}</SidebarGroupLabel>
                <SidebarMenu className="gap-1.5">
                  {visibleItems.map((item) => {
                    const active = isActive(item.href)
                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          asChild
                          isActive={active}
                          onClick={() => setMobileOpen(false)}
                          title={collapsed ? item.label : undefined}
                          className={cn(
                            "h-9 px-3 rounded-lg transition-all duration-200 group relative",
                            active 
                              ? "bg-primary/10 text-primary font-medium shadow-sm ring-1 ring-primary/20" 
                              : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                          )}
                        >
                          <Link href={item.href} className="w-full flex items-center gap-3">
                            <item.icon
                              className={cn(
                                "w-[18px] h-[18px] shrink-0 transition-transform duration-200",
                                active ? "text-primary stroke-[2.5px]" : "stroke-2 group-hover:scale-110",
                              )}
                            />
                            {!collapsed && (
                              <span className="flex-1 truncate">{item.label}</span>
                            )}
                            {!collapsed && item.badge !== undefined && item.badge > 0 && (
                              <span className="ml-auto flex h-[18px] min-w-[18px] items-center justify-center rounded-md bg-primary text-[9px] font-bold text-primary-foreground px-1.5 shadow-sm">
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroup>
            )
          })}
        </SidebarContent>

        {/* ── User footer ────────────────────────────────────── */}
        <SidebarFooter className={cn(
          "border-t border-border/40 p-3",
          collapsed ? "flex justify-center" : "block"
        )}>
          {user ? (
            <div className={cn(
              "flex items-center gap-3 rounded-xl p-2 transition-colors",
              !collapsed ? "bg-sidebar-accent/50 border border-border/50 shadow-sm" : ""
            )}>
              <Avatar size="sm" className="ring-2 ring-background shrink-0">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold rounded-lg uppercase">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              {!collapsed && (
                <>
                  <div className="flex-1 min-w-0 pr-1">
                    <p className="text-[13px] font-semibold truncate text-sidebar-foreground">{user.name}</p>
                    <p className="text-[10px] font-medium text-sidebar-foreground/50 truncate uppercase tracking-wider">{user.role?.name}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={logout}
                    title="Sign out"
                    className="shrink-0 text-sidebar-foreground/50 hover:text-destructive hover:bg-destructive/10 h-7 w-7 rounded-md"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </Button>
                </>
              )}
            </div>
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
