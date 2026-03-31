import { ReactNode } from "react";
import "./globals.css";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      {/* Body me flex-col add karein taaki footer hamesha niche rahe */}
      <body className="flex flex-col min-h-screen w-full antialiased">
        
        <Header />

        {/* Flex-grow ensures main takes available space */}
        <main className="flex-grow">
          {children}
        </main>

        <Footer />

      </body>
    </html>
  );
}