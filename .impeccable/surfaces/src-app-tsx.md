---
version: 1
slug: "src-app-tsx"
primary_target: "src/App.tsx"
related_targets: []
---

# Calculadora de presupuesto (src/App.tsx)

Mode: Operate. Visitor: a maker pricing a print job (1 to ~20 parts), manual inputs, settings not persisted, code-led build (no image generation). Responsive is a hard requirement: mobile-first, no horizontal page scroll from 320px, touch targets of 44px or more.

Cost model is simplified by the user: only printer and material (material, machine hour from printer cost / life + maintenance), plus failure % and margin %. No electricity, labor, setup.

Replacement world: the Crouwel grid direction was rejected by the user; they asked for something more tied to 3D printing.

## Direction contract

THESIS: The quote is an assembly manual for a printer kit: each part is a numbered step with its line drawing, a x-quantity and its price at the margin, and the last page is the total. Refuses the category default of a form plus a rounded summary card.

OWN-WORLD: White page, flat grey step panels with no decorative borders, ink #1a1a1a, one orange #ff5a1f used for step number squares, the total plane and primary actions. One self-hosted grotesk (Hanken Grotesk), tabular numerals. Line drawings are isometric printed blocks whose layer lines, infill hatch, colour and copies are driven by the part's real inputs.

STORY: The maker works down the steps, sees each part drawn from its own settings, watches the effect of each edit on the total, and ends on the total page with PDF and send actions.

FIRST VIEWPORT: Narrow: manual title and tools, a price-weighted tab rail, step 1 panel (orange numeral, drawing, name, fields, price at the margin). Wide: steps in the left column; right column sticky with the orange total, live delta of the last change, then the bill of materials.

FORM: Assembly manual, assigned by the roll after the user pinned 3D printing; seed key bc0a492a; raises from the variable specimen (live delta), Metro (flat colour fields, no chrome) and the acetate manual (tab rail whose size follows price).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
