'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import {
  Shield, Plus, Trash2, Copy, Edit2, ChevronRight,
  Check, X, Loader2, Users, Lock, Info,
} from 'lucide-react';
import { rolesApi } from '@/lib/api';
import { queryKeys } from '@/lib/query-keys';
import { cn } from '@/lib/utils';
import type { Role, Permission, PermissionKey } from '@/types';

// ─── Permission Keys grouped by resource ─────────────────────────
const PERMISSION_GROUPS: { label: string; keys: PermissionKey[] }[] = [
  { label: 'Users & Team', keys: ['users', 'roles'] },
  { label: 'Jobs', keys: ['jobs'] },
  { label: 'Candidates', keys: ['candidates', 'applications', 'files'] },
  { label: 'Interviews & Offers', keys: ['interviews', 'offers'] },
  { label: 'Clients & Contracts', keys: ['clients', 'contracts'] },
  { label: 'Organization', keys: ['departments'] },
  { label: 'Reports & Export', keys: ['reports', 'export'] },
  { label: 'Settings', keys: ['email_templates', 'pipeline', 'custom_fields', 'api_keys', 'webhooks', 'approvals'] },
];

const CRUD = ['canCreate', 'canRead', 'canUpdate', 'canDelete'] as const;
type CrudKey = typeof CRUD[number];

const CRUD_LABELS: Record<CrudKey, string> = {
  canCreate: 'Create',
  canRead: 'Read',
  canUpdate: 'Update',
  canDelete: 'Delete',
};

// ─── Form schema ──────────────────────────────────────────────────
const roleSchema = z.object({
  name: z.string().min(2, 'Role name must be at least 2 characters').max(50),
});
type RoleForm = z.infer<typeof roleSchema>;

type PermissionMap = Record<string, Record<CrudKey, boolean>>;

export default function RolesPage() {
  const qc = useQueryClient();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [permMap, setPermMap] = useState<PermissionMap>({});
  const [permDirty, setPermDirty] = useState(false);

  // ── Queries ──────────────────────────────────────────────────────
  const { data: roles = [], isLoading } = useQuery({
    queryKey: queryKeys.roles.list(),
    queryFn: rolesApi.list,
  });

  const { data: allKeys = [] } = useQuery({
    queryKey: queryKeys.roles.permissions(),
    queryFn: rolesApi.allPermissionKeys,
  });

  // ── When a role is selected, build permMap from its permissions ──
  const selectRole = (role: Role) => {
    setSelectedRole(role);
    setPermDirty(false);
    const map: PermissionMap = {};
    // init all keys to false
    for (const g of PERMISSION_GROUPS) {
      for (const key of g.keys) {
        map[key] = { canCreate: false, canRead: false, canUpdate: false, canDelete: false };
      }
    }
    // fill from role permissions
    for (const p of role.permissions ?? []) {
      map[p.permissionKey] = {
        canCreate: p.canCreate,
        canRead: p.canRead,
        canUpdate: p.canUpdate,
        canDelete: p.canDelete,
      };
    }
    setPermMap(map);
  };

  // ── Create Role ───────────────────────────────────────────────────
  const { register, handleSubmit, reset, formState: { errors } } = useForm<RoleForm>({
    resolver: zodResolver(roleSchema),
  });

  const createMutation = useMutation({
    mutationFn: (data: RoleForm) => rolesApi.create({ name: data.name }),
    onSuccess: (role) => {
      qc.invalidateQueries({ queryKey: queryKeys.roles.list() });
      toast.success(`Role "${role.name}" created`);
      reset();
      setCreateOpen(false);
      selectRole(role);
    },
    onError: () => toast.error('Failed to create role'),
  });

  // ── Save Permissions ──────────────────────────────────────────────
  const saveMutation = useMutation({
    mutationFn: (permissions: Partial<Permission>[]) =>
      rolesApi.updatePermissions(selectedRole!.id, permissions),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.roles.list() });
      toast.success('Permissions saved');
      setPermDirty(false);
    },
    onError: () => toast.error('Failed to save permissions'),
  });

  const handleSavePermissions = () => {
    const permissions: Partial<Permission>[] = Object.entries(permMap).map(([key, crud]) => ({
      permissionKey: key,
      ...crud,
    }));
    saveMutation.mutate(permissions);
  };

  // ── Delete Role ───────────────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: (id: string) => rolesApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.roles.list() });
      toast.success('Role deleted');
      setSelectedRole(null);
    },
    onError: () => toast.error('Cannot delete role with assigned users'),
  });

  // ── Duplicate Role ────────────────────────────────────────────────
  const duplicateMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      rolesApi.duplicate(id, `${name} (Copy)`),
    onSuccess: (role) => {
      qc.invalidateQueries({ queryKey: queryKeys.roles.list() });
      toast.success(`Role duplicated as "${role.name}"`);
      selectRole(role);
    },
    onError: () => toast.error('Failed to duplicate role'),
  });

  // ── Toggle single CRUD bit ────────────────────────────────────────
  const togglePerm = (key: string, crud: CrudKey) => {
    if (selectedRole?.isSystem) return;
    setPermMap((prev) => ({
      ...prev,
      [key]: { ...prev[key], [crud]: !prev[key]?.[crud] },
    }));
    setPermDirty(true);
  };

  // ── Toggle entire row (all CRUD for one key) ──────────────────────
  const toggleRow = (key: string) => {
    if (selectedRole?.isSystem) return;
    const all = CRUD.every((c) => permMap[key]?.[c]);
    setPermMap((prev) => ({
      ...prev,
      [key]: { canCreate: !all, canRead: !all, canUpdate: !all, canDelete: !all },
    }));
    setPermDirty(true);
  };

  // ── Grant / revoke all permissions ───────────────────────────────
  const setAll = (value: boolean) => {
    if (selectedRole?.isSystem) return;
    const map: PermissionMap = {};
    for (const g of PERMISSION_GROUPS)
      for (const key of g.keys)
        map[key] = { canCreate: value, canRead: value, canUpdate: value, canDelete: value };
    setPermMap(map);
    setPermDirty(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-display font-bold flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Roles & Permissions
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Create roles and control what each role can access.
          </p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          New Role
        </button>
      </div>

      <div className="flex gap-4 h-[calc(100vh-200px)]">
        {/* ── Role List ────────────────────────────────────────────── */}
        <div className="w-64 shrink-0 flex flex-col bg-surface border border-border rounded-xl overflow-hidden">
          <div className="px-3 py-2.5 border-b border-border">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Roles</p>
          </div>

          {/* Create role inline form */}
          {createOpen && (
            <form
              onSubmit={handleSubmit((d) => createMutation.mutate(d))}
              className="p-3 border-b border-border bg-primary-muted/20"
            >
              <input
                {...register('name')}
                placeholder="Role name…"
                autoFocus
                className="w-full h-8 px-2.5 text-sm rounded-lg border border-border bg-background
                           focus:outline-none focus:ring-1 focus:ring-primary"
              />
              {errors.name && (
                <p className="text-[10px] text-destructive mt-1">{errors.name.message}</p>
              )}
              <div className="flex gap-1.5 mt-2">
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="flex-1 h-7 rounded bg-primary text-primary-foreground text-xs font-medium
                             hover:opacity-90 flex items-center justify-center gap-1"
                >
                  {createMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => { setCreateOpen(false); reset(); }}
                  className="h-7 w-7 rounded bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </form>
          )}

          <div className="flex-1 overflow-y-auto py-1">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="mx-2 my-1 h-12 skeleton" />
                ))
              : roles.map((role) => (
                  <RoleListItem
                    key={role.id}
                    role={role}
                    active={selectedRole?.id === role.id}
                    onClick={() => selectRole(role)}
                    onDuplicate={() => duplicateMutation.mutate({ id: role.id, name: role.name })}
                    onDelete={() => {
                      if (confirm(`Delete role "${role.name}"? This cannot be undone.`)) {
                        deleteMutation.mutate(role.id);
                      }
                    }}
                  />
                ))}
          </div>
        </div>

        {/* ── Permission Matrix ─────────────────────────────────────── */}
        <div className="flex-1 flex flex-col bg-surface border border-border rounded-xl overflow-hidden">
          {selectedRole ? (
            <>
              {/* Permission Header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-border shrink-0">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm">{selectedRole.name}</h3>
                    {selectedRole.isSystem && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-warning-muted text-warning text-[10px] font-medium">
                        <Lock className="w-2.5 h-2.5" />
                        System
                      </span>
                    )}
                  </div>
                  {selectedRole.isSystem && (
                    <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
                      <Info className="w-3 h-3" />
                      System roles cannot be edited
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {!selectedRole.isSystem && (
                    <>
                      <button
                        onClick={() => setAll(true)}
                        className="text-xs text-primary hover:underline"
                      >
                        Grant All
                      </button>
                      <span className="text-border">·</span>
                      <button
                        onClick={() => setAll(false)}
                        className="text-xs text-muted-foreground hover:text-foreground"
                      >
                        Revoke All
                      </button>
                    </>
                  )}
                  {permDirty && !selectedRole.isSystem && (
                    <button
                      onClick={handleSavePermissions}
                      disabled={saveMutation.isPending}
                      className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-primary text-primary-foreground
                                 text-xs font-medium hover:opacity-90 disabled:opacity-60 transition-opacity"
                    >
                      {saveMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                      Save Changes
                    </button>
                  )}
                </div>
              </div>

              {/* Matrix Table */}
              <div className="flex-1 overflow-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-surface border-b border-border z-10">
                    <tr>
                      <th className="text-left px-5 py-2.5 text-xs font-semibold text-muted-foreground w-48">
                        Resource
                      </th>
                      {CRUD.map((c) => (
                        <th key={c} className="px-3 py-2.5 text-xs font-semibold text-muted-foreground text-center w-24">
                          {CRUD_LABELS[c]}
                        </th>
                      ))}
                      <th className="px-3 py-2.5 text-xs font-semibold text-muted-foreground text-center w-20">
                        All
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {PERMISSION_GROUPS.map((group) => (
                      <>
                        {/* Group header row */}
                        <tr key={`g-${group.label}`} className="bg-muted/40">
                          <td colSpan={6} className="px-5 py-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                              {group.label}
                            </span>
                          </td>
                        </tr>
                        {/* Permission rows */}
                        {group.keys.map((key) => {
                          const rowPerms = permMap[key] ?? { canCreate: false, canRead: false, canUpdate: false, canDelete: false };
                          const allChecked = CRUD.every((c) => rowPerms[c]);
                          const someChecked = CRUD.some((c) => rowPerms[c]);
                          return (
                            <tr key={key} className="hover:bg-muted/30 transition-colors group">
                              <td className="px-5 py-2.5">
                                <span className="text-sm capitalize">{key.replace(/_/g, ' ')}</span>
                              </td>
                              {CRUD.map((crud) => (
                                <td key={crud} className="px-3 py-2.5 text-center">
                                  <PermCheckbox
                                    checked={rowPerms[crud]}
                                    onChange={() => togglePerm(key, crud)}
                                    disabled={selectedRole.isSystem}
                                  />
                                </td>
                              ))}
                              {/* Row toggle */}
                              <td className="px-3 py-2.5 text-center">
                                <button
                                  onClick={() => toggleRow(key)}
                                  disabled={selectedRole.isSystem}
                                  className={cn(
                                    'w-8 h-4 rounded-full transition-colors relative shrink-0',
                                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                                    allChecked ? 'bg-primary' : someChecked ? 'bg-primary/40' : 'bg-muted',
                                    selectedRole.isSystem && 'opacity-40 cursor-not-allowed',
                                  )}
                                >
                                  <span className={cn(
                                    'absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-all',
                                    allChecked ? 'left-[18px]' : 'left-0.5',
                                  )} />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-muted-foreground">
              <Shield className="w-12 h-12 opacity-20" />
              <p className="text-sm">Select a role to manage permissions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Role List Item ───────────────────────────────────────────────
function RoleListItem({
  role, active, onClick, onDuplicate, onDelete,
}: {
  role: Role; active: boolean;
  onClick: () => void; onDuplicate: () => void; onDelete: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div
      className={cn(
        'relative mx-2 my-0.5 rounded-lg px-3 py-2.5 cursor-pointer transition-colors group',
        active ? 'bg-primary-muted' : 'hover:bg-muted',
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <p className={cn('text-sm font-medium truncate', active && 'text-primary')}>{role.name}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            {role.isSystem && (
              <span className="text-[9px] bg-warning-muted text-warning px-1.5 py-0.5 rounded font-medium">
                SYSTEM
              </span>
            )}
            <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
              <Users className="w-2.5 h-2.5" />
              {role.userCount ?? 0}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          {!role.isSystem && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); onDuplicate(); }}
                className="p-1 rounded text-muted-foreground hover:text-foreground"
                title="Duplicate"
              >
                <Copy className="w-3 h-3" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="p-1 rounded text-muted-foreground hover:text-destructive"
                title="Delete"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Permission Checkbox ─────────────────────────────────────────
function PermCheckbox({
  checked, onChange, disabled,
}: { checked: boolean; onChange: () => void; disabled: boolean }) {
  return (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      className={cn(
        'w-5 h-5 rounded flex items-center justify-center transition-all border',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        checked
          ? 'bg-primary border-primary text-primary-foreground'
          : 'bg-background border-border text-transparent',
        disabled && 'opacity-40 cursor-not-allowed',
      )}
    >
      <Check className="w-3 h-3" />
    </button>
  );
}
