import { useMemo } from 'react'
import { useProgress } from '../store/useProgress'
import type { Curriculum, Module } from '../types'
import { mergeCurriculum } from './index'

/** The active curriculum = built-in modules + any authored in-app. */
export function useCurriculum(): Curriculum {
  const customModules = useProgress((s) => s.customModules)
  return useMemo(
    () => mergeCurriculum(customModules as Module[]),
    [customModules],
  )
}
