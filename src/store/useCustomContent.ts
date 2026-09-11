import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Authored curriculum content (from the Author tool) is shared by every
 * student on this device — unlike useProgress, it is NOT scoped per profile.
 */
interface CustomContentState {
  customModules: unknown[]
  addCustomModule: (mod: unknown) => void
  removeCustomModule: (id: string) => void
}

export const useCustomContent = create<CustomContentState>()(
  persist(
    (set) => ({
      customModules: [],
      addCustomModule: (mod) =>
        set((s) => ({ customModules: [...s.customModules, mod] })),
      removeCustomModule: (id) =>
        set((s) => ({
          customModules: s.customModules.filter(
            (m) => (m as { id?: string }).id !== id,
          ),
        })),
    }),
    { name: 'future-makers-academy-content', version: 1 },
  ),
)
