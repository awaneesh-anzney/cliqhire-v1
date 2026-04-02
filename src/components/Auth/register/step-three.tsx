import { useEffect, useState } from "react";
import { Check, Copy, ExternalLink, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export function StepThree({ data }: { data: any }) {
  const [count, setCount] = useState(5);
  const fullUrl = data.workspaceUrl || `http://${data.tenantSlug}.localhost:3000`;

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    
    if (count === 0 && fullUrl) {
      window.location.href = fullUrl;
    }
    
    return () => clearInterval(timer);
  }, [count, fullUrl]);

  const copyUrl = () => {
    navigator.clipboard.writeText(fullUrl);
    toast.success("Workspace URL copied!");
  };

  return (
    <div className="text-center space-y-8 animate-in zoom-in-95 duration-500">
      <div className="w-24 h-24 bg-blue-600 text-white rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-blue-500/40 rotate-12 transition-transform hover:rotate-0">
        <PartyPopper size={48} />
      </div>

      <div className="space-y-2">
        <h2 className="text-4xl font-black tracking-tight text-slate-900">Boom! You're in.</h2>
        <p className="text-slate-500 font-medium">Your global hiring workspace is live.</p>
      </div>

      <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 space-y-4">
        <p className="text-xs font-black uppercase tracking-widest text-slate-400">Your Unique URL</p>
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm group">
          <span className="font-bold text-blue-600 truncate mr-2">{fullUrl}</span>
          <button onClick={copyUrl} className="p-2 hover:bg-blue-50 rounded-lg text-slate-400 hover:text-blue-600 transition-colors">
            <Copy size={18} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <Button onClick={() => window.location.href = fullUrl} className="w-full h-14 rounded-2xl bg-slate-900 text-white font-black text-lg group">
          Go to Dashboard <ExternalLink className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
        </Button>
        <p className="text-sm font-bold text-slate-400 italic">
          Redirecting in <span className="text-blue-600">{count}s</span>...
        </p>
      </div>
    </div>
  );
}