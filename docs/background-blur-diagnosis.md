# Diagnostic record — unwanted background blur

Measured on the live app with Puppeteer at 1440×900, both themes, by
(a) enumerating every computed `backdrop-filter` / `filter` / painted pseudo-element,
(b) capturing the page with `#main-content` hidden to isolate the background layers,
(c) pixel-diffing real vs. content-hidden captures, and
(d) scanning for full-width / full-height straight luminance boundaries.

## Result: there is no rogue full-section overlay

* Background-only capture (`#main-content` hidden) is **perfectly smooth** — no
  rectangular boundary anywhere, in either theme.
* Real-vs-background-only pixel diff is **≈ 0** outside content bounds
  (max cell |ΔL| ≈ 0.3/255).
* Full-width horizontal boundaries found: only the Navbar (hero, y≈24–102)
  and project-card top edges (projects, y≈297–300).
* Full-height vertical boundaries found: only the ChapterReadout rail
  (x≈23/25) and real component edges.

`AmbientMesh` is already the single continuous background: one
`fixed inset-0` fullscreen clip-space quad, opaque, no scene graph.

## The actual offender: doubled backdrop-filter on the Contact section sheet

`Contact.jsx` — the large section sheet (768 × 886 @1440):

```jsx
<div className="glass3d bg-white/70 … backdrop-blur-xl … rounded-3xl …">
```

This stacks **two** backdrop filters on one surface:

1. the element's own `backdrop-blur-xl` → `blur(24px)`
2. `.glass3d::before` → `backdrop-filter: blur(8px) brightness(0.97) saturate(1.6)`

and then adds a third and fourth `backdrop-blur-sm` layer on every one of
the 6 contact tiles and 3 form inputs nested inside it.

That is the largest blurred rectangle on the page and it is what reads as a
hazy sheet sitting on top of the ambient field.

**Fix (section-local, Glass3D left untouched globally):** drop the redundant
`backdrop-blur-*` layers on the Contact sheet and its children so the
surface is painted, not blurred. The Navbar pill, `SectionHeader` pill and
`BentoCard` keep their existing treatment — they are small, deliberate
chrome, not section-sized sheets.