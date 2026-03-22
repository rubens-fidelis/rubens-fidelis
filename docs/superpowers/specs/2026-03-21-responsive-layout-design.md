# Responsive Layout Design

**Date:** 2026-03-21
**Project:** rubens-fidelis portfolio site
**Scope:** Mobile-first responsive redesign with hamburger nav

---

## Breakpoints

Mobile-first using `min-width` queries. Replaces the existing `max-width: 900px` and `max-width: 600px` rules entirely. Note: the 768–900px range changes behavior (viewports in that range previously got desktop styles; they now get tablet styles — this is intentional).

| Tier    | Query              | Target devices              |
|---------|--------------------|-----------------------------|
| Mobile  | base (0–767px)     | Phones (360–430px viewport) |
| Tablet  | `min-width: 768px` | iPad portrait, large phones |
| Desktop | `min-width: 1024px`| iPad landscape, laptops+    |

---

## Navigation

### Mobile / Tablet (< 1024px)
- Nav links and lang-toggle are hidden (`display: none`)
- A hamburger button (`☰`) appears in the nav-right area:
  - `aria-label="Open menu"`, `aria-expanded="false"` (toggled by JS)
  - Uses `font-family: var(--font-mono)`, matches nav aesthetic
- Clicking opens a **fullscreen overlay**:
  - The overlay element lives in the HTML as a direct sibling of `<nav>`, NOT inside the nav
  - Background: `var(--bg-deep)` at 97% opacity, `backdrop-filter: blur(8px)`
  - Z-index: 200 (above nav at z-index 100)
  - Links stacked vertically, centered horizontally and vertically using flexbox
  - Lang-toggle displayed below the links
  - Close button (`✕`) is inside the overlay element, positioned absolute top-right (not in nav)
  - Overlay fades in (`opacity 0 → 1`, 300ms ease)
  - Links slide up with staggered delay (80ms per item, matching existing animation style)
  - Respects `prefers-reduced-motion: reduce` — skip all transitions/animations when set
- Clicking a nav link, close button, or pressing Escape closes the overlay
- On viewport resize to ≥ 1024px (detected via `matchMedia`), auto-close the overlay and restore scroll
- Accessibility:
  - `aria-hidden="true"` on overlay by default; toggled to `aria-hidden="false"` when opened
  - `aria-expanded` on the hamburger reflects open/closed state
  - Tab focus is trapped inside the overlay while open (cycle through focusable elements)
  - Focus returns to the hamburger button on close
- Body scroll lock while overlay is open:
  - Use `position: fixed; width: 100%; top: -<scrollY>px` on body (NOT just `overflow: hidden` — that fails on iOS Safari)
  - On close, restore `position`, remove `top`, and set `window.scrollTo(0, savedScrollY)`
  - Note: no existing CSS sets `top` or `position` on `body`, so no conflict

### Desktop (1024px+)
- Hamburger button hidden (`display: none`)
- Nav links and lang-toggle visible — current layout unchanged

### HTML structure for overlay
Use a `<div>` with a `<ul>` (not a second `<nav>`) to avoid duplicate navigation landmarks:
```html
<!-- hamburger, inside nav > .nav-right -->
<button class="nav-hamburger" aria-label="Open menu" aria-expanded="false">&#9776;</button>

<!-- overlay, sibling of <nav> -->
<div class="nav-overlay" aria-hidden="true">
  <button class="nav-overlay-close" aria-label="Close menu">&#10005;</button>
  <ul class="nav-overlay-links">
    <li><a href="#services"><span data-lang-en>Services</span><span data-lang-pt>Serviços</span></a></li>
    <li><a href="#about"><span data-lang-en>About</span><span data-lang-pt>Sobre</span></a></li>
    <li><a href="#skills"><span data-lang-en>Skills</span><span data-lang-pt>Habilidades</span></a></li>
    <li><a href="#experience"><span data-lang-en>Experience</span><span data-lang-pt>Experiência</span></a></li>
    <li><a href="#contact"><span data-lang-en>Contact</span><span data-lang-pt>Contato</span></a></li>
  </ul>
  <div class="lang-toggle overlay-lang-toggle">
    <button class="lang-btn" data-lang="en">EN</button>
    <button class="lang-btn" data-lang="pt-BR">PT</button>
  </div>
</div>
```

The overlay lang-toggle uses the same `.lang-btn` and `data-lang` attributes as the main toggle. The existing `setLang()` function already targets all `.lang-btn` elements via `querySelectorAll('.lang-btn')`, so active state sync requires no extra code — the duplicate buttons are automatically updated on language switch. The main nav lang-toggle buttons get `tabindex="-1"` when the overlay is open; restored on close.

---

## Layout Sections

All changes are additive over base mobile styles using `min-width` queries. `:last-child` overrides on `.timeline-item` and `.timeline-group` (padding-bottom: 0) remain in base CSS, untouched.

### Global
| Property | Mobile (base) | Tablet 768px+ | Desktop 1024px+ |
|---|---|---|---|
| `section` padding | `0 16px` | `0 32px` | `0 40px` |
| `nav` padding | `0 16px` | `0 32px` | `0 40px` |
| `nav` height | `52px` | `60px` | `60px` |
| `.nav-links` gap | — (hidden) | — (hidden) | `32px` |
| `.nav-links a` font-size | — (hidden) | — (hidden) | `11px` |
| Coord markers | `display: none` | `display: none` | visible (default) |

Note: `.nav-links` is `display: none` on mobile/tablet — gap and font-size rules only apply at desktop (1024px+).

### Sections padding-top/bottom
| Section | Mobile (base) | Tablet 768px+ | Desktop 1024px+ |
|---|---|---|---|
| `.about`, `.skills`, `.experience`, `.contact`, `.services` | `80px` | `100px` | `120px` |
| `.section-header` margin-bottom | `40px` | `52px` | `64px` |

### Hero
| Property | Mobile (base) | Tablet 768px+ | Desktop 1024px+ |
|---|---|---|---|
| `padding-top` | `52px` | `60px` | inherited from tablet tier (no new rule) |
| `.hero-cta` flex-direction | `column` | `row` | inherited from tablet tier |
| `.hero-cta a` text-align | `center` | default | default |
| `.hero-meta` gap | `20px` | `32px` | `40px` |

### About
| Property | Mobile (base) | Tablet 768px+ | Desktop 1024px+ |
|---|---|---|---|
| `.about-content` grid | `1 column` | `1 column` | `2fr 1fr` |
| `.about-content` gap | `40px` | `48px` | `80px` |
| `.about-stats` grid | `1fr 1fr` | `1fr 1fr` | `1fr` |
| `.about-stats` gap | `16px` | `20px` | `32px` |
| `.stat-card` padding | `20px` | `24px` | `28px` |
| `.stat-number` font-size | `32px` | `36px` | `42px` |

### Skills
| Property | Mobile (base) | Tablet 768px+ | Desktop 1024px+ |
|---|---|---|---|
| `.skills-grid` columns | `1fr` | `repeat(2, 1fr)` | `auto-fill minmax(280px, 1fr)` |

### Services
| Property | Mobile (base) | Tablet 768px+ | Desktop 1024px+ |
|---|---|---|---|
| `.services-grid` columns | `1fr` | `repeat(2, 1fr)` | `auto-fill minmax(320px, 1fr)` |

### Experience Timeline

The `.timeline-role-item::before` pseudo-element (small square dot inside `.timeline-group-roles`) is defined in existing base CSS and remains unchanged except for the `left` offset values below.

Dot alignment formula: `dot-left = line-left − padding-left − dot-width/2`

| Property | Mobile (base) | Tablet 768px+ | Desktop 1024px+ |
|---|---|---|---|
| `.timeline` padding-left | `28px` | `48px` | `80px` |
| `.timeline::before` left | `6px` | `16px` | `30px` |
| `.timeline-dot` left | `-27px` | `-37px` | `-56px` |
| `.timeline-dot` size | `9×9px` | `10×10px` | `11×11px` |
| `.timeline-item` padding-bottom | `40px` | `52px` | `64px` |
| `.timeline-group` padding-bottom | `40px` | `52px` | `64px` |
| `.timeline-group-roles` padding-left | `16px` | `24px` | `28px` |
| `.timeline-group-roles` margin-left | `4px` (unchanged at all tiers) | | |
| `.timeline-role-item::before` left | `-20px` | `-28px` | `-32px` |

Mobile timeline `padding-left` is `28px` (deliberate reduction from old `32px` — tighter on phones is intentional).

### Contact
| Property | Mobile (base) | Tablet 768px+ | Desktop 1024px+ |
|---|---|---|---|
| `.contact-content` grid | `1 column` | `1 column` | `1fr 1fr` |
| `.contact-content` gap | `40px` | `48px` | `80px` |

### Footer
No responsive changes needed. Existing `padding: 40px` and centered text work at all viewport sizes.

---

## JavaScript Changes (`js/main.js`)

Add hamburger menu logic:
- Open/close overlay on hamburger click
- Toggle `aria-expanded` (`"true"` / `"false"`) on hamburger button
- Toggle `aria-hidden` (`"false"` / `"true"`) on overlay element
- Close on: nav link click, close button click, Escape keydown
- Body scroll lock on open: save `scrollY = window.scrollY`, then set properties individually:
  `body.style.position='fixed'; body.style.width='100%'; body.style.top='-'+scrollY+'px'`
  (Do NOT use `cssText` assignment — it replaces all inline styles and may conflict with other JS)
- Body scroll unlock on close: `body.style.position=''; body.style.width=''; body.style.top=''; window.scrollTo(0, savedScrollY)`
- Focus trap: query focusable elements as `overlay.querySelectorAll('a[href], button:not([disabled])')`;
  on Tab cycle forward, on Shift+Tab cycle backward through that list
- Return focus to hamburger button on close
- Skip overlay animation when `window.matchMedia('(prefers-reduced-motion: reduce)').matches`
- Auto-close overlay on viewport resize: `matchMedia('(min-width: 1024px)').addEventListener('change', e => { if (e.matches) closeOverlay(); })`
  (only close when `e.matches === true`, i.e. viewport grows to desktop width — not on shrink)

---

## CSS Implementation Notes

**This is a mobile-first rewrite, not purely additive.** The existing `css/style.css` has desktop values as base declarations (no media query). These base declarations must be changed to mobile values, then scaled up with `min-width` queries. Specifically, the following base rules must be updated to their mobile values:

| Selector | Property | Old base value | New mobile base value |
|---|---|---|---|
| `section` | `padding` | `0 40px` | `0 16px` |
| `nav` | `padding` | `0 40px` | `0 16px` |
| `nav` | `height` | `60px` | `52px` |
| `.about-content` | `grid-template-columns` | `2fr 1fr` | `1fr` |
| `.about-content` | `gap` | `80px` | `40px` |
| `.about-stats` | `gap` | `32px` | `16px` |
| `.stat-card` | `padding` | `28px` | `20px` |
| `.stat-number` | `font-size` | `42px` | `32px` |
| `.contact-content` | `grid-template-columns` | `1fr 1fr` | `1fr` |
| `.contact-content` | `gap` | `80px` | `40px` |
| `.services-grid` | `grid-template-columns` | `auto-fill minmax(320px, 1fr)` | `1fr` |
| `.skills-grid` | `grid-template-columns` | `auto-fill minmax(280px, 1fr)` | `1fr` |
| `.timeline` | `padding-left` | `80px` | `28px` |
| `.timeline::before` | `left` | `30px` | `6px` |
| `.timeline-dot` | `left` | `-54px` | `-27px` |
| `.timeline-dot` | `width/height` | `11px` | `9px` |
| `.timeline-item` | `padding-bottom` | `64px` | `40px` |
| `.timeline-group` | `padding-bottom` | `64px` | `40px` |
| `.timeline-group-roles` | `padding-left` | `28px` | `16px` |
| `.timeline-role-item::before` | `left` | `-32px` | `-20px` |
| `.section-header` | `margin-bottom` | `64px` | `40px` |
| `.about,.skills,.experience,.contact,.services` | `padding-top/bottom` | `120px` | `80px` |
| `.hero` | `padding-top` | `60px` | `52px` |
| `.hero-cta` | `flex-direction` | `row` | `column` |
| `.hero-cta a` | `text-align` | (unset) | `center` |
| `.hero-meta` | `gap` | `40px` | `20px` |
| `.coord-marker` | `display` | (default) | `none` |

The existing `max-width: 900px` and `max-width: 600px` blocks are deleted entirely and replaced with the new `min-width: 768px` and `min-width: 1024px` blocks.

**Intentional visual changes in the 768–900px range** (previously desktop-styled, now tablet-styled):
- Hero meta gap: was `40px`, now `32px` at 768px+ (slightly tighter — intentional)
- Nav: hamburger shown instead of links (previously full links showed at 900px+)
- Section padding: `0 32px` instead of `0 40px`

---

## Files Changed

| File | Change |
|---|---|
| `css/style.css` | Update base declarations to mobile values; delete `max-width` queries; add `min-width: 768px` and `min-width: 1024px` tiers; add `.nav-hamburger` and `.nav-overlay` styles |
| `js/main.js` | Add hamburger toggle, focus trap, scroll lock, keyboard and resize handling |
| `index.html` | Add `.nav-hamburger` button inside nav and `.nav-overlay` div as sibling of nav |
