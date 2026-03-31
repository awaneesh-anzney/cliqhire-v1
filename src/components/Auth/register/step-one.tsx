import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step1Schema, toSlug } from "@/validation/register.schemas";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Building2, User, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function StepOne({ onNext, data }: { onNext: (data: any) => void; data: any }) {
  const form = useForm({
    resolver: zodResolver(step1Schema),
    defaultValues: data || { companyName: '', tenantSlug: '' },
  });

  const watchName = form.watch("companyName");

  return (
    <form onSubmit={form.handleSubmit(onNext)} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <h2 className="text-3xl font-black tracking-tight">Create Workspace</h2>
        <p className="text-slate-500 font-medium">Choose how you want to use the platform.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { id: 'company', label: 'Company', icon: Building2 },
          { id: 'agency', label: 'Agency', icon: User }
        ].map((type) => (
          <button
            key={type.id}
            type="button"
            onClick={() => form.setValue('orgType', type.id as any)}
            className={cn(
              "flex flex-col items-center gap-3 p-6 rounded-[2rem] border-2 transition-all",
              form.watch('orgType') === type.id 
                ? "border-blue-600 bg-blue-50/50 text-blue-600" 
                : "border-slate-100 hover:border-slate-200 text-slate-400"
            )}
          >
            <type.icon size={32} />
            <span className="font-bold">{type.label}</span>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <Input 
          {...form.register("companyName")} 
          placeholder="Organization Name"
          className="h-14 rounded-2xl bg-slate-50 border-none px-6 font-bold"
          onBlur={() => {
            if(!form.getValues('tenantSlug')) form.setValue('tenantSlug', toSlug(watchName))
          }}
        />
        <div className="relative">
            <Input 
                {...form.register("tenantSlug")} 
                placeholder="workspace-id"
                className="h-14 rounded-2xl bg-slate-50 border-none px-6 font-bold pr-36"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 bg-white px-2 py-1 rounded-lg shadow-sm">
                .ats.com
            </span>
        </div>
      </div>

      <Button className="w-full h-14 rounded-2xl bg-blue-600 font-black text-lg shadow-xl shadow-blue-500/20">
        Continue <ArrowRight className="ml-2" size={20} />
      </Button>
    </form>
  );
}