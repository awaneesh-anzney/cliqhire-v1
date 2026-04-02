import { MoreHorizontal, Eye, Edit2, Copy, CheckCircle2, XCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export function JobActionMenu({ job, onPublish, onClose, onDelete, onDuplicate }: any) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem asChild>
          <Link href={`/dashboard/jobs/${job.id}`} className="flex items-center gap-2">
            <Eye className="w-4 h-4" /> View Details
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/dashboard/jobs/${job.id}/edit`} className="flex items-center gap-2">
            <Edit2 className="w-4 h-4" /> Edit
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDuplicate(job.id)} className="flex items-center gap-2">
          <Copy className="w-4 h-4" /> Duplicate
        </DropdownMenuItem>
        
        {job.status === "draft" && (
          <DropdownMenuItem onClick={() => onPublish(job.id)} className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Publish
          </DropdownMenuItem>
        )}
        
        {job.status === "published" && (
          <DropdownMenuItem onClick={() => onClose(job.id)} className="flex items-center gap-2">
            <XCircle className="w-4 h-4" /> Close Job
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => onDelete(job.id)} 
          className="flex items-center gap-2 text-destructive focus:text-destructive"
        >
          <Trash2 className="w-4 h-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}