import type { LessonRef } from '../types'

/**
 * Workshop data: named consumer printers, each a composition of shared parts.
 *
 * The deep mechanical explanations live once in {@link PART_LIBRARY} and are
 * universal to the part type. Model-specific facts go in the per-printer
 * `note`. Anything model-specific should still be checked against the
 * manufacturer's own manual (linked from each printer).
 */

export type MaintenanceInterval =
  | 'each-print'
  | 'weekly'
  | 'monthly'
  | 'quarterly'
  | 'biannual'
  | 'annual'
  | 'as-needed'

export const INTERVAL_DAYS: Record<MaintenanceInterval, number> = {
  'each-print': 0,
  weekly: 7,
  monthly: 30,
  quarterly: 90,
  biannual: 182,
  annual: 365,
  'as-needed': -1,
}

export const INTERVAL_LABEL: Record<MaintenanceInterval, string> = {
  'each-print': 'Every print',
  weekly: 'Weekly',
  monthly: 'Monthly',
  quarterly: 'Every 3 months',
  biannual: 'Every 6 months',
  annual: 'Yearly',
  'as-needed': 'As needed',
}

export type PartCategory =
  | 'hotend'
  | 'extrusion'
  | 'motion'
  | 'bed'
  | 'electronics'
  | 'frame'

export interface MaintenanceTask {
  interval: MaintenanceInterval
  task: string
}

export interface PartInfo {
  id: string
  name: string
  category: PartCategory
  /** One line shown in the list and as the panel subtitle. */
  tagline: string
  /** Markdown: what it is and how it works. */
  how: string
  /** Signs this part is the problem. */
  symptoms: string[]
  maintenance: MaintenanceTask[]
  /** Markdown: repair / replacement guidance. */
  repair: string
  relatedLessons?: LessonRef[]
  /** A real, openly-licensed reference photo shown in the part's focus view. */
  photo?: PartPhoto
}

export interface PartPhoto {
  /** Direct image URL (Wikimedia Commons Special:FilePath links are stable). */
  url: string
  /** e.g. "Photo: Jane Doe, CC BY-SA 4.0, via Wikimedia Commons" */
  credit: string
  /** Shown under the photo — use this to flag when it's illustrative rather
   *  than an exact match (e.g. a generic fan standing in for a small one). */
  note?: string
}

export const CATEGORY_LABEL: Record<PartCategory, string> = {
  hotend: 'Hotend',
  extrusion: 'Extrusion',
  motion: 'Motion',
  bed: 'Bed & first layer',
  electronics: 'Electronics',
  frame: 'Frame',
}

// ---------------------------------------------------------------------------
// Shared part library
// ---------------------------------------------------------------------------

export const PART_LIBRARY: Record<string, PartInfo> = {
  nozzle: {
    id: 'nozzle',
    name: 'Nozzle',
    category: 'hotend',
    tagline: 'The calibrated orifice that shapes every extruded line.',
    how: `A small brass (or hardened steel / ruby-tipped) tip screwed into the heater block. Molten plastic is forced through its bore — usually **0.4 mm** — which sets the width of the line the printer can draw. Brass conducts heat well and is easy on the wallet, but abrasive filaments (glow, glitter, carbon-fibre, glass-filled) wear the bore oval in hours; use hardened steel for those.`,
    symptoms: [
      'Under-extrusion that cleaning does not fix (worn or partially blocked bore)',
      'Lines wider than they should be, poor detail (bore worn oversize)',
      'Molten plastic climbing the outside of the nozzle then dropping blobs on the print (leak between nozzle and block)',
    ],
    maintenance: [
      { interval: 'each-print', task: 'Glance that the tip is clean — no burnt-on plastic skirt' },
      { interval: 'monthly', task: 'Wipe the hot nozzle with a brass brush; inspect the tip under light' },
      { interval: 'as-needed', task: 'Re-tighten the nozzle against the heat break while hot after any hotend work' },
    ],
    repair: `**Replacing a nozzle (do it hot):** heat the hotend to 240 °C so the plastic inside is liquid. Hold the heater block with a spanner so you are not twisting the whole hotend, and undo the nozzle with a socket. Fit the new one, seat it *almost* home, then do the final tightening **at temperature** so it seals against the heat break and cannot leak. A leak here causes a growing blob that eventually swallows the hotend ("heat creep blob of death").`,
    relatedLessons: [{ moduleId: 'troubleshooting', lessonId: 'extrusion-issues' }],
  },

  'heater-block': {
    id: 'heater-block',
    name: 'Heater block, cartridge & thermistor',
    category: 'hotend',
    tagline: 'Melts the filament and reports its own temperature.',
    how: `The aluminium **block** holds a **heater cartridge** (a resistive rod, 30–60 W) and a **thermistor** (a temperature sensor whose resistance changes with heat). The firmware runs a **PID loop**: read the thermistor, compare to target, adjust power to the cartridge. Both parts are held by tiny grub screws and are the most common hotend failures because they live in a hot, vibrating place.`,
    symptoms: [
      '"Thermal runaway" or "heater error" and an aborted print (loose/failed cartridge or thermistor)',
      'Temperature reading that jumps around wildly or reads MINTEMP/─── (thermistor wire broken)',
      'Hotend slow to heat or never reaches target (cartridge failing or under-powered)',
    ],
    maintenance: [
      { interval: 'quarterly', task: 'With the printer OFF and cold, gently tug the heater and thermistor wires near the block — check for cracked insulation and firm grub screws' },
      { interval: 'biannual', task: 'Re-wrap the hotend wiring loom if the sleeving is frayed; confirm strain relief so motion is not flexing the wires at the block' },
    ],
    repair: `Cartridge and thermistor are cheap — keep spares. To swap: cold machine, unplug it, loosen the grub screw, slide the old part out, slide the new one fully in, nip the grub screw (don't crush the thermistor). Route the new wires with the existing loom and add strain relief. **After any thermistor change, re-run PID autotune** (\`M303\`) or the temperature will oscillate. Never run the printer with thermal-runaway protection disabled.`,
    relatedLessons: [{ moduleId: 'slicer', lessonId: 'speed-temp' }],
  },

  heatbreak: {
    id: 'heatbreak',
    name: 'Heat break',
    category: 'hotend',
    tagline: 'Keeps the melt zone short so filament does not jam.',
    how: `A deliberately thin-walled tube (often steel, sometimes bi-metal or titanium) between the hot block and the cooled heatsink. Its thin wall resists heat travelling upward, so the plastic stays solid until the last few millimetres. In an **all-metal** hotend the plastic touches metal all the way; in a **PTFE-lined** hotend a Teflon tube runs down to the nozzle — smoother, but it degrades above ~250 °C and must be replaced periodically.`,
    symptoms: [
      'Jams a few minutes into a print, especially after retractions ("heat creep" — the melt zone crept upward)',
      'Grinding/clicking from the extruder mid-print though cold pulls come out clean',
      'Charred black debris on the filament tip after a cold pull (burnt PTFE)',
    ],
    maintenance: [
      { interval: 'biannual', task: 'PTFE-lined hotend: pull and inspect the PTFE liner; replace if the end is discoloured, flared, or has a gap at the nozzle' },
      { interval: 'annual', task: 'All-metal hotend: dismantle, clean the bore with a nylon brush, check the heatsink fins are clear' },
    ],
    repair: `A gap between the PTFE liner and the nozzle is a classic hidden fault — molten plastic pools there and jams. Cut the liner square, seat the nozzle against it while hot, and there should be zero gap. For all-metal breaks, a smear of thermal paste on the threads into the heatsink improves cooling; the joint into the block stays dry and tight.`,
  },

  'heatsink-fan': {
    id: 'heatsink-fan',
    name: 'Hotend cooling fan',
    category: 'hotend',
    tagline: 'Cools the heatsink so heat cannot creep up to the extruder.',
    how: `A small fan blowing constantly across the finned **heatsink** above the heat break. It is *not* the fan that cools your print — it runs whenever the hotend is hot and its only job is to keep the cold side cold. Usually a cheap 40 mm fan; when it slows with dust or age, heat creeps up and you get jams that look like everything else.`,
    symptoms: [
      'Reliable prints that started jamming after ~10–30 minutes for no obvious reason',
      'Audible bearing rattle, or the fan spins slowly / not at all when the hotend is hot',
      'Jams that clear completely once the hotend cools, then return',
    ],
    maintenance: [
      { interval: 'monthly', task: 'Confirm it spins up freely the moment the hotend starts heating; blow dust off the blades and heatsink fins' },
      { interval: 'annual', task: 'Replace as a wear item even if still spinning — they are a few dollars and failure means a ruined print' },
    ],
    repair: `Direct swap: match the size (usually 40×40×10 mm) and voltage (24 V on most modern printers, 12 V on older ones — check!). Note the airflow direction arrow on the frame points *into* the heatsink. Keep the old one as a shroud template if the new fan's wire exits a different side.`,
    photo: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Xilence_120mm_cooling_fan_of_a_power_supply_unit.jpg?width=700',
      credit: 'Photo: Clive Darra, CC BY-SA 2.0, via Wikimedia Commons',
      note: 'Illustrative — a generic cooling fan. The hotend fan itself is usually a much smaller 40 mm size.',
    },
  },

  'part-fan': {
    id: 'part-fan',
    name: 'Part cooling fan & duct',
    category: 'hotend',
    tagline: 'Freezes each new line in place for clean overhangs and detail.',
    how: `A blower fan feeding a shaped **duct** that aims air at the plastic *just after* it leaves the nozzle. The slicer controls its speed per material: ~100% for PLA, ~30–50% for PETG, near zero for ABS. A cracked or badly-aimed duct is a common cause of poor overhangs that no slicer setting fixes.`,
    symptoms: [
      'Droopy overhangs and blobby fine detail despite correct slicer cooling settings',
      'One side of a print noticeably rougher than the other (duct blows unevenly)',
      'Fan buzzing at low PWM but not moving air (worn blower)',
    ],
    maintenance: [
      { interval: 'monthly', task: 'Check the duct is intact, unclipped, not melted, and aimed at the nozzle tip' },
      { interval: 'quarterly', task: 'Clear plastic wisps and dust from the blower impeller' },
    ],
    repair: `Ducts are the most-printed spare part there is — print one in PETG or ABS (PLA sags near the hotend). Blower fans (usually 5015 or 4010) are a direct swap; keep the connector polarity. If overhangs improved only slightly after a duct upgrade, the fan itself may be weak — upgrade both together.`,
    relatedLessons: [{ moduleId: 'slicer', lessonId: 'speed-temp' }, { moduleId: 'dfam', lessonId: 'overhangs' }],
    photo: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Xilence_120mm_cooling_fan_of_a_power_supply_unit.jpg?width=700',
      credit: 'Photo: Clive Darra, CC BY-SA 2.0, via Wikimedia Commons',
      note: 'Illustrative — a generic cooling fan. Part-cooling fans on a hotend are usually a much smaller 40–50 mm blower.',
    },
  },

  extruder: {
    id: 'extruder',
    name: 'Extruder',
    category: 'extrusion',
    tagline: 'The geared motor and drive gears that push filament.',
    how: `A stepper motor turns a **hobbed gear** (or a pair of them) that grips the filament and pushes it toward the hotend at a precisely metered rate. **Direct drive** puts the motor on the toolhead — better control, essential for flexibles. **Bowden** puts it on the frame and pushes filament through a long tube — lighter toolhead, but springy, so retraction is less crisp. Dual-gear geared extruders (BMG-style) grip far better than a single drive gear.`,
    symptoms: [
      'Rhythmic clicking/knocking as the motor skips back (blockage downstream, tension wrong, or temp too low for the speed)',
      'Under-extrusion and gaps; a chewed flat spot ground into the filament',
      'Fine plastic dust building up inside the extruder body',
    ],
    maintenance: [
      { interval: 'monthly', task: 'Open the idler and brush filament dust out of the drive-gear teeth' },
      { interval: 'quarterly', task: 'Check idler-arm spring tension: filament should be gripped firmly but you should be able to push it through by hand with the hotend hot' },
      { interval: 'biannual', task: 'Verify E-steps / extrusion calibration — mark 120 mm, extrude 100 mm, measure what actually fed' },
    ],
    repair: `A worn hobbed gear (teeth rounded, packed with plastic) is a common silent killer — replace it and clicking often vanishes. On a geared extruder, a cracked plastic housing (common on budget machines) lets the gears splay under load; the aluminium replacement is a worthwhile upgrade. Re-check E-steps after any extruder change.`,
    relatedLessons: [{ moduleId: 'troubleshooting', lessonId: 'extrusion-issues' }, { moduleId: 'fundamentals', lessonId: 'printer-anatomy' }],
    photo: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/MakerBot%20SmartExtruder%20(14258107128).jpg?width=700',
      credit: 'Photo: Creative Tools, CC BY 2.0, via Wikimedia Commons',
      note: 'A direct-drive extruder/toolhead assembly (MakerBot SmartExtruder) — the general layout, not this printer’s exact part.',
    },
  },

  bowden: {
    id: 'bowden',
    name: 'Bowden tube & couplers',
    category: 'extrusion',
    tagline: 'The PTFE tube guiding filament from a frame-mounted extruder.',
    how: `On a Bowden machine, filament travels from the extruder to the hotend through a **PTFE (Teflon) tube** held at each end by push-fit **collet couplers**. The tube must butt hard against the nozzle with no gap. Because the tube has some give, every retraction has to take up that slack first — which is why Bowden setups need longer retraction (4–6 mm) and string more than direct drive.`,
    symptoms: [
      'Stringing and oozing that retraction tuning barely improves',
      'Filament grinding after a filament change (tube not seated, or a gap opened at the nozzle)',
      'The tube slowly backs out of the coupler mid-print',
    ],
    maintenance: [
      { interval: 'quarterly', task: 'Press the collet in and push the tube fully home at both ends; add the clip if fitted' },
      { interval: 'biannual', task: 'Pull the tube, cut ~5 mm off the hotend end square with a sharp blade, and re-seat — the end wears and flares' },
    ],
    repair: `If a coupler no longer grips (the internal teeth wear), replace it — a few cents. Upgrading the stock tube to genuine **Capricorn** (tighter bore) reduces filament wander and improves retraction consistency. Always cut tube ends dead square; a diagonal cut leaves a gap that jams.`,
    relatedLessons: [{ moduleId: 'troubleshooting', lessonId: 'stringing' }],
  },

  'x-carriage': {
    id: 'x-carriage',
    name: 'Toolhead carriage',
    category: 'motion',
    tagline: 'Carries the hotend and rides the X axis.',
    how: `The plate or block holding the hotend assembly, running along the X axis on **V-groove wheels** (budget), **linear rods with bushings**, or **linear rails** (premium). Wheel-based carriages use an **eccentric nut** on one wheel to set preload — too loose and the head rocks (ringing, layer inconsistency), too tight and the motor strains and flat-spots the wheels.`,
    symptoms: [
      'Ghosting/ringing echoes after corners (carriage too loose or belt slack)',
      'You can wobble the hotend by hand front-to-back',
      'A faint clunk at direction changes; uneven wheel wear (one wheel not turning)',
    ],
    maintenance: [
      { interval: 'monthly', task: 'Check for play: hold the frame, try to rock the toolhead — there should be none, but every wheel should still turn with a fingertip' },
      { interval: 'quarterly', task: 'Wipe the V-slot / rail clean and re-lubricate rails with proper grease (never oil a V-wheel)' },
    ],
    repair: `Adjust the eccentric nut with the printer off: turn it in small steps until the loosest wheel just grips, then check every wheel still spins. Replace wheels showing flats or debris embedded in the POM. On rail-based machines, a notchy-feeling rail usually just needs cleaning and fresh grease, not replacement.`,
    relatedLessons: [{ moduleId: 'troubleshooting', lessonId: 'layer-shift' }],
  },

  'x-axis': {
    id: 'x-axis',
    name: 'X axis — motor, belt & tensioner',
    category: 'motion',
    tagline: 'Moves the toolhead left and right.',
    how: `A stepper motor turns a toothed pulley that drives a **GT2 belt** looped around an idler at the far end; the toolhead is clamped to the belt. A **tensioner** (thumbscrew or sliding block) sets belt tension: a correctly tensioned belt plucks with a low musical note, not a dull thud. Loose belts cause positional error that shows up as ringing and, in the worst case, layer shifts.`,
    symptoms: [
      'Ringing/ghosting worst on the X-facing walls',
      'Prints come out a fraction short or skewed in X',
      'A sudden sideways step in the print at one layer (skipped steps — belt slipped or something collided)',
    ],
    maintenance: [
      { interval: 'monthly', task: 'Pluck the belt — it should ring, not thud. Re-tension if slack' },
      { interval: 'quarterly', task: 'Check the pulley grub screw is tight on the motor shaft flat; inspect belt teeth for wear/cracks' },
    ],
    repair: `A pulley grub screw backed off the motor-shaft flat is a top cause of "random layer shifts" — mark it and torque it onto the flat. Replace a belt when teeth are rounded or it has stretched past the tensioner's range. Idler pulleys that squeak or wobble have a dead bearing — swap them.`,
    relatedLessons: [{ moduleId: 'troubleshooting', lessonId: 'layer-shift' }],
    photo: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nema_17_Stepper_Motor.jpg?width=700',
      credit: 'Photo: oomlout, CC BY-SA 2.0, via Wikimedia Commons',
      note: 'A NEMA 17 stepper motor — the standard size driving this axis on nearly every consumer FDM printer.',
    },
  },

  'y-axis': {
    id: 'y-axis',
    name: 'Y axis — bed carriage, belt & wheels',
    category: 'motion',
    tagline: 'Slides the whole heated bed forward and back.',
    how: `On a bed-slinger the **bed rides on the Y axis** — wheels or bearings on rails, driven by its own motor and GT2 belt with a tensioner at the front. Because the bed and everything on it is heavy, Y is the axis most prone to belt stretch, wheel wear, and — at high speed/acceleration — skipped steps and layer shifts.`,
    symptoms: [
      'Layer shift in the Y direction partway up tall prints',
      'Ringing on Y-facing walls; a rougher finish than X walls',
      'The bed rocks or lifts slightly at one corner when pushed',
    ],
    maintenance: [
      { interval: 'monthly', task: 'Tension the Y belt; check bed-carriage wheels for play and that each one turns' },
      { interval: 'quarterly', task: 'Clean the Y rails/rods and re-grease; confirm the belt runs parallel and is not rubbing the frame' },
    ],
    repair: `If tall prints shift in Y, first drop print speed and Y acceleration — the moving mass is large. Then check belt tension and the motor pulley grub screw. Worn bed wheels are cheap; replace all of them together so preload is even. Keep the bed carriage's cable chain free so it never snags at the end of travel.`,
    relatedLessons: [{ moduleId: 'troubleshooting', lessonId: 'layer-shift' }],
  },

  corexy: {
    id: 'corexy',
    name: 'CoreXY belts & idlers',
    category: 'motion',
    tagline: 'Two crossed belts move the toolhead in X and Y; the bed only moves in Z.',
    how: `Two stepper motors stay fixed to the frame. Two long belts cross the machine so that turning **both** motors the same way moves the head in one axis and turning them **opposite** ways moves the other. The toolhead is light and fast, and the heavy bed only creeps down in Z. The catch: the two belts must be at **equal tension** or the toolhead skews and prints come out as parallelograms.`,
    symptoms: [
      'Square test prints come out as parallelograms / not square (unequal belt tension)',
      'Ringing that appears on both X and Y walls equally',
      'A rhythmic tick from an idler once per pass (dry idler bearing)',
    ],
    maintenance: [
      { interval: 'monthly', task: 'Pluck both belts near the same span and match the pitch by ear or with a phone tuner app; adjust the looser one' },
      { interval: 'quarterly', task: 'Check every idler spins silently; inspect belt paths for rubbing and the belts for fraying at the toolhead clamp' },
    ],
    repair: `Print a "belt tension" test or use a frequency app — both belts should read within a few Hz of each other. A single squeaking idler with a dead bearing will eventually shed its teeth-guide and let a belt walk off; replace idler bearings as a set. Frayed belt ends at the toolhead clamp mean the clamp radius is too tight or a screw is proud and sawing the belt.`,
    relatedLessons: [{ moduleId: 'troubleshooting', lessonId: 'layer-shift' }],
  },

  'z-axis': {
    id: 'z-axis',
    name: 'Z axis — leadscrew, motor & nut',
    category: 'motion',
    tagline: 'Raises the gantry (or lowers the bed) one layer at a time.',
    how: `One or more **leadscrews** turned by stepper motors, each driving a brass or **POM nut** fixed to the moving part. Z moves slowly and carries little load, so it rarely skips — but a bent screw, a dry screw, or a screw that is over-constrained (rigidly coupled at both ends) makes a repeating wave in the surface called **Z banding** or **Z wobble**.`,
    symptoms: [
      'Regular horizontal banding at a fixed spacing up every print (Z wobble)',
      'A visible "hitch" in the surface at one height each rotation of the screw',
      'Grinding from the Z motor at the start of a print (nut binding or screw bent)',
    ],
    maintenance: [
      { interval: 'quarterly', task: 'Wipe the leadscrew(s) clean and apply a thin film of PTFE or lithium grease — never WD-40' },
      { interval: 'biannual', task: 'Loosen the motor coupler, run Z to mid-travel, and let the screw self-centre in the nut before re-tightening, so it is not fighting a misalignment' },
    ],
    repair: `The classic single-screw bed-slinger fix: make sure the top of the screw is **not** rigidly held — it should be free to wobble slightly so the nut, not the screw, defines position. A visibly bent screw (roll it on glass) must be replaced. On dual-Z machines without independent motors, a toothed belt links the screws — check its tension too. Anti-backlash nuts remove play if banding persists.`,
    relatedLessons: [{ moduleId: 'troubleshooting', lessonId: 'layer-shift' }],
    photo: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nema_17_Stepper_Motor.jpg?width=700',
      credit: 'Photo: oomlout, CC BY-SA 2.0, via Wikimedia Commons',
      note: 'A NEMA 17 stepper motor — the standard size driving the leadscrew on nearly every consumer FDM printer.',
    },
  },

  'bed-probe': {
    id: 'bed-probe',
    name: 'Z endstop / bed levelling sensor',
    category: 'bed',
    tagline: 'Tells the printer where the bed surface is.',
    how: `Sets the critical nozzle-to-bed distance. A **mechanical endstop** just marks Z=0. An **ABL probe** (inductive, BLTouch-style pin, strain gauge, or a load cell that senses the nozzle touching down) measures a grid of points and builds a **mesh** the firmware follows to compensate for a warped bed. ABL corrects warp — it does *not* set your Z-offset, which you still tune by eye on the first layer.`,
    symptoms: [
      'First layer great in the centre, bad at the edges (or vice-versa) — mesh is stale or the probe is inconsistent',
      'Probe deploys but the nozzle still crashes into the bed (offset lost, or probe triggering late)',
      'Different first-layer height every print (probe repeatability poor — loose mount, or probing while temperatures differ)',
    ],
    maintenance: [
      { interval: 'monthly', task: 'Re-run bed mesh calibration; wipe the nozzle tip first (a plastic booger throws off contact probes badly)' },
      { interval: 'quarterly', task: 'Check the probe mount for play and that the trigger height has not drifted; confirm you probe at printing temperature' },
    ],
    repair: `A BLTouch that flashes and fails to deploy usually has a bent pin or a dirty pin bore — replace the pin. Inductive probes drift with temperature; mount them so ambient heat is stable and set the offset hot. For load-cell systems, keep the nozzle scrupulously clean and don't touch the toolhead during probing.`,
    relatedLessons: [{ moduleId: 'first-layer', lessonId: 'tramming' }, { moduleId: 'first-layer', lessonId: 'z-offset' }],
  },

  'heated-bed': {
    id: 'heated-bed',
    name: 'Heated bed & build plate',
    category: 'bed',
    tagline: 'Holds the first layer down and fights warping.',
    how: `An aluminium (or older PCB) plate with an etched or silicone **heater** underneath and a **thermistor** reading its temperature. On top sits the build surface — usually a removable **spring-steel sheet** coated in textured or smooth **PEI**. Heat keeps the lower layers from shrinking off the plate; the surface plus cleanliness provides the grip.`,
    symptoms: [
      'Prints not sticking, or lifting at the corners (surface dirty, temp wrong, or first layer too high)',
      'Bed slow to reach temperature or reads an error (heater or thermistor failing, or a corroded wire at the terminal)',
      'A dished or crowned bed the mesh cannot fully fix (thermal warp — common on thin PCB beds)',
    ],
    maintenance: [
      { interval: 'each-print', task: 'Confirm the surface is clean where the print will sit' },
      { interval: 'weekly', task: 'Degrease the sheet with isopropyl alcohol; handle it only by the edges after' },
      { interval: 'quarterly', task: 'Cold machine: check the bed power wires at both ends for discoloured/melted insulation and loose screw terminals (a real fire risk)' },
    ],
    repair: `Loss of adhesion is almost always finger oil — IPA fixes it; glass cleaner leaves residue and makes it worse. A textured PEI sheet that has gone shiny and slick in the middle can be lightly scuffed with a green scrub pad, or flipped/replaced. Charred bed wiring must be fixed before the next print — re-terminate with ferrules and proper strain relief.`,
    relatedLessons: [{ moduleId: 'first-layer', lessonId: 'surfaces-adhesives' }, { moduleId: 'first-layer', lessonId: 'why-first-layer' }],
  },

  'bed-adjusters': {
    id: 'bed-adjusters',
    name: 'Bed adjusters (screws, springs or spacers)',
    category: 'bed',
    tagline: 'Set the bed parallel to the nozzle’s travel plane.',
    how: `Three or four points under the bed you turn to tram it flat. Cheap machines use a screw and a soft **spring** — which slowly compresses and lets the bed drift out of tram every few prints. **Silicone spacers** (a firm rubber column) hold their setting far better and are a common upgrade. Premium machines skip manual adjusters and correct everything in software from the mesh.`,
    symptoms: [
      'The bed needs re-tramming every week or two (springs sagging)',
      'One corner always low no matter how you adjust (bent plate, or the adjuster bottomed out)',
      'First layer drifts between "too squished" and "not sticking" over successive prints',
    ],
    maintenance: [
      { interval: 'monthly', task: 'Re-tram the bed at printing temperature; check knobs have not vibrated loose' },
      { interval: 'biannual', task: 'Replace sagged springs, or upgrade to silicone spacers and re-tram once' },
    ],
    repair: `If you re-level constantly, swap the springs for stiffer yellow springs or silicone spacers — this single change fixes most "my bed won't stay level" complaints. Tram hot, circle the corners two or three times (each adjustment affects the others), then check the centre. Snug the knobs so they resist vibration but can still be turned by hand.`,
    relatedLessons: [{ moduleId: 'first-layer', lessonId: 'tramming' }],
  },

  frame: {
    id: 'frame',
    name: 'Frame & motion hardware',
    category: 'frame',
    tagline: 'Everything rigid the moving parts push against.',
    how: `Aluminium **extrusions** bolted (and sometimes only partly tightened from the factory) into a rectangle. Rigidity matters: a frame that flexes or racks lets the toolhead vibrate, which prints as **ringing**. Gantry-style bed-slingers with a single upright are the least rigid; boxed CoreXY frames the most. Eccentric nuts, wheel preload, and bolt torque all live here.`,
    symptoms: [
      'Ringing/ghosting everywhere that lowering acceleration only partly fixes',
      'The gantry visibly deflects when you push the toolhead',
      'The whole printer "walks" across the desk at high speed',
    ],
    maintenance: [
      { interval: 'quarterly', task: 'Go around every frame bolt with the correct hex key and check torque; check the gantry is square to the base' },
      { interval: 'biannual', task: 'Re-check wheel/eccentric preload on all axes; verify the printer sits flat with no rock' },
    ],
    repair: `New budget printers benefit hugely from a "bolt check" on day one — factory assembly is rushed. Add a top brace to a single-upright gantry to cut ringing. Put the machine on a solid surface (not a flexing shelf); a paving slab or MDF board under it noticeably reduces ghosting and noise.`,
    relatedLessons: [{ moduleId: 'troubleshooting', lessonId: 'layer-shift' }],
  },

  mainboard: {
    id: 'mainboard',
    name: 'Mainboard & stepper drivers',
    category: 'electronics',
    tagline: 'Reads the G-code and drives every motor and heater.',
    how: `A microcontroller board running the firmware (Marlin, Klipper, RRF, or a vendor fork). **Stepper drivers** — separate chips or soldered on — turn step pulses into motor current; modern **TMC** drivers add near-silent operation and, on some, sensorless homing. The board also switches the heaters through MOSFETs, reads the thermistors, and runs thermal-runaway protection.`,
    symptoms: [
      'One axis dead or stuttering (driver overheated or failed)',
      'Motors quiet then suddenly loud/rough (driver in fallback mode, or lost UART comms)',
      'Random reboots mid-print (brown-out, SD card fault, or a heater MOSFET drawing too much)',
    ],
    maintenance: [
      { interval: 'quarterly', task: 'Cold machine: blow dust off the board; check the driver heatsinks are still stuck on and any board fan spins' },
      { interval: 'biannual', task: 'Re-seat plug-in drivers and connectors; check screw terminals for the heaters/PSU are tight and not browned' },
    ],
    repair: `A single dead axis is usually one driver — on boards with plug-in drivers, swap it with a working axis to confirm, then replace. Keep firmware backups before flashing. If a heater terminal has overheated, the crimp was loose — re-crimp with a ferrule; don't just retighten a damaged wire. Never disable thermal-runaway protection to "fix" a heater error.`,
    photo: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Arduino_MEGA_2560_R3,_front_side.jpg?width=700',
      credit: 'Photo: Dsimic, CC BY-SA 4.0, via Wikimedia Commons',
      note: 'An Arduino Mega 2560 — the microcontroller under many budget boards (e.g. RAMPS-based). Prusa, Bambu and other vendors use their own custom boards instead.',
    },
  },

  psu: {
    id: 'psu',
    name: 'Power supply',
    category: 'electronics',
    tagline: 'Turns mains AC into the 24 V (or 12 V) the printer runs on.',
    how: `A switch-mode supply sized for the peak load — mostly the heated bed. It has a small internal fan on many units, a mains input (fused), a voltage selector switch on some (115/230 V — set wrong, it fails immediately), and DC output terminals. It is the highest-energy component in the machine and the one most worth treating carefully.`,
    symptoms: [
      'Printer won’t power on, or the bed never gets hot while the hotend does (bed pulls the most current)',
      'A buzzing or coil whine that rises with bed heating; PSU fan not spinning',
      'Occasional resets when the bed kicks in (PSU sagging under load)',
    ],
    maintenance: [
      { interval: 'quarterly', task: 'Unplugged: check the DC output screw terminals are tight and the wires are not discoloured; clear dust from the PSU fan/vents' },
      { interval: 'biannual', task: 'Confirm the mains voltage selector (if fitted) matches your country; check the mains lead and inlet for damage' },
    ],
    repair: `Loose or under-gauge DC output wiring is a genuine fire risk — the bed wires especially should be tight, ferruled, and strain-relieved. A PSU that clicks and won't start is often in over-current shutdown from a shorted bed or hotend wire; find the short before replacing the PSU. Replace like-for-like on voltage and with equal or greater wattage.`,
    photo: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/XT-PC-Power-Supply-PSU-SMPS-IMG%200445.JPG?width=700',
      credit: 'Photo: Hans Haase, CC BY-SA 3.0, via Wikimedia Commons',
      note: 'The inside of a switch-mode power supply — the general layout (transformer, capacitors, output terminals) is the same idea as a printer’s 24 V PSU.',
    },
  },

  display: {
    id: 'display',
    name: 'Display & controls',
    category: 'electronics',
    tagline: 'Where you start prints, tune settings, and read errors.',
    how: `A rotary-knob LCD, a colour touchscreen, or increasingly just a web interface on your phone. It talks to the mainboard over a ribbon cable or serial link, reads the SD card or USB stick on many machines, and is where live tuning ("babystep Z", flow, speed) happens during a print.`,
    symptoms: [
      'Blank, garbled, or "blue screen" display (loose or reversed ribbon cable)',
      'Knob turns register the wrong way or skip (encoder dirty or failing)',
      'Touchscreen unresponsive in patches (digitiser wear)',
    ],
    maintenance: [
      { interval: 'biannual', task: 'Re-seat the display ribbon/cable at both ends; keep the screen and knob free of plastic dust' },
    ],
    repair: `A suddenly garbled LCD after moving the printer is almost always a half-unseated ribbon cable — push both connectors home. Displays are cheap, model-specific direct swaps. If only the SD card slot fails, a USB card reader on the board's host port is an easy workaround.`,
    photo: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/16x2_Character_LCD_Display.jpg?width=700',
      credit: 'Photo: oomlout, CC BY-SA 2.0, via Wikimedia Commons',
      note: 'A character LCD like the ones on many budget printers. Prosumer machines more often use a colour touchscreen instead.',
    },
  },

  'filament-system': {
    id: 'filament-system',
    name: 'Spool holder & filament path',
    category: 'extrusion',
    tagline: 'Feeds clean, dry filament to the extruder without drag.',
    how: `The spool must unwind with almost no resistance — a stiff holder adds load the extruder has to overcome, causing under-extrusion and skips. Many machines add a **runout sensor** (a switch or optical gate) that pauses the print when filament ends. Filament is hygroscopic, so a sealed **dry box** feeding the extruder directly is the ideal path for PETG, TPU and nylon.`,
    symptoms: [
      'Under-extrusion that comes and goes as the spool gets lighter or tangles',
      'Print pauses for "filament runout" with filament still loaded (sensor false trigger — dust or a worn switch)',
      'Popping at the nozzle and hairy surfaces (wet filament, not a printer fault)',
    ],
    maintenance: [
      { interval: 'each-print', task: 'Check the spool spins freely and the filament has not slipped under a loose wrap' },
      { interval: 'monthly', task: 'Blow dust out of the runout sensor; wipe the filament with a foam filter clipped before the extruder' },
    ],
    repair: `Add a bearing-based spool holder or roller if the stock one drags. A runout sensor that cries wolf can be cleaned, adjusted, or disabled in firmware if it causes more failed prints than it saves. For the thirsty materials, print straight from a dry box — no amount of printer tuning fixes wet filament.`,
    relatedLessons: [{ moduleId: 'materials', lessonId: 'moisture' }],
    photo: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/ABS_filament_spool.jpg?width=700',
      credit: 'Photo: Tatár Lehel, CC BY-SA 3.0 / GFDL, via Wikimedia Commons',
    },
  },
}

// ---------------------------------------------------------------------------
// Printers
// ---------------------------------------------------------------------------

export interface PrinterPartRef {
  partId: string
  /** Hotspot position in the diagram's viewBox coordinates. */
  hotspot: { x: number; y: number }
  /** Model-specific detail added under the shared explanation. */
  note?: string
}

export interface Printer {
  id: string
  name: string
  maker: string
  /** Which schematic to draw. */
  diagram: 'bedslinger' | 'corexy'
  year: string
  blurb: string
  specs: { label: string; value: string }[]
  manualUrl: string
  manualLabel: string
  parts: PrinterPartRef[]
}

/** Bed-slinger hotspot coordinates (viewBox 0 0 440 400). */
const BEDSLINGER_HOTSPOTS: Record<string, { x: number; y: number }> = {
  'spool-holder': { x: 220, y: 34 },
  extruder: { x: 120, y: 60 },
  bowden: { x: 175, y: 120 },
  'x-carriage': { x: 232, y: 178 },
  'part-fan': { x: 268, y: 196 },
  'heater-block': { x: 232, y: 210 },
  nozzle: { x: 232, y: 232 },
  heatbreak: { x: 232, y: 192 },
  'heatsink-fan': { x: 200, y: 182 },
  'x-axis': { x: 330, y: 168 },
  'z-axis': { x: 96, y: 250 },
  'bed-probe': { x: 210, y: 250 },
  'heated-bed': { x: 232, y: 286 },
  'bed-adjusters': { x: 300, y: 300 },
  'y-axis': { x: 150, y: 320 },
  frame: { x: 350, y: 90 },
  mainboard: { x: 388, y: 330 },
  psu: { x: 388, y: 280 },
  display: { x: 330, y: 366 },
  'filament-system': { x: 260, y: 30 },
}

/** CoreXY hotspot coordinates (viewBox 0 0 440 400). */
const COREXY_HOTSPOTS: Record<string, { x: number; y: number }> = {
  corexy: { x: 210, y: 78 },
  'x-carriage': { x: 220, y: 96 },
  'part-fan': { x: 250, y: 108 },
  'heater-block': { x: 220, y: 120 },
  nozzle: { x: 220, y: 140 },
  heatbreak: { x: 220, y: 104 },
  'heatsink-fan': { x: 192, y: 96 },
  extruder: { x: 220, y: 80 },
  'z-axis': { x: 120, y: 250 },
  'bed-probe': { x: 250, y: 232 },
  'heated-bed': { x: 220, y: 240 },
  frame: { x: 70, y: 90 },
  mainboard: { x: 220, y: 372 },
  psu: { x: 320, y: 372 },
  display: { x: 110, y: 360 },
  'filament-system': { x: 404, y: 60 },
}

function refs(
  hotspots: Record<string, { x: number; y: number }>,
  entries: (string | [string, string])[],
): PrinterPartRef[] {
  return entries.map((e) => {
    const [partId, note] = Array.isArray(e) ? e : [e, undefined]
    return { partId, hotspot: hotspots[partId] ?? { x: 220, y: 200 }, note }
  })
}

export const PRINTERS: Printer[] = [
  {
    id: 'ender3-v2',
    name: 'Ender-3 V2',
    maker: 'Creality',
    diagram: 'bedslinger',
    year: '2020',
    blurb:
      'The archetypal budget bed-slinger, and the machine millions of people learn on. Bowden extrusion, manual bed tramming, V-wheel motion — every part is exposed and serviceable, which makes it a superb teacher.',
    specs: [
      { label: 'Build volume', value: '220 × 220 × 250 mm' },
      { label: 'Motion', value: 'Cartesian bed-slinger, V-wheels on extrusion' },
      { label: 'Extruder', value: 'Bowden, single-gear (frame-mounted)' },
      { label: 'Hotend', value: 'PTFE-lined, MK8 brass nozzle 0.4 mm, ~240 °C' },
      { label: 'Bed', value: 'Carborundum glass, manual 4-point tram, ~100 °C' },
      { label: 'Z', value: 'Single leadscrew, left side' },
      { label: 'Board', value: '32-bit, silent TMC2208 (v4.2.2 / 4.2.7)' },
    ],
    manualUrl: 'https://www.creality.com/pages/download-ender-3-v2',
    manualLabel: 'Creality downloads',
    parts: refs(BEDSLINGER_HOTSPOTS, [
      ['nozzle', 'Standard MK8 brass. Swap to hardened steel before any abrasive filament — brass wears in hours.'],
      ['heater-block', 'The stock heater/thermistor wires flex right at the block; add strain relief and check the grub screws — this is the #1 "thermal runaway" cause on this machine.'],
      ['heatbreak', 'PTFE-lined. The Teflon tube runs all the way to the nozzle; replace it every few months and after any prolonged printing above 240 °C.'],
      ['heatsink-fan', 'A 24 V 40 mm fan. When it ages and slows you get heat-creep jams that look like everything else — treat it as an annual wear item.'],
      ['part-fan', 'Stock blower and duct are weak; a printed duct + stronger 5015 blower is the most common first upgrade and noticeably improves overhangs.'],
      ['extruder', 'Stock is a single-gear plastic-armed extruder — the arm cracks with age and lets filament slip. The aluminium dual-gear replacement is a cheap, worthwhile upgrade.'],
      ['bowden', 'Stock PTFE + push-fit couplers. Seat both ends hard, keep the little blue clips on, and cut the hotend end square. Capricorn tube tightens retraction consistency.'],
      ['x-carriage', 'Three V-wheels with one eccentric nut. Set it so the loosest wheel just grips and every wheel still spins by fingertip.'],
      ['x-axis', 'Manual belt routing, no dedicated tensioner on early units — a printed X-tensioner is a good add. Check the pulley grub screw on the motor-shaft flat.'],
      ['y-axis', 'Front thumb-wheel tensioner. The bed is heavy — if tall prints shift in Y, lower speed/acceleration first, then tension.'],
      ['z-axis', "Single screw on the left. Leave the TOP of the screw free to wobble — don't rigidly constrain it — so the nut defines position. This kills most Z-banding here."],
      ['bed-probe', 'Mechanical Z endstop only — no ABL from the factory. Adding a CR Touch / BLTouch gives you a mesh; you still set the Z-offset by eye.'],
      ['heated-bed', 'Carborundum glass sheet. Grips PLA well warm, releases when cool. Check the bed power wires at the terminal block — early units had thin, under-strain-relieved wiring.'],
      ['bed-adjusters', 'Large hand knobs on soft springs. The springs sag — swap for yellow stiff springs or silicone spacers and you will re-level far less often.'],
      ['frame', 'Single-upright gantry — the least rigid layout. A bolt-check on day one and a top gantry brace both reduce ringing.'],
      ['mainboard', 'Under the machine on the right. 32-bit with soldered TMC2208 — quiet, but a failed driver means a board swap, not a chip swap.'],
      ['psu', 'Mains-voltage selector switch on the side (Meanwhile / Creality unit) — check it matches your country before first power-on.'],
      ['display', 'Rotary-encoder colour LCD on the front right. Garbled screen after moving the printer = re-seat the ribbon cable.'],
      ['filament-system', 'Simple plastic spool arm on top — it drags. A bearing roller or top-mounted holder reduces extruder load. No runout sensor on the base model.'],
    ]),
  },

  {
    id: 'prusa-mk4s',
    name: 'MK4S',
    maker: 'Prusa Research',
    diagram: 'bedslinger',
    year: '2024',
    blurb:
      'A prosumer i3-style bed-slinger built to be maintained: the Nextruder direct drive, a load-cell that probes with the nozzle tip itself, segmented spring-steel bed, and firmware with input shaping. Same fundamental layout as an Ender 3, engineered several tiers up.',
    specs: [
      { label: 'Build volume', value: '250 × 210 × 220 mm' },
      { label: 'Motion', value: 'Cartesian bed-slinger, linear rods + bearings' },
      { label: 'Extruder', value: 'Nextruder — direct drive, planetary gearset' },
      { label: 'Hotend', value: 'All-metal, high-flow nozzle 0.4 mm, up to ~290 °C' },
      { label: 'Bed', value: 'Removable PEI spring steel, load-cell mesh, ~120 °C' },
      { label: 'Z', value: 'Dual leadscrews, dual motors' },
      { label: 'Board', value: 'xBuddy, Trinamic drivers, input shaper, Wi-Fi' },
    ],
    manualUrl: 'https://help.prusa3d.com/category/mk4s_1057',
    manualLabel: 'Prusa Knowledge Base',
    parts: refs(BEDSLINGER_HOTSPOTS, [
      ['nozzle', 'High-flow "Prusa nozzle" — quick-swap on the MK4S revision. Still brass by default; hardened and larger sizes available.'],
      ['heater-block', 'Integrated into a modular hotend cartridge — the whole heater/thermistor unit swaps as a module, which makes field repair fast.'],
      ['heatbreak', 'All-metal. No PTFE liner to degrade, so no periodic liner swap — just keep the bore clean and the heatsink clear.'],
      ['heatsink-fan', 'Monitored in firmware — the printer stops with an error if RPM drops, so you get a warning before it causes jams. Still worth replacing every year or two.'],
      ['part-fan', 'Also RPM-monitored. The duct is a printed part in Prusa PETG — reprint from their files if it cracks near the hotend.'],
      ['extruder', 'The Nextruder: direct drive with a planetary gearset for high grip at low motor torque. Handles flexibles well. The gearset is greased for life but the drive gear can still pack with dust — brush it monthly.'],
      ['x-carriage', 'Runs on a linear rod with bushings, not V-wheels — nothing to preload, but keep the rod clean and lightly oiled. The load cell lives in this toolhead.'],
      ['x-axis', 'GT2 belt with a proper screw tensioner and a printed tensioner block. Prusa firmware can report belt tension via a self-test.'],
      ['y-axis', 'Bed on twin linear rods. The Y belt tensioner is under the bed at the front; run the self-test after adjusting.'],
      ['z-axis', 'Two leadscrews, two independent motors — the firmware can auto-align them at startup so the X gantry is level. Grease both screws quarterly.'],
      ['bed-probe', 'No separate probe — the nozzle itself presses on the bed and a load cell in the toolhead detects contact, then builds the mesh. Keep the nozzle tip spotless; a plastic booger ruins the reading.'],
      ['heated-bed', 'Segmented heater with independent zones for even temperature, plus a removable textured/smooth PEI spring steel. Degrease weekly; flex to release parts. There are no manual bed-levelling screws — the load-cell mesh compensates in software, which removes the whole "my bed drifted out of level" failure mode.'],
      ['frame', 'Bear-style thick aluminium frame — much stiffer than a single-upright gantry. Still check bolts at the extrusion joints yearly.'],
      ['mainboard', 'xBuddy board in the base enclosure with Trinamic drivers and input shaping. Firmware updates over USB/Wi-Fi; keep a backup.'],
      ['psu', 'Internal, sized for the segmented bed. Check the DC terminals in the base compartment during the yearly service.'],
      ['display', 'Colour screen with a click-wheel. Live tuning (Live-Z / first-layer offset) is done here during the first layer.'],
      ['filament-system', 'MMU-ready. Optical filament sensor in the extruder. Feed from a dry box for PETG/PA — the Nextruder path is short and tolerant but wet filament still ruins prints.'],
    ]),
  },

  {
    id: 'bambu-p1s',
    name: 'P1S',
    maker: 'Bambu Lab',
    diagram: 'corexy',
    year: '2023',
    blurb:
      'An enclosed CoreXY — the toolhead is light and fast while the bed only moves in Z. Fully covered, so servicing means opening panels, but the payoff is speed, a stable chamber for ABS, and very consistent motion once the two belts are matched.',
    specs: [
      { label: 'Build volume', value: '256 × 256 × 256 mm' },
      { label: 'Motion', value: 'CoreXY, enclosed; carbon X gantry' },
      { label: 'Extruder', value: 'Direct drive, dual-gear' },
      { label: 'Hotend', value: 'All-metal, swappable nozzle 0.4 mm, ~300 °C' },
      { label: 'Bed', value: 'Textured PEI plate, auto mesh, ~100 °C' },
      { label: 'Z', value: 'Bed on leadscrew(s), driven from one motor' },
      { label: 'Extras', value: 'Enclosed chamber, AMS-ready, chamber exhaust fan' },
    ],
    manualUrl: 'https://wiki.bambulab.com/en/p1',
    manualLabel: 'Bambu Lab Wiki',
    parts: refs(COREXY_HOTSPOTS, [
      ['corexy', 'Two belts cross the machine. If square test prints come out as parallelograms, the belts are at unequal tension — match their pitch with a phone tuner app.'],
      ['nozzle', 'All-metal, quick-swap assembly (nozzle + heater + break come as a unit on this platform). Hardened options for CF/GF filament.'],
      ['heater-block', 'Part of the combined hotend module — you replace the whole module rather than individual grub-screwed parts, which is faster but pricier.'],
      ['heatbreak', 'All-metal, integrated in the hotend module. No PTFE liner maintenance.'],
      ['heatsink-fan', 'Inside the toolhead shroud. Getting to it means removing the toolhead cover — follow the wiki teardown; the cables are short.'],
      ['part-fan', 'Toolhead blower plus a separate auxiliary part-cooling fan on the side of the chamber for fast PLA. Keep both impellers clear of dust.'],
      ['extruder', 'Compact dual-gear direct drive in the toolhead. A filament cutter blade trims the tip on each change — check it is sharp if changes start jamming.'],
      ['x-carriage', 'Rides the carbon-fibre X gantry tube. Wipe the tube and re-lube lightly; grit here shows up as ringing on both axes.'],
      ['z-axis', 'The whole bed is the Z stage, carried on leadscrew(s) from a single motor. Keep the screw(s) greased; a notchy Z feel is usually just a dry screw.'],
      ['bed-probe', 'Automatic — the printer measures the plate before each print (analog force sensing through the toolhead). Wipe the nozzle first; the routine also relies on clean bed contact points.'],
      ['heated-bed', 'Textured PEI on a spring steel plate over the heater. Degrease weekly with IPA. The enclosed chamber helps ABS but also keeps PLA hot — use the aux fan and open the top for PLA.'],
      ['frame', 'Boxed, panelled CoreXY frame — the stiffest of the three layouts, which is why it can print fast without ringing. Panels also retain chamber heat; check panel clips and door seal.'],
      ['mainboard', 'In the base, behind a cover. Largely sealed; servicing is connector re-seating and dust removal. Firmware updates come over the network.'],
      ['psu', 'Internal, in the base. Sized for the bed and motion; check the base compartment for dust at the yearly service.'],
      ['display', 'Small mono screen plus phone/cloud control. Most tuning happens in Bambu Studio or the app rather than on the machine.'],
      ['filament-system', 'External spool or AMS. The path into an enclosed CoreXY is long — a dry AMS or dry box matters more here, and the PTFE path segments should be checked for wear where they flex.'],
    ]),
  },
]

export function getPrinter(id: string): Printer | undefined {
  return PRINTERS.find((p) => p.id === id)
}

export function partOf(ref: PrinterPartRef): PartInfo | undefined {
  return PART_LIBRARY[ref.partId]
}

/** Maintenance-log key for a specific task on a specific printer. */
export function maintKey(printerId: string, partId: string, taskIndex: number): string {
  return `${printerId}:${partId}:${taskIndex}`
}
