import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Returns initials from a full name — e.g. "John Doe" → "JD" */
export function getInitials(name: string): string {
  if (!name) return "??"
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("")
}

/** Returns a human-readable relative time string — e.g. "2 hours ago" */
export function timeAgo(dateStr: string | Date): string {
  const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return "just now"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  const weeks = Math.floor(days / 7)
  if (weeks < 4) return `${weeks}w ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months}mo ago`
  const years = Math.floor(days / 365)
  return `${years}y ago`
}

/** Format a date string/Date to a readable locale string */
export function formatDate(dateStr: string | Date): string {
  const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

/** Maps a status string to Tailwind color classes */
export function statusColors(status: string): string {
  const map: Record<string, string> = {
    active: "bg-success-muted text-success",
    inactive: "bg-muted text-muted-foreground",
    pending: "bg-warning-muted text-warning",
    rejected: "bg-destructive-muted text-destructive",
    hired: "bg-success-muted text-success",
    interview: "bg-accent-muted text-accent",
    offered: "bg-primary-muted text-primary",
    withdrawn: "bg-muted text-muted-foreground",
  }
  return map[status?.toLowerCase()] ?? "bg-muted text-muted-foreground"
}
