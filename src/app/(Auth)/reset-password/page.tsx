'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Briefcase, Eye, EyeOff, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { authApi } from '@/lib/api';
import { cn } from '@/lib/utils';

const schema = z.object({
  password: z.string().min(8, 'Minimum 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});
type FormData = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [done, setDone] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const passwordValue = watch('password') ?? '';
  const strength = getStrength(passwordValue);

  const mutation = useMutation({
    mutationFn: (data: FormData) => authApi.resetPassword(token, data.password),
    onSuccess: () => {
      setDone(true);
      toast.success('Password reset successfully!');
      setTimeout(() => router.push('/login'), 2500);
    },
    onError: () => toast.error('Reset link is invalid or expired. Please request a new one.'),
  });

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--background))] p-4">
        <div className="text-center max-w-sm">
          <div className="w-14 h-14 rounded-2xl bg-[hsl(var(--destructive-muted))] flex items-center justify-center mx-auto mb-5">
            <ShieldCheck className="w-7 h-7 text-[hsl(var(--destructive))]" />
          </div>
          <h2 className="text-lg font-bold mb-2">Invalid reset link</h2>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mb-6">
            This password reset link is missing or malformed.
          </p>
          <Link href="/forgot-password"
            className="inline-flex items-center justify-center h-10 px-6 rounded-xl bg-[hsl(var(--primary))] text-white text-sm font-semibold hover:opacity-90 transition-opacity">
            Request new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--background))] p-6">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mb-10 justify-center">
          <div className="w-8 h-8 rounded-lg bg-[hsl(var(--primary))] flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-sm tracking-tight">ATS Platform</span>
        </Link>

        <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl p-8 shadow-sm">
          {!done ? (
            <>
              <div className="text-center mb-7">
                <div className="w-12 h-12 rounded-xl bg-[hsl(var(--primary-muted))] flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="w-6 h-6 text-[hsl(var(--primary))]" />
                </div>
                <h1 className="text-xl font-extrabold">Set new password</h1>
                <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
                  Choose a strong password for your account.
                </p>
              </div>

              <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
                {/* New password */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">New password</label>
                  <div className="relative">
                    <input
                      {...register('password')}
                      type={showPass ? 'text' : 'password'}
                      placeholder="Min. 8 characters"
                      className={cn(inputCls(!!errors.password), 'pr-10')}
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-[hsl(var(--destructive))]">{errors.password.message}</p>}

                  {/* Strength bar */}
                  {passwordValue && (
                    <div className="space-y-1 pt-0.5">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className={cn('flex-1 h-1 rounded-full transition-colors',
                            i <= strength.score ? strength.color : 'bg-[hsl(var(--muted))]'
                          )} />
                        ))}
                      </div>
                      <p className={cn('text-[10px]', strength.textColor)}>{strength.label}</p>
                    </div>
                  )}
                </div>

                {/* Confirm password */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Confirm new password</label>
                  <div className="relative">
                    <input
                      {...register('confirmPassword')}
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="Re-enter password"
                      className={cn(inputCls(!!errors.confirmPassword), 'pr-10')}
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]">
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-xs text-[hsl(var(--destructive))]">{errors.confirmPassword.message}</p>}
                </div>

                {/* Requirements */}
                <div className="p-3 bg-[hsl(var(--muted))] rounded-xl space-y-1.5">
                  <p className="text-[10px] font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wide">Password must have:</p>
                  {[
                    { label: 'At least 8 characters', met: passwordValue.length >= 8 },
                    { label: 'One uppercase letter', met: /[A-Z]/.test(passwordValue) },
                    { label: 'One number', met: /[0-9]/.test(passwordValue) },
                  ].map((req) => (
                    <div key={req.label} className="flex items-center gap-2">
                      <div className={cn('w-3.5 h-3.5 rounded-full flex items-center justify-center',
                        req.met ? 'bg-[hsl(var(--success))]' : 'bg-[hsl(var(--border))]')}>
                        {req.met && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
                      </div>
                      <span className={cn('text-[11px]', req.met ? 'text-[hsl(var(--success))]' : 'text-[hsl(var(--muted-foreground))]')}>
                        {req.label}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full h-11 rounded-xl bg-[hsl(var(--primary))] text-white font-semibold text-sm
                             hover:opacity-90 disabled:opacity-60 transition-opacity flex items-center justify-center gap-2"
                >
                  {mutation.isPending
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Resetting…</>
                    : 'Reset password'
                  }
                </button>
              </form>
            </>
          ) : (
            /* Success */
            <div className="text-center py-4 animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-[hsl(var(--success-muted))] flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 className="w-8 h-8 text-[hsl(var(--success))]" />
              </div>
              <h2 className="text-xl font-extrabold mb-2">Password reset!</h2>
              <p className="text-sm text-[hsl(var(--muted-foreground))] mb-6">
                Your password has been updated. Redirecting you to sign in…
              </p>
              <Link href="/login"
                className="inline-flex items-center justify-center h-10 px-6 rounded-xl bg-[hsl(var(--primary))] text-white text-sm font-semibold hover:opacity-90 transition-opacity">
                Sign in now
              </Link>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-[hsl(var(--muted-foreground))] mt-5">
          Remember your password?{' '}
          <Link href="/login" className="text-[hsl(var(--primary))] hover:underline font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

function inputCls(hasError: boolean) {
  return cn(
    'w-full h-10 px-3 rounded-xl border bg-[hsl(var(--background))] text-sm placeholder:text-[hsl(var(--muted-foreground))]',
    'focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] focus:border-transparent transition-shadow',
    hasError ? 'border-[hsl(var(--destructive))]' : 'border-[hsl(var(--border))]',
  );
}

function getStrength(password: string) {
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
