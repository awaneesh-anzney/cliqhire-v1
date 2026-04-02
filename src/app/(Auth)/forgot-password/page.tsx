'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  Briefcase, ArrowLeft, Mail, Loader2,
  CheckCircle2, KeyRound,
} from 'lucide-react';
import { authApi } from '@/lib/api';
import { cn } from '@/lib/utils';

const schema = z.object({
  tenantSlug: z.string().min(1, 'Workspace ID required'),
  email: z.string().email('Invalid email address'),
});
type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { tenantSlug: '', email: '' },
  });

  const mutation = useMutation({
    mutationFn: ({ email, tenantSlug }: FormData) =>
      authApi.forgotPassword(email, tenantSlug),
    onSuccess: (_, vars) => {
      setSubmittedEmail(vars.email);
      setSent(true);
    },
    onError: () => {
      // Show success anyway to avoid email enumeration
      toast.success('If that account exists, a reset link has been sent.');
      setSent(true);
    },
  });

  return (
    <div className="min-h-screen flex bg-[hsl(var(--background))]">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-2/5 bg-[hsl(var(--card))] border-r border-[hsl(var(--border))] flex-col justify-between p-12">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[hsl(var(--primary))] flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-sm tracking-tight">ATS Platform</span>
        </Link>

        <div className="space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-[hsl(var(--primary-muted))] flex items-center justify-center">
            <KeyRound className="w-7 h-7 text-[hsl(var(--primary))]" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold leading-tight">
              Secure password reset
            </h2>
            <p className="text-sm text-[hsl(var(--muted-foreground))] mt-3 leading-relaxed">
              We'll send a secure reset link to your registered email.
              The link expires in 24 hours.
            </p>
          </div>
          <ul className="space-y-3 text-sm text-[hsl(var(--muted-foreground))]">
            <li className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-[hsl(var(--primary-muted))] flex items-center justify-center shrink-0">
                <span className="text-[10px] font-bold text-[hsl(var(--primary))]">1</span>
              </div>
              Enter your workspace ID and email
            </li>
            <li className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-[hsl(var(--primary-muted))] flex items-center justify-center shrink-0">
                <span className="text-[10px] font-bold text-[hsl(var(--primary))]">2</span>
              </div>
              Check your inbox for the reset link
            </li>
            <li className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-[hsl(var(--primary-muted))] flex items-center justify-center shrink-0">
                <span className="text-[10px] font-bold text-[hsl(var(--primary))]">3</span>
              </div>
              Set your new password securely
            </li>
          </ul>
        </div>

        <p className="text-xs text-[hsl(var(--muted-foreground))]">© {new Date().getFullYear()} ATS Platform</p>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile logo */}
          <Link href="/" className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-7 h-7 rounded-lg bg-[hsl(var(--primary))] flex items-center justify-center">
              <Briefcase className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-sm">ATS Platform</span>
          </Link>

          {!sent ? (
            <>
              {/* Back link */}
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] mb-6 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
              </Link>

              <div className="mb-7">
                <h1 className="text-xl font-extrabold">Forgot your password?</h1>
                <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
                  No worries. Enter your details and we'll send you a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
                {/* Workspace ID */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Workspace ID</label>
                  <input
                    {...register('tenantSlug')}
                    placeholder="acme-corp"
                    className={inputCls(!!errors.tenantSlug)}
                  />
                  {errors.tenantSlug && (
                    <p className="text-xs text-[hsl(var(--destructive))]">{errors.tenantSlug.message}</p>
                  )}
                  <p className="text-[10px] text-[hsl(var(--muted-foreground))]">
                    The ID you chose when signing up (e.g., acme-corp)
                  </p>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Email address</label>
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="you@company.com"
                    className={inputCls(!!errors.email)}
                  />
                  {errors.email && (
                    <p className="text-xs text-[hsl(var(--destructive))]">{errors.email.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full h-11 rounded-xl bg-[hsl(var(--primary))] text-white font-semibold text-sm
                             hover:opacity-90 disabled:opacity-60 transition-opacity flex items-center justify-center gap-2"
                >
                  {mutation.isPending
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
                    : <><Mail className="w-4 h-4" /> Send reset link</>
                  }
                </button>
              </form>

              <p className="text-center text-xs text-[hsl(var(--muted-foreground))] mt-6">
                Remembered it?{' '}
                <Link href="/login" className="text-[hsl(var(--primary))] hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </>
          ) : (
            /* Success State */
            <div className="text-center animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-[hsl(var(--success-muted))] flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-[hsl(var(--success))]" />
              </div>
              <h2 className="text-xl font-extrabold mb-2">Check your inbox</h2>
              <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed mb-2">
                We've sent a password reset link to
              </p>
              <p className="font-semibold text-sm mb-6">{submittedEmail}</p>
              <p className="text-xs text-[hsl(var(--muted-foreground))] mb-8">
                The link expires in 24 hours. Check your spam folder if you don't see it.
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => { setSent(false); }}
                  className="w-full h-10 rounded-xl border border-[hsl(var(--border))] text-sm font-medium hover:bg-[hsl(var(--muted))] transition-colors"
                >
                  Try a different email
                </button>
                <Link
                  href="/login"
                  className="block w-full h-10 rounded-xl bg-[hsl(var(--primary))] text-white text-sm font-semibold
                             hover:opacity-90 transition-opacity flex items-center justify-center"
                >
                  Back to sign in
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
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
