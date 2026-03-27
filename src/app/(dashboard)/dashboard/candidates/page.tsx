'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
  UserCircle, Plus, Search, MoreHorizontal, Eye, Trash2,
  ChevronLeft, ChevronRight, Upload,
} from 'lucide-react';
import { candidatesApi } from '@/lib/api';
import { queryKeys } from '@/lib/query-keys';
import { cn, formatDate, statusColors, getInitials } from '@/lib/utils';
import type { Candidate, ListQueryParams } from '@/types';

const STATUSES = ['all', 'active', 'inactive', 'blacklisted'];

export default function CandidatesPage() {
  const qc = useQueryClient();
  const [params, setParams] = useState<ListQueryParams & { status?: string }>({
    page: 1, limit: 20, status: 'all', search: '',
  });
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.candidates.list(params),
    queryFn: () => candidatesApi.list({
      ...params,
      status: params.status === 'all' ? undefined : params.status,
    }),
    placeholderData: (prev) => prev,
  });

  const deleteMutation = useMutation({
    mutationFn: candidatesApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.candidates.all });
      toast.success('Candidate removed');
    },
    onError: () => toast.error('Failed to delete candidate'),
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
            <UserCircle className="w-5 h-5 text-primary" /> Candidates
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">{data?.total ?? 0} total candidates</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 h-9 px-3 rounded-lg bg-surface border border-border text-sm hover:bg-muted transition-colors">
            <Upload className="w-4 h-4" /> Import
          </button>
          <Link
            href="/dashboard/candidates/new"
            className="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" /> Add Candidate
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, skill…"
            className="w-full h-9 pl-9 pr-3 rounded-lg bg-surface border border-border text-sm
                       placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </form>
        <div className="flex gap-1 bg-muted p-1 rounded-lg">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setParams((p) => ({ ...p, status: s, page: 1 }))}
              className={cn(
                'px-3 h-7 rounded-md text-xs font-medium capitalize whitespace-nowrap transition-colors',
                params.status === s ? 'bg-surface text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {s === 'all' ? 'All' : s}
            </button>
          ))}
        </div>
      </div>

      {/* Candidate Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-36 skeleton rounded-xl" />
          ))}
        </div>
      ) : data?.data?.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {data.data.map((c) => (
            <CandidateCard
              key={c.id}
              candidate={c}
              onDelete={() => {
                if (confirm('Remove this candidate?')) deleteMutation.mutate(c.id);
              }}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-surface border border-border rounded-xl">
          <UserCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No candidates found</p>
          <Link href="/dashboard/candidates/new" className="text-xs text-primary hover:underline mt-1 inline-block">
            Add your first candidate →
          </Link>
        </div>
      )}

      {/* Pagination */}
      {(data?.totalPages ?? 0) > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {((params.page! - 1) * params.limit!) + 1}–{Math.min(params.page! * params.limit!, data!.total)} of {data!.total}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setParams((p) => ({ ...p, page: p.page! - 1 }))}
              disabled={params.page === 1}
              className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-surface border border-border disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs px-3">{params.page} / {data?.totalPages}</span>
            <button
              onClick={() => setParams((p) => ({ ...p, page: p.page! + 1 }))}
              disabled={params.page === data?.totalPages}
              className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-surface border border-border disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function CandidateCard({ candidate: c, onDelete }: { candidate: Candidate; onDelete: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="bg-surface border border-border rounded-xl p-4 hover:shadow-md transition-all group relative">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-muted text-primary text-sm font-bold
                          flex items-center justify-center shrink-0">
            {getInitials(c.fullName)}
          </div>
          <div className="min-w-0">
            <Link
              href={`/dashboard/candidates/${c.id}`}
              className="font-medium text-sm hover:text-primary transition-colors block truncate"
            >
              {c.fullName}
            </Link>
            <p className="text-xs text-muted-foreground truncate">{c.email}</p>
          </div>
        </div>

        <div className="relative">
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
              <div className="absolute right-0 top-8 z-30 w-36 bg-surface border border-border rounded-lg shadow-lg py-1 animate-fade-in">
                <Link
                  href={`/dashboard/candidates/${c.id}`}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-muted transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <Eye className="w-3.5 h-3.5" /> View Profile
                </Link>
                <button
                  onClick={() => { setMenuOpen(false); onDelete(); }}
                  className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-destructive hover:bg-destructive-muted transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="space-y-1.5">
        {c.currentTitle && (
          <p className="text-xs text-muted-foreground truncate">
            {c.currentTitle}{c.currentCompany ? ` @ ${c.currentCompany}` : ''}
          </p>
        )}
        <div className="flex items-center justify-between">
          <span className={cn(
            'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium capitalize',
            statusColors[c.status],
          )}>
            {c.status}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {c.applicationCount ?? 0} applications
          </span>
        </div>
        {c.skills?.length ? (
          <div className="flex gap-1 flex-wrap mt-1">
            {c.skills.slice(0, 3).map((s) => (
              <span key={s} className="px-1.5 py-0.5 bg-muted rounded text-[9px] text-muted-foreground">
                {s}
              </span>
            ))}
            {c.skills.length > 3 && (
              <span className="px-1.5 py-0.5 bg-muted rounded text-[9px] text-muted-foreground">
                +{c.skills.length - 3}
              </span>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
