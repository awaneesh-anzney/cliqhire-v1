import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step2Schema } from "@/validation/register.schemas";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function StepTwo({ onNext, onBack, data, isPending }: any) {
  const [showPass, setShowPass] = useState(false);
  const form = useForm({
    resolver: zodResolver(step2Schema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const passValue = form.watch("password");

  // Simple Strength Logic
  const getStrength = (p: string) => {
    if (!p) return 0;
    let s = 0;
    if (p.length > 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    return s;
  };

  return (
    <form onSubmit={form.handleSubmit(onNext)} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="space-y-2">
        <button type="button" onClick={onBack} className="text-slate-400 hover:text-blue-600 flex items-center gap-1 text-sm font-bold transition-colors">
          <ArrowLeft size={14} /> Back to Workspace
        </button>
        <h2 className="text-3xl font-black tracking-tight">Setup Admin</h2>
        <p className="text-slate-500 font-medium">You'll be the owner of <span className="text-blue-600">@{data.tenantSlug}</span></p>
      </div>

      <div className="space-y-4">
        <Input {...form.register("name")} placeholder="Full Name" className="h-14 rounded-2xl bg-slate-50 border-none px-6 font-bold" />
        <Input {...form.register("email")} type="email" placeholder="Work Email" className="h-14 rounded-2xl bg-slate-50 border-none px-6 font-bold" />
        
        <div className="relative">
          <Input 
            {...form.register("password")} 
            type={showPass ? "text" : "password"} 
            placeholder="Create Password" 
            className="h-14 rounded-2xl bg-slate-50 border-none px-6 font-bold pr-12" 
          />
          <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
            {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Password Strength Bar */}
        {passValue && (
          <div className="flex gap-2 px-1">
            {[1, 2, 3].map((level) => (
              <div key={level} className={cn("h-1.5 flex-1 rounded-full transition-all", getStrength(passValue) >= level ? "bg-blue-600" : "bg-slate-100")} />
            ))}
          </div>
        )}

        <Input {...form.register("confirmPassword")} type="password" placeholder="Confirm Password" className="h-14 rounded-2xl bg-slate-50 border-none px-6 font-bold" />
      </div>

      <Button disabled={isPending} className="w-full h-14 rounded-2xl bg-blue-600 font-black text-lg shadow-xl shadow-blue-500/20">
        {isPending ? <Loader2 className="animate-spin mr-2" /> : <ShieldCheck className="mr-2" />}
        Finalize Workspace
      </Button>
    </form>
  );
}