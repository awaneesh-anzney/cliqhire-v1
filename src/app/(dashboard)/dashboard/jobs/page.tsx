"use client";

import { useState } from "react";
import { Plus, Search, Briefcase } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TableView } from "@/components/jobs/TableView";
import { CardView } from "@/components/jobs/card-view";
import { DUMMY_JOBS } from "@/Dummy-data/dummy-data"; // 

export default function JobsPage() {
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [status, setStatus] = useState("all");
  
  // Real data fetching logic (kept from your original code)
  // const { data, isLoading } = useQuery(...)
  const jobs = DUMMY_JOBS; // Using dummy data for now
  const isLoading = false;

  return (
    <div className="p-2 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-primary" /> Jobs
          </h1>
          <p className="text-muted-foreground text-sm">Manage your job postings and applications.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/jobs/new">
            <Plus className="w-4 h-4 mr-2" /> New Job
          </Link>
        </Button>
      </div>

      {/* Filters & Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search jobs..." className="pl-9" />
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto">
          <Tabs value={status} onValueChange={setStatus} className="w-fit">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="published">Published</TabsTrigger>
              <TabsTrigger value="draft">Draft</TabsTrigger>
              <TabsTrigger value="closed">Closed</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="h-8 w-px bg-border hidden md:block" />

          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "table" | "card")}>
            <TabsList>
              <TabsTrigger value="table">Table</TabsTrigger>
              <TabsTrigger value="card">Cards</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Content Area */}
      {viewMode === "table" ? (
        <TableView jobs={jobs} isLoading={isLoading} />
      ) : (
        <CardView jobs={jobs} isLoading={isLoading} />
      )}
    </div>
  );
}