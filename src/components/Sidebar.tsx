import { NavLink } from 'react-router-dom'
import { useProgress } from '../store/useProgress'
import { useAuth } from '../store/useAuth'
import { logout } from '../store/session'
import { useCurriculum } from '../content/useCurriculum'
import { allCards, overallProgress } from '../content'
import { cn } from './ui'
import { Logo } from './Logo'
import { Avatar } from './Avatar'

const NAV = [
  { to: '/', label: 'Dashboard', icon: '◱', end: true },
  { to: '/pathway', label: 'Learning Path', icon: '⋔' },
  { to: '/tips', label: 'Quick Tips', icon: '▶' },
  { to: '/review', label: 'Review', icon: '↻' },
  { to: '/certificates', label: 'Certificates', icon: '🎓' },
  { to: '/workshop', label: 'Workshop', icon: '⚒' },
  { to: '/sandbox', label: 'Sandbox', icon: '⚙' },
  { to: '/author', label: 'Author', icon: '✎' },
  { to: '/settings', label: 'Settings', icon: '⚑' },
]

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const curr = useCurriculum()
  const { xp, streak, completedLessons, theme, setTheme, dueCardIds } =
    useProgress()
  const student = useAuth((s) =>
    s.profiles.find((p) => p.id === s.activeProfileId),
  )

  const cardIds = [...allCards(curr).keys()]
  const due = dueCardIds(cardIds).length
  const overall = overallProgress(curr, completedLessons)

  return (
    <div className="flex h-full flex-col gap-1 p-3">
      <div className="flex items-center gap-2.5 px-2 py-3">
        <Logo size={34} />
        <div className="leading-tight">
          <div className="text-sm font-semibold text-ink">Future Makers</div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-xp">
            Academy
          </div>
        </div>
      </div>

      {student && (
        <div className="mx-2 mb-2 flex items-center gap-2.5 rounded-lg border border-border bg-surface-2 px-3 py-2">
          <Avatar photo={student.photo} name={student.name} size={30} />
          <div className="min-w-0 flex-1 leading-tight">
            <div className="truncate text-sm font-medium text-ink">
              {student.name}
            </div>
            <button
              type="button"
              onClick={logout}
              className="text-[11px] text-muted hover:text-accent"
            >
              Switch student
            </button>
          </div>
        </div>
      )}

      <div className="mx-2 mb-2 overflow-hidden rounded-lg border border-border bg-surface-2 p-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted">Course progress</span>
          <span className="font-mono text-ink">{Math.round(overall.pct)}%</span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-3">
          <div
            className="h-full rounded-full"
            style={{
              width: `${overall.pct}%`,
              background:
                'linear-gradient(90deg, var(--accent), var(--xp))',
            }}
          />
        </div>
        <div className="mt-2 flex gap-3 text-[11px] text-muted">
          <span>
            <span className="font-mono text-xp">{xp}</span> XP
          </span>
          <span>
            🔥 <span className="font-mono text-ink">{streak.current}</span> day
            {streak.current === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      <nav className="flex flex-col gap-0.5">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-accent-soft text-accent'
                  : 'text-text hover:bg-surface-2 hover:text-ink',
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute inset-y-1.5 left-0 w-[3px] rounded-full bg-accent shadow-[0_0_8px_var(--accent)]" />
                )}
                <span className="w-4 text-center text-base leading-none opacity-80">
                  {item.icon}
                </span>
                <span className="flex-1">{item.label}</span>
                {item.to === '/review' && due > 0 && (
                  <span className="rounded-full bg-accent px-1.5 text-[11px] font-semibold text-accent-ink">
                    {due}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto space-y-1">
        <button
          type="button"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted hover:bg-surface-2 hover:text-ink"
        >
          <span className="w-4 text-center">{theme === 'dark' ? '☾' : '☀'}</span>
          {theme === 'dark' ? 'Dark' : 'Light'} theme
        </button>
        <a
          href="https://apollon3d.com"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 px-3 py-1 text-[11px] text-muted hover:text-xp"
        >
          <span aria-hidden="true">✦</span>
          Built by Apollon3D
        </a>
      </div>
    </div>
  )
}
