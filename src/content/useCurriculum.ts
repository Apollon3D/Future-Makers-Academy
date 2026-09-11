import { useMemo } from 'react'
import { useCustomContent } from '../store/useCustomContent'
import type { Curriculum, Module } from '../types'
import { mergeCurriculum } from './index'

/** The active curriculum = built-in modules + any authored in-app. */
export function useCurriculum(): Curriculum {
  const customModules = useCustomContent((s) => s.customModules)
  return useMemo(
    () => mergeCurriculum(customModules as Module[]),
    [customModules],
  )
}
