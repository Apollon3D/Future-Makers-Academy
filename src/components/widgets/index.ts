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
      'Layer height, infill, walls, speed and temperature vs. print time, strength, quality and stringing — with a live cutaway of the part.',
  },
  'axis-visualizer': {
    component: AxisVisualizer,
    title: 'Coordinate System & Layers',
    description:
      'Watch the nozzle trace each layer’s toolpath in X/Y, then step up in Z — a real print building, top and side views.',
  },
  'material-picker': {
    component: MaterialPicker,
    title: 'Material Selector',
    description:
      'Describe your part and printer, get a ranked filament pick — plus a full reference of every common FDM filament.',
  },
  'infill-compare': {
    component: InfillCompare,
    title: 'Infill Explorer',
    description:
      'Compare any two of nine infill patterns at a chosen density, with strength, speed and material trade-offs.',
  },
  'z-offset': {
    component: ZOffset,
    title: 'First-Layer Squish',
    description:
      'How the Z-offset changes the first-layer lines — in cross-section and as they look on the bed.',
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
