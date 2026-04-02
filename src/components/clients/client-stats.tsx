import { Card, CardContent } from "@/components/ui/card";
import { Building2, TrendingUp, Briefcase, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsProps {
  activeCount: number;
  prospectCount: number;
  totalJobs: number;
  totalClients: number;
}

export function ClientStats({ activeCount, prospectCount, totalJobs, totalClients }: StatsProps) {
  const stats = [
    { label: 'Active Clients', value: activeCount, icon: Building2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Prospects', value: prospectCount, icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Open Positions', value: totalJobs, icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Clients', value: totalClients, icon: Users, color: 'text-slate-600', bg: 'bg-slate-100' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <Card key={s.label} className="border-none shadow-sm bg-card/50 backdrop-blur">
          <CardContent className="p-6 flex items-center gap-4">
            <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center shrink-0', s.bg)}>
              <s.icon className={cn('w-6 h-6', s.color)} />
            </div>
            <div>
              <p className="text-2xl font-black tracking-tight">{s.value}</p>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{s.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}