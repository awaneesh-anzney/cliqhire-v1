'use client';

import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Components
import { ClientStats } from '@/components/clients/client-stats';
import { ClientTable } from '@/components/clients/client-table';

export default function ClientsPage() {

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');


  const MOCK_CLIENTS = [
  {
    id: '1', companyName: 'TechCorp Solutions', industry: 'Technology',
    status: 'active', accountManager: 'Priya Sharma',
    contactName: 'Rahul Mehta', email: 'rahul@techcorp.com', phone: '+91 98765 43210',
    location: 'Bangalore', activeJobs: 4, totalPlacements: 12,
    revenue: '₹8.4L', since: 'Jan 2024',
  },
  // ... baaki objects yahan daal dein
];

  // Filtering Logic
  const filteredClients = MOCK_CLIENTS.filter(client => {
    const matchesSearch = client.companyName.toLowerCase().includes(search.toLowerCase()) || 
                          client.contactName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === 'all' || client.status === status;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-8 space-y-10 max-w-[1800px] mx-auto animate-in fade-in duration-700">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-5xl font-black tracking-tighter text-slate-900">Partners</h1>
          <p className="text-lg text-slate-500 font-medium italic">Empower your recruitment ecosystem.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 h-14 px-8 rounded-2xl font-black text-base shadow-xl shadow-blue-500/20 transition-all hover:scale-105 active:scale-95">
          <Plus className="mr-2 h-6 w-6" /> Add New Partner
        </Button>
      </div>

      {/* Stats Section */}
      <ClientStats 
        activeCount={3} 
        prospectCount={1} 
        totalJobs={9} 
        totalClients={MOCK_CLIENTS.length} 
      />

      {/* Modern Filter Bar */}
      <div className="flex flex-col lg:flex-row items-center gap-4 bg-white p-5 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
          <Input 
            placeholder="Search company, industry or primary contact..." 
            className="pl-14 h-14 bg-slate-50/50 border-none rounded-2xl text-base font-medium placeholder:text-slate-300 focus-visible:ring-2 focus-visible:ring-blue-600/20"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full lg:w-[220px] h-14 rounded-2xl bg-slate-50 border-none font-black text-slate-600 px-6">
            <SelectValue placeholder="Filter Status" />
          </SelectTrigger>
          <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
            <SelectItem value="all">All Partners</SelectItem>
            <SelectItem value="active">Active Only</SelectItem>
            <SelectItem value="prospect">Prospects</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* The Extracted Table Component */}
      <ClientTable data={filteredClients} />

    </div>
  );
}