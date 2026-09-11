/**
 * The Future Makers Academy mark: an Apollo sun rising over the print layers.
 * Colour-adapts to the active theme via CSS vars — safe to drop anywhere.
 */
export function Logo({
  size = 28,
  className,
}: {
  size?: number
  className?: string
}) {
  const cx = 24
  const cy = 13
  const rIn = 6.2
  const rOut = 9.8
  const rays = Array.from({ length: 8 }, (_, i) => (i * Math.PI) / 4)

  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      <g stroke="var(--xp)" strokeWidth={2.4} strokeLinecap="round">
        {rays.map((a, i) => (
          <line
            key={i}
            x1={cx + rIn * Math.cos(a)}
            y1={cy + rIn * Math.sin(a)}
            x2={cx + rOut * Math.cos(a)}
            y2={cy + rOut * Math.sin(a)}
          />
        ))}
      </g>
      <circle cx={cx} cy={cy} r={4.8} fill="var(--xp)" />
      <g
        stroke="var(--accent)"
        strokeWidth={2.6}
        strokeLinecap="round"
        fill="none"
      >
        <path d="M6 40c6-3 12-3 18 0s12 3 18 0" opacity={1} />
        <path d="M6 34c6-3 12-3 18 0s12 3 18 0" opacity={0.62} />
        <path d="M6 28c6-3 12-3 18 0s12 3 18 0" opacity={0.32} />
      </g>
    </svg>
  )
}
