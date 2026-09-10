import type { ButtonHTMLAttributes, ReactNode } from 'react'

export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}

export function Card({
  children,
  className,
  as: As = 'div',
}: {
  children: ReactNode
  className?: string
  as?: 'div' | 'section' | 'article'
}) {
  return (
    <As
      className={cn(
        'rounded-xl border border-border bg-surface p-5 shadow-sm',
        className,
      )}
    >
      {children}
    </As>
  )
}

type BadgeTone = 'accent' | 'muted' | 'success' | 'warn' | 'danger' | 'xp'

const badgeTones: Record<BadgeTone, string> = {
  accent: 'bg-accent-soft text-accent',
  muted: 'bg-surface-3 text-muted',
  success: 'text-success bg-[color-mix(in_srgb,var(--success)_14%,transparent)]',
  warn: 'text-warn bg-[color-mix(in_srgb,var(--warn)_14%,transparent)]',
  danger: 'text-danger bg-[color-mix(in_srgb,var(--danger)_14%,transparent)]',
  xp: 'bg-xp-soft text-xp',
}

export function Badge({
  children,
  tone = 'muted',
  className,
}: {
  children: ReactNode
  tone?: BadgeTone
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
        badgeTones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

type ButtonVariant = 'primary' | 'ghost' | 'outline' | 'danger'

const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    'bg-accent text-accent-ink hover:brightness-110 disabled:opacity-50 disabled:hover:brightness-100',
  ghost: 'text-text hover:bg-surface-2 hover:text-ink',
  outline: 'border border-border-strong text-text hover:bg-surface-2 hover:text-ink',
  danger:
    'border border-[color-mix(in_srgb,var(--danger)_40%,transparent)] text-danger hover:bg-[color-mix(in_srgb,var(--danger)_12%,transparent)]',
}

export function Button({
  children,
  variant = 'primary',
  className,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
}) {
  return (
    <button
      {...rest}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-[background-color,filter,color] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        buttonVariants[variant],
        className,
      )}
    >
      {children}
    </button>
  )
}

/** SVG donut progress ring. */
export function ProgressRing({
  value,
  size = 56,
  stroke = 5,
  label,
  tone = 'var(--accent)',
}: {
  value: number
  size?: number
  stroke?: number
  label?: ReactNode
  tone?: string
}) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const pct = Math.max(0, Math.min(100, value))
  return (
    <div
      className="relative grid place-items-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--surface-3)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={tone}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (pct / 100) * c}
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      <span className="absolute text-xs font-semibold text-ink">
        {label ?? `${Math.round(pct)}%`}
      </span>
    </div>
  )
}

export function StatTile({
  label,
  value,
  hint,
  tone = 'accent',
}: {
  label: string
  value: ReactNode
  hint?: string
  tone?: 'accent' | 'xp' | 'plain'
}) {
  const valueColor =
    tone === 'xp' ? 'text-xp' : tone === 'accent' ? 'text-accent' : 'text-ink'
  return (
    <Card className="p-4">
      <div className="text-xs font-medium uppercase tracking-wide text-muted">
        {label}
      </div>
      <div className={cn('mt-1 font-mono text-2xl font-semibold', valueColor)}>
        {value}
      </div>
      {hint && <div className="mt-0.5 text-xs text-muted">{hint}</div>}
    </Card>
  )
}

export function Labeled({
  label,
  children,
  hint,
}: {
  label: string
  children: ReactNode
  hint?: string
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-ink">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  )
}

export function EmptyState({
  title,
  children,
}: {
  title: string
  children?: ReactNode
}) {
  return (
    <Card className="grid place-items-center py-14 text-center">
      <div className="max-w-sm">
        <h3 className="text-base font-semibold text-ink">{title}</h3>
        {children && <p className="mt-2 text-sm text-muted">{children}</p>}
      </div>
    </Card>
  )
}
