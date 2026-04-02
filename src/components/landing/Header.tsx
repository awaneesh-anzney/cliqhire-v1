"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, ArrowRight } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
        scrolled 
          ? "py-4 bg-white/80 backdrop-blur-2xl border-b border-slate-200/60 shadow-sm" 
          : "py-6 bg-transparent"
      }`}
    >
      <div className="w-full max-w-[1800px] mx-auto px-6 md:px-10 flex items-center justify-between relative">
        
        {/* 1. Left Section: Logo */}
        <div className="flex-shrink-0 z-10">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center transition-transform group-hover:rotate-12 shadow-lg shadow-blue-500/20">
              <span className="text-white font-black text-xl">A</span>
            </div>
            <h2 className="text-2xl font-black tracking-tighter text-slate-900">
              ATS<span className="text-blue-600">.</span>
            </h2>
          </Link>
        </div>

        {/* 2. Middle Section: Centered Navigation */}
        {/* 'absolute left-1/2 -translate-x-1/2' se ye hamesha center me rahega */}
        <nav className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-12 bg-slate-100/50 px-8 py-2.5 rounded-2xl border border-slate-200/50 backdrop-blur-md">
          {["Features", "Pricing", "About", "Contact"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-[13px] uppercase tracking-widest font-black text-slate-500 hover:text-blue-600 transition-all"
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* 3. Right Section: CTA Buttons */}
        <div className="flex items-center gap-4 z-10">
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/login"
              className="px-6 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-6 py-3 text-sm font-black bg-slate-900 text-white rounded-xl hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-500/20 transition-all flex items-center gap-2"
            >
              Get Started
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-3 bg-slate-100 rounded-xl text-slate-900"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* --- Mobile Menu Overlay --- */}
        <div className={`
          lg:hidden fixed inset-0 top-0 h-screen bg-white z-[110] transition-all duration-700 ease-[cubic-bezier(0.22, 1, 0.36, 1)] 
          ${isOpen ? "translate-y-0" : "-translate-y-full"}
        `}>
          <div className="p-6 flex justify-between items-center border-b">
             <span className="text-2xl font-black">ATS.</span>
             <button onClick={() => setIsOpen(false)} className="p-3 bg-slate-100 rounded-xl"><X size={24}/></button>
          </div>
          <div className="flex flex-col items-center justify-center h-[70vh] gap-10">
             {["Features", "Pricing", "About", "Contact"].map((item) => (
                <Link
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setIsOpen(false)}
                  className="text-5xl font-black text-slate-900 hover:text-blue-600"
                >
                  {item}
                </Link>
              ))}
          </div>
        </div>
      </div>
    </header>
  );
}