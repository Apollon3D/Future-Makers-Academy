import type { Module } from '../../types'

export const postProcessing: Module = {
  id: 'post-processing',
  title: 'Post-Processing & Finishing',
  blurb: 'Turn a functional print into a finished part: sanding, painting, smoothing, and bonding.',
  icon: '✦',
  level: 'level-2',
  requires: ['level-1-exam'],
  lessons: [
    {
      id: 'why-post-process',
      title: 'Why Bother Finishing a Print?',
      summary: 'What post-processing actually buys you, and when to skip it.',
      estMinutes: 4,
      type: 'reading',
      body: `A print straight off the bed already works for a lot of jobs — jigs, prototypes, brackets nobody will see. Post-processing is for the rest: parts that need to look good, seal against water or air, mate smoothly with another part, or survive rougher handling than the raw layer lines allow.

## What finishing actually changes

- **Appearance** — hides layer lines, evens out color, adds gloss or a chosen texture.
- **Surface function** — smoother surfaces move through o-rings and bearings, seal better, and collect less dirt or bacteria.
- **Strength in specific spots** — a threaded insert or a fillet of epoxy can outlast the printed plastic alone.
- **Assembly** — gluing, welding, and fasteners turn several printed parts into one object.

## When to skip it

Finishing costs time, and some steps (solvents, heat) are not reversible if you get them wrong. If the part is a one-off fit-check, a jig, or something that lives inside an enclosure no one opens, printing it clean and moving on is usually the better use of your time.`,
      keyTakeaways: [
        'Finishing trades time for appearance, surface function, targeted strength, or assembly.',
        'Skip it for internal or throwaway parts where raw print quality is already enough.',
      ],
    },
    {
      id: 'sanding-filling',
      title: 'Sanding & Filling',
      summary: 'Removing layer lines and blemishes before anything else happens.',
      estMinutes: 6,
      type: 'reading',
      body: `Sanding is the foundation every other finishing step builds on — paint and primer both telegraph whatever texture is underneath them.

## Sandpaper progression

Work up through grits rather than jumping straight to fine paper — each grit's job is to remove the scratches left by the one before it:

1. **150–220 grit**: knock down layer lines and support marks.
2. **320–400 grit**: smooth out the 150–220 scratches.
3. **600–800+ grit** (wet sanding, i.e. with water): a glassy finish before painting or clear coat.

**Wet sanding** (dunking the paper or flowing water over the part) clears dust as you go, prevents the paper clogging with melted plastic, and gives a finer result at the same grit.

## Filling gaps and layer lines

- **Gap-filling primer** (a thick sandable spray primer) fills shallow layer lines in one or two coats — sand it back and you have a smooth substrate for the final finish.
- **Two-part epoxy filler** or **body filler (glazing putty)** handles bigger gaps, seams, or support scars: apply, let cure, sand flush.
- PLA sands and fills easily; ABS is a similar experience; PETG is gummier and tends to clog paper — go slower and clean the paper often.

> A print that will be painted is only as good as the sanding underneath it. Rushing this step shows up immediately once paint is on.`,
      keyTakeaways: [
        'Sand through a grit progression (coarse → fine); each step removes the previous step’s scratches.',
        'Wet sanding at high grit gives the smoothest result and less clogging.',
        'Gap-filling primer or epoxy filler closes layer lines and seams before painting.',
      ],
    },
    {
      id: 'priming-painting',
      title: 'Priming & Painting',
      summary: 'Getting paint to stick, look even, and survive handling.',
      estMinutes: 6,
      type: 'reading',
      body: `## Why prime first

Primer does three jobs: it gives paint something more uniform to grip than bare plastic, it is formulated to be sanded smooth, and it seals the surface so the topcoat's color goes on even instead of soaking in unevenly.

- **Filler/sandable primer**: thick, built to be sanded — use this on visible parts.
- **Plastic-specific primer/adhesion promoter**: thin, made to bond to slick plastics like PP or ABS where filler primer alone won't stick well.

## Painting

- **Spray cans** (enamel, lacquer, or acrylic): several **thin** coats beat one thick one — thick coats sag, run, and take far longer to cure hard.
- Light "dust" coats first to build a base the wetter coats can grip, then fuller coats.
- Let each coat flash off per the can's instructions before the next; recoat windows exist for a reason — paint outside them and the layers can wrinkle.
- **Acrylic (water-based) paints** brushed on are common for miniatures — thin with water or medium, multiple thin coats, occasional wet-sanding between coats for a very smooth result.

## Compatibility

Some spray paint solvents attack certain plastics (PLA can craze or soften under strong lacquer solvents). Test on scrap or an inconspicuous spot first, especially with any solvent-heavy spray paint on PLA.`,
      keyTakeaways: [
        'Primer improves adhesion, sandability, and even color underneath the topcoat.',
        'Several thin coats beat one thick coat — thick coats sag and cure slowly.',
        'Test paint compatibility on scrap first; some solvents attack PLA.',
      ],
    },
    {
      id: 'vapor-smoothing',
      title: 'Vapor Smoothing & Chemical Finishing',
      summary: 'Acetone smoothing for ABS/ASA, and safer alternatives.',
      estMinutes: 6,
      type: 'reading',
      body: `## Acetone vapor smoothing (ABS / ASA)

Acetone dissolves the outer surface of ABS and ASA. Expose the part to **acetone vapor** (not a liquid dip, which over-melts detail) in a sealed container, and the softened surface flows just enough to erase layer lines while the bulk of the part stays solid — the classic "injection-molded" look.

**Safety first**: acetone vapor is flammable and the fumes are unpleasant to breathe in quantity.

- Work in a **well-ventilated area**, away from any open flame or spark source (this includes some appliance pilot lights).
- Use a sealed glass or metal container, never an open dish you breathe over.
- A small heat source (like a warm-water bath under the container) speeds vapor smoothing but adds fire risk — many hobbyists skip heating and just accept a longer exposure time.
- Check progress every few minutes; oversmoothing softens fine features and can warp thin walls.

## What it does not work on

Acetone does not meaningfully smooth **PLA** (a different polymer family) or **PETG**. Attempts to find a PLA-safe solvent equivalent generally trade one problem for another — this technique is specific to ABS/ASA.

## Gentler alternatives

- **Butanone (MEK) or specialty smoothing sprays**: marketed for other polymers, less mainstream, follow the manufacturer's ventilation guidance exactly.
- **Filler primer + wet sanding** (previous lesson): slower, but works on any material and needs no solvent vapor step at all — the safer default unless you specifically need the acetone look on ABS/ASA.`,
      keyTakeaways: [
        'Acetone vapor smooths ABS/ASA by dissolving and re-flowing the surface layer.',
        'It is flammable and must be done ventilated, away from ignition sources, in a sealed container.',
        'It does not work on PLA or PETG — sanding and priming is the material-agnostic alternative.',
      ],
    },
    {
      id: 'bonding-assembly',
      title: 'Bonding, Welding & Assembly',
      summary: 'Gluing prints together, threaded inserts, and plastic welding.',
      estMinutes: 6,
      type: 'reading',
      body: `## Adhesives

- **Cyanoacrylate (CA / "super glue")**: fast, strong on small contact areas, brittle once cured. Good for PLA, ABS, and quick tacking. Accelerator spray cures it almost instantly for less precise clamping.
- **Epoxy (2-part)**: slower cure, much better gap-filling and higher toughness than CA — the choice for structural bonds or uneven mating surfaces.
- **Plastic cement / solvent weld** (for ABS): actually melts and fuses the two ABS surfaces together rather than gluing a separate layer between them — the strongest bond you can get on ABS, but it only works on ABS-to-ABS and needs ventilation like any solvent.
- **PETG and PP** are notoriously hard to glue with anything — mechanical fasteners or (for PP) heat-welding are more reliable than adhesive.

## Threaded inserts

**Heat-set brass inserts** give a printed part real, reusable metal threads: press a knurled brass insert into an undersized printed hole using a heated tool (a soldering iron with the right tip, or a dedicated insert tool) — the heat melts the immediately surrounding plastic, which cools and grips the insert's knurling. Far stronger and more durable than threading the plastic itself, and reusable across many screw-in/out cycles.

## Mechanical fasteners

Printed parts take self-tapping screws into an undersized pilot hole reasonably well in tougher materials (PETG, nylon), less well in brittle ones (PLA can crack). Captured nuts (a hex pocket sized to hold a nut so it can't spin) are a simple, strong alternative that needs no heat and no glue.`,
      keyTakeaways: [
        'CA glue is fast but brittle; epoxy is slower but tougher and better at gap-filling.',
        'Solvent welding fuses ABS-to-ABS directly and is stronger than gluing it.',
        'Heat-set brass inserts give reusable metal threads in a printed part.',
      ],
    },
    {
      id: 'check-post-processing',
      title: 'Checkpoint: Post-Processing',
      summary: 'Pick the right finishing technique for the job.',
      estMinutes: 5,
      type: 'quiz',
      passScore: 70,
      questions: [
        {
          id: 'q1',
          prompt: 'Why sand through a grit progression instead of jumping straight to fine paper?',
          options: [
            'Fine paper is more expensive so you save it for last',
            'Each grit removes the scratches left by the previous, coarser grit',
            'Coarse paper does not work on plastic',
            'It has no effect either way',
          ],
          answer: 1,
          explanation: 'Skipping grits leaves the coarser scratches behind, which fine paper alone cannot remove.',
        },
        {
          id: 'q2',
          prompt: 'When spray painting a print, the best approach is:',
          options: [
            'One thick, heavy coat to save time',
            'Several thin coats, letting each flash off before the next',
            'Paint immediately after sanding without primer',
            'Apply paint while the part is still warm from printing',
          ],
          answer: 1,
          explanation: 'Thick coats sag and cure slowly; several thin coats build an even, durable finish.',
        },
        {
          id: 'q3',
          prompt: 'Acetone vapor smoothing works well on:',
          options: ['PLA', 'PETG', 'ABS and ASA', 'Nylon'],
          answer: 2,
          explanation: 'Acetone dissolves and re-flows ABS/ASA specifically; it does not meaningfully affect PLA or PETG.',
        },
        {
          id: 'q4',
          prompt: 'A heat-set insert is installed by:',
          options: [
            'Gluing it into an oversized hole',
            'Pressing it in cold with pliers',
            'Using a heated tool to melt it into an undersized printed hole',
            'Screwing it in like a normal screw',
          ],
          answer: 2,
          explanation: 'Heat melts the plastic immediately around the insert so it re-solidifies gripping the knurled brass.',
        },
        {
          id: 'q5',
          prompt: 'For a strong, permanent ABS-to-ABS joint, the best option is usually:',
          options: [
            'Cyanoacrylate (super glue)',
            'Solvent welding (plastic cement)',
            'Masking tape',
            'No adhesive is needed for ABS',
          ],
          answer: 1,
          explanation: 'Solvent welding actually fuses the two ABS surfaces together, giving a stronger joint than any glued-on adhesive layer.',
        },
      ],
    },
    {
      id: 'post-processing-cards',
      title: 'Flashcards: Finishing Techniques',
      summary: 'Lock in when to use each technique.',
      estMinutes: 4,
      type: 'flashcards',
      cards: [
        { id: 'fc-grit', front: 'Typical sanding grit progression for a print?', back: '150–220 → 320–400 → 600–800+ (wet), working coarse to fine.' },
        { id: 'fc-primer-job', front: 'What does primer actually do before painting?', back: 'Improves paint adhesion, is formulated to sand smooth, and seals the surface for even color.' },
        { id: 'fc-acetone', front: 'What does acetone vapor smoothing work on, and what is the key safety rule?', back: 'ABS/ASA only. Ventilate well, sealed container, no open flame/spark nearby — vapor is flammable.' },
        { id: 'fc-ca-vs-epoxy', front: 'CA glue vs. epoxy — the trade-off?', back: 'CA: fast, strong on small contact area, brittle. Epoxy: slower, better gap-filling, tougher.' },
        { id: 'fc-solvent-weld', front: 'What makes solvent welding stronger than gluing for ABS?', back: 'It melts and fuses the two surfaces together directly, rather than bonding through a separate adhesive layer.' },
        { id: 'fc-insert', front: 'Why use a heat-set insert instead of threading the plastic directly?', back: 'Reusable metal threads that survive many more screw cycles than plastic threads alone.' },
      ],
    },
  ],
}
