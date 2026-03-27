'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Loader2, Briefcase, ArrowRight } from 'lucide-react';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { cn } from '@/lib/utils';

const schema = z.object({
  tenantSlug: z.string().min(1, 'Workspace ID required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Minimum 8 characters'),
});
type FormData = z.infer<typeof schema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [showPass, setShowPass] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      tenantSlug: searchParams.get('slug') ?? '',
      email: '',
      password: '',
    },
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuth({ accessToken: data.accessToken, refreshToken: data.refreshToken }, data.user);
      toast.success(`Welcome back, ${data.user.name.split(' ')[0]}!`);
      router.push('/dashboard');
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message ?? 'Invalid credentials';
      toast.error(typeof msg === 'string' ? msg : 'Login failed');
    },
  });

  return (
    <div className="min-h-screen flex bg-[hsl(var(--background))]">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-2/5 bg-[hsl(var(--card))] border-r border-[hsl(var(--border))] flex-col justify-between p-12">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[hsl(var(--primary))] flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-sm tracking-tight">ATS Platform</span>
        </Link>

        <div className="space-y-6">
          <h1 className="text-3xl font-extrabold leading-tight">
            Welcome back.<br />
            <span className="text-[hsl(var(--primary))]">Your pipeline awaits.</span>
          </h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed max-w-xs">
            Sign in to your workspace and pick up where you left off.
          </p>

          <div className="grid grid-cols-3 gap-3 pt-2">
            {[
              { n: '12', l: 'Phases Built' },
              { n: '44+', l: 'Feature Flags' },
              { n: '100+', l: 'API Endpoints' },
            ].map((s) => (
              <div key={s.l} className="bg-[hsl(var(--background))] rounded-xl p-3 border border-[hsl(var(--border))]">
                <div className="text-lg font-extrabold text-[hsl(var(--primary))]">{s.n}</div>
                <div className="text-[10px] text-[hsl(var(--muted-foreground))] mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-[hsl(var(--muted-foreground))]">© {new Date().getFullYear()} ATS Platform</p>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm animate-fade-in">
          {/* Mobile logo */}
          <Link href="/" className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-7 h-7 rounded-lg bg-[hsl(var(--primary))] flex items-center justify-center">
              <Briefcase className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-sm">ATS Platform</span>
          </Link>

          <div className="mb-7">
            <h2 className="text-xl font-extrabold">Sign in to your workspace</h2>
            <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
              Enter your workspace ID and credentials.
            </p>
          </div>

          <form onSubmit={handleSubmit((d) => loginMutation.mutate(d))} className="space-y-4">
            {/* Workspace slug */}
            <Field label="Workspace ID" error={errors.tenantSlug?.message}>
              <input
                {...register('tenantSlug')}
                placeholder="acme-corp"
                className={inputCls(!!errors.tenantSlug)}
              />
            </Field>

            {/* Email */}
            <Field label="Email" error={errors.email?.message}>
              <input
                {...register('email')}
                type="email"
                placeholder="you@company.com"
                className={inputCls(!!errors.email)}
              />
            </Field>

            {/* Password */}
            <Field label="Password" error={errors.password?.message}>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={cn(inputCls(!!errors.password), 'pr-10')}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </Field>

            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-xs text-[hsl(var(--primary))] hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full h-11 rounded-xl bg-[hsl(var(--primary))] text-white font-semibold text-sm
                         hover:opacity-90 disabled:opacity-60 transition-opacity flex items-center justify-center gap-2"
            >
              {loginMutation.isPending
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</>
                : <>Sign in <ArrowRight className="w-4 h-4" /></>
              }
            </button>
          </form>

          <p className="text-center text-xs text-[hsl(var(--muted-foreground))] mt-6">
            Don't have a workspace?{' '}
            <Link href="/register" className="text-[hsl(var(--primary))] hover:underline font-medium">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">{label}</label>
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
