import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { JobActionMenu } from "@/components/jobs/JobActionMenu";
import { MapPin, Users, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

export function CardView({ jobs, isLoading, ...actions }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {jobs.map((job: any) => (
        <Card key={job.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <Badge variant="outline" className="capitalize">
                {job.jobType.replace("_", " ")}
              </Badge>
              <h3 className="font-semibold leading-none tracking-tight">{job.title}</h3>
            </div>
            
            {/* CARD MEIN YAHAN USE HOGA */}
            <JobActionMenu job={job} {...actions} />
          </CardHeader>
          
          <CardContent>
            <div className="flex items-center text-sm text-muted-foreground gap-1">
              <MapPin className="w-3.5 h-3.5" /> {job.location}
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between border-t pt-4">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="w-3.5 h-3.5" /> {job.applicationCount} Apps
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" /> {formatDate(job.createdAt)}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}