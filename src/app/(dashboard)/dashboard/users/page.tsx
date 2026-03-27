'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import {
  Users, Plus, Search, MoreHorizontal, Mail, UserX,
  UserCheck, Trash2, Loader2, X, Check, ShieldCheck,
} from 'lucide-react';
import { usersApi, rolesApi } from '@/lib/api';
import { queryKeys } from '@/lib/query-keys';
import { cn, formatDate, statusColors, getInitials } from '@/lib/utils';
import type { User } from '@/types';

const inviteSchema = z.object({
  email: z.string().email('Invalid email'),
  roleId: z.string().min(1, 'Please select a role'),
});
type InviteForm = z.infer<typeof inviteSchema>;

export default function UsersPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [inviteOpen, setInviteOpen] = useState(false);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.users.list({ page, search }),
    queryFn: () => usersApi.list({ page, limit: 20, search }),
    placeholderData: (prev) => prev,
  });

  const { data: roles = [] } = useQuery({
    queryKey: queryKeys.roles.list(),
    queryFn: rolesApi.list,
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<InviteForm>({
    resolver: zodResolver(inviteSchema),
  });

  const inviteMutation = useMutation({
    mutationFn: usersApi.invite,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.users.all });
      toast.success('Invitation sent successfully');
      reset();
      setInviteOpen(false);
    },
    onError: () => toast.error('Failed to send invitation'),
  });

  const activateMutation = useMutation({
    mutationFn: usersApi.activate,
    onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.users.all }); toast.success('User activated'); },
  });

  const deactivateMutation = useMutation({
    mutationFn: usersApi.deactivate,
    onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.users.all }); toast.success('User deactivated'); },
  });

  const deleteMutation = useMutation({
    mutationFn: usersApi.delete,
    onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.users.all }); toast.success('User removed'); },
  });

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-display font-bold flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" /> Team Members
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">{data?.total ?? 0} members</p>
        </div>
        <button
          onClick={() => setInviteOpen(true)}
          className="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" /> Invite Member
        </button>
      </div>

      {/* Invite Modal */}
      {inviteOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setInviteOpen(false)} />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50
                          w-full max-w-md bg-surface border border-border rounded-2xl shadow-2xl p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-semibold text-base flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" /> Invite Team Member
              </h3>
              <button onClick={() => setInviteOpen(false)} className="text-muted-foreground hover:text-foreground p-1 rounded">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit((d) => inviteMutation.mutate(d))} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Email Address</label>
                <input
                  {...register('email')}
                  placeholder="colleague@company.com"
                  type="email"
                  className={cn(
                    'w-full h-10 px-3 rounded-lg border bg-background text-sm placeholder:text-muted-foreground',
                    'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
                    errors.email ? 'border-destructive' : 'border-border',
                  )}
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Assign Role</label>
                <select
                  {...register('roleId')}
                  className={cn(
                    'w-full h-10 px-3 rounded-lg border bg-background text-sm',
                    'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
                    errors.roleId ? 'border-destructive' : 'border-border',
                  )}
                >
                  <option value="">Select a role…</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
                {errors.roleId && <p className="text-xs text-destructive">{errors.roleId.message}</p>}
              </div>

              <div className="p-3 bg-accent-muted/30 rounded-lg border border-accent/20">
                <p className="text-xs text-muted-foreground">
                  The invitee will receive an email to set their password and join your workspace.
                </p>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => { setInviteOpen(false); reset(); }}
                  className="flex-1 h-10 rounded-lg border border-border text-sm hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={inviteMutation.isPending}
                  className="flex-1 h-10 rounded-lg bg-primary text-primary-foreground text-sm font-medium
                             hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {inviteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                  Send Invite
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search members…"
          className="w-full h-9 pl-9 pr-3 rounded-lg bg-surface border border-border text-sm
                     placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Table */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/30">
            <tr>
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Member</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden md:table-cell">Role</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden lg:table-cell">Joined</th>
              <th className="px-4 py-3 w-10" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {[1, 2, 3, 4, 5].map((j) => (
                      <td key={j} className="px-5 py-4"><div className="h-4 skeleton" /></td>
                    ))}
                  </tr>
                ))
              : data?.data?.map((user) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    onActivate={() => activateMutation.mutate(user.id)}
                    onDeactivate={() => deactivateMutation.mutate(user.id)}
                    onDelete={() => { if (confirm('Remove this user?')) deleteMutation.mutate(user.id); }}
                  />
                ))}
          </tbody>
        </table>
        {!isLoading && !data?.data?.length && (
          <div className="py-16 text-center">
            <Users className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No team members yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

function UserRow({ user, onActivate, onDeactivate, onDelete }: {
  user: User; onActivate: () => void; onDeactivate: () => void; onDelete: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <tr className="hover:bg-muted/30 transition-colors group">
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary-muted text-primary text-xs font-bold
                          flex items-center justify-center shrink-0">
            {getInitials(user.name)}
          </div>
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3.5 hidden md:table-cell">
        <span className="flex items-center gap-1.5 text-sm">
          <ShieldCheck className="w-3.5 h-3.5 text-muted-foreground" />
          {user.role?.name ?? '—'}
        </span>
      </td>
      <td className="px-4 py-3.5">
        <span className={cn(
          'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium capitalize',
          statusColors[user.status],
        )}>
          {user.status}
        </span>
      </td>
      <td className="px-4 py-3.5 hidden lg:table-cell text-muted-foreground text-xs">
        {formatDate(user.createdAt)}
      </td>
      <td className="px-4 py-3.5 relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="h-7 w-7 rounded flex items-center justify-center text-muted-foreground
                     hover:bg-muted opacity-0 group-hover:opacity-100 transition-all"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
        {menuOpen && (
          <>
            <div className="fixed inset-0 z-20" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-4 top-8 z-30 w-40 bg-surface border border-border rounded-lg shadow-lg py-1 animate-fade-in">
              {user.status !== 'active' && (
                <button
                  onClick={() => { setMenuOpen(false); onActivate(); }}
                  className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-success hover:bg-success-muted transition-colors"
                >
                  <UserCheck className="w-3.5 h-3.5" /> Activate
                </button>
              )}
              {user.status === 'active' && (
                <button
                  onClick={() => { setMenuOpen(false); onDeactivate(); }}
                  className="flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-muted transition-colors"
                >
                  <UserX className="w-3.5 h-3.5" /> Deactivate
                </button>
              )}
              <div className="h-px bg-border my-1" />
              <button
                onClick={() => { setMenuOpen(false); onDelete(); }}
                className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-destructive hover:bg-destructive-muted transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Remove
              </button>
            </div>
          </>
        )}
      </td>
    </tr>
  );
}
