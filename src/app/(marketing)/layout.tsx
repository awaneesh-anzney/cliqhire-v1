import type { Metadata } from "next";
import { ReactNode } from "react";

// 👉 Global styles (ensure correct import path)
import "@/styles/globals.css";

// 👉 Example: reusable components
// import { Header } from "@/components/layout/Header";
import Footer from "@/components/landing/Footer";

// 👉 SEO Metadata (important for production)
export const metadata: Metadata = {
  title: {
    default: "Your App Name",
    template: "%s | Your App Name",
  },
  description: "Your app description for SEO and social sharing.",
  keywords: ["SaaS", "Marketing", "Next.js", "App"],
  authors: [{ name: "Your Company" }],
  creator: "Your Company",
  metadataBase: new URL("https://yourdomain.com"),

  openGraph: {
    title: "Your App Name",
    description: "Your app description",
    url: "https://yourdomain.com",
    siteName: "Your App Name",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "OG Image",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Your App Name",
    description: "Your app description",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

interface MarketingLayoutProps {
  children: ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased">
        {/* 👉 Header */}
        {/* <Header /> */}

        {/* 👉 Main Content */}
        <main className="flex-1">{children}</main>

        {/* 👉 Footer */}
        <Footer />
      </body>
    </html>
  );
}
