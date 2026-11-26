---
name: printesu
description: A 3D print quote written as an assembly manual, one numbered step per part, ending on an orange total page.
colors:
  paper: "#ffffff"
  panel: "#eef0f2"
  line: "#c9ced4"
  field-line: "#7d848c"
  ink: "#1a1a1a"
  ink-soft: "#4b5058"
  accent-orange: "#ff5a1f"
  error: "#b42318"
typography:
  display:
    fontFamily: "Hanken Grotesk Variable, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "48px"
    fontWeight: 800
    lineHeight: "56px"
    letterSpacing: "-0.03em"
    fontFeature: "'tnum' 1"
  headline:
    fontFamily: "Hanken Grotesk Variable, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "32px"
    fontWeight: 800
    lineHeight: "40px"
    letterSpacing: "-0.03em"
  display-sm:
    fontFamily: "Hanken Grotesk Variable, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "40px"
    fontWeight: 800
    lineHeight: "48px"
    letterSpacing: "-0.03em"
    fontFeature: "'tnum' 1"
  title:
    fontFamily: "Hanken Grotesk Variable, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "24px"
    fontWeight: 800
    lineHeight: "32px"
    letterSpacing: "-0.02em"
  subtitle:
    fontFamily: "Hanken Grotesk Variable, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "20px"
    fontWeight: 800
    lineHeight: "28px"
    letterSpacing: "normal"
  body:
    fontFamily: "Hanken Grotesk Variable, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "24px"
    letterSpacing: "normal"
  wordmark:
    fontFamily: "Pacifico, Segoe Script, cursive"
    fontSize: "36px"
    fontWeight: 400
    lineHeight: "52px"
    letterSpacing: "0"
  small:
    fontFamily: "Hanken Grotesk Variable, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "20px"
    letterSpacing: "normal"
  label:
    fontFamily: "Hanken Grotesk Variable, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: "16px"
    letterSpacing: "normal"
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-default:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0 20px"
    height: "48px"
  button-default-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.sm}"
    padding: "0 20px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.accent-orange}"
    textColor: "{colors.ink}"
  step-panel:
    backgroundColor: "{colors.panel}"
    rounded: "{rounded.md}"
    padding: "16px"
  step-number:
    backgroundColor: "{colors.accent-orange}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    size: "48px"
  total-plane:
    backgroundColor: "{colors.accent-orange}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "20px"
  field-cell:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    height: "48px"
  tab:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    width: "72px"
  minibar:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    height: "56px"
---

# Design System: printesu

## Overview

**Creative North Star: "The Assembly Manual"**

Prices are computed in US dollars and shown as "Ref. $"; the large figure everywhere is the bolívar amount converted at the official BCV rate that the page fetches on load (dollars lead only while the rate is unavailable) (the rate, without a date, is shown in the total card with Actualizar and Reintentar actions). The quote is read like the instruction booklet of a printer kit. Each part is a numbered step: an orange numeral square, an isometric line drawing of the part, its name and fields, and its price at the margin. The last page is the total. The page is white, step panels are flat grey, and the only colour is one orange, spent on step numerals, the logo tile, the primary action and a few signals. It refuses the category default of a form with a rounded summary card.

The drawings are not decoration. Each is an isometric printed block whose layer lines follow layer height, whose top hatch follows infill, whose right face turns orange when the part is multicolor, and whose stacked copies follow quantity (up to three). They are inline SVG drawn in the same ink line as the type. No raster images exist in the build.

The interface is Spanish, mobile-first, and dense in the way a manual is dense: small calm facts, big numerals. It is built to stay readable from 320px to 1440px with no horizontal page scroll and 48px touch targets.

**Key Characteristics:**
- White page, flat grey panels, no decorative borders, almost no shadow.
- One orange (#ff5a1f) used only for numerals, the total and live signals; ink for everything that must be read.
- One grotesk, heavy weight (800) for numbers and headings, tabular numerals everywhere.
- Drawings carry data (layers, infill, colour, quantity, print time); tabs are uniform.
- Left column of steps, right column sticky total on wide screens; fixed ink minibar on narrow ones.

## Colors

A manual's palette: white paper, cool grey panels, near-black ink, and a single signal orange.

### Primary
- **Signal Orange** (#ff5a1f): step number squares, the logo tile, the primary button, the dollar reference inside the total card, the colour face of a multicolor drawing, the primary-button hover, the warning marker square, the confirm state of "Vaciar todo", and text selection. Ink sits on it, never white.

### Neutral
- **Paper White** (#ffffff): page, input cells, secondary button faces, drawing faces.
- **Panel Grey** (#eef0f2): step panels, settings and send panels, rail tabs, hint callouts, disabled buttons.
- **Rule Grey** (#c9ced4): hairlines in the bill of materials, hovered tab body.
- **Field Line Grey** (#7d848c): input cell stroke, chosen to hold contrast against white.
- **Ink** (#1a1a1a): text, focus ring, primary button, drawing lines, the heavy rule above the bill of materials, the minibar.
- **Soft Ink** (#4b5058): labels, units, hints, secondary figures.

### Semantic
- **Error Red** (#b42318): invalid field stroke and its message, always paired with text.

### Icons and customer sheet
Icons come from Lucide, drawn at one 2px stroke: 24px beside section headings, 20px in buttons and summaries, 18px in compact buttons and notes, 16px inline. They always sit beside a text label and are hidden from assistive tech. The PDF is a separate customer-facing sheet: the logo tile, a 4px orange rule under the header, ink numbered squares and quantity chips, Bs prices with the dollar reference beneath, and an ink total block under a 4px orange rule with the dollar reference in orange. The sheet uses no grey fills, and orange stays a small accent. It carries no internal costs and no explanatory notes.

### Responsive behaviour
Piece cards are CSS containers and adapt to their own width, not the screen's: under 480px two field columns with the drawing inline; from 480px three; from 640px the drawing moves to a sticky side column; from 880px four columns. The piece tabs are equal-sized (56px tall, 76px minimum), scroll horizontally with snap on narrow screens, wrap from 960px, and the tab of the piece in view is filled ink.

### Mobile viewport
The page uses dynamic viewport units (`100dvh`) and `viewport-fit=cover`; top and bottom safe areas are added to the masthead, the page's bottom padding and the fixed total bar. The bar has a fixed 56px height plus the bottom inset, sits on its own layer, and hides while a field has focus so the on-screen keyboard keeps the room.

### Named Rules
**The One Orange Rule.** Orange marks position (step number), result (total) and attention (warning, confirm). It never decorates headings, borders or backgrounds of ordinary panels.
**The Ink-On-Orange Rule.** Text on orange is ink (#1a1a1a). White on orange is not used.

## Typography

**Display, Body and Label Font:** Hanken Grotesk Variable (self-hosted via @fontsource-variable), with Helvetica Neue, Helvetica, Arial, sans-serif.

**Character:** One grotesk at two voices: 800 weight with tight tracking for headings and figures, 400 to 700 for reading. Tabular numerals are on globally (`font-feature-settings: 'tnum' 1`) so prices stay aligned as they change.

### Hierarchy
- **Display** (800, 40px / 48px, 48px / 56px from 960px, -0.03em): the total figure only, shown in bolívares with the dollar reference ("Ref. $") beneath it at the Subtitle size.
- **Wordmark** (Pacifico script, 400, 36px / 52px): the "printesu" logotype beside its orange tile mark; nothing else uses the script.
- **Title** (800, 24px / 32px, -0.02em): section headings "Piezas" and "Ajustes". Step numerals share 24px / 800.
- **Subtitle** (800, 20px / 28px): panel summaries, step price in Bs with "Ref. $" under it, dollar reference under the total, quantity at 24px (Title). Bill-of-materials subheads and the total row use Body at 800.
- **Body** (400, 16px / 24px): buttons, toggles and teaching text, max line length 65ch. **Small** (14px / 20px): dense panel text, captions, the rate note.
- **Label** (400, 13px / 16px, Soft Ink): field labels, units, hints, errors, rail tab prices (600) and the bolívar line under each step price.

### Named Rules
**The Weight Is The Hierarchy Rule.** Rank is made with weight 800 against 400 and with size, never with a second typeface or colour.
**The Tabular Rule.** Every figure that changes with input uses tabular numerals.

## Layout

Mobile-first single column inside a `.sheet` container (max 1200px, 16px side padding, body min-width 320px). From 960px the layout becomes two columns, 7fr steps and 5fr result, with a 32px gap; the result column pins with `position: sticky; top: 16px`. Below 960px a fixed 56px ink minibar shows the running total and jumps to the summary, and the page gets 88px bottom padding to clear it.

Inside a step, the head is a grid (numeral, price; name beneath) that becomes one row at 560px. From 720px the body splits into a 168px drawing column (sticky) and the fields; below it the drawing sits inline at 112px beside its caption. Field grids use two columns, going to four by container query at 760px, and three in settings from 720px.

Spacing rhythm is 4 / 8 / 12 / 16 / 24 / 32px; panels pad 16px, the total card 20px, vertical gap between steps 16px. Every interactive target is at least 48px tall (minibar 56px, summaries 56px). Print output hides tools, rail, outputs, send and minibar and leaves the quote with a plain print header.

## Elevation & Depth

Flat. Depth is made by tonal layering (white page, grey panels, white fields set into grey) and by a 3px ink rule above the bill of materials. The only shadow in the build is a 1px inset ring on invalid cells, which thickens the error stroke rather than lifting anything.

### Named Rules
**The Flat Plane Rule.** Surfaces are colour fields, not objects. No drop shadows, no blur, no gradients.

## Shapes

Small, quiet radii: 6px on buttons, numeral squares, fields and tab tops; 8px on panels and the total card (ink, white text); 12px on the logo tile. The step numeral is a square, not a circle. Fields (inputs, selects with their unit or chevron) share one hover and focus state on the whole cell: the border thickens to ink, never a separate inner line. Panels have no borders; borders appear only on fields (1px Field Line Grey), secondary buttons (1px ink), the dashed 2px "add part" button and hairlines in tables. Drawings use 1.5px ink outlines with round joins and 1px lines at 55% opacity for layers and hatch.

## Components

### Buttons
- **Shape:** 6px radius, 48px minimum height, 20px horizontal padding, 15px / 700 text.
- **Default:** paper face, 1px ink border; hover inverts to ink face and paper text (150ms, expo-out ease).
- **Primary:** full width, ink face; hover turns orange with ink text. Disabled becomes panel grey with Rule Grey border.
- **Ghost:** transparent face for tools. Confirm state fills orange ("Confirmar: vaciar todo").
- **Add part:** full width, 2px dashed ink border.
- **Active:** 1px downward nudge.

### Step panel
Flat Panel Grey, 8px radius, 16px padding. Head: 48px orange numeral square, part name, price at the margin (22px / 800) with a 12 to 14px sub line. Body: drawing figure with a 28px / 800 quantity and caption, then the field grid, then a foot row with the part total and remove action.

### Step rail
A row of tabs, one per part, bottom aligned. Tab height is 44px plus up to 56px following the part's share of the total price; each shows the number and price, has a 4px orange cap, a Panel Grey body and a Rule Grey hover. Scrolls horizontally inside itself if crowded.

### Fields
White cell, 1px Field Line Grey, 6px radius, 48px high; label above at 13px Soft Ink; units inside at the right edge. Focus draws a 3px ink outline offset 1px on the cell. Invalid: red stroke plus inset ring plus bold red message. Select uses a custom inline-SVG chevron. Toggles use a 24px native checkbox with `accent-color` orange.

### Total card
Orange 8px block, 20px padding: 16px / 800 label, display figure, 14px / 600 note carrying the live delta of the last edit ("último cambio +X"). Below it the primary PDF button, then the bill of materials: a 3px ink top rule, 14px tables with Rule Grey row lines, a 1px ink rule above subtotals, and an 18px / 800 total row.

### Disclosure panels (Ajustes, Enviar)
Panel Grey, 8px radius, 56px summary at 18px / 800 with a "+" or "−" glyph on the right, native details behaviour. Sending is WhatsApp only.

### Part drawing
Inline SVG isometric block (viewBox 150x110), driven by the part's inputs: layer-line count by layer height, hatch density by infill, block height by print hours, orange right face if multicolor, up to two ghosted copies behind for quantity. Decorative, hidden from assistive tech.

### Notes
Teaching note: Panel Grey, 8px radius, 15px, max 65ch. Example-data note: ink background, paper text.

## Do's and Don'ts

### Do:
- **Do** let drawings, tab heights and the total reflect the real inputs; any new visual must carry data.
- **Do** keep ink text on orange and orange to numerals, the total, and signals.
- **Do** keep 48px minimum targets and verify no horizontal overflow from 320px to 1440px.
- **Do** use tabular numerals and weight 800 for figures.
- **Do** keep copy in Spanish and keep focus as a 3px ink outline with 2px offset.
- **Do** draw any new illustration as inline SVG in the 1.5px ink line language.

### Don't:
- **Don't** wrap steps or the total in bordered, shadowed or heavily rounded cards; panels are flat colour fields.
- **Don't** add a second accent colour or use orange for ordinary borders and backgrounds.
- **Don't** convey state by colour alone; the error red always comes with text.
- **Don't** use raster images or icon fonts; the build has none.
- **Don't** add a second typeface.
