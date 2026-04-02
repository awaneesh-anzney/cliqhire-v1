import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { JobActionMenu } from "@/components/jobs/JobActionMenu"; 
import { MapPin, Users } from "lucide-react";
import { formatDate, statusColors } from "@/lib/utils";

export function TableView({ jobs, isLoading, ...actions }: any) {
  if (isLoading) return <div>Loading jobs...</div>;

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[300px]">Job Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Applications</TableHead>
            <TableHead className="hidden lg:table-cell">Posted Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job: any) => (
            <TableRow key={job.id} className="group">
              <TableCell>
                <div className="font-medium">{job.title}</div>
                <div className="flex items-center text-xs text-muted-foreground gap-1">
                  <MapPin className="w-3 h-3" /> {job.location}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className={statusColors(job.status)}>
                  {job.status.replace("_", " ")}
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <div className="flex items-center gap-1 text-sm">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  {job.applicationCount}
                </div>
              </TableCell>
              <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                {formatDate(job.createdAt)}
              </TableCell>
              <TableCell className="text-right">
                {/* YAHAN USE HOGA ACTION MENU */}
                <JobActionMenu job={job} {...actions} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}