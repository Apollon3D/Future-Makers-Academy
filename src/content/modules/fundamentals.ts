import type { Module } from '../../types'

export const fundamentals: Module = {
  id: 'fundamentals',
  title: 'FDM Fundamentals',
  blurb: 'How a filament printer turns a digital model into a physical object.',
  icon: '▦',
  level: 'level-1',
  lessons: [
    {
      id: 'fdm-what',
      title: 'What Is FDM 3D Printing?',
      summary: 'Additive vs. subtractive manufacturing and the core FDM idea.',
      estMinutes: 5,
      type: 'reading',
      body: `## Additive, not subtractive

Most manufacturing you have seen is **subtractive**: you start with a block of material and cut, drill, or mill away everything that is not the part. **Additive manufacturing** works the opposite way — it builds the part up from nothing, adding material only where it is needed.

**FDM** stands for *Fused Deposition Modelling* (also called FFF, *Fused Filament Fabrication*). It is by far the most common 3D printing process for hobbyists, schools, and prototyping.

## The core idea

An FDM printer does three things, over and over:

1. **Melt** a thin plastic thread (*filament*) by pushing it through a heated nozzle.
2. **Move** that nozzle along a precise path in the X and Y directions, laying down a line of molten plastic that fuses to what is already there.
3. **Step up** a fraction of a millimetre in Z and draw the next *layer* on top.

Stack a few hundred of these layers and you have a solid object. A layer is typically **0.1–0.3 mm** thick — about the thickness of a sheet of paper or two.

## Why it matters

Because the printer only adds material where the design needs it, you can make shapes that are difficult or impossible to machine or mould: internal channels, organic curves, enclosed cavities, or one-off custom parts with no tooling cost. The trade-off is that those visible layers create a characteristic texture and make the part weaker in the vertical direction — themes you will return to throughout this course.`,
      keyTakeaways: [
        'FDM builds parts layer by layer from melted plastic filament.',
        'Each layer is roughly 0.1–0.3 mm thick.',
        'Additive processes add material only where needed — enabling shapes that cannot be machined or moulded.',
      ],
    },
    {
      id: 'video-getting-started',
      title: 'Watch: A Complete Beginner Walkthrough',
      summary: 'A full tour — assembly, slicing, levelling and first prints.',
      estMinutes: 22,
      type: 'video',
      provider: 'youtube',
      src: 'T-Z3GmM20JM',
      credit: 'Thomas Sanladerer (Made with Layers)',
      intro:
        'Before the detail lessons, watch one experienced maker take a printer from box to first print. You will recognise every stage from the previous lesson.',
      body: `## What to notice

- How little of the time is spent *printing* versus preparing (levelling, slicing, checking).
- The slicer is where the settings decisions happen — that is the next module.
- The first layer gets special attention. So does ours, later.

Don't worry about memorising numbers from the video — the written lessons cover the specifics for your printer.`,
      keyTakeaways: [
        'The workflow in practice: set up → slice → watch the first layer → let it run.',
        'Most of the skill is in preparation, not the print itself.',
      ],
    },
    {
      id: 'printer-anatomy',
      title: 'Anatomy of an FDM Printer',
      summary: 'The hotend, extruder, motion system, bed, and controller.',
      estMinutes: 7,
      type: 'reading',
      body: `Every FDM printer, from a $150 starter machine to an industrial one, is built from the same functional blocks.

## The extruder

A geared motor grips the filament and pushes it forward at a controlled rate. Two arrangements exist:

- **Bowden**: the motor is mounted on the frame and pushes filament through a long PTFE tube to the hotend. Lighter moving mass, faster travel, but more lag when starting and stopping flow.
- **Direct drive**: the motor sits right above the hotend. Heavier, but far better control — important for flexible filaments like TPU.

## The hotend

Where filament becomes liquid. Key parts:

- **Heater cartridge** and **thermistor** — heat and measure temperature.
- **Heat break** — a deliberately thin section that keeps the melt zone short so plastic does not soften too early and jam.
- **Nozzle** — the calibrated orifice, usually **0.4 mm**, that shapes the extruded line.

## The motion system

Stepper motors, belts, and lead screws move the nozzle relative to the bed in X, Y, and Z. Common layouts: *bed slinger* (bed moves in Y), *CoreXY* (bed only moves down in Z, head moves in X/Y), and *delta*.

## The build plate

A heated, flat surface the first layer sticks to. Usually aluminium with a removable spring-steel sheet coated in PEI or a textured powder coat.

## The controller

A small board with a microcontroller reads **G-code** — a text list of movements and commands — and drives every motor and heater in sync.`,
      widget: 'axis-visualizer',
      keyTakeaways: [
        'Extruder pushes filament; hotend melts it; motion system positions it; bed holds the part; controller runs the G-code.',
        'Bowden vs. direct drive is a trade-off between moving mass and flow control.',
        'The heat break keeps the melt zone short to prevent jams.',
      ],
    },
    {
      id: 'axes-layers',
      title: 'Axes & Layers: Move the Print Head',
      summary: 'Interactive: drag the print head through X, Y, and Z space.',
      estMinutes: 4,
      type: 'interactive',
      widget: 'axis-visualizer',
      intro:
        'FDM printers work in a Cartesian coordinate system. Press Print and watch the nozzle trace one layer’s toolpath in X and Y, then step up in Z for the next. Scrub the layer slider to jump around the build.',
      body: `Notice that **Z only ever increases** during a normal print — the machine finishes an entire layer in X/Y before stepping up. The height of that step is your **layer height**, the single setting that most affects both print time and surface finish.`,
    },
    {
      id: 'workflow',
      title: 'The Print Workflow: Model → Slice → Print',
      summary: 'The three-stage pipeline every print goes through.',
      estMinutes: 6,
      type: 'reading',
      body: `## 1. Get a model

You need a 3D model as a mesh file — usually **STL** or **3MF**. You can download one (Printables, Thingiverse, MakerWorld), model it yourself in CAD (Fusion, Onshape, FreeCAD, Tinkercad), or scan a real object.

A mesh describes only the *surface* of the object as a web of triangles. It contains no information about how to print it.

## 2. Slice it

A **slicer** (Cura, PrusaSlicer, OrcaSlicer, Bambu Studio) takes the mesh plus your settings and computes the actual toolpath: every line the nozzle will draw, on every layer, plus temperatures, fan speeds, and support structures. It exports **G-code**.

This is where nearly all of your decisions live — layer height, infill, supports, speed — and where this course spends most of its time.

## 3. Print it

The printer executes the G-code line by line. Your job shifts to **preparation and observation**: a clean, level bed; dry filament; and watching the critical first layer go down. Most failed prints can be caught or prevented in the first few minutes.

> A useful mental model: the model is *what*, the slicer is *how*, and the printer is *do it*. Getting good results is mostly about mastering the "how".`,
      keyTakeaways: [
        'Mesh files (STL/3MF) describe only the surface — they are not printable on their own.',
        'The slicer converts mesh + settings into G-code toolpaths.',
        'Most quality decisions are made in the slicer, not on the printer.',
      ],
    },
    {
      id: 'check-fundamentals',
      title: 'Checkpoint: Fundamentals',
      summary: 'Five questions on the FDM process and workflow.',
      estMinutes: 4,
      type: 'quiz',
      passScore: 70,
      questions: [
        {
          id: 'q1',
          prompt: 'What best describes additive manufacturing?',
          options: [
            'Cutting material away from a solid block',
            'Building an object up by adding material only where needed',
            'Injecting molten plastic into a mould',
            'Pressing sheet metal into a shape',
          ],
          answer: 1,
          explanation:
            'Additive processes add material layer by layer. Subtractive processes (milling, turning) remove it from stock.',
        },
        {
          id: 'q2',
          prompt: 'A typical FDM layer height is around:',
          options: ['0.002 mm', '0.02 mm', '0.2 mm', '2 mm'],
          answer: 2,
          explanation:
            'Most FDM printing happens between 0.1 and 0.3 mm per layer, with 0.2 mm as the common default.',
        },
        {
          id: 'q3',
          prompt: 'What is the job of the heat break in a hotend?',
          options: [
            'To spread heat evenly across the whole hotend',
            'To keep the melt zone short so filament does not soften too early and jam',
            'To cool the printed part after each layer',
            'To measure the nozzle temperature',
          ],
          answer: 1,
          explanation:
            'The thin heat break limits heat creep up the filament path, keeping the molten region small and controllable.',
        },
        {
          id: 'q4',
          prompt: 'Which file does a slicer produce for the printer to run?',
          options: ['STL', 'G-code', 'STEP', '3MF mesh'],
          answer: 1,
          explanation:
            'The slicer outputs G-code: a text list of moves, extrusion amounts, temperatures, and fan commands.',
        },
        {
          id: 'q5',
          prompt:
            'On a direct-drive extruder, compared to Bowden, you generally get:',
          options: [
            'Lower moving mass and faster travel',
            'Better flow control, useful for flexible filaments',
            'No need for retraction',
            'A larger build volume',
          ],
          answer: 1,
          explanation:
            'Direct drive places the motor right at the hotend, giving tighter control of starts and stops at the cost of extra moving weight.',
        },
      ],
    },
  ],
}
