'use client';

import { QueryProvider } from "@/lib/query-provider";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <QueryProvider>{children}</QueryProvider>;
}