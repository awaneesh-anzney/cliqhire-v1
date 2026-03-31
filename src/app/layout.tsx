import type { Metadata } from "next"
import { Toaster } from "sonner"
import { QueryProvider } from "@/lib/query-provider"
import "./globals.css"
import { Inter } from "next/font/google"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: {
    template: "%s | CliqHire",
    default: "CliqHire — ATS Platform",
  },
  description: "Multi-tenant Applicant Tracking System",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans antialiased", inter.variable)}>
      <body>
        <QueryProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              classNames: {
                toast: "bg-surface text-foreground border border-border rounded-[var(--radius)] text-sm shadow-lg",
              },
            }}
          />
        </QueryProvider>
      </body>
    </html>
  )
}
