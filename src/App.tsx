import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Sidebar } from './components/Sidebar'
import { useProgress } from './store/useProgress'
import { LessonPlayer } from './pages/LessonPlayer'
import { NotFound } from './pages/NotFound'

const Dashboard = lazy(() =>
  import('./pages/Dashboard').then((m) => ({ default: m.Dashboard })),
)
const Pathway = lazy(() =>
  import('./pages/Pathway').then((m) => ({ default: m.Pathway })),
)
const Review = lazy(() =>
  import('./pages/Review').then((m) => ({ default: m.Review })),
)
const Sandbox = lazy(() =>
  import('./pages/Sandbox').then((m) => ({ default: m.Sandbox })),
)
const Author = lazy(() =>
  import('./pages/Author').then((m) => ({ default: m.Author })),
)
const Settings = lazy(() =>
  import('./pages/Settings').then((m) => ({ default: m.Settings })),
)

function App() {
  const theme = useProgress((s) => s.theme)
  const touchStreak = useProgress((s) => s.touchStreak)
  const addTime = useProgress((s) => s.addTime)
  const location = useLocation()
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Apply theme to <html>.
  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  // Streak: count today as active on first load.
  useEffect(() => {
    touchStreak()
  }, [touchStreak])

  // Rough time-on-task: accrue while the tab is visible.
  const lastTick = useRef(Date.now())
  useEffect(() => {
    const flush = () => {
      const now = Date.now()
      const delta = (now - lastTick.current) / 1000
      lastTick.current = now
      if (document.visibilityState === 'visible' && delta < 120) {
        addTime(delta)
      }
    }
    const id = window.setInterval(flush, 30_000)
    const onVisibility = () => {
      if (document.visibilityState === 'visible') lastTick.current = Date.now()
      else flush()
    }
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('beforeunload', flush)
    return () => {
      window.clearInterval(id)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('beforeunload', flush)
    }
  }, [addTime])

  // Close the mobile drawer and scroll up on route change.
  useEffect(() => {
    setDrawerOpen(false)
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="min-h-svh bg-bg text-text">
      <div className="mx-auto flex max-w-[1400px]">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-svh w-64 shrink-0 border-r border-border bg-surface lg:block">
          <Sidebar />
        </aside>

        {/* Mobile drawer */}
        {drawerOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setDrawerOpen(false)}
            />
            <aside className="absolute left-0 top-0 h-full w-64 border-r border-border bg-surface">
              <Sidebar onNavigate={() => setDrawerOpen(false)} />
            </aside>
          </div>
        )}

        <div className="min-w-0 flex-1">
          {/* Mobile top bar */}
          <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-surface/90 px-4 py-2.5 backdrop-blur lg:hidden">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="grid h-9 w-9 place-items-center rounded-lg border border-border text-ink"
              aria-label="Open menu"
            >
              ≡
            </button>
            <span className="text-sm font-semibold text-ink">
              Filament Academy
            </span>
          </div>

          <main className="bp-grid min-h-svh px-4 py-6 sm:px-8 sm:py-10">
            <div className="mx-auto max-w-4xl">
              <Suspense
                fallback={
                  <div className="grid place-items-center py-20 text-sm text-muted">
                    Loading…
                  </div>
                }
              >
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/pathway" element={<Pathway />} />
                <Route
                  path="/learn/:moduleId/:lessonId"
                  element={<LessonPlayer />}
                />
                <Route path="/review" element={<Review />} />
                <Route path="/sandbox" element={<Sandbox />} />
                <Route path="/sandbox/:widgetKey" element={<Sandbox />} />
                <Route path="/author" element={<Author />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              </Suspense>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default App
