// ─────────────────────────────────────────────────────────────────
// Lightweight UI primitives that mirror shadcn/ui API
// Uses only Tailwind + CSS variables from globals.css
// ─────────────────────────────────────────────────────────────────
import * as React from 'react';
import { cn } from '@/lib/utils';

// ── Button ────────────────────────────────────────────────────────
type ButtonVariant = 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary';
type ButtonSize    = 'default' | 'sm' | 'lg' | 'icon';

const buttonVariants: Record<ButtonVariant, string> = {
  default:     'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:opacity-90',
  outline:     'border border-[hsl(var(--border))] bg-transparent hover:bg-[hsl(var(--muted))]',
  ghost:       'hover:bg-[hsl(var(--muted))] bg-transparent',
  destructive: 'bg-[hsl(var(--destructive))] text-white hover:opacity-90',
  secondary:   'bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--border))]',
};
const buttonSizes: Record<ButtonSize, string> = {
  default: 'h-9 px-4 text-sm',
  sm:      'h-7 px-3 text-xs',
  lg:      'h-11 px-6 text-base',
  icon:    'h-8 w-8',
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?:    ButtonSize;
}
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all',
        'disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none',
        'focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-1',
        buttonVariants[variant],
        buttonSizes[size],
        className,
      )}
      {...props}
    />
  ),
);
Button.displayName = 'Button';

// ── Input ─────────────────────────────────────────────────────────
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'h-9 w-full rounded-lg border bg-[hsl(var(--card))] px-3 text-sm',
        'placeholder:text-[hsl(var(--muted-foreground))] text-[hsl(var(--foreground))]',
        'focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] focus:border-transparent',
        'transition-shadow disabled:opacity-50',
        error ? 'border-[hsl(var(--destructive))]' : 'border-[hsl(var(--input))]',
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = 'Input';

// ── Textarea ──────────────────────────────────────────────────────
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'w-full rounded-lg border bg-[hsl(var(--card))] px-3 py-2 text-sm',
        'placeholder:text-[hsl(var(--muted-foreground))] text-[hsl(var(--foreground))]',
        'focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] focus:border-transparent',
        'transition-shadow resize-none disabled:opacity-50 min-h-[80px]',
        error ? 'border-[hsl(var(--destructive))]' : 'border-[hsl(var(--input))]',
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = 'Textarea';

// ── Select ────────────────────────────────────────────────────────
export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & { error?: boolean }
>(({ className, error, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      'h-9 w-full rounded-lg border bg-[hsl(var(--card))] px-3 text-sm',
      'text-[hsl(var(--foreground))] focus:outline-none focus:ring-2',
      'focus:ring-[hsl(var(--ring))] focus:border-transparent transition-shadow',
      'disabled:opacity-50 cursor-pointer',
      error ? 'border-[hsl(var(--destructive))]' : 'border-[hsl(var(--input))]',
      className,
    )}
    {...props}
  />
));
Select.displayName = 'Select';

// ── Label ─────────────────────────────────────────────────────────
export const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn('text-sm font-medium text-[hsl(var(--foreground))]', className)}
    {...props}
  />
));
Label.displayName = 'Label';

// ── Field (Label + Input + error) ────────────────────────────────
export function Field({
  label, error, required, hint, children,
}: {
  label?: string; error?: string; required?: boolean; hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      {label && (
        <Label>
          {label}
          {required && <span className="text-[hsl(var(--destructive))] ml-0.5">*</span>}
        </Label>
      )}
      {hint && <p className="text-[11px] text-[hsl(var(--muted-foreground))]">{hint}</p>}
      {children}
      {error && <p className="text-xs text-[hsl(var(--destructive))]">{error}</p>}
    </div>
  );
}

// ── Badge ─────────────────────────────────────────────────────────
type BadgeVariant = 'default' | 'success' | 'warning' | 'destructive' | 'secondary' | 'outline';
const badgeVariants: Record<BadgeVariant, string> = {
  default:     'bg-[hsl(var(--primary-muted))] text-[hsl(var(--primary))]',
  success:     'bg-[hsl(var(--success-muted))] text-[hsl(var(--success))]',
  warning:     'bg-[hsl(var(--warning-muted))] text-[hsl(var(--warning))]',
  destructive: 'bg-[hsl(var(--destructive-muted))] text-[hsl(var(--destructive))]',
  secondary:   'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]',
  outline:     'border border-[hsl(var(--border))] text-[hsl(var(--foreground))]',
};
export function Badge({
  children, variant = 'default', className,
}: { children: React.ReactNode; variant?: BadgeVariant; className?: string }) {
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium',
      badgeVariants[variant], className,
    )}>
      {children}
    </span>
  );
}

// ── Card ──────────────────────────────────────────────────────────
export function Card({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl', className)}
      {...props}
    >
      {children}
    </div>
  );
}
export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('px-5 py-4 border-b border-[hsl(var(--border))]', className)}>{children}</div>;
}
export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('px-5 py-4', className)}>{children}</div>;
}
export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('px-5 py-4 border-t border-[hsl(var(--border))] bg-[hsl(var(--muted))]/30', className)}>{children}</div>;
}

// ── Separator ─────────────────────────────────────────────────────
export function Separator({ className }: { className?: string }) {
  return <div className={cn('h-px w-full bg-[hsl(var(--border))]', className)} />;
}

// ── Avatar ────────────────────────────────────────────────────────
export function Avatar({
  name, size = 'sm', className,
}: { name: string; size?: 'xs' | 'sm' | 'md' | 'lg'; className?: string }) {
  const sizes = { xs: 'w-6 h-6 text-[9px]', sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base' };
  const initials = name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
  return (
    <div className={cn(
      sizes[size],
      'rounded-lg bg-[hsl(var(--primary-muted))] text-[hsl(var(--primary))] font-semibold',
      'flex items-center justify-center shrink-0', className,
    )}>
      {initials}
    </div>
  );
}

// ── Empty State ───────────────────────────────────────────────────
export function EmptyState({
  icon: Icon, title, description, action,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string; description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
      <div className="w-12 h-12 rounded-xl bg-[hsl(var(--muted))] flex items-center justify-center">
        <Icon className="w-5 h-5 text-[hsl(var(--muted-foreground))]" />
      </div>
      <div>
        <p className="text-sm font-medium text-[hsl(var(--foreground))]">{title}</p>
        {description && <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">{description}</p>}
      </div>
      {action}
    </div>
  );
}

// ── Page Header ───────────────────────────────────────────────────
export function PageHeader({
  title, description, children,
}: { title: string; description?: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-xl font-bold text-[hsl(var(--foreground))]">{title}</h1>
        {description && (
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-0.5">{description}</p>
        )}
      </div>
      {children && <div className="flex items-center gap-2 shrink-0">{children}</div>}
    </div>
  );
}
