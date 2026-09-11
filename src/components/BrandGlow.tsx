/** A soft ambient teal/gold glow. Drop as the first child of a `relative isolate` header. */
export function BrandGlow() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -inset-x-6 -top-14 -z-10 h-48 opacity-80 blur-2xl"
      style={{
        background:
          'radial-gradient(420px 170px at 18% 20%, color-mix(in srgb, var(--accent) 22%, transparent), transparent 70%), radial-gradient(340px 150px at 88% 0%, color-mix(in srgb, var(--xp) 20%, transparent), transparent 70%)',
      }}
    />
  )
}
