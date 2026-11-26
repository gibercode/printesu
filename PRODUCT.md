# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Makers: people who own a 3D printer and print for themselves or others, and need to calculate a quote (presupuesto) for a print job. The job: turn a print's material, quality and manual inputs into a price they can trust and hand to a customer.

## Product Purpose
A web calculator for 3D print quotes (project name: printesu). Success is a maker getting a defensible price quickly, then taking it away as a result they can use: shown on screen, downloaded as a PDF, or sent as a request.

## Positioning
Built by and for makers, not a print-service marketplace. Prices come from the maker's own inputs (material, quality, manual figures), not from a vendor's catalog. Open decision: whether this stays maker-first or grows into a customer-facing quote request flow.

## Operating Context
Inputs are manual for now: the maker enters the figures (grams, print time) rather than uploading a model. Price depends only on the printer and the material: material grams x price per kg, plus machine time x (printer cost / life hours + maintenance per hour), then failure % and margin %. The user explicitly excluded services such as electricity, labor and setup. Machine cost per hour is automatic: printer price / life hours plus maintenance (blank = 5% repair allowance), prefilled with typical hobby values (printer $600, life 3000 h, from published guides) and editable via presets (economy, mid, high) or custom values. A part can still carry its own cost per hour, which wins. Failure % and margin % are optional and default to 0. The workshop settings are saved in the browser (localStorage, through a Zustand store with persist); the pieces and the client data are not saved. Layer height, infill and multicolor describe the part and drive its drawing; they do not change the price.

## Capabilities and Constraints
- Confirmed, v1: manual data entry; material and quality selection.
- Confirmed outputs, all three wanted: show the price on screen; downloadable PDF quote with breakdown; send a quote request through WhatsApp only (the user removed the email option; a wa.me link with the summary, no backend).
- Future, not v1: integrations with third parties such as MakerWorld or Anycubic, only where they offer open APIs, to pre-fill the calculation. Whether such APIs exist and are usable is unverified.
- Excluded by the user: electricity, labor, post-processing, setup and other services. Currency decided: costs are entered and computed in US dollars; the main figure shown is the bolívar amount at the official BCV rate, with the dollar value as "Ref. $" underneath (open ve.dolarapi.com, no key). Undecided: shipping, UI language (user writes in Spanish; assume Spanish until confirmed), pricing formula and defaults.
- Existing stack: Vite, React 19, TypeScript, pnpm, Oxlint. No backend yet; sending requests will need one or a third-party service.

## Brand Commitments
None confirmed. Name "printesu" is the project name as it stands.

## Evidence on Hand
None. No real pricing data, material price lists, sample quotes or brand assets exist in the project. Do not fabricate prices, material costs, customers or testimonials.

## Product Principles
1. The maker's own numbers drive the price; show the breakdown, never a black-box total.
2. Only printer and material drive the price; no services.
3. Manual entry first; integrations are an optional accelerator later, never a dependency.
4. A result must leave the page usable: on screen, as a PDF, or as a sent request.
5. Do not claim accuracy the inputs cannot support; label the quote as an estimate where relevant.

## Accessibility & Inclusion
No product-specific requirement established.

## Responsive
The user stated responsive is important: mobile-first, no horizontal page scroll from 320px, touch targets of 44px or more.
