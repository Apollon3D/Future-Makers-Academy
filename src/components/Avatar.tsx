import { cn } from './ui'

export function Avatar({
  photo,
  name,
  size = 40,
  className,
}: {
  photo?: string
  name: string
  size?: number
  className?: string
}) {
  const initial = name.trim().charAt(0).toUpperCase() || '?'

  if (photo) {
    return (
      <img
        src={photo}
        alt={name}
        className={cn('shrink-0 rounded-full border border-border-strong object-cover', className)}
        style={{ width: size, height: size }}
      />
    )
  }

  return (
    <div
      className={cn(
        'grid shrink-0 place-items-center rounded-full font-semibold text-accent-ink',
        className,
      )}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.42,
        background: 'linear-gradient(135deg, var(--accent), var(--xp))',
      }}
      aria-hidden="true"
    >
      {initial}
    </div>
  )
}
