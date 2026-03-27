'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  Briefcase, ArrowRight, Check, ChevronRight, Zap,
  Users, BarChart2, Shield, Globe, Layers, Bell,
  Star, Menu, X, MoveRight, Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Nav ─────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'About', href: '#about' },
];

const PLANS = [
  {
    name: 'Starter',
    price: 0,
    desc: 'Perfect for small teams just getting started.',
    features: ['3 active jobs', '100 candidates', 'Basic pipeline', 'Email support'],
    cta: 'Get started free',
    highlight: false,
  },
  {
    name: 'Growth',
    price: 2499,
    desc: 'For growing teams that need more power.',
    features: ['Unlimited jobs', '10,000 candidates', 'Custom pipeline', 'Feature flags', 'API access', 'Priority support'],
    cta: 'Start free trial',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: null,
    desc: 'For large organizations with advanced needs.',
    features: ['Everything in Growth', 'SSO / SAML', 'HRIS integrations', 'Advanced analytics', 'Dedicated CSM', 'SLA guarantee'],
    cta: 'Contact sales',
    highlight: false,
  },
];

const FEATURES = [
  {
    icon: Briefcase,
    title: 'Smart Job Management',
    desc: 'Create, publish, and manage job postings with custom approval workflows and multi-stage pipelines.',
    color: 'text-primary bg-[hsl(var(--primary-muted))]',
  },
  {
    icon: Users,
    title: 'Candidate Profiles',
    desc: 'Full-text search, AI resume parsing, duplicate detection, and rich candidate timelines.',
    color: 'text-[hsl(var(--success))] bg-[hsl(var(--success-muted))]',
  },
  {
    icon: Layers,
    title: 'Pipeline & Kanban',
    desc: 'Drag-and-drop kanban boards, stage-wise tracking, and disqualification workflows.',
    color: 'text-[hsl(var(--warning))] bg-[hsl(var(--warning-muted))]',
  },
  {
    icon: Bell,
    title: 'Smart Notifications',
    desc: 'Real-time notifications, event-driven emails, and customizable email templates.',
    color: 'text-primary bg-[hsl(var(--primary-muted))]',
  },
  {
    icon: Shield,
    title: 'Roles & Permissions',
    desc: 'Granular CRUD permissions per role. System roles + custom roles. Full audit trail.',
    color: 'text-[hsl(var(--success))] bg-[hsl(var(--success-muted))]',
  },
  {
    icon: BarChart2,
    title: 'Reports & Analytics',
    desc: 'Time-to-hire metrics, pipeline funnel analysis, recruiter performance, and exports.',
    color: 'text-[hsl(var(--warning))] bg-[hsl(var(--warning-muted))]',
  },
  {
    icon: Globe,
    title: 'Multi-Tenant SaaS',
    desc: 'Full multi-tenant isolation. Each workspace gets its own subdomain, data, and config.',
    color: 'text-primary bg-[hsl(var(--primary-muted))]',
  },
  {
    icon: Zap,
    title: 'Feature Flags',
    desc: '44+ feature flags. Enable/disable any module per tenant without code deployments.',
    color: 'text-[hsl(var(--success))] bg-[hsl(var(--success-muted))]',
  },
];

const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    role: 'Head of Talent, TechCorp',
    avatar: 'PS',
    quote: 'We reduced our time-to-hire from 45 days to 18 days. The pipeline visibility is unmatched.',
    stars: 5,
  },
  {
    name: 'Rahul Mehta',
    role: 'Founder, HireRight Agency',
    avatar: 'RM',
    quote: 'The client portal feature transformed our agency. Clients can now see candidate submissions in real-time.',
    stars: 5,
  },
  {
    name: 'Anjali Singh',
    role: 'HR Manager, StartupX',
    avatar: 'AS',
    quote: 'Setup took under an hour. The approval workflows and role permissions are exactly what we needed.',
    stars: 5,
  },
];

const STEPS = [
  { step: '01', title: 'Create your workspace', desc: 'Sign up, choose your plan, and get a dedicated subdomain in minutes.' },
  { step: '02', title: 'Post your first job', desc: 'Add job details, set a pipeline, and publish to your career page instantly.' },
  { step: '03', title: 'Track candidates', desc: 'Review applications, schedule interviews, and move candidates through stages.' },
  { step: '04', title: 'Hire & measure', desc: 'Extend offers, track acceptance rates, and analyze your pipeline metrics.' },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">

      {/* ── Navbar ───────────────────────────────────────────────── */}
      <header className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-200',
        scrolled
          ? 'bg-[hsl(var(--card))]/95 backdrop-blur-md border-b border-[hsl(var(--border))] shadow-sm'
          : 'bg-transparent',
      )}>
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[hsl(var(--primary))] flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-sm tracking-tight">ATS Platform</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="px-3 py-1.5 text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] rounded-lg hover:bg-[hsl(var(--muted))] transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/login"
              className="px-4 h-9 rounded-lg text-sm font-medium border border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))] transition-colors flex items-center"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="px-4 h-9 rounded-lg text-sm font-medium bg-[hsl(var(--primary))] text-white hover:opacity-90 transition-opacity flex items-center gap-1.5"
            >
              Get started <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-4 space-y-1 animate-fade-in">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm hover:bg-[hsl(var(--muted))] transition-colors"
              >
                {l.label}
              </a>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              <Link href="/login" className="block text-center px-4 py-2 rounded-lg border border-[hsl(var(--border))] text-sm font-medium">
                Sign in
              </Link>
              <Link href="/register" className="block text-center px-4 py-2 rounded-lg bg-[hsl(var(--primary))] text-white text-sm font-medium">
                Get started free
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[hsl(var(--primary-muted))] border border-[hsl(var(--primary))]/20 text-[hsl(var(--primary))] text-xs font-medium mb-6">
            <Sparkles className="w-3 h-3" />
            Now with AI resume parsing & smart matching
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6">
            Hire smarter,{' '}
            <span className="text-[hsl(var(--primary))]">faster</span>,{' '}
            together.
          </h1>

          <p className="text-base md:text-lg text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto mb-10 leading-relaxed">
            End-to-end applicant tracking for agencies and in-house teams.
            Multi-tenant, feature-flag-driven, built for scale — from 5 to 50,000 hires.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-xl bg-[hsl(var(--primary))] text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-[hsl(var(--primary))]/20"
            >
              Start for free <MoveRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-xl border border-[hsl(var(--border))] font-medium text-sm hover:bg-[hsl(var(--muted))] transition-colors"
            >
              Sign in to workspace
            </Link>
          </div>

          {/* Social proof */}
          <div className="mt-10 flex items-center justify-center gap-6 text-xs text-[hsl(var(--muted-foreground))]">
            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[hsl(var(--success))]" /> No credit card required</span>
            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[hsl(var(--success))]" /> 14-day free trial</span>
            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[hsl(var(--success))]" /> Cancel anytime</span>
          </div>
        </div>

        {/* Hero Visual — Dashboard Preview */}
        <div className="max-w-5xl mx-auto mt-16">
          <div className="relative rounded-2xl border border-[hsl(var(--border))] shadow-2xl shadow-black/5 overflow-hidden bg-[hsl(var(--card))]">
            {/* Fake browser bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[hsl(var(--border))] bg-[hsl(var(--muted))]/50">
              <div className="w-3 h-3 rounded-full bg-red-400/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
              <div className="w-3 h-3 rounded-full bg-green-400/60" />
              <div className="flex-1 flex justify-center">
                <div className="h-5 w-56 rounded bg-[hsl(var(--border))] text-[10px] flex items-center justify-center text-[hsl(var(--muted-foreground))]">
                  acme.ats-platform.com/dashboard
                </div>
              </div>
            </div>
            {/* Mock dashboard UI */}
            <DashboardPreview />
          </div>
        </div>
      </section>

      {/* ── Logos / Trust ────────────────────────────────────────── */}
      <section className="py-12 border-y border-[hsl(var(--border))] bg-[hsl(var(--muted))]/30">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-xs text-[hsl(var(--muted-foreground))] uppercase tracking-widest font-semibold mb-8">
            Trusted by teams at
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-50">
            {['Groww', 'Razorpay', 'Zepto', 'Meesho', 'Cred', 'Slice', 'PhonePe'].map((n) => (
              <span key={n} className="text-sm font-bold tracking-tight">{n}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            badge="Features"
            title="Everything your hiring team needs"
            sub="From sourcing to offer, every step of the recruitment process — in one platform."
          />
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-5 hover:shadow-md transition-shadow group">
                <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center mb-4', f.color)}>
                  <f.icon className="w-4.5 h-4.5" />
                </div>
                <h3 className="font-semibold text-sm mb-1.5">{f.title}</h3>
                <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-4 bg-[hsl(var(--muted))]/30">
        <div className="max-w-5xl mx-auto">
          <SectionHeader
            badge="How it works"
            title="Up and running in minutes"
            sub="No complex setup. No IT required. Just create your workspace and start hiring."
          />
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s, i) => (
              <div key={s.step} className="relative">
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-full w-full h-px bg-[hsl(var(--border))] -translate-x-1/2 z-0" />
                )}
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-[hsl(var(--primary-muted))] border border-[hsl(var(--primary))]/20 flex items-center justify-center mb-4">
                    <span className="text-sm font-bold text-[hsl(var(--primary))]">{s.step}</span>
                  </div>
                  <h3 className="font-semibold text-sm mb-2">{s.title}</h3>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────────── */}
      <section id="pricing" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <SectionHeader
            badge="Pricing"
            title="Simple, transparent pricing"
            sub="Start free. Scale as you grow. No hidden fees."
          />
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={cn(
                  'relative rounded-2xl border p-7 flex flex-col',
                  plan.highlight
                    ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary-muted))] shadow-xl shadow-[hsl(var(--primary))]/10'
                    : 'border-[hsl(var(--border))] bg-[hsl(var(--card))]',
                )}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 rounded-full bg-[hsl(var(--primary))] text-white text-[10px] font-bold uppercase tracking-wider">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="mb-5">
                  <h3 className="font-bold text-base">{plan.name}</h3>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">{plan.desc}</p>
                </div>
                <div className="mb-6">
                  {plan.price === null ? (
                    <span className="text-3xl font-extrabold">Custom</span>
                  ) : plan.price === 0 ? (
                    <span className="text-3xl font-extrabold">Free</span>
                  ) : (
                    <div>
                      <span className="text-3xl font-extrabold">₹{plan.price.toLocaleString('en-IN')}</span>
                      <span className="text-sm text-[hsl(var(--muted-foreground))]">/month</span>
                    </div>
                  )}
                </div>
                <ul className="space-y-2.5 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-xs">
                      <Check className="w-3.5 h-3.5 text-[hsl(var(--success))] shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.price === null ? '/contact' : '/register'}
                  className={cn(
                    'w-full h-10 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 transition-opacity',
                    plan.highlight
                      ? 'bg-[hsl(var(--primary))] text-white hover:opacity-90'
                      : 'border border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))]',
                  )}
                >
                  {plan.cta} <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-[hsl(var(--muted))]/30">
        <div className="max-w-5xl mx-auto">
          <SectionHeader
            badge="Testimonials"
            title="Loved by recruitment teams"
            sub="See what hiring managers and agency owners say about ATS Platform."
          />
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl p-6">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[hsl(var(--warning))] text-[hsl(var(--warning))]" />
                  ))}
                </div>
                <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed mb-5">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[hsl(var(--primary-muted))] text-[hsl(var(--primary))] text-xs font-bold flex items-center justify-center">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-xs font-semibold">{t.name}</p>
                    <p className="text-[10px] text-[hsl(var(--muted-foreground))]">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────── */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center bg-[hsl(var(--primary))] rounded-3xl p-12 shadow-2xl shadow-[hsl(var(--primary))]/20">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
            Ready to transform your hiring?
          </h2>
          <p className="text-white/80 text-sm mb-8">
            Join thousands of companies using ATS Platform to hire faster.
            Free forever for small teams.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-xl bg-white text-[hsl(var(--primary))] font-bold text-sm hover:bg-white/90 transition-colors"
            >
              Start free today <MoveRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center h-12 px-8 rounded-xl border border-white/30 text-white font-medium text-sm hover:bg-white/10 transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="border-t border-[hsl(var(--border))] py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[hsl(var(--primary))] flex items-center justify-center">
                <Briefcase className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-sm">ATS Platform</span>
            </div>
            <div className="flex items-center gap-6 text-xs text-[hsl(var(--muted-foreground))]">
              <a href="#" className="hover:text-[hsl(var(--foreground))] transition-colors">Privacy</a>
              <a href="#" className="hover:text-[hsl(var(--foreground))] transition-colors">Terms</a>
              <a href="#" className="hover:text-[hsl(var(--foreground))] transition-colors">Contact</a>
            </div>
            <p className="text-xs text-[hsl(var(--muted-foreground))]">
              © {new Date().getFullYear()} ATS Platform. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── Section Header Component ─────────────────────────────────────
function SectionHeader({ badge, title, sub }: { badge: string; title: string; sub: string }) {
  return (
    <div className="text-center">
      <span className="inline-block px-3 py-1 rounded-full bg-[hsl(var(--primary-muted))] text-[hsl(var(--primary))] text-xs font-semibold mb-4">
        {badge}
      </span>
      <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-3">{title}</h2>
      <p className="text-sm text-[hsl(var(--muted-foreground))] max-w-xl mx-auto leading-relaxed">{sub}</p>
    </div>
  );
}

// ─── Dashboard Preview (static mockup) ───────────────────────────
function DashboardPreview() {
  const stats = [
    { label: 'Active Jobs', value: '24', color: 'bg-[hsl(var(--primary-muted))] text-[hsl(var(--primary))]' },
    { label: 'Candidates', value: '1,842', color: 'bg-[hsl(var(--success-muted))] text-[hsl(var(--success))]' },
    { label: 'Interviews', value: '12', color: 'bg-[hsl(var(--warning-muted))] text-[hsl(var(--warning))]' },
    { label: 'Hired', value: '8', color: 'bg-[hsl(var(--primary-muted))] text-[hsl(var(--primary))]' },
  ];
  const stages = [
    { name: 'Applied', count: 142, pct: 100 },
    { name: 'Screening', count: 89, pct: 63 },
    { name: 'Interview', count: 54, pct: 38 },
    { name: 'Offer', count: 18, pct: 13 },
  ];
  return (
    <div className="p-5 bg-[hsl(var(--background))]">
      <div className="grid grid-cols-4 gap-3 mb-5">
        {stats.map((s) => (
          <div key={s.label} className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-3">
            <div className={cn('text-lg font-extrabold', s.color.split(' ')[1])}>{s.value}</div>
            <div className="text-[10px] text-[hsl(var(--muted-foreground))] mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-4">
        <p className="text-xs font-semibold mb-4">Pipeline Funnel</p>
        <div className="space-y-2.5">
          {stages.map((s) => (
            <div key={s.name} className="flex items-center gap-3">
              <span className="text-[10px] text-[hsl(var(--muted-foreground))] w-16 shrink-0">{s.name}</span>
              <div className="flex-1 h-2 bg-[hsl(var(--muted))] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[hsl(var(--primary))] rounded-full transition-all"
                  style={{ width: `${s.pct}%` }}
                />
              </div>
              <span className="text-[10px] font-semibold w-6 text-right">{s.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
