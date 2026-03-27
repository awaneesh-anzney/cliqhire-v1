'use client';

import { useQuery } from '@tanstack/react-query';
import {
  Briefcase, UserCircle, CalendarCheck, TrendingUp,
  Users, Award, Clock, ArrowUpRight, ArrowDownRight,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { reportsApi } from '@/lib/api';
import { queryKeys } from '@/lib/query-keys';
import { useAuthStore } from '@/store/auth.store';
import { cn, timeAgo, getInitials } from '@/lib/utils';

const COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);

  const { data: stats, isLoading } = useQuery({
    queryKey: queryKeys.reports.dashboard(),
    queryFn: reportsApi.dashboard,
  });

  const statCards = [
    {
      label: 'Active Jobs',
      value: stats?.activeJobs ?? 0,
      icon: Briefcase,
      color: 'text-primary',
      bg: 'bg-primary-muted',
      trend: +12,
    },
    {
      label: 'Total Candidates',
      value: stats?.totalCandidates ?? 0,
      icon: UserCircle,
      color: 'text-accent',
      bg: 'bg-accent-muted',
      trend: +8,
    },
    {
      label: 'Interviews Today',
      value: stats?.scheduledInterviews ?? 0,
      icon: CalendarCheck,
      color: 'text-success',
      bg: 'bg-success-muted',
      trend: +3,
    },
    {
      label: 'Hired This Month',
      value: stats?.hiredThisMonth ?? 0,
      icon: Award,
      color: 'text-warning',
      bg: 'bg-warning-muted',
      trend: -2,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold">
          Good {getGreeting()}, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Here's what's happening with your recruitment pipeline today.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} loading={isLoading} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Pipeline Funnel */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-medium text-sm">Pipeline Funnel</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Candidates by stage</p>
            </div>
          </div>
          {isLoading ? (
            <div className="h-48 skeleton" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats?.pipelineFunnel ?? mockFunnel} barSize={28}>
                <XAxis dataKey="stage" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={28} />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--surface))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Source Breakdown Pie */}
        <div className="bg-surface border border-border rounded-xl p-5">
          <div className="mb-5">
            <h3 className="font-medium text-sm">Candidate Sources</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Where they come from</p>
          </div>
          {isLoading ? (
            <div className="h-48 skeleton" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={stats?.sourceBreakdown ?? mockSources}
                  cx="50%"
                  cy="45%"
                  innerRadius={50}
                  outerRadius={75}
                  dataKey="count"
                  nameKey="source"
                >
                  {(stats?.sourceBreakdown ?? mockSources).map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: '11px' }}
                  formatter={(v) => <span style={{ color: 'hsl(var(--foreground))' }}>{v}</span>}
                />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--surface))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Activity */}
        <div className="bg-surface border border-border rounded-xl p-5">
          <h3 className="font-medium text-sm mb-4">Recent Activity</h3>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-12 skeleton" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {(stats?.recentActivity ?? mockActivity).slice(0, 6).map((item) => (
                <div key={item.id} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-primary-muted text-primary text-xs font-semibold
                                  flex items-center justify-center shrink-0 mt-0.5">
                    {getInitials(item.performedBy.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground">
                      <span className="font-medium">{item.performedBy.name}</span>
                      {' '}{formatAction(item.action, item.entityType)}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{timeAgo(item.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Metrics */}
        <div className="bg-surface border border-border rounded-xl p-5">
          <h3 className="font-medium text-sm mb-4">Key Metrics</h3>
          <div className="space-y-4">
            <Metric
              label="Avg. Time to Hire"
              value={`${stats?.timeToHireAvg ?? 0} days`}
              icon={Clock}
              color="text-primary"
              bg="bg-primary-muted"
            />
            <Metric
              label="Open Applications"
              value={stats?.openApplications ?? 0}
              icon={Users}
              color="text-accent"
              bg="bg-accent-muted"
            />
            <Metric
              label="Offers Extended"
              value={stats?.offersExtended ?? 0}
              icon={TrendingUp}
              color="text-success"
              bg="bg-success-muted"
            />
          </div>

          {/* Offer Acceptance Rate */}
          <div className="mt-5 p-4 bg-background rounded-lg border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Offer Acceptance Rate</span>
              <span className="text-xs font-semibold text-success">78%</span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full w-[78%] bg-success rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label, value, icon: Icon, color, bg, trend, loading,
}: {
  label: string; value: number; icon: React.ComponentType<{ className?: string }>;
  color: string; bg: string; trend: number; loading: boolean;
}) {
  return (
    <div className="bg-surface border border-border rounded-xl p-5 space-y-3">
      <div className="flex items-center justify-between">
        <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', bg)}>
          <Icon className={cn('w-4.5 h-4.5', color)} />
        </div>
        <div className={cn('flex items-center gap-0.5 text-xs font-medium',
          trend >= 0 ? 'text-success' : 'text-destructive')}>
          {trend >= 0
            ? <ArrowUpRight className="w-3 h-3" />
            : <ArrowDownRight className="w-3 h-3" />}
          {Math.abs(trend)}%
        </div>
      </div>
      {loading
        ? <div className="h-8 w-20 skeleton" />
        : <div className="text-2xl font-bold">{value.toLocaleString()}</div>
      }
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function Metric({
  label, value, icon: Icon, color, bg,
}: {
  label: string; value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color: string; bg: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', bg)}>
        <Icon className={cn('w-4 h-4', color)} />
      </div>
      <div className="flex-1 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-sm font-semibold">{value}</span>
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

function formatAction(action: string, entity: string) {
  return `${action.replace(/_/g, ' ')} a ${entity.replace(/_/g, ' ')}`;
}

// Mock data for visual rendering before API
const mockFunnel = [
  { stage: 'Applied', count: 142 },
  { stage: 'Screening', count: 89 },
  { stage: 'Interview', count: 54 },
  { stage: 'Offer', count: 18 },
  { stage: 'Hired', count: 12 },
];

const mockSources = [
  { source: 'LinkedIn', count: 45 },
  { source: 'Referral', count: 30 },
  { source: 'Job Board', count: 15 },
  { source: 'Direct', count: 8 },
  { source: 'Other', count: 2 },
];

const mockActivity = [
  { id: '1', action: 'moved_to_interview', entityType: 'application', performedBy: { id: '1', name: 'Priya Sharma', avatarUrl: null }, metadata: {}, createdAt: new Date(Date.now() - 300_000).toISOString() },
  { id: '2', action: 'created', entityType: 'job', performedBy: { id: '2', name: 'Rahul Mehta', avatarUrl: null }, metadata: {}, createdAt: new Date(Date.now() - 900_000).toISOString() },
  { id: '3', action: 'submitted_feedback', entityType: 'interview', performedBy: { id: '3', name: 'Anjali Singh', avatarUrl: null }, metadata: {}, createdAt: new Date(Date.now() - 1_800_000).toISOString() },
  { id: '4', action: 'extended_offer', entityType: 'offer', performedBy: { id: '4', name: 'Vikram Patel', avatarUrl: null }, metadata: {}, createdAt: new Date(Date.now() - 3_600_000).toISOString() },
];
