/**
 * FDM filament reference. Scores are 0–3: how well the material serves that
 * need. Temperatures are typical starting ranges — always defer to the spool's
 * own spec sheet.
 */

export type FilamentFamily =
  | 'Standard'
  | 'Engineering'
  | 'Flexible'
  | 'Composite'
  | 'Support'
  | 'Specialty'
  | 'Industrial'

export type ScoreAxis =
  | 'strength'
  | 'toughness'
  | 'heat'
  | 'outdoor'
  | 'flex'
  | 'detail'
  | 'ease'
  | 'lowWarp'
  | 'chem'

export interface Filament {
  id: string
  name: string
  family: FilamentFamily
  /** Nozzle temperature range, °C. */
  nozzle: [number, number]
  /** Bed temperature range, °C. */
  bed: [number, number]
  enclosure: 'no' | 'helpful' | 'required'
  cooling: 'high' | 'medium' | 'low' | 'off'
  /** Abrasive — needs a hardened steel nozzle. */
  abrasive?: boolean
  /** Absorbs moisture fast — dry before printing. */
  thirsty?: boolean
  fumes?: 'low' | 'moderate' | 'high'
  scores: Record<ScoreAxis, number>
  bestFor: string
  watchOut: string
}

export const AXIS_LABEL: Record<ScoreAxis, string> = {
  strength: 'Stiffness / load',
  toughness: 'Impact toughness',
  heat: 'Heat resistance',
  outdoor: 'Outdoor / UV',
  flex: 'Flexibility',
  detail: 'Detail & finish',
  ease: 'Ease of printing',
  lowWarp: 'Low warping',
  chem: 'Chemical resistance',
}

export const FILAMENTS: Filament[] = [
  // ---- Standard ---------------------------------------------------------
  {
    id: 'pla',
    name: 'PLA',
    family: 'Standard',
    nozzle: [190, 220],
    bed: [50, 60],
    enclosure: 'no',
    cooling: 'high',
    fumes: 'low',
    scores: { strength: 2, toughness: 1, heat: 0, outdoor: 0, flex: 0, detail: 3, ease: 3, lowWarp: 3, chem: 1 },
    bestFor: 'Models, prototypes, jigs, toys, anything not near heat or load.',
    watchOut: 'Brittle; softens by ~55 °C. Never in a hot car or direct sun.',
  },
  {
    id: 'pla-plus',
    name: 'PLA+ / Tough PLA',
    family: 'Standard',
    nozzle: [200, 230],
    bed: [50, 65],
    enclosure: 'no',
    cooling: 'high',
    fumes: 'low',
    scores: { strength: 2, toughness: 2, heat: 0, outdoor: 0, flex: 0, detail: 3, ease: 3, lowWarp: 3, chem: 1 },
    bestFor: 'When you want PLA’s ease but less shattering — brackets, light functional parts.',
    watchOut: 'Still low heat resistance. "PLA+" is a marketing term — quality varies by brand.',
  },
  {
    id: 'pla-aesthetic',
    name: 'PLA (silk / matte / glow / dual-colour)',
    family: 'Standard',
    nozzle: [200, 230],
    bed: [50, 60],
    enclosure: 'no',
    cooling: 'high',
    abrasive: true,
    fumes: 'low',
    scores: { strength: 1, toughness: 1, heat: 0, outdoor: 0, flex: 0, detail: 3, ease: 2, lowWarp: 3, chem: 1 },
    bestFor: 'Display prints where looks are everything — sheen, matte texture, colour effects.',
    watchOut: 'Weaker than plain PLA. Glow and some silk blends are abrasive — use a hardened nozzle.',
  },
  {
    id: 'petg',
    name: 'PETG',
    family: 'Standard',
    nozzle: [230, 250],
    bed: [70, 85],
    enclosure: 'helpful',
    cooling: 'low',
    thirsty: true,
    fumes: 'low',
    scores: { strength: 2, toughness: 3, heat: 2, outdoor: 2, flex: 1, detail: 2, ease: 2, lowWarp: 2, chem: 2 },
    bestFor: 'The everyday functional upgrade — outdoor fixtures, enclosures, mechanical parts.',
    watchOut: 'Strings if wet; bonds hard to smooth PEI (use a release agent or textured plate).',
  },
  {
    id: 'pctg',
    name: 'PCTG',
    family: 'Standard',
    nozzle: [240, 260],
    bed: [70, 90],
    enclosure: 'helpful',
    cooling: 'low',
    thirsty: true,
    fumes: 'low',
    scores: { strength: 2, toughness: 3, heat: 2, outdoor: 2, flex: 1, detail: 2, ease: 2, lowWarp: 2, chem: 2 },
    bestFor: 'A clearer, tougher, less-stringy PETG. Good for transparent functional parts.',
    watchOut: 'Pricier than PETG; still hygroscopic.',
  },

  // ---- Engineering -----------------------------------------------------
  {
    id: 'abs',
    name: 'ABS',
    family: 'Engineering',
    nozzle: [240, 260],
    bed: [95, 110],
    enclosure: 'required',
    cooling: 'off',
    fumes: 'high',
    scores: { strength: 2, toughness: 2, heat: 3, outdoor: 1, flex: 1, detail: 2, ease: 1, lowWarp: 0, chem: 2 },
    bestFor: 'Heat-resistant parts you can acetone-smooth or machine — under-hood, enclosures.',
    watchOut: 'Warps and cracks without an enclosure. Styrene fumes — ventilate.',
  },
  {
    id: 'asa',
    name: 'ASA',
    family: 'Engineering',
    nozzle: [240, 260],
    bed: [95, 110],
    enclosure: 'required',
    cooling: 'off',
    fumes: 'moderate',
    scores: { strength: 2, toughness: 2, heat: 3, outdoor: 3, flex: 1, detail: 2, ease: 1, lowWarp: 0, chem: 2 },
    bestFor: 'Outdoor parts that must last — UV-stable, weatherproof. The go-to for exterior use.',
    watchOut: 'Same enclosure and warping demands as ABS; fumes are lower but still ventilate.',
  },
  {
    id: 'pc',
    name: 'Polycarbonate (PC)',
    family: 'Engineering',
    nozzle: [260, 300],
    bed: [110, 130],
    enclosure: 'required',
    cooling: 'off',
    thirsty: true,
    fumes: 'moderate',
    scores: { strength: 3, toughness: 3, heat: 3, outdoor: 2, flex: 1, detail: 2, ease: 0, lowWarp: 0, chem: 1 },
    bestFor: 'Maximum strength + heat in a printable plastic — load-bearing, high-temp parts.',
    watchOut: 'Very hygroscopic (dry it), high temps, strong warping. Needs a capable hotend.',
  },
  {
    id: 'pc-abs',
    name: 'PC-ABS blend',
    family: 'Engineering',
    nozzle: [250, 275],
    bed: [100, 120],
    enclosure: 'required',
    cooling: 'off',
    thirsty: true,
    fumes: 'moderate',
    scores: { strength: 3, toughness: 3, heat: 3, outdoor: 1, flex: 1, detail: 2, ease: 1, lowWarp: 1, chem: 2 },
    bestFor: 'PC strength and heat with better printability and impact toughness than pure PC.',
    watchOut: 'Still needs an enclosure and drying. Not UV-stable.',
  },
  {
    id: 'nylon',
    name: 'Nylon (PA6 / PA12)',
    family: 'Engineering',
    nozzle: [250, 280],
    bed: [70, 100],
    enclosure: 'required',
    cooling: 'off',
    thirsty: true,
    fumes: 'moderate',
    scores: { strength: 2, toughness: 3, heat: 2, outdoor: 1, flex: 2, detail: 1, ease: 0, lowWarp: 1, chem: 3 },
    bestFor: 'Living hinges, gears, bushings, wear parts — tough, slippery, fatigue-resistant.',
    watchOut: 'Extremely hygroscopic — must print from a dry box. Adhesion is fussy.',
  },
  {
    id: 'pp',
    name: 'Polypropylene (PP)',
    family: 'Engineering',
    nozzle: [220, 250],
    bed: [85, 100],
    enclosure: 'required',
    cooling: 'low',
    fumes: 'low',
    scores: { strength: 1, toughness: 3, heat: 2, outdoor: 2, flex: 2, detail: 1, ease: 0, lowWarp: 0, chem: 3 },
    bestFor: 'Chemically inert, fatigue-proof, watertight parts — tanks, containers, snap fits.',
    watchOut: 'Notoriously hard to get to stick — often needs a PP-tape bed surface. Warps badly.',
  },
  {
    id: 'pom',
    name: 'POM / Acetal',
    family: 'Engineering',
    nozzle: [210, 230],
    bed: [110, 130],
    enclosure: 'required',
    cooling: 'off',
    fumes: 'moderate',
    scores: { strength: 3, toughness: 2, heat: 2, outdoor: 1, flex: 1, detail: 2, ease: 0, lowWarp: 1, chem: 3 },
    bestFor: 'Precision low-friction mechanical parts — gears, cams, sliding surfaces.',
    watchOut: 'Very poor bed adhesion; can release formaldehyde when overheated — ventilate well.',
  },

  // ---- Flexible -------------------------------------------------------
  {
    id: 'tpu-95a',
    name: 'TPU 95A',
    family: 'Flexible',
    nozzle: [220, 240],
    bed: [40, 60],
    enclosure: 'no',
    cooling: 'medium',
    thirsty: true,
    fumes: 'low',
    scores: { strength: 2, toughness: 3, heat: 1, outdoor: 2, flex: 3, detail: 1, ease: 1, lowWarp: 3, chem: 2 },
    bestFor: 'Semi-rigid flexible parts — phone cases, bushings, cable strain reliefs, wheels.',
    watchOut: 'Print slow (15–30 mm/s); a direct-drive extruder is strongly preferred.',
  },
  {
    id: 'tpu-85a',
    name: 'TPU 85A / TPE',
    family: 'Flexible',
    nozzle: [210, 235],
    bed: [40, 55],
    enclosure: 'no',
    cooling: 'medium',
    thirsty: true,
    fumes: 'low',
    scores: { strength: 1, toughness: 3, heat: 1, outdoor: 2, flex: 3, detail: 0, ease: 0, lowWarp: 3, chem: 2 },
    bestFor: 'Very soft, rubbery parts — gaskets, grips, tyres, vibration dampers.',
    watchOut: 'Needs direct drive and very slow speeds; Bowden setups will jam.',
  },

  // ---- Composite -----------------------------------------------------
  {
    id: 'pla-cf',
    name: 'PLA-CF (carbon fibre)',
    family: 'Composite',
    nozzle: [200, 230],
    bed: [50, 60],
    enclosure: 'no',
    cooling: 'high',
    abrasive: true,
    fumes: 'low',
    scores: { strength: 3, toughness: 1, heat: 0, outdoor: 0, flex: 0, detail: 2, ease: 2, lowWarp: 3, chem: 1 },
    bestFor: 'Stiff, dimensionally stable, matte-black display and light structural parts.',
    watchOut: 'Even more brittle than PLA. Abrasive — hardened nozzle required.',
  },
  {
    id: 'petg-cf',
    name: 'PETG-CF',
    family: 'Composite',
    nozzle: [240, 260],
    bed: [70, 90],
    enclosure: 'helpful',
    cooling: 'low',
    abrasive: true,
    thirsty: true,
    fumes: 'low',
    scores: { strength: 3, toughness: 2, heat: 2, outdoor: 2, flex: 0, detail: 2, ease: 2, lowWarp: 3, chem: 2 },
    bestFor: 'Stiffer, lower-warp PETG for functional brackets and fixtures.',
    watchOut: 'Abrasive (hardened nozzle); carbon reduces impact toughness vs plain PETG.',
  },
  {
    id: 'pa-cf',
    name: 'PA-CF (nylon carbon fibre)',
    family: 'Composite',
    nozzle: [260, 290],
    bed: [80, 110],
    enclosure: 'required',
    cooling: 'off',
    abrasive: true,
    thirsty: true,
    fumes: 'moderate',
    scores: { strength: 3, toughness: 3, heat: 3, outdoor: 1, flex: 1, detail: 2, ease: 0, lowWarp: 2, chem: 3 },
    bestFor: 'Near-aluminium stiffness-to-weight — drone frames, tooling, end-use engineering parts.',
    watchOut: 'Hardened nozzle, enclosure, aggressive drying, capable hotend. Demanding.',
  },
  {
    id: 'pa-gf',
    name: 'PA-GF (glass fibre nylon)',
    family: 'Composite',
    nozzle: [260, 290],
    bed: [80, 110],
    enclosure: 'required',
    cooling: 'off',
    abrasive: true,
    thirsty: true,
    fumes: 'moderate',
    scores: { strength: 3, toughness: 3, heat: 3, outdoor: 1, flex: 1, detail: 1, ease: 0, lowWarp: 2, chem: 3 },
    bestFor: 'Like PA-CF but retains a bit more impact toughness; heat-resistant structural parts.',
    watchOut: 'Glass fibre is highly abrasive — hardened nozzle is non-negotiable.',
  },
  {
    id: 'pla-wood',
    name: 'PLA wood / cork / other fill',
    family: 'Composite',
    nozzle: [190, 220],
    bed: [50, 60],
    enclosure: 'no',
    cooling: 'high',
    abrasive: true,
    fumes: 'low',
    scores: { strength: 1, toughness: 0, heat: 0, outdoor: 0, flex: 0, detail: 2, ease: 1, lowWarp: 3, chem: 0 },
    bestFor: 'Decorative props with a wood-like look and smell; can be sanded and stained.',
    watchOut: 'Weak and brittle; particles clog small nozzles — use ≥0.5 mm, hardened.',
  },
  {
    id: 'pla-metal',
    name: 'Metal-filled PLA',
    family: 'Composite',
    nozzle: [190, 220],
    bed: [50, 60],
    enclosure: 'no',
    cooling: 'high',
    abrasive: true,
    fumes: 'low',
    scores: { strength: 1, toughness: 0, heat: 0, outdoor: 0, flex: 0, detail: 2, ease: 1, lowWarp: 3, chem: 0 },
    bestFor: 'Heavy, metallic-looking props that can be polished to a shine.',
    watchOut: 'Very abrasive and heavy; brittle. Hardened nozzle, larger diameter.',
  },

  // ---- Support ------------------------------------------------------
  {
    id: 'pva',
    name: 'PVA (water-soluble support)',
    family: 'Support',
    nozzle: [190, 210],
    bed: [45, 60],
    enclosure: 'helpful',
    cooling: 'medium',
    thirsty: true,
    fumes: 'low',
    scores: { strength: 0, toughness: 0, heat: 0, outdoor: 0, flex: 1, detail: 1, ease: 0, lowWarp: 2, chem: 0 },
    bestFor: 'Dissolvable support for PLA/PETG on a dual-extruder machine — dissolves in plain water.',
    watchOut: 'Extremely hygroscopic; degrades in the hotend if left hot. Store sealed.',
  },
  {
    id: 'bvoh',
    name: 'BVOH (soluble support)',
    family: 'Support',
    nozzle: [200, 220],
    bed: [45, 60],
    enclosure: 'helpful',
    cooling: 'medium',
    thirsty: true,
    fumes: 'low',
    scores: { strength: 0, toughness: 0, heat: 0, outdoor: 0, flex: 1, detail: 1, ease: 1, lowWarp: 2, chem: 0 },
    bestFor: 'Faster-dissolving, more reliable alternative to PVA; bonds well to more materials.',
    watchOut: 'Pricey; still very moisture-sensitive.',
  },
  {
    id: 'hips',
    name: 'HIPS (support / light model)',
    family: 'Support',
    nozzle: [230, 245],
    bed: [90, 110],
    enclosure: 'required',
    cooling: 'low',
    fumes: 'moderate',
    scores: { strength: 1, toughness: 2, heat: 2, outdoor: 0, flex: 1, detail: 2, ease: 1, lowWarp: 1, chem: 1 },
    bestFor: 'Break-away or limonene-dissolvable support for ABS; also a light, machinable model material.',
    watchOut: 'Needs an enclosure like ABS; limonene dissolving is slow and smelly.',
  },

  // ---- Specialty ---------------------------------------------------
  {
    id: 'pla-hf',
    name: 'High-speed PLA',
    family: 'Specialty',
    nozzle: [200, 240],
    bed: [55, 65],
    enclosure: 'no',
    cooling: 'high',
    fumes: 'low',
    scores: { strength: 2, toughness: 1, heat: 0, outdoor: 0, flex: 0, detail: 2, ease: 3, lowWarp: 3, chem: 1 },
    bestFor: 'Modern fast printers — reformulated to flow at high volumetric rates without stringing.',
    watchOut: 'Needs strong part cooling to keep up; same heat/brittleness limits as PLA.',
  },
  {
    id: 'pla-matte-heavy',
    name: 'Reinforced / "tough" PETG (GF)',
    family: 'Specialty',
    nozzle: [240, 260],
    bed: [75, 90],
    enclosure: 'helpful',
    cooling: 'low',
    abrasive: true,
    thirsty: true,
    fumes: 'low',
    scores: { strength: 3, toughness: 2, heat: 2, outdoor: 2, flex: 0, detail: 1, ease: 2, lowWarp: 3, chem: 2 },
    bestFor: 'Glass-fibre PETG for rigid, low-warp jigs and fixtures without going full nylon.',
    watchOut: 'Abrasive; matte finish hides layer lines but also detail.',
  },

  // ---- Industrial ------------------------------------------------
  {
    id: 'peek',
    name: 'PEEK / PEKK',
    family: 'Industrial',
    nozzle: [380, 450],
    bed: [120, 160],
    enclosure: 'required',
    cooling: 'off',
    thirsty: true,
    fumes: 'moderate',
    scores: { strength: 3, toughness: 3, heat: 3, outdoor: 2, flex: 1, detail: 1, ease: 0, lowWarp: 0, chem: 3 },
    bestFor: 'Aerospace/medical-grade parts — extreme heat, chemical and wear resistance.',
    watchOut: 'Needs a specialised high-temp printer (heated chamber, 450 °C hotend). Not a hobby material.',
  },
  {
    id: 'ultem',
    name: 'PEI / ULTEM',
    family: 'Industrial',
    nozzle: [350, 400],
    bed: [140, 160],
    enclosure: 'required',
    cooling: 'off',
    thirsty: true,
    fumes: 'moderate',
    scores: { strength: 3, toughness: 2, heat: 3, outdoor: 2, flex: 0, detail: 2, ease: 0, lowWarp: 0, chem: 3 },
    bestFor: 'Flame-retardant, high-temp structural parts for aerospace and electronics.',
    watchOut: 'Same as PEEK — specialised industrial hardware only.',
  },
]

export const FAMILY_ORDER: FilamentFamily[] = [
  'Standard',
  'Engineering',
  'Flexible',
  'Composite',
  'Support',
  'Specialty',
  'Industrial',
]
