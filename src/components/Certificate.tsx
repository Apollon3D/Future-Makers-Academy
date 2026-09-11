import type { Certificate as CertificateData } from '../store/useProgress'
import type { Level } from '../content/levels'
import { Logo } from './Logo'

export function Certificate({
  studentName,
  level,
  certificate,
}: {
  studentName: string
  level: Level
  certificate: CertificateData
}) {
  const date = new Date(certificate.earnedAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div
      className="certificate-print relative mx-auto aspect-[1.414/1] w-full max-w-2xl overflow-hidden rounded-xl border-[3px] p-8 sm:p-12"
      style={{
        borderColor: 'var(--xp)',
        background:
          'radial-gradient(120% 100% at 0% 0%, color-mix(in srgb, var(--accent) 10%, var(--surface)), var(--surface) 60%)',
      }}
    >
      {/* corner flourishes */}
      <div
        className="pointer-events-none absolute inset-3 rounded-lg border"
        style={{ borderColor: 'color-mix(in srgb, var(--xp) 45%, transparent)' }}
      />

      <div className="flex h-full flex-col items-center justify-between text-center">
        <div className="flex flex-col items-center gap-2">
          <Logo size={48} />
          <div className="text-xs font-semibold uppercase tracking-[0.25em] text-muted">
            Future Makers Academy
          </div>
        </div>

        <div>
          <div className="text-sm font-medium uppercase tracking-[0.2em] text-xp">
            Certificate of Achievement
          </div>
          <div className="mt-4 text-3xl font-semibold text-ink sm:text-4xl">
            {studentName}
          </div>
          <p className="mx-auto mt-4 max-w-md text-sm text-text">
            has successfully completed the requirements of
          </p>
          <div className="mt-2 text-xl font-semibold text-accent sm:text-2xl">
            Level {level.number}: {level.name}
          </div>
          <p className="mx-auto mt-2 max-w-md text-xs text-muted">
            {level.tagline}
          </p>
        </div>

        <div className="flex w-full items-end justify-between text-left text-xs text-muted">
          <div>
            <div className="text-ink">{date}</div>
            <div>Date earned</div>
          </div>
          <div className="text-right">
            <div className="font-mono text-ink">{certificate.serial}</div>
            <div>Certificate ID</div>
          </div>
        </div>
      </div>
    </div>
  )
}
