'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Building2, Plus, Search, MoreHorizontal,
  Phone, Mail, MapPin, ChevronRight, Eye, Edit2,
  Trash2, Users, Briefcase, TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Button, Badge, Card, Avatar, EmptyState, PageHeader,
} from '@/components/ui/primitives';

// ─── Mock Data ────────────────────────────────────────────────────
const MOCK_CLIENTS = [
  {
    id: '1', companyName: 'TechCorp Solutions', industry: 'Technology',
    status: 'active', accountManager: 'Priya Sharma',
    contactName: 'Rahul Mehta', email: 'rahul@techcorp.com', phone: '+91 98765 43210',
    location: 'Bangalore', activeJobs: 4, totalPlacements: 12,
    revenue: '₹8.4L', since: 'Jan 2024',
  },
  {
    id: '2', companyName: 'FinServe India', industry: 'Finance',
    status: 'active', accountManager: 'Anjali Singh',
    contactName: 'Vikram Patel', email: 'vikram@finserve.in', phone: '+91 87654 32109',
    location: 'Mumbai', activeJobs: 2, totalPlacements: 7,
    revenue: '₹3.2L', since: 'Mar 2024',
  },
  {
    id: '3', companyName: 'HealthPlus Clinics', industry: 'Healthcare',
    status: 'prospect', accountManager: 'Rohan Das',
    contactName: 'Dr. Sunita Roy', email: 'sunita@healthplus.com', phone: '+91 76543 21098',
    location: 'Delhi', activeJobs: 0, totalPlacements: 0,
    revenue: '—', since: 'Jun 2024',
  },
  {
    id: '4', companyName: 'EduTech Ventures', industry: 'Education',
    status: 'inactive', accountManager: 'Priya Sharma',
    contactName: 'Arjun Kapoor', email: 'arjun@edutech.com', phone: '+91 65432 10987',
    location: 'Hyderabad', activeJobs: 0, totalPlacements: 3,
    revenue: '₹1.1L', since: 'Nov 2023',
  },
  {
    id: '5', companyName: 'Logistic Masters', industry: 'Logistics',
    status: 'active', accountManager: 'Anjali Singh',
    contactName: 'Meena Iyer', email: 'meena@logmasters.com', phone: '+91 54321 09876',
    location: 'Chennai', activeJobs: 3, totalPlacements: 9,
    revenue: '₹5.7L', since: 'Feb 2024',
  },
];

const STATUS_VARIANTS: Record<string, 'success' | 'secondary' | 'warning'> = {
  active:   'success',
  inactive: 'secondary',
  prospect: 'warning',
};

const STATUSES = ['all', 'active', 'prospect', 'inactive'];
const INDUSTRIES = ['All', 'Technology', 'Finance', 'Healthcare', 'Education', 'Logistics'];

export default function ClientsPage() {
  const [search, setSearch]       = useState('');
  const [status, setStatus]       = useState('all');
  const [industry, setIndustry]   = useState('All');
  const [view, setView]           = useState<'table' | 'grid'>('table');
  const [menuOpen, setMenuOpen]   = useState<string | null>(null);

  const filtered = MOCK_CLIENTS.filter((c) => {
    const matchSearch   = !search || c.companyName.toLowerCase().includes(search.toLowerCase()) || c.contactName.toLowerCase().includes(search.toLowerCase());
    const matchStatus   = status === 'all' || c.status === status;
    const matchIndustry = industry === 'All' || c.industry === industry;
    return matchSearch && matchStatus && matchIndustry;
  });

  // Stats
  const activeCount   = MOCK_CLIENTS.filter((c) => c.status === 'active').length;
  const prospectCount = MOCK_CLIENTS.filter((c) => c.status === 'prospect').length;
  const totalJobs     = MOCK_CLIENTS.reduce((s, c) => s + c.activeJobs, 0);

  return (
    <div className="space-y-6 animate-[fade-in_0.3s_ease-out]">

      {/* Header */}
      <PageHeader title="Clients" description={`${MOCK_CLIENTS.length} total clients`}>
        <Link href="/dashboard/clients/new">
          <Button>
            <Plus className="w-4 h-4" /> New Client
          </Button>
        </Link>
      </PageHeader>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Active Clients',    value: activeCount,   icon: Building2,   color: 'text-[hsl(var(--success))]',  bg: 'bg-[hsl(var(--success-muted))]'  },
          { label: 'Prospects',         value: prospectCount, icon: TrendingUp,   color: 'text-[hsl(var(--warning))]',  bg: 'bg-[hsl(var(--warning-muted))]'  },
          { label: 'Open Positions',    value: totalJobs,     icon: Briefcase,   color: 'text-[hsl(var(--primary))]',  bg: 'bg-[hsl(var(--primary-muted))]'  },
          { label: 'Total Clients',     value: MOCK_CLIENTS.length, icon: Users, color: 'text-[hsl(var(--muted-foreground))]', bg: 'bg-[hsl(var(--muted))]' },
        ].map((s) => (
          <Card key={s.label} className="p-4 flex items-center gap-3">
            <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center shrink-0', s.bg)}>
              <s.icon className={cn('w-4 h-4', s.color)} />
            </div>
            <div>
              <p className="text-xl font-bold">{s.value}</p>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">{s.label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[hsl(var(--muted-foreground))]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clients…"
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--card))]
                       text-sm placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none
                       focus:ring-2 focus:ring-[hsl(var(--ring))]"
          />
        </div>

        {/* Status tabs */}
        <div className="flex gap-1 bg-[hsl(var(--muted))] p-1 rounded-lg">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={cn(
                'px-3 h-7 rounded-md text-xs font-medium capitalize transition-colors',
                status === s ? 'bg-[hsl(var(--card))] shadow-sm text-[hsl(var(--foreground))]'
                             : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]',
              )}
            >
              {s === 'all' ? 'All' : s}
            </button>
          ))}
        </div>

        {/* Industry filter */}
        <select
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className="h-9 px-3 rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--card))] text-sm
                     focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] cursor-pointer"
        >
          {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
        </select>
      </div>

      {/* Table */}
      <Card>
        {filtered.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="No clients found"
            description="Try adjusting your search or filters"
            action={
              <Link href="/dashboard/clients/new">
                <Button size="sm"><Plus className="w-3.5 h-3.5" /> Add Client</Button>
              </Link>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-[hsl(var(--border))] bg-[hsl(var(--muted))]/40">
                <tr>
                  {['Client', 'Industry', 'Contact', 'Status', 'Active Jobs', 'Placements', 'Revenue', ''].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[hsl(var(--muted-foreground))] whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[hsl(var(--border))]">
                {filtered.map((client) => (
                  <tr key={client.id} className="hover:bg-[hsl(var(--muted))]/30 transition-colors group">
                    {/* Client */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar name={client.companyName} size="sm" />
                        <div>
                          <p className="font-medium text-[hsl(var(--foreground))] leading-none">{client.companyName}</p>
                          <p className="text-[11px] text-[hsl(var(--muted-foreground))] mt-0.5 flex items-center gap-1">
                            <MapPin className="w-2.5 h-2.5" />{client.location}
                          </p>
                        </div>
                      </div>
                    </td>
                    {/* Industry */}
                    <td className="px-4 py-3.5 text-[hsl(var(--muted-foreground))]">{client.industry}</td>
                    {/* Contact */}
                    <td className="px-4 py-3.5">
                      <p className="font-medium text-xs">{client.contactName}</p>
                      <p className="text-[11px] text-[hsl(var(--muted-foreground))] flex items-center gap-1 mt-0.5">
                        <Mail className="w-2.5 h-2.5" />{client.email}
                      </p>
                    </td>
                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <Badge variant={STATUS_VARIANTS[client.status]} className="capitalize">
                        {client.status}
                      </Badge>
                    </td>
                    {/* Active Jobs */}
                    <td className="px-4 py-3.5 text-center">
                      <span className="font-semibold text-[hsl(var(--primary))]">{client.activeJobs}</span>
                    </td>
                    {/* Placements */}
                    <td className="px-4 py-3.5 text-center text-[hsl(var(--muted-foreground))]">
                      {client.totalPlacements}
                    </td>
                    {/* Revenue */}
                    <td className="px-4 py-3.5 font-medium text-[hsl(var(--success))]">{client.revenue}</td>
                    {/* Actions */}
                    <td className="px-4 py-3.5 relative">
                      <button
                        onClick={() => setMenuOpen(menuOpen === client.id ? null : client.id)}
                        className="h-7 w-7 rounded flex items-center justify-center text-[hsl(var(--muted-foreground))]
                                   hover:bg-[hsl(var(--muted))] opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      {menuOpen === client.id && (
                        <>
                          <div className="fixed inset-0 z-20" onClick={() => setMenuOpen(null)} />
                          <div className="absolute right-4 top-8 z-30 w-40 bg-[hsl(var(--card))] border border-[hsl(var(--border))]
                                          rounded-lg shadow-lg py-1 animate-[fade-in_0.15s_ease-out]">
                            <MenuBtn icon={Eye}   label="View Details" onClick={() => setMenuOpen(null)} />
                            <MenuBtn icon={Edit2} label="Edit Client"  onClick={() => setMenuOpen(null)} />
                            <div className="h-px bg-[hsl(var(--border))] my-1" />
                            <MenuBtn icon={Trash2} label="Delete" onClick={() => setMenuOpen(null)} danger />
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        {filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-[hsl(var(--border))] flex items-center justify-between">
            <p className="text-xs text-[hsl(var(--muted-foreground))]">
              Showing {filtered.length} of {MOCK_CLIENTS.length} clients
            </p>
            <div className="flex items-center gap-1">
              <button className="h-7 w-7 rounded border border-[hsl(var(--border))] flex items-center justify-center
                                 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] text-xs disabled:opacity-40" disabled>
                ‹
              </button>
              <span className="text-xs px-2">1 / 1</span>
              <button className="h-7 w-7 rounded border border-[hsl(var(--border))] flex items-center justify-center
                                 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] text-xs disabled:opacity-40" disabled>
                ›
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

function MenuBtn({ icon: Icon, label, onClick, danger }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string; onClick: () => void; danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 w-full px-3 py-1.5 text-xs transition-colors',
        danger ? 'text-[hsl(var(--destructive))] hover:bg-[hsl(var(--destructive-muted))]'
               : 'text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]',
      )}
    >
      <Icon className="w-3.5 h-3.5" /> {label}
    </button>
  );
}
