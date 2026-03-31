import Link from "next/link";
import { ArrowRight, Play, CheckCircle2, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden bg-white px-4 py-8">
      
      {/* 🔹 Background Effects (Full Width Ambient Light) */}
      <div className="absolute inset-0 w-full h-full -z-10">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-blue-100/40 blur-[150px] rounded-full translate-x-1/3 -translate-y-1/3 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-indigo-100/30 blur-[120px] rounded-full -translate-x-1/4 translate-y-1/4" />
        
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30 L30 0 M30 30 L60 30 M30 30 L30 60 M30 30 L0 30' fill='none' stroke='%23000' stroke-width='1'/%3E%3C/svg%3E")` }} 
        />
      </div>

      <div className="w-full max-w-[1800px] mx-auto flex flex-col lg:flex-row items-center gap-16">
        
        {/* 🔹 Left Content: Text & CTA (Takes 55% space) */}
        <div className="flex-1 text-left space-y-8 animate-in fade-in slide-in-from-left duration-1000">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-2xl border border-blue-100 shadow-sm transition-transform hover:scale-105 cursor-default">
            <Sparkles size={16} className="animate-pulse" />
            <span className="text-xs font-bold tracking-wider uppercase">Next-Gen AI Recruitment</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-[calc(-0.02em)] leading-[1.05]">
            Hiring isn't hard. <br />
            <span className="text-blue-600 relative inline-block">
               You’re just using 
               <svg className="absolute -bottom-2 left-0 w-full h-3 text-blue-200" viewBox="0 0 100 10" preserveAspectRatio="none">
                 <path d="M0 5 Q 25 0 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="4" />
               </svg>
            </span> <br />
            old tools.
          </h1>

          <p className="text-xl md:text-2xl text-slate-500 max-w-2xl leading-relaxed">
            ATS is the world's most intelligent platform for hiring. Score candidates, 
            automate interviews, and build world-class teams in minutes.
          </p>

          <div className="flex flex-wrap gap-5 pt-4">
            <Link 
              href="/signup" 
              className="px-10 py-5 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 hover:shadow-[0_20px_50px_rgba(37,99,235,0.3)] transition-all flex items-center gap-3 text-lg group"
            >
              Get Started for Free
              <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </Link>
            
            <button className="px-10 py-5 bg-white text-slate-900 font-bold rounded-2xl border-2 border-slate-100 hover:border-blue-100 hover:bg-slate-50 transition-all flex items-center gap-3 text-lg shadow-sm">
              <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                <Play size={14} className="text-blue-600 fill-blue-600" />
              </div>
              Watch Product Tour
            </button>
          </div>

          <div className="flex items-center gap-8 pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-green-500" />
              <span className="text-sm font-semibold text-slate-600">No credit card</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-green-500" />
              <span className="text-sm font-semibold text-slate-600">Free 14-day trial</span>
            </div>
          </div>
        </div>

        {/* 🔹 Right Content: Modern Visual Dashboard (Takes 45% space) */}
        <div className="flex-1 relative w-full lg:w-auto h-[500px] md:h-[650px] animate-in fade-in slide-in-from-right duration-1000 delay-200">
          
          {/* Main Dashboard Preview Card */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[80%] bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border-[8px] border-slate-800 rotate-3 transition-transform hover:rotate-0 duration-500">
            <div className="p-6 space-y-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="h-4 w-1/3 bg-slate-700 rounded" />
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="h-32 bg-slate-800 rounded-xl border border-slate-700 animate-pulse" />
                <div className="h-32 bg-slate-800 rounded-xl border border-slate-700 animate-pulse delay-75" />
              </div>
              <div className="h-48 bg-blue-600/20 rounded-xl border border-blue-500/30 flex items-center justify-center">
                 <span className="text-blue-400 font-mono text-xs tracking-widest">REALTIME_ANALYTICS_V2</span>
              </div>
            </div>
          </div>

          {/* Floating Candidate Card */}
          <div className="absolute top-10 right-4 md:-right-4 w-64 bg-white p-4 rounded-2xl shadow-2xl border border-slate-100 -rotate-6 animate-bounce-slow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">JD</div>
              <div>
                <p className="text-sm font-bold">John Doe</p>
                <p className="text-[10px] text-slate-400">Senior React Dev</p>
              </div>
            </div>
            <div className="mt-4 flex gap-1">
               <div className="h-1.5 flex-1 bg-green-500 rounded" />
               <div className="h-1.5 flex-1 bg-green-500 rounded" />
               <div className="h-1.5 w-1/3 bg-slate-200 rounded" />
            </div>
            <p className="mt-2 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded inline-block">94% Match Score</p>
          </div>

          {/* Floating Metric Card */}
          <div className="absolute bottom-10 left-4 md:-left-4 w-52 bg-white p-5 rounded-2xl shadow-2xl border border-slate-100 rotate-6">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-tight">Time to hire</p>
            <p className="text-3xl font-black text-slate-900 mt-1">12 <span className="text-sm font-normal text-slate-500">days</span></p>
            <div className="mt-2 flex items-center text-green-500 text-xs font-bold italic">
               ↓ 45% faster than avg
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}