/**
 * The Apollon3D mark, in a white badge so it reads clearly on both the dark
 * and light themes. `size` is the overall badge diameter in px.
 */
export function Logo({
  size = 28,
  className,
}: {
  size?: number
  className?: string
}) {
  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: '#fff',
        display: 'grid',
        placeItems: 'center',
        flexShrink: 0,
        boxShadow: '0 0 0 1px var(--border)',
      }}
    >
      <img
        src="/apollon3d-mark.png"
        alt="Apollon3D"
        style={{ width: '68%', height: '68%', objectFit: 'contain' }}
      />
    </div>
  )
}
