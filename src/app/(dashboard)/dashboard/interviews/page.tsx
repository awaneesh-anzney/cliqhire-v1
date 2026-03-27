'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  CalendarCheck, Plus, Search, MoreHorizontal,
  Video, Phone, MapPin, Clock, Users, XCircle,
} from 'lucide-react';
import { interviewsApi } from '@/lib/api';
import { queryKeys } from '@/lib/query-keys';
import { cn, formatDate, statusColors, getInitials } from '@/lib/utils';
import type { Interview } from '@/types';
import { format } from 'date-fns';

const STATUSES = ['all', 'scheduled', 'completed', 'cancelled', 'no_show'];
const MODE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  video: Video,
  phone: Phone,
  onsite: MapPin,
};

export default function InterviewsPage() {
  const qc = useQueryClient();
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.interviews.list({ status: status === 'all' ? undefined : status, search }),
    queryFn: () => interviewsApi.list({ status: status === 'all' ? undefined : status, search }),
    placeholderData: (prev) => prev,
  });

  const cancelMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      interviewsApi.cancel(id, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.interviews.list() });
      toast.success('Interview cancelled');
    },
  });

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-display font-bold flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-primary" /> Interviews
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">{data?.total ?? 0} interviews</p>
        </div>
        <button className="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> Schedule Interview
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search interviews…"
            className="w-full h-9 pl-9 pr-3 rounded-lg bg-surface border border-border text-sm
                       placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="flex gap-1 bg-muted p-1 rounded-lg">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={cn(
                'px-3 h-7 rounded-md text-xs font-medium capitalize whitespace-nowrap transition-colors',
                status === s ? 'bg-surface text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {s === 'all' ? 'All' : s.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Interview Cards */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 skeleton rounded-xl" />
          ))}
        </div>
      ) : data?.data?.length ? (
        <div className="space-y-3">
          {data.data.map((interview) => (
            <InterviewCard
              key={interview.id}
              interview={interview}
              onCancel={() => {
                const reason = prompt('Cancellation reason:');
                if (reason) cancelMutation.mutate({ id: interview.id, reason });
              }}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-surface border border-border rounded-xl">
          <CalendarCheck className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No interviews found</p>
        </div>
      )}
    </div>
  );
}

function InterviewCard({ interview: iv, onCancel }: { interview: Interview; onCancel: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const ModeIcon = MODE_ICONS[iv.mode] ?? Video;
  const scheduledDate = new Date(iv.scheduledAt);

  return (
    <div className="bg-surface border border-border rounded-xl p-4 hover:shadow-sm transition-all group">
      <div className="flex items-start gap-4">
        {/* Date block */}
        <div className="shrink-0 w-14 flex flex-col items-center bg-primary-muted rounded-lg p-2 text-center">
          <span className="text-[10px] font-semibold text-primary uppercase">
            {format(scheduledDate, 'MMM')}
          </span>
          <span className="text-2xl font-bold text-primary leading-none">
            {format(scheduledDate, 'dd')}
          </span>
          <span className="text-[10px] text-primary mt-0.5">
            {format(scheduledDate, 'EEE')}
          </span>
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-medium text-sm">
                {iv.application?.candidate?.fullName ?? 'Candidate'}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {iv.application?.job?.title ?? 'Job Position'}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={cn(
                'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium capitalize',
                statusColors[iv.status],
              )}>
                {iv.status.replace(/_/g, ' ')}
              </span>
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
                    <div className="absolute right-0 top-8 z-30 w-40 bg-surface border border-border rounded-lg shadow-lg py-1 animate-fade-in">
                      {iv.status === 'scheduled' && (
                        <button
                          onClick={() => { setMenuOpen(false); onCancel(); }}
                          className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-destructive hover:bg-destructive-muted"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Cancel
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-2.5 flex-wrap">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              {format(scheduledDate, 'h:mm a')} · {iv.durationMin} min
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground capitalize">
              <ModeIcon className="w-3.5 h-3.5" />
              {iv.mode}
            </span>
            {iv.interviewers?.length > 0 && (
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Users className="w-3.5 h-3.5" />
                {iv.interviewers.map((i) => i.name).join(', ')}
              </span>
            )}
          </div>

          {iv.meetingLink && (
            <a
              href={iv.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"
            >
              <Video className="w-3 h-3" /> Join Meeting
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
