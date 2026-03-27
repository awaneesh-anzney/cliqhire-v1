"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Menu, Bell, Search, Plus, LogOut, Settings, ChevronDown } from "lucide-react"
import Link from "next/link"
import { notificationsApi } from "@/lib/api"
import { queryKeys } from "@/lib/query-keys"
import { useAuthStore } from "@/store/auth.store"
import { cn, timeAgo, getInitials } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"

/* ── Component ───────────────────────────────────────────────── */

export default function TopBar() {
  const { setCollapsed, collapsed, setMobileOpen } = useSidebar()
  const { user, logout } = useAuthStore()
  const [notifOpen, setNotifOpen] = useState(false)
  const qc = useQueryClient()

  const { data: notifs } = useQuery({
    queryKey: queryKeys.notifications.list({ unreadOnly: true }),
    queryFn: () => notificationsApi.list({ unreadOnly: true }),
    refetchInterval: 30_000,
  })

  const markAllRead = useMutation({
    mutationFn: notificationsApi.markAllRead,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.notifications.list() }),
  })

  const unreadCount = notifs?.total ?? 0

  return (
    <header className="h-14 border-b border-border bg-surface flex items-center px-4 gap-3 shrink-0 z-10">
      {/* Desktop sidebar toggle */}
      <div className="hidden lg:flex">
        <SidebarTrigger onClick={() => setCollapsed(!collapsed)} />
      </div>

      {/* Mobile hamburger */}
      <Button
        variant="ghost"
        size="icon-sm"
        className="lg:hidden text-muted-foreground"
        onClick={() => setMobileOpen(true)}
      >
        <Menu className="w-4 h-4" />
        <span className="sr-only">Open menu</span>
      </Button>

      {/* Search */}
      <div className="flex-1 max-w-md hidden md:flex">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search candidates, jobs..."
            className={cn(
              "w-full h-8 pl-9 pr-10 rounded-lg",
              "bg-background border border-border text-sm",
              "placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary",
              "transition-colors",
            )}
          />
          <kbd className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-mono hidden lg:flex items-center">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="flex-1" />

      {/* Quick action — New Job */}
      <Button asChild size="sm" className="hidden sm:flex gap-1.5 h-8">
        <Link href="/dashboard/jobs/new">
          <Plus className="w-3.5 h-3.5" />
          New Job
        </Link>
      </Button>

      {/* Notifications dropdown */}
      <div className="relative">
        <button
          onClick={() => setNotifOpen(!notifOpen)}
          className="relative p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary text-[9px] font-bold text-primary-foreground flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {notifOpen && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setNotifOpen(false)} />
            <div className="absolute right-0 top-10 z-40 w-80 bg-surface border border-border rounded-xl shadow-lg divide-y divide-border overflow-hidden animate-fade-in">
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-sm font-semibold">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAllRead.mutate()}
                    className="text-xs text-primary hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-border">
                {notifs?.data?.length ? (
                  notifs.data.map((n) => (
                    <div
                      key={n.id}
                      className={cn(
                        "px-4 py-3 hover:bg-muted transition-colors",
                        !n.isRead && "bg-primary/5",
                      )}
                    >
                      <p className="text-sm font-medium">{n.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{n.body}</p>
                      <p className="text-[10px] text-muted-foreground/70 mt-1">{timeAgo(n.createdAt)}</p>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                    All caught up! 🎉
                  </div>
                )}
              </div>
              <div className="px-4 py-2.5">
                <Link
                  href="/dashboard/notifications"
                  onClick={() => setNotifOpen(false)}
                  className="text-xs text-primary hover:underline"
                >
                  View all notifications →
                </Link>
              </div>
            </div>
          </>
        )}
      </div>

      {/* User dropdown */}
      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 pl-2 border-l border-border outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-md">
              <Avatar size="sm">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold rounded-lg">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-xs font-medium leading-none">{user.name}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{user.role?.name}</p>
              </div>
              <ChevronDown className="hidden md:block w-3 h-3 text-muted-foreground ml-0.5" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-0.5">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.role?.name}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings" className="flex items-center gap-2 cursor-pointer">
                <Settings className="w-3.5 h-3.5" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={logout}
              className="flex items-center gap-2 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  )
}
