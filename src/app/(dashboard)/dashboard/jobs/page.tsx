'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
  Briefcase, Plus, Search, Filter, MoreHorizontal,
  Eye, Edit2, Copy, XCircle, Trash2, CheckCircle2,
  ChevronLeft, ChevronRight, Loader2,
} from 'lucide-react';
import { jobsApi } from '@/lib/api';
import { queryKeys } from '@/lib/query-keys';
import { cn, formatDate, statusColors, truncate } from '@/lib/utils';
import type { Job, ListQueryParams } from '@/types';

const JOB_STATUSES = ['all', 'draft', 'pending_approval', 'published', 'closed', 'archived'];

export default function JobsPage() {
  const qc = useQueryClient();
  const [params, setParams] = useState<ListQueryParams & { status?: string }>({
    page: 1, limit: 20, status: 'all', search: '',
  });
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.jobs.list(params),
    queryFn: () => jobsApi.list({
      ...params,
      status: params.status === 'all' ? undefined : params.status,
    }),
    placeholderData: (prev) => prev,
  });

  const publishMutation = useMutation({
    mutationFn: jobsApi.publish,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.jobs.all });
      toast.success('Job published');
    },
    onError: () => toast.error('Failed to publish job'),
  });

  const closeMutation = useMutation({
    mutationFn: (id: string) => jobsApi.close(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.jobs.all });
      toast.success('Job closed');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: jobsApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.jobs.all });
      toast.success('Job deleted');
    },
    onError: () => toast.error('Cannot delete job with active applications'),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setParams((p) => ({ ...p, search, page: 1 }));
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-display font-bold flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary" /> Jobs
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {data?.total ?? 0} total job postings
          </p>
        </div>
        <Link
          href="/dashboard/jobs/new"
          className="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" /> New Job
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <form onSubmit={handleSearch} className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search jobs…"
            className="w-full h-9 pl-9 pr-3 rounded-lg bg-surface border border-border text-sm
                       placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </form>

        {/* Status tabs */}
        <div className="flex gap-1 bg-muted p-1 rounded-lg overflow-x-auto">
          {JOB_STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setParams((p) => ({ ...p, status: s, page: 1 }))}
              className={cn(
                'px-3 h-7 rounded-md text-xs font-medium capitalize whitespace-nowrap transition-colors',
                params.status === s
                  ? 'bg-surface text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {s === 'all' ? 'All' : s.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/30">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Job Title</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden md:table-cell">Department</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden lg:table-cell">Type / Mode</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden sm:table-cell">Applications</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden lg:table-cell">Posted</th>
                <th className="px-4 py-3 w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 7 }).map((_, j) => (
                        <td key={j} className="px-5 py-4">
                          <div className="h-4 skeleton" />
                        </td>
                      ))}
                    </tr>
                  ))
                : data?.data?.map((job) => (
                    <JobRow
                      key={job.id}
                      job={job}
                      onPublish={() => publishMutation.mutate(job.id)}
                      onClose={() => closeMutation.mutate(job.id)}
                      onDelete={() => {
                        if (confirm('Delete this job?')) deleteMutation.mutate(job.id);
                      }}
                    />
                  ))}
            </tbody>
          </table>

          {!isLoading && !data?.data?.length && (
            <div className="py-16 text-center">
              <Briefcase className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No jobs found</p>
              <Link href="/dashboard/jobs/new" className="text-xs text-primary hover:underline mt-1 inline-block">
                Post your first job →
              </Link>
            </div>
          )}
        </div>

        {/* Pagination */}
        {(data?.totalPages ?? 0) > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Showing {((params.page! - 1) * params.limit!) + 1}–{Math.min(params.page! * params.limit!, data!.total)} of {data!.total}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setParams((p) => ({ ...p, page: p.page! - 1 }))}
                disabled={params.page === 1}
                className="h-7 w-7 rounded flex items-center justify-center text-muted-foreground
                           hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs px-2">{params.page} / {data?.totalPages}</span>
              <button
                onClick={() => setParams((p) => ({ ...p, page: p.page! + 1 }))}
                disabled={params.page === data?.totalPages}
                className="h-7 w-7 rounded flex items-center justify-center text-muted-foreground
                           hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Job Row ──────────────────────────────────────────────────────
function JobRow({ job, onPublish, onClose, onDelete }: {
  job: Job;
  onPublish: () => void;
  onClose: () => void;
  onDelete: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <tr className="hover:bg-muted/30 transition-colors group">
      <td className="px-5 py-3.5">
        <div>
          <Link href={`/dashboard/jobs/${job.id}`} className="font-medium hover:text-primary transition-colors line-clamp-1">
            {job.title}
          </Link>
          {job.location && (
            <p className="text-xs text-muted-foreground mt-0.5">{job.location}</p>
          )}
        </div>
      </td>
      <td className="px-4 py-3.5 hidden md:table-cell text-muted-foreground">
        {job.department?.name ?? '—'}
      </td>
      <td className="px-4 py-3.5 hidden lg:table-cell">
        <div className="flex flex-col gap-1">
          <span className="text-xs capitalize">{job.jobType?.replace(/_/g, ' ')}</span>
          <span className="text-xs text-muted-foreground capitalize">{job.workMode}</span>
        </div>
      </td>
      <td className="px-4 py-3.5">
        <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium capitalize',
          statusColors[job.status] ?? 'bg-muted text-muted-foreground')}>
          {job.status.replace(/_/g, ' ')}
        </span>
      </td>
      <td className="px-4 py-3.5 hidden sm:table-cell text-muted-foreground">
        {job.applicationCount ?? 0}
      </td>
      <td className="px-4 py-3.5 hidden lg:table-cell text-muted-foreground">
        {formatDate(job.createdAt)}
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
            <div className="absolute right-4 top-8 z-30 w-44 bg-surface border border-border rounded-lg shadow-lg
                            py-1 animate-fade-in overflow-hidden">
              <MenuItem href={`/dashboard/jobs/${job.id}`} icon={Eye} label="View" onClick={() => setMenuOpen(false)} />
              <MenuItem href={`/dashboard/jobs/${job.id}/edit`} icon={Edit2} label="Edit" onClick={() => setMenuOpen(false)} />
              {job.status === 'draft' && (
                <MenuItem icon={CheckCircle2} label="Publish" onClick={() => { setMenuOpen(false); onPublish(); }} />
              )}
              {job.status === 'published' && (
                <MenuItem icon={XCircle} label="Close Job" onClick={() => { setMenuOpen(false); onClose(); }} />
              )}
              <div className="h-px bg-border my-1" />
              <MenuItem icon={Trash2} label="Delete" onClick={() => { setMenuOpen(false); onDelete(); }} danger />
            </div>
          </>
        )}
      </td>
    </tr>
  );
}

function MenuItem({
  href, icon: Icon, label, onClick, danger,
}: {
  href?: string; icon: React.ComponentType<{ className?: string }>;
  label: string; onClick: () => void; danger?: boolean;
}) {
  const cls = cn(
    'flex items-center gap-2.5 w-full px-3 py-1.5 text-sm transition-colors',
    danger ? 'text-destructive hover:bg-destructive-muted' : 'text-foreground hover:bg-muted',
  );
  if (href) return (
    <Link href={href} className={cls} onClick={onClick}>
      <Icon className="w-3.5 h-3.5" /> {label}
    </Link>
  );
  return (
    <button type="button" className={cls} onClick={onClick}>
      <Icon className="w-3.5 h-3.5" /> {label}
    </button>
  );
}
