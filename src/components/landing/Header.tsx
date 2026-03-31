"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full border-b bg-white/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        
        <div className="flex items-center justify-between h-16">
          
          {/* 🔹 Logo */}
          <Link href="/" className="text-xl font-bold">
            ATS<span className="text-blue-600">.</span>
          </Link>

          {/* 🔹 Desktop Menu */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="#features" className="hover:text-blue-600 transition">
              Features
            </Link>
            <Link href="#pricing" className="hover:text-blue-600 transition">
              Pricing
            </Link>
            <Link href="#about" className="hover:text-blue-600 transition">
              About
            </Link>
            <Link href="#contact" className="hover:text-blue-600 transition">
              Contact
            </Link>
          </nav>

          {/* 🔹 CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium hover:text-blue-600"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Get Started
            </Link>
          </div>

          {/* 🔹 Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* 🔹 Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-4">
            <Link href="#features" className="block">
              Features
            </Link>
            <Link href="#pricing" className="block">
              Pricing
            </Link>
            <Link href="#about" className="block">
              About
            </Link>
            <Link href="#contact" className="block">
              Contact
            </Link>

            <div className="pt-4 border-t flex flex-col gap-2">
              <Link href="/login">Login</Link>
              <Link
                href="/signup"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-center"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}