"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/* ── Context ──────────────────────────────────────────────────── */

interface SidebarContextValue {
  collapsed: boolean
  setCollapsed: (v: boolean) => void
  mobileOpen: boolean
  setMobileOpen: (v: boolean) => void
}

const SidebarContext = React.createContext<SidebarContextValue>({
  collapsed: false,
  setCollapsed: () => {},
  mobileOpen: false,
  setMobileOpen: () => {},
})

export function useSidebar() {
  return React.useContext(SidebarContext)
}

/* ── Provider ─────────────────────────────────────────────────── */

interface SidebarProviderProps {
  children: React.ReactNode
  defaultCollapsed?: boolean
}

export function SidebarProvider({
  children,
  defaultCollapsed = false,
}: SidebarProviderProps) {
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed)
  const [mobileOpen, setMobileOpen] = React.useState(false)

  return (
    <SidebarContext.Provider
      value={{ collapsed, setCollapsed, mobileOpen, setMobileOpen }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

/* ── Root ─────────────────────────────────────────────────────── */

export function Sidebar({ className, children }: React.ComponentProps<"aside">) {
  const { collapsed, mobileOpen } = useSidebar()

  return (
    <>
      <aside
        data-slot="sidebar"
        data-collapsed={collapsed}
        className={cn(
          "flex flex-col h-full bg-sidebar border-r border-sidebar-border z-30 transition-[width] duration-250 ease-out",
          "fixed lg:relative inset-y-0 left-0",
          collapsed ? "w-16" : "w-60",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          className,
        )}
      >
        {children}
      </aside>
    </>
  )
}

/* ── Sub-sections ─────────────────────────────────────────────── */

export function SidebarHeader({
  className,
  children,
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-header"
      className={cn("flex shrink-0 items-center border-b border-sidebar-border", className)}
    >
      {children}
    </div>
  )
}

export function SidebarContent({
  className,
  children,
}: React.ComponentProps<"nav">) {
  return (
    <nav
      data-slot="sidebar-content"
      className={cn("flex-1 overflow-y-auto py-3 px-2 space-y-4", className)}
    >
      {children}
    </nav>
  )
}

export function SidebarFooter({
  className,
  children,
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-footer"
      className={cn("border-t border-sidebar-border p-3 shrink-0", className)}
    >
      {children}
    </div>
  )
}

/* ── Nav Group / Label ────────────────────────────────────────── */

export function SidebarGroup({
  className,
  children,
}: React.ComponentProps<"div">) {
  return (
    <div data-slot="sidebar-group" className={cn("", className)}>
      {children}
    </div>
  )
}

export function SidebarGroupLabel({
  className,
  children,
}: React.ComponentProps<"p">) {
  const { collapsed } = useSidebar()
  if (collapsed) return null
  return (
    <p
      data-slot="sidebar-group-label"
      className={cn(
        "px-2 mb-1 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/50",
        className,
      )}
    >
      {children}
    </p>
  )
}

/* ── Menu ─────────────────────────────────────────────────────── */

export function SidebarMenu({
  className,
  children,
}: React.ComponentProps<"ul">) {
  return (
    <ul data-slot="sidebar-menu" className={cn("space-y-0.5", className)}>
      {children}
    </ul>
  )
}

export function SidebarMenuItem({
  className,
  children,
}: React.ComponentProps<"li">) {
  return (
    <li data-slot="sidebar-menu-item" className={cn("", className)}>
      {children}
    </li>
  )
}

import { Slot } from "radix-ui"

/* ── Menu Button ──────────────────────────────────────────────── */

interface SidebarMenuButtonProps
  extends React.ComponentProps<"a"> {
  isActive?: boolean
  asChild?: boolean
}

export const SidebarMenuButton = React.forwardRef<
  HTMLAnchorElement,
  SidebarMenuButtonProps
>(({ className, isActive, asChild = false, children, ...props }, ref) => {
  const { collapsed } = useSidebar()
  const Comp = asChild ? Slot.Root : "a"
  
  return (
    <Comp
      ref={ref as any}
      data-slot="sidebar-menu-button"
      data-active={isActive}
      className={cn(
        "sidebar-item flex items-center gap-3 rounded-lg px-2 py-2 text-sm",
        "text-sidebar-foreground/70 transition-all duration-150 cursor-pointer",
        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        isActive && "bg-sidebar-accent text-sidebar-primary font-medium",
        collapsed && "justify-center",
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  )
})
SidebarMenuButton.displayName = "SidebarMenuButton"

/* ── Inset trigger area ───────────────────────────────────────── */

export function SidebarTrigger({
  className,
  onClick,
}: {
  className?: string
  onClick?: () => void
}) {
  return (
    <button
      data-slot="sidebar-trigger"
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center rounded-lg p-1.5",
        "text-muted-foreground hover:text-foreground hover:bg-muted",
        "transition-colors duration-150",
        className,
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M9 3v18" />
      </svg>
      <span className="sr-only">Toggle sidebar</span>
    </button>
  )
}
