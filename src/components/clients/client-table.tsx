import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, Mail, Search } from "lucide-react";
import { ClientActions } from "./client-actions";
import { cn } from "@/lib/utils";

// TypeScript Interface for Client
interface Client {
  id: string;
  companyName: string;
  industry: string;
  status: string;
  contactName: string;
  email: string;
  location: string;
  activeJobs: number;
  revenue: string;
}

interface ClientTableProps {
  data: Client[];
}

export function ClientTable({ data }: ClientTableProps) {
  return (
    <Card className="rounded-[2.5rem] border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden bg-white">
      <Table>
        <TableHeader className="bg-slate-50/50">
          <TableRow className="hover:bg-transparent border-slate-100">
            <TableHead className="w-[300px] px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Client</TableHead>
            <TableHead className="px-6 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Primary Contact</TableHead>
            <TableHead className="px-6 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Status</TableHead>
            <TableHead className="px-6 py-5 text-xs font-black uppercase tracking-widest text-slate-400 text-center">Active Jobs</TableHead>
            <TableHead className="px-6 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Revenue</TableHead>
            <TableHead className="text-right px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Actions</TableHead>
          </TableRow>
        </TableHeader>
        
        <TableBody>
          {data.map((client) => (
            <TableRow 
              key={client.id} 
              className="group border-slate-50 hover:bg-blue-50/40 transition-all duration-300"
            >
              {/* Client Info */}
              <TableCell className="px-8 py-5">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 rounded-2xl shadow-sm border-2 border-white">
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-800 text-white font-black text-lg">
                      {client.companyName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <p className="font-black text-slate-900 tracking-tight leading-none text-base">
                      {client.companyName}
                    </p>
                    <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-tighter">
                      <MapPin size={10} className="text-blue-500" /> {client.location}
                    </p>
                  </div>
                </div>
              </TableCell>

              {/* Contact Info */}
              <TableCell className="px-6 py-5">
                <div className="space-y-1">
                  <p className="font-bold text-slate-800 text-sm">{client.contactName}</p>
                  <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                    <Mail size={12} className="text-slate-300" /> {client.email}
                  </p>
                </div>
              </TableCell>

              {/* Status Badge */}
              <TableCell className="px-6 py-5">
                <Badge 
                  variant="outline"
                  className={cn(
                    "rounded-lg px-3 py-1 text-[10px] font-black uppercase tracking-widest border-2 transition-all",
                    client.status === 'active' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                    client.status === 'prospect' ? "bg-orange-50 text-orange-600 border-orange-100" :
                    "bg-slate-50 text-slate-400 border-slate-100"
                  )}
                >
                  {client.status}
                </Badge>
              </TableCell>

              {/* Job Count */}
              <TableCell className="px-6 py-5 text-center">
                <span className="inline-flex items-center justify-center h-9 w-9 rounded-xl bg-slate-100 text-slate-900 font-black text-sm group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-inner">
                  {client.activeJobs}
                </span>
              </TableCell>

              {/* Revenue (Currency) */}
              <TableCell className="px-6 py-5">
                <div className="flex items-center gap-1 font-black text-slate-900 text-base italic">
                  <span className="text-blue-600">₹</span>
                  {client.revenue === '—' ? '0.00' : client.revenue.replace('₹', '')}
                </div>
              </TableCell>

              {/* Actions Dropdown */}
              <TableCell className="text-right px-8 py-5">
                <ClientActions id={client.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Empty State Logic inside the component */}
      {data.length === 0 && (
        <div className="py-24 text-center flex flex-col items-center justify-center space-y-4">
           <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200">
              <Search size={40} />
           </div>
           <div className="space-y-1">
             <h3 className="text-lg font-black text-slate-900">No Partners Found</h3>
             <p className="text-slate-400 font-medium">Try adjusting your filters or search terms.</p>
           </div>
        </div>
      )}
    </Card>
  );
}