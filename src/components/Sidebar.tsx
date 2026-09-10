import { NavLink } from 'react-router-dom'
import { useProgress } from '../store/useProgress'
import { useCurriculum } from '../content/useCurriculum'
import { allCards, overallProgress } from '../content'
import { cn } from './ui'

const NAV = [
  { to: '/', label: 'Dashboard', icon: '◱', end: true },
  { to: '/pathway', label: 'Learning Path', icon: '⋔' },
  { to: '/review', label: 'Review', icon: '↻' },
  { to: '/workshop', label: 'Workshop', icon: '⚒' },
  { to: '/sandbox', label: 'Sandbox', icon: '⚙' },
  { to: '/author', label: 'Author', icon: '✎' },
  { to: '/settings', label: 'Settings', icon: '⚑' },
]

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const curr = useCurriculum()
  const { xp, streak, completedLessons, theme, setTheme, dueCardIds } =
    useProgress()

  const cardIds = [...allCards(curr).keys()]
  const due = dueCardIds(cardIds).length
  const overall = overallProgress(curr, completedLessons)

  return (
    <div className="flex h-full flex-col gap-1 p-3">
      <div className="flex items-center gap-2.5 px-2 py-3">
        <svg viewBox="0 0 32 32" className="h-7 w-7">
          <g
            stroke="var(--accent)"
            strokeWidth="2.4"
            strokeLinecap="round"
            fill="none"
          >
            <path d="M5 22c4-1.7 7-1.7 11 0s7 1.7 11 0" />
            <path d="M5 16c4-1.7 7-1.7 11 0s7 1.7 11 0" opacity="0.65" />
            <path d="M5 10c4-1.7 7-1.7 11 0s7 1.7 11 0" opacity="0.35" />
          </g>
        </svg>
        <div className="leading-tight">
          <div className="text-sm font-semibold text-ink">Filament Academy</div>
          <div className="text-[11px] text-muted">FDM, from first layer up</div>
        </div>
      </div>

      <div className="mx-2 mb-2 rounded-lg border border-border bg-surface-2 p-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted">Course progress</span>
          <span className="font-mono text-ink">{Math.round(overall.pct)}%</span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-3">
          <div
            className="h-full rounded-full bg-accent"
            style={{ width: `${overall.pct}%` }}
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
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-accent-soft text-accent'
                  : 'text-text hover:bg-surface-2 hover:text-ink',
              )
            }
          >
            <span className="w-4 text-center text-base leading-none opacity-80">
              {item.icon}
            </span>
            <span className="flex-1">{item.label}</span>
            {item.to === '/review' && due > 0 && (
              <span className="rounded-full bg-accent px-1.5 text-[11px] font-semibold text-accent-ink">
                {due}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="mt-auto flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted hover:bg-surface-2 hover:text-ink"
      >
        <span className="w-4 text-center">{theme === 'dark' ? '☾' : '☀'}</span>
        {theme === 'dark' ? 'Dark' : 'Light'} theme
      </button>
    </div>
  )
}
