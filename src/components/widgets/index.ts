import type { ComponentType } from 'react'
import { SlicerSim } from './SlicerSim'
import { AxisVisualizer } from './AxisVisualizer'
import { MaterialPicker } from './MaterialPicker'
import { InfillCompare } from './InfillCompare'
import { ZOffset } from './ZOffset'
import { OverhangDial } from './OverhangDial'

export interface WidgetMeta {
  component: ComponentType
  title: string
  description: string
}

/**
 * The widget registry. Lesson JSON references a widget by key; the Sandbox
 * lists every entry. Add a widget here and it is available everywhere.
 */
export const WIDGETS: Record<string, WidgetMeta> = {
  'slicer-sim': {
    component: SlicerSim,
    title: 'Slicer Simulator',
    description:
      'Move layer height, infill, speed and walls; watch print time, strength and quality trade off.',
  },
  'axis-visualizer': {
    component: AxisVisualizer,
    title: 'Coordinate System',
    description: 'Drive a virtual print head through X, Y and Z over the bed.',
  },
  'material-picker': {
    component: MaterialPicker,
    title: 'Material Selector',
    description:
      'Answer a few questions about your part and get a ranked filament recommendation.',
  },
  'infill-compare': {
    component: InfillCompare,
    title: 'Infill Pattern Comparison',
    description: 'Grid vs. gyroid, and how each behaves under different loads.',
  },
  'z-offset': {
    component: ZOffset,
    title: 'First-Layer Squish',
    description: 'See how the nozzle gap changes bead shape and adhesion.',
  },
  'overhang-dial': {
    component: OverhangDial,
    title: 'Overhang Angle',
    description: 'Sweep the overhang angle and find where a printer stops coping.',
  },
}

export function getWidget(key: string): WidgetMeta | undefined {
  return WIDGETS[key]
}
