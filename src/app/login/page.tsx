'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Loader2, Briefcase } from 'lucide-react';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { cn } from '@/lib/utils';

const schema = z.object({
  tenantSlug: z.string().min(1, 'Company ID required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Minimum 8 characters'),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [showPass, setShowPass] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { tenantSlug: '', email: '', password: '' },
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuth({ accessToken: data.accessToken, refreshToken: data.refreshToken }, data.user);
      toast.success(`Welcome back, ${data.user.name}!`);
      router.push('/dashboard');
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message ?? 'Login failed';
      toast.error(typeof msg === 'string' ? msg : 'Invalid credentials');
    },
  });

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left — Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-surface border-r border-border flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display font-semibold text-lg tracking-tight">ATS Platform</span>
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-display font-bold leading-tight">
            Hire smarter,<br />
            <span className="text-primary">faster, together.</span>
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
            End-to-end recruitment platform built for agencies and in-house teams.
            Track every candidate, every stage, every hire.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4">
            {[
              { n: '12 Phase', l: 'Build Plan' },
              { n: '44+', l: 'Feature Flags' },
              { n: '100+', l: 'API Endpoints' },
            ].map((s) => (
              <div key={s.l} className="bg-background rounded-xl p-4 border border-border">
                <div className="text-xl font-bold text-foreground">{s.n}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm text-muted-foreground">© 2024 ATS Platform. All rights reserved.</p>
      </div>

      {/* Right — Login Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold">ATS Platform</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-display font-bold">Sign in</h2>
            <p className="text-muted-foreground mt-1">Enter your workspace details to continue</p>
          </div>

          <form onSubmit={handleSubmit((d) => loginMutation.mutate(d))} className="space-y-4">
            {/* Company Slug */}
            <Field label="Company ID" error={errors.tenantSlug?.message}>
              <input
                {...register('tenantSlug')}
                placeholder="acme-corp"
                className={inputClass(!!errors.tenantSlug)}
              />
            </Field>

            {/* Email */}
            <Field label="Email" error={errors.email?.message}>
              <input
                {...register('email')}
                type="email"
                placeholder="you@company.com"
                className={inputClass(!!errors.email)}
              />
            </Field>

            {/* Password */}
            <Field label="Password" error={errors.password?.message}>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={cn(inputClass(!!errors.password), 'pr-10')}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </Field>

            <div className="flex justify-end">
              <a href="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full h-10 rounded-lg bg-primary text-primary-foreground font-medium text-sm
                         hover:opacity-90 disabled:opacity-60 transition-opacity flex items-center justify-center gap-2"
            >
              {loginMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function inputClass(hasError: boolean) {
  return cn(
    'w-full h-10 px-3 rounded-lg border bg-surface text-sm text-foreground placeholder:text-muted-foreground',
    'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow',
    hasError ? 'border-destructive' : 'border-border',
  );
}
