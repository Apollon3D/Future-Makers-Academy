import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Sidebar } from './components/Sidebar'
import { Logo } from './components/Logo'
import { ProfileGate } from './components/ProfileGate'
import { useProgress } from './store/useProgress'
import { useAuth } from './store/useAuth'
import { syncActiveProfile } from './store/session'
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
const Workshop = lazy(() =>
  import('./pages/Workshop').then((m) => ({ default: m.Workshop })),
)
const Certificates = lazy(() =>
  import('./pages/Certificates').then((m) => ({ default: m.Certificates })),
)
const PrinterDetail = lazy(() =>
  import('./pages/PrinterDetail').then((m) => ({ default: m.PrinterDetail })),
)
const Author = lazy(() =>
  import('./pages/Author').then((m) => ({ default: m.Author })),
)
const Settings = lazy(() =>
  import('./pages/Settings').then((m) => ({ default: m.Settings })),
)

/**
 * Top-level gate: wait for the auth store to hydrate from localStorage, then
 * show either the profile picker or the real app. Theme is applied here too,
 * since ProfileGate itself needs to render themed.
 */
function App() {
  const theme = useProgress((s) => s.theme)
  const activeProfileId = useAuth((s) => s.activeProfileId)
  const [hydrated, setHydrated] = useState(useAuth.persist.hasHydrated())
  // Flips true only once syncActiveProfile() has actually run. AuthedApp must
  // not mount before that: React fires a newly-mounted child's effects
  // (e.g. AuthedApp's touchStreak) *before* this component's own effects in
  // the same commit, so if AuthedApp mounted as soon as activeProfileId was
  // known, touchStreak could write the still-default store back to this
  // profile's storage slot before its real saved data was ever loaded —
  // silently resetting it. Gating on this flag (rather than effect timing)
  // makes the ordering explicit instead of relying on commit-order luck.
  const [synced, setSynced] = useState(false)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    if (hydrated) return
    return useAuth.persist.onFinishHydration(() => setHydrated(true))
  }, [hydrated])

  // Once we know who (if anyone) is logged in, load their progress slot —
  // synchronously, before allowing anything downstream to render.
  useEffect(() => {
    if (!hydrated) return
    if (activeProfileId) syncActiveProfile()
    setSynced(true)
  }, [hydrated, activeProfileId])

  if (!hydrated || !synced) return null
  if (!activeProfileId) return <ProfileGate />
  return <AuthedApp />
}

function AuthedApp() {
  const touchStreak = useProgress((s) => s.touchStreak)
  const addTime = useProgress((s) => s.addTime)
  const location = useLocation()
  const [drawerOpen, setDrawerOpen] = useState(false)

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
    // Deliberately no 'beforeunload' flush: a store write triggered right at
    // page teardown races the browser's actual unload — zustand's persist
    // write can lose to it, silently dropping the write (we saw this corrupt
    // more than just the time counter in testing). Losing the last few
    // seconds of a session is a fine trade for never doing that.
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.clearInterval(id)
      document.removeEventListener('visibilitychange', onVisibility)
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
            <Logo size={22} />
            <span className="text-sm font-semibold text-ink">
              Future Makers Academy
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
                <Route path="/certificates" element={<Certificates />} />
                <Route path="/sandbox" element={<Sandbox />} />
                <Route path="/sandbox/:widgetKey" element={<Sandbox />} />
                <Route path="/workshop" element={<Workshop />} />
                <Route path="/workshop/:printerId" element={<PrinterDetail />} />
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
