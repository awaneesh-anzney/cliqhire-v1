'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Menu, PanelLeft, Bell, Search, Plus, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { notificationsApi } from '@/lib/api';
import { queryKeys } from '@/lib/query-keys';
import { useAuthStore } from '@/store/auth.store';
import { cn, timeAgo, getInitials } from '@/lib/utils';

interface TopBarProps {
  onToggleSidebar: () => void;
  onMobileMenu: () => void;
}

export default function TopBar({ onToggleSidebar, onMobileMenu }: TopBarProps) {
  const user = useAuthStore((s) => s.user);
  const [notifOpen, setNotifOpen] = useState(false);
  const qc = useQueryClient();

  const { data: notifs } = useQuery({
    queryKey: queryKeys.notifications.list({ unreadOnly: true }),
    queryFn: () => notificationsApi.list({ unreadOnly: true }),
    refetchInterval: 30_000,
  });

  const markAllRead = useMutation({
    mutationFn: notificationsApi.markAllRead,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.notifications.list() }),
  });

  const unreadCount = notifs?.total ?? 0;

  return (
    <header className="h-14 border-b border-border bg-surface flex items-center px-4 gap-3 shrink-0 z-10">
      {/* Sidebar toggle */}
      <button
        onClick={onToggleSidebar}
        className="hidden lg:flex text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-muted"
      >
        <PanelLeft className="w-4 h-4" />
      </button>
      <button
        onClick={onMobileMenu}
        className="lg:hidden text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-muted"
      >
        <Menu className="w-4 h-4" />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-md hidden md:flex">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search candidates, jobs..."
            className="w-full h-8 pl-9 pr-3 rounded-lg bg-background border border-border text-sm
                       placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <kbd className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground
                          bg-muted px-1.5 py-0.5 rounded font-mono hidden lg:block">⌘K</kbd>
        </div>
      </div>

      <div className="flex-1" />

      {/* Quick Actions */}
      <Link
        href="/dashboard/jobs/new"
        className="hidden sm:flex items-center gap-1.5 h-8 px-3 rounded-lg bg-primary text-primary-foreground
                   text-xs font-medium hover:opacity-90 transition-opacity"
      >
        <Plus className="w-3.5 h-3.5" />
        New Job
      </Link>

      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => setNotifOpen(!notifOpen)}
          className="relative p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary text-[9px]
                             font-bold text-primary-foreground flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {notifOpen && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setNotifOpen(false)} />
            <div className="absolute right-0 top-10 z-40 w-80 bg-surface border border-border rounded-xl shadow-lg
                            divide-y divide-border overflow-hidden animate-fade-in">
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-sm font-medium">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAllRead.mutate()}
                    className="text-xs text-primary hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifs?.data?.length ? (
                  notifs.data.map((n) => (
                    <div key={n.id} className={cn('px-4 py-3 hover:bg-muted transition-colors', !n.isRead && 'bg-primary-muted/30')}>
                      <p className="text-sm font-medium">{n.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{n.body}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{timeAgo(n.createdAt)}</p>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                    All caught up! 🎉
                  </div>
                )}
              </div>
              <div className="px-4 py-2">
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

      {/* User Menu */}
      {user && (
        <div className="flex items-center gap-2 pl-2 border-l border-border">
          <div className="w-7 h-7 rounded-lg bg-primary-muted text-primary text-xs font-semibold
                          flex items-center justify-center">
            {getInitials(user.name)}
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-medium leading-none">{user.name}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{user.role?.name}</p>
          </div>
        </div>
      )}
    </header>
  );
}
