import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { deleteAllClipsFor } from '../lib/clipsDb'

/**
 * Local student profiles — a lightweight "who's using this device" picker,
 * not a secured account system. Everything lives in this browser; there is
 * no server, so a profile is just an identity + photo, not a password.
 */
export interface StudentProfile {
  id: string
  name: string
  /** Small resized data URL, if the student uploaded a photo. */
  photo?: string
  createdAt: number
}

export const PROGRESS_KEY_PREFIX = 'future-makers-academy-progress'

interface AuthState {
  profiles: StudentProfile[]
  activeProfileId: string | null
  addProfile: (name: string, photo?: string) => string
  updateProfile: (
    id: string,
    patch: Partial<Pick<StudentProfile, 'name' | 'photo'>>,
  ) => void
  removeProfile: (id: string) => void
  setActiveProfile: (id: string | null) => void
}

function makeId(): string {
  return `s_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      profiles: [],
      activeProfileId: null,

      addProfile: (name, photo) => {
        const id = makeId()
        const profile: StudentProfile = {
          id,
          name: name.trim() || 'Student',
          photo,
          createdAt: Date.now(),
        }
        set((s) => ({ profiles: [...s.profiles, profile] }))
        return id
      },

      updateProfile: (id, patch) =>
        set((s) => ({
          profiles: s.profiles.map((p) =>
            p.id === id ? { ...p, ...patch } : p,
          ),
        })),

      removeProfile: (id) => {
        set((s) => ({
          profiles: s.profiles.filter((p) => p.id !== id),
          activeProfileId: s.activeProfileId === id ? null : s.activeProfileId,
        }))
        try {
          localStorage.removeItem(`${PROGRESS_KEY_PREFIX}:${id}`)
        } catch {
          /* storage unavailable — nothing more we can do */
        }
        deleteAllClipsFor(id).catch(() => {
          /* best-effort — an orphaned clip in IndexedDB isn't visible to anyone */
        })
      },

      setActiveProfile: (id) => set({ activeProfileId: id }),
    }),
    { name: 'future-makers-academy-auth', version: 1 },
  ),
)
