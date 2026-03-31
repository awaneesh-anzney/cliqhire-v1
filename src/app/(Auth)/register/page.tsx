'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import {
  Briefcase, ArrowRight, ArrowLeft, Eye, EyeOff,
  Loader2, Check, Building2, User, Copy,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRegister } from '@/hooks/useAuth';
import type { RegisterResponse } from '@/types/auth';

// ─── Schemas per step ─────────────────────────────────────────────
const step1Schema = z.object({
  orgType: z.enum(['agency', 'company'], { required_error: 'Please select workspace type' }),
  companyName: z.string().min(2, 'Company name required'),
  tenantSlug: z
    .string()
    .min(2, 'Minimum 2 characters')
    .max(32, 'Maximum 32 characters')
    .regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers, and hyphens'),
});

const step2Schema = z.object({
  name: z.string().min(2, 'Full name required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Minimum 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;
type AllData = Step1Data & Step2Data;

// ─── Slug generator ───────────────────────────────────────────────
const toSlug = (str: string) =>
  str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [step1Data, setStep1Data] = useState<Step1Data | null>(null);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [workspaceUrl, setWorkspaceUrl] = useState('');
  const [countdown, setCountdown] = useState(5);

  // ── Step 1 form ──────────────────────────────────────────────────
  const form1 = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: { orgType: undefined, companyName: '', tenantSlug: '' },
  });

  // Auto-fill slug from company name
  const watchCompany = form1.watch('companyName');
  const handleCompanyBlur = () => {
    const current = form1.getValues('tenantSlug');
    if (!current && watchCompany) {
      form1.setValue('tenantSlug', toSlug(watchCompany));
    }
  };

  // ── Step 2 form ──────────────────────────────────────────────────
  const form2 = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  // ── Register mutation ────────────────────────────────────────────
  const registerMutation = useRegister();
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 3 && countdown > 0) {
      timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    } else if (step === 3 && countdown === 0) {
      router.push(`/login?slug=${step1Data?.tenantSlug}`);
    }
    return () => clearTimeout(timer);
  }, [step, countdown, router, step1Data]);

  const onStep1 = (data: Step1Data) => {
    setStep1Data(data);
    setStep(2);
  };

  const onStep2 = (data: Step2Data) => {
    if (!step1Data) return;
    registerMutation.mutate({ ...step1Data, adminName: data.name, adminEmail: data.email, adminPassword: data.password }, {
      onSuccess: (res: RegisterResponse) => {
        toast.success('Workspace created! Preparing dashboard...');
        setWorkspaceUrl(res.workspaceUrl);
        setStep(3);
      },
      onError: (err: unknown) => {
        const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
        toast.error(typeof msg === 'string' ? msg : 'Registration failed. Slug may already be taken.');
      }
    });
  };

  const passwordValue = form2.watch('password');
  const passwordStrength = getPasswordStrength(passwordValue);

  return (
    <div className="min-h-screen flex bg-[hsl(var(--background))]">
      {/* Left branding */}
      <div className="hidden lg:flex lg:w-2/5 bg-[hsl(var(--primary))] flex-col justify-between p-12">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-sm text-white tracking-tight">ATS Platform</span>
        </Link>

        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white leading-tight">
              Your hiring workspace,<br />ready in minutes.
            </h1>
            <p className="text-white/70 text-sm mt-4 leading-relaxed">
              Create your multi-tenant workspace, invite your team, and start tracking candidates today.
            </p>
          </div>

          {/* Checklist */}
          <ul className="space-y-3">
            {[
              'Custom subdomain for your workspace',
              'Unlimited candidates & pipeline stages',
              'Role-based permissions for your team',
              'Email templates & notifications built-in',
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-white/90">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-white" />
                </div>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-white/50">© {new Date().getFullYear()} ATS Platform</p>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-md animate-fade-in py-8">
          {/* Mobile logo */}
          <Link href="/" className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-7 h-7 rounded-lg bg-[hsl(var(--primary))] flex items-center justify-center">
              <Briefcase className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-sm">ATS Platform</span>
          </Link>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={cn(
                  'w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-all',
                  step === s
                    ? 'bg-[hsl(var(--primary))] text-white'
                    : step > s
                    ? 'bg-[hsl(var(--success))] text-white'
                    : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]',
                )}>
                  {step > s ? <Check className="w-3.5 h-3.5" /> : s}
                </div>
                <span className={cn('text-xs', step === s ? 'text-[hsl(var(--foreground))] font-medium' : 'text-[hsl(var(--muted-foreground))]')}>
                  {s === 1 ? 'Workspace' : 'Your account'}
                </span>
                {s < 2 && <div className="w-8 h-px bg-[hsl(var(--border))]" />}
              </div>
            ))}
            <div className="flex items-center gap-2">
              <div className={cn(
                'w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-all',
                step === 3
                  ? 'bg-[hsl(var(--primary))] text-white'
                  : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]',
              )}>
                3
              </div>
              <span className={cn('text-xs', step === 3 ? 'text-[hsl(var(--foreground))] font-medium' : 'text-[hsl(var(--muted-foreground))]')}>
                Ready
              </span>
            </div>
          </div>

          {/* ── STEP 1 ─────────────────────────────────────────── */}
          {step === 1 && (
            <>
              <div className="mb-7">
                <h2 className="text-xl font-extrabold">Create your workspace</h2>
                <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
                  Tell us about your organization.
                </p>
              </div>

              <form onSubmit={form1.handleSubmit(onStep1)} className="space-y-5">
                {/* Org type */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">I am setting up for…</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'company', label: 'In-house team', icon: Building2, desc: 'Internal HR / talent team' },
                      { value: 'agency', label: 'Recruitment agency', icon: User, desc: 'Staffing or RPO agency' },
                    ].map((opt) => {
                      const selected = form1.watch('orgType') === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => form1.setValue('orgType', opt.value as 'agency' | 'company', { shouldValidate: true })}
                          className={cn(
                            'p-4 rounded-xl border text-left transition-all',
                            selected
                              ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary-muted))]'
                              : 'border-[hsl(var(--border))] hover:border-[hsl(var(--primary))]/50',
                          )}
                        >
                          <opt.icon className={cn('w-5 h-5 mb-2', selected ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--muted-foreground))]')} />
                          <p className="text-sm font-medium">{opt.label}</p>
                          <p className="text-[10px] text-[hsl(var(--muted-foreground))] mt-0.5">{opt.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                  {form1.formState.errors.orgType && (
                    <p className="text-xs text-[hsl(var(--destructive))]">{form1.formState.errors.orgType.message}</p>
                  )}
                </div>

                {/* Company name */}
                <Field label="Company / Organization name" error={form1.formState.errors.companyName?.message}>
                  <input
                    {...form1.register('companyName')}
                    onBlur={handleCompanyBlur}
                    placeholder="Acme Corp"
                    className={inputCls(!!form1.formState.errors.companyName)}
                  />
                </Field>

                {/* Workspace slug */}
                <Field
                  label="Workspace ID"
                  error={form1.formState.errors.tenantSlug?.message}
                  hint="This will be your subdomain: {slug}.ats-platform.com"
                >
                  <div className="relative">
                    <input
                      {...form1.register('tenantSlug')}
                      placeholder="acme-corp"
                      className={cn(inputCls(!!form1.formState.errors.tenantSlug), 'pr-40')}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[hsl(var(--muted-foreground))] bg-[hsl(var(--muted))] px-2 py-1 rounded">
                      .ats-platform.com
                    </span>
                  </div>
                </Field>

                <button
                  type="submit"
                  className="w-full h-11 rounded-xl bg-[hsl(var(--primary))] text-white font-semibold text-sm
                             hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </>
          )}

          {/* ── STEP 2 ─────────────────────────────────────────── */}
          {step === 2 && (
            <>
              <div className="mb-7">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] mb-4 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
                <h2 className="text-xl font-extrabold">Create your admin account</h2>
                <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
                  You'll be the workspace owner with full access.
                </p>
              </div>

              {/* Workspace badge */}
              {step1Data && (
                <div className="flex items-center gap-2.5 p-3 bg-[hsl(var(--primary-muted))] border border-[hsl(var(--primary))]/20 rounded-xl mb-5">
                  <div className="w-7 h-7 rounded-lg bg-[hsl(var(--primary))] flex items-center justify-center shrink-0">
                    <Briefcase className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold">{step1Data.companyName}</p>
                    <p className="text-[10px] text-[hsl(var(--muted-foreground))]">{step1Data.tenantSlug}.ats-platform.com</p>
                  </div>
                </div>
              )}

              <form onSubmit={form2.handleSubmit(onStep2)} className="space-y-4">
                <Field label="Full name" error={form2.formState.errors.name?.message}>
                  <input
                    {...form2.register('name')}
                    placeholder="Priya Sharma"
                    className={inputCls(!!form2.formState.errors.name)}
                  />
                </Field>

                <Field label="Work email" error={form2.formState.errors.email?.message}>
                  <input
                    {...form2.register('email')}
                    type="email"
                    placeholder="priya@acmecorp.com"
                    className={inputCls(!!form2.formState.errors.email)}
                  />
                </Field>

                <Field label="Password" error={form2.formState.errors.password?.message}>
                  <div className="space-y-2">
                    <div className="relative">
                      <input
                        {...form2.register('password')}
                        type={showPass ? 'text' : 'password'}
                        placeholder="Min. 8 characters"
                        className={cn(inputCls(!!form2.formState.errors.password), 'pr-10')}
                      />
                      <button type="button" onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]">
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {/* Password strength */}
                    {passwordValue && (
                      <div className="space-y-1">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4].map((i) => (
                            <div key={i} className={cn(
                              'flex-1 h-1 rounded-full transition-colors',
                              i <= passwordStrength.score
                                ? passwordStrength.color
                                : 'bg-[hsl(var(--muted))]',
                            )} />
                          ))}
                        </div>
                        <p className={cn('text-[10px]', passwordStrength.textColor)}>
                          {passwordStrength.label}
                        </p>
                      </div>
                    )}
                  </div>
                </Field>

                <Field label="Confirm password" error={form2.formState.errors.confirmPassword?.message}>
                  <div className="relative">
                    <input
                      {...form2.register('confirmPassword')}
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="Re-enter password"
                      className={cn(inputCls(!!form2.formState.errors.confirmPassword), 'pr-10')}
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]">
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </Field>

                <p className="text-[10px] text-[hsl(var(--muted-foreground))]">
                  By creating an account, you agree to our{' '}
                  <a href="/terms" className="text-[hsl(var(--primary))] hover:underline">Terms of Service</a>
                  {' '}and{' '}
                  <a href="/privacy" className="text-[hsl(var(--primary))] hover:underline">Privacy Policy</a>.
                </p>

                <button
                  type="submit"
                  disabled={registerMutation.isPending}
                  className="w-full h-11 rounded-xl bg-[hsl(var(--primary))] text-white font-semibold text-sm
                             hover:opacity-90 disabled:opacity-60 transition-opacity flex items-center justify-center gap-2"
                >
                  {registerMutation.isPending
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating workspace…</>
                    : <><Check className="w-4 h-4" /> Create workspace</>
                  }
                </button>
              </form>
            </>
          )}

          {/* ── STEP 3 ─────────────────────────────────────────── */}
          {step === 3 && (
            <div className="text-center animate-fade-in space-y-6">
              <div className="mx-auto w-16 h-16 bg-[hsl(var(--success-muted))] rounded-full flex items-center justify-center mb-4">
                <Check className="w-8 h-8 text-[hsl(var(--success))]" />
              </div>
              <h2 className="text-2xl font-extrabold text-[hsl(var(--foreground))]">You're all set!</h2>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                Your workspace has been successfully created. Here is your unique workspace link:
              </p>
              
              <div className="flex items-center border border-[hsl(var(--border))] rounded-xl p-3 bg-[hsl(var(--card))]">
                <div className="flex-1 text-sm font-medium truncate text-left">{workspaceUrl}</div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(workspaceUrl);
                    toast.success('URL Copied!');
                  }}
                  className="p-2 ml-2 bg-[hsl(var(--primary-muted))] text-[hsl(var(--primary))] rounded-lg hover:bg-[hsl(var(--primary))]/20 transition-colors shrink-0"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-[hsl(var(--muted))] p-4 rounded-xl">
                <p className="text-xs text-[hsl(var(--muted-foreground))]">
                  Redirecting to login in <span className="font-bold text-[hsl(var(--foreground))]">{countdown}</span> seconds...
                </p>
                <div className="w-full h-1 bg-[hsl(var(--border))] mt-3 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[hsl(var(--primary))] transition-all duration-1000 ease-linear"
                    style={{ width: `${(countdown / 5) * 100}%` }}
                  />
                </div>
              </div>
              
              <button
                type="button"
                onClick={() => router.push(`/login?slug=${step1Data?.tenantSlug}`)}
                className="w-full h-11 rounded-xl bg-[hsl(var(--primary))] text-white font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                Go to login now
              </button>
            </div>
          )}

          <p className="text-center text-xs text-[hsl(var(--muted-foreground))] mt-6">
            Already have a workspace?{' '}
            <Link href="/login" className="text-[hsl(var(--primary))] hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────
function Field({ label, error, hint, children }: {
  label: string; error?: string; hint?: string; children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">{label}</label>
      {hint && <p className="text-[10px] text-[hsl(var(--muted-foreground))]">{hint}</p>}
      {children}
      {error && <p className="text-xs text-[hsl(var(--destructive))]">{error}</p>}
    </div>
  );
}

function inputCls(hasError: boolean) {
  return cn(
    'w-full h-10 px-3 rounded-xl border bg-[hsl(var(--card))] text-sm placeholder:text-[hsl(var(--muted-foreground))]',
    'focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] focus:border-transparent transition-shadow',
    hasError ? 'border-[hsl(var(--destructive))]' : 'border-[hsl(var(--border))]',
  );
}

function getPasswordStrength(password: string) {
  if (!password) return { score: 0, label: '', color: '', textColor: '' };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const map = [
    { label: 'Weak', color: 'bg-[hsl(var(--destructive))]', textColor: 'text-[hsl(var(--destructive))]' },
    { label: 'Fair', color: 'bg-[hsl(var(--warning))]', textColor: 'text-[hsl(var(--warning))]' },
    { label: 'Good', color: 'bg-[hsl(var(--warning))]', textColor: 'text-[hsl(var(--warning))]' },
    { label: 'Strong', color: 'bg-[hsl(var(--success))]', textColor: 'text-[hsl(var(--success))]' },
    { label: 'Very strong', color: 'bg-[hsl(var(--success))]', textColor: 'text-[hsl(var(--success))]' },
  ];
  return { score, ...map[Math.min(score, 4)] };
}
