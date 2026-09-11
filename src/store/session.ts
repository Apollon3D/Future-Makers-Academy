import { useAuth, PROGRESS_KEY_PREFIX } from './useAuth'
import { useProgress, DEFAULT_PROGRESS, type ProgressData } from './useProgress'

/**
 * Loads a profile's saved progress directly from its storage slot and
 * replaces useProgress's data fields with it (falling back to defaults for
 * anything missing — e.g. a brand-new profile, or fields added since the
 * data was last saved). Reading straight from localStorage here — rather
 * than relying on zustand persist's own async rehydration — avoids any race
 * between "which profile is active" and "which slot got read".
 */
function loadProgressFor(id: string) {
  let saved: Partial<ProgressData> = {}
  try {
    const raw = localStorage.getItem(`${PROGRESS_KEY_PREFIX}:${id}`)
    if (raw) saved = (JSON.parse(raw)?.state ?? {}) as Partial<ProgressData>
  } catch {
    /* corrupt or missing — start fresh for this profile */
  }
  useProgress.setState({ ...DEFAULT_PROGRESS, ...saved })
}

/**
 * Log in as `id`: makes it the active profile, loads its progress, and sends
 * the browser back to the dashboard (a hard reload — simplest way to
 * guarantee no other page's local state leaks between students).
 */
export function switchProfile(id: string) {
  useAuth.getState().setActiveProfile(id)
  loadProgressFor(id)
  window.location.assign('/')
}

/** Re-sync useProgress to whichever profile useAuth already has active —
 *  call once after auth has hydrated on app start. */
export function syncActiveProfile() {
  const id = useAuth.getState().activeProfileId
  if (id) loadProgressFor(id)
}

/** Return to the profile picker. */
export function logout() {
  useAuth.getState().setActiveProfile(null)
  useProgress.setState({ ...DEFAULT_PROGRESS })
}
