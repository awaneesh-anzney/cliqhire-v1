import { Briefcase, CheckCircle2 } from "lucide-react";

export function AuthSidebar() {
  return (
    <div className="hidden lg:flex lg:w-[450px] bg-slate-900 p-12 flex-col justify-between relative overflow-hidden">
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent" />
      
      <div className="flex items-center gap-2 z-10 text-white">
        <Briefcase className="w-8 h-8 text-blue-500" />
        <span className="font-black text-xl tracking-tighter">ATS.</span>
      </div>

      <div className="z-10 space-y-6">
        <h1 className="text-4xl font-black text-white leading-tight">
          Start building your <br /> <span className="text-blue-500">dream team</span> today.
        </h1>
        <ul className="space-y-4">
          {['Custom Subdomains', 'AI-Candidate Scoring', 'Team Collaboration'].map((item) => (
            <li key={item} className="flex items-center gap-3 text-slate-300">
              <CheckCircle2 className="w-5 h-5 text-blue-500" />
              <span className="font-medium">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="z-10 text-slate-500 text-xs font-bold uppercase tracking-widest">
        © 2026 ATS PLATFORM INC.
      </div>
    </div>
  );
}