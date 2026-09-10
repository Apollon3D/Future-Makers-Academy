import type { Printer } from '../content/workshop'

/**
 * Schematic, clickable front-elevation diagrams of a printer. Not to scale and
 * not photoreal — a blueprint that maps every numbered hotspot to a part.
 */
export function PrinterDiagram({
  printer,
  selectedPartId,
  onSelect,
}: {
  printer: Printer
  selectedPartId: string | null
  onSelect: (partId: string) => void
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <svg viewBox="0 0 440 400" className="w-full">
        <g
          stroke="var(--border-strong)"
          strokeWidth={2}
          fill="var(--surface-2)"
          strokeLinejoin="round"
        >
          {printer.diagram === 'bedslinger' ? <BedSlinger /> : <CoreXY />}
        </g>

        {/* Hotspots */}
        {printer.parts.map((ref, i) => {
          const selected = ref.partId === selectedPartId
          const { x, y } = ref.hotspot
          return (
            <g
              key={ref.partId}
              transform={`translate(${x} ${y})`}
              onClick={() => onSelect(ref.partId)}
              style={{ cursor: 'pointer' }}
            >
              {selected && (
                <circle
                  r={13}
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth={2}
                  opacity={0.9}
                >
                  <animate
                    attributeName="r"
                    values="11;15;11"
                    dur="1.6s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.9;0.2;0.9"
                    dur="1.6s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}
              <circle
                r={9}
                fill={selected ? 'var(--accent)' : 'var(--surface)'}
                stroke={selected ? 'var(--accent)' : 'var(--border-strong)'}
                strokeWidth={1.5}
              />
              <text
                y={3.2}
                textAnchor="middle"
                fontSize={9}
                fontWeight={600}
                fill={selected ? 'var(--accent-ink)' : 'var(--muted)'}
              >
                {i + 1}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

const L = { stroke: 'var(--muted)', strokeWidth: 1, fill: 'none' } as const
const DASH = { ...L, strokeDasharray: '3 3' } as const

function BedSlinger() {
  return (
    <>
      {/* base + feet */}
      <rect x={52} y={330} width={336} height={12} />
      <rect x={58} y={342} width={16} height={8} />
      <rect x={366} y={342} width={16} height={8} />
      {/* uprights + top rail */}
      <rect x={72} y={64} width={14} height={266} />
      <rect x={340} y={64} width={14} height={266} />
      <rect x={72} y={52} width={282} height={13} />
      {/* Z leadscrew + motor */}
      <line x1={96} y1={66} x2={96} y2={322} {...DASH} />
      <rect x={82} y={320} width={28} height={12} />
      {/* Z endstop tab */}
      <rect x={90} y={256} width={12} height={6} />
      {/* X gantry beam + X motor */}
      <rect x={86} y={162} width={250} height={11} />
      <rect x={332} y={156} width={22} height={22} />
      {/* belt hint along gantry */}
      <line x1={100} y1={167} x2={330} y2={167} {...DASH} />
      {/* toolhead carriage */}
      <rect x={212} y={160} width={40} height={26} />
      {/* heatsink + hotend fan */}
      <rect x={224} y={184} width={16} height={10} />
      <circle cx={200} cy={182} r={9} fill="var(--surface-2)" />
      <path d="M192 182 h16 M200 174 v16" {...L} />
      {/* heater block + nozzle */}
      <rect x={222} y={198} width={20} height={12} />
      <polygon points="224,210 240,210 235,228 229,228" />
      {/* part cooling duct */}
      <path
        d="M262 176 q16 6 8 24 q-4 8 -20 6"
        fill="none"
        stroke="var(--border-strong)"
        strokeWidth={2}
      />
      {/* extruder */}
      <rect x={102} y={46} width={36} height={28} />
      <circle cx={120} cy={60} r={7} fill="var(--surface)" />
      {/* bowden tube */}
      <path
        d="M122 74 C 150 110 188 120 230 160"
        fill="none"
        stroke="var(--border-strong)"
        strokeWidth={2}
      />
      {/* spool */}
      <line x1={200} y1={52} x2={220} y2={38} {...L} />
      <circle cx={222} cy={32} r={22} fill="var(--surface-2)" />
      <circle cx={222} cy={32} r={6} fill="var(--surface)" />
      {/* heated bed + Y carriage */}
      <rect x={150} y={280} width={164} height={9} />
      <rect x={140} y={289} width={184} height={8} />
      {/* bed adjusters */}
      <circle cx={162} cy={299} r={4} fill="var(--surface)" />
      <circle cx={300} cy={299} r={4} fill="var(--surface)" />
      {/* Y belt */}
      <line x1={140} y1={314} x2={326} y2={314} {...DASH} />
      {/* electronics box */}
      <rect x={358} y={252} width={60} height={92} fill="var(--surface-2)" />
      <line x1={358} y1={296} x2={418} y2={296} {...L} />
      <text x={388} y={276} textAnchor="middle" fontSize={8} fill="var(--muted)" stroke="none">
        PSU
      </text>
      <text x={388} y={322} textAnchor="middle" fontSize={8} fill="var(--muted)" stroke="none">
        MCU
      </text>
      {/* display */}
      <rect x={300} y={350} width={92} height={26} />
      <circle cx={378} cy={363} r={5} fill="var(--surface-2)" />
    </>
  )
}

function CoreXY() {
  return (
    <>
      {/* enclosure */}
      <rect x={44} y={44} width={352} height={322} rx={6} fill="var(--surface-2)" />
      <rect x={54} y={70} width={332} height={288} rx={3} fill="var(--surface)" />
      {/* door split */}
      <line x1={220} y1={70} x2={220} y2={358} {...DASH} />
      {/* CoreXY belt hint (top) */}
      <path
        d="M66 58 H 374 M78 52 L 210 78 L 342 52 M78 64 L 210 82 L 342 64"
        fill="none"
        stroke="var(--border-strong)"
        strokeWidth={1.6}
      />
      {/* X gantry */}
      <rect x={64} y={70} width={312} height={10} />
      {/* toolhead + extruder */}
      <rect x={206} y={72} width={28} height={16} />
      <rect x={210} y={64} width={20} height={10} />
      {/* heatsink fan */}
      <circle cx={192} cy={92} r={8} fill="var(--surface-2)" />
      {/* heater block + nozzle */}
      <rect x={212} y={110} width={16} height={12} />
      <polygon points="214,122 226,122 222,138 218,138" />
      {/* aux part fan on wall */}
      <rect x={360} y={150} width={14} height={22} fill="var(--surface-2)" />
      {/* bed (Z stage) */}
      <rect x={112} y={232} width={216} height={12} />
      <line x1={140} y1={244} x2={140} y2={344} {...DASH} />
      <line x1={220} y1={244} x2={220} y2={344} {...DASH} />
      <line x1={300} y1={244} x2={300} y2={344} {...DASH} />
      {/* Z motor */}
      <rect x={206} y={330} width={28} height={16} />
      {/* base electronics compartment */}
      <rect x={54} y={344} width={332} height={14} fill="var(--surface-2)" />
      <text x={140} y={355} textAnchor="middle" fontSize={8} fill="var(--muted)" stroke="none">
        display
      </text>
      <text x={230} y={355} textAnchor="middle" fontSize={8} fill="var(--muted)" stroke="none">
        mainboard
      </text>
      <text x={330} y={355} textAnchor="middle" fontSize={8} fill="var(--muted)" stroke="none">
        PSU
      </text>
      {/* external spool */}
      <circle cx={410} cy={60} r={18} fill="var(--surface-2)" />
      <path d="M398 66 C 380 90 360 74 360 74" fill="none" stroke="var(--border-strong)" strokeWidth={2} />
    </>
  )
}
