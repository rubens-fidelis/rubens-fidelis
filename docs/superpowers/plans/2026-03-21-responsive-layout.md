# Responsive Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing desktop-first `max-width` media queries with a proper mobile-first three-tier system (mobile base / 768px tablet / 1024px desktop) and add a fullscreen hamburger menu for mobile/tablet navigation.

**Architecture:** Base CSS declarations are changed to mobile values; `min-width: 768px` and `min-width: 1024px` media query blocks scale layouts up. The hamburger overlay is a sibling `<div>` to `<nav>`, controlled by vanilla JS. Tasks are ordered so each commit leaves the site working at desktop width — mobile correctness is restored in Task 2.

**Tech Stack:** Pure HTML5, CSS3 (custom properties, grid, flexbox, media queries), vanilla JS (no framework)

**Spec:** `docs/superpowers/specs/2026-03-21-responsive-layout-design.md`

---

## File Map

| File | Change |
|---|---|
| `css/style.css` | Update base declarations to mobile values; delete old `max-width` blocks; add `min-width: 768px` and `min-width: 1024px` blocks; add hamburger/overlay CSS and `--overlay-bg` variable |
| `js/main.js` | Append hamburger toggle, focus trap, scroll lock, keyboard and resize handling |
| `index.html` | Add `.nav-hamburger` button inside nav; add `.nav-overlay` div after `</nav>` |

---

## Task 1: Add desktop media query block (safe baseline)

Add a `@media (min-width: 1024px)` block that encodes all current desktop values. Visually a no-op — it just moves desktop values into a query so the base can safely be changed in Task 2.

**Files:**
- Modify: `css/style.css` — append after the existing `@media (max-width: 600px)` block

- [ ] **Step 1: Append the desktop media query**

In `css/style.css`, find the end of the existing `/* ——— Responsive ——— */` section (after the closing `}` of `@media (max-width: 600px)`). Append:

```css
/* ——— Desktop 1024px+ ——— */
@media (min-width: 1024px) {
    section { padding: 0 40px; }
    nav { padding: 0 40px; height: 60px; }
    .nav-links { display: flex; gap: 32px; }
    .nav-links a { font-size: 11px; }
    .nav-right .lang-toggle { display: flex; }
    .nav-hamburger { display: none; }
    .hero { padding-top: 60px; }
    .hero-cta { flex-direction: row; }
    .hero-cta a { text-align: left; }
    .hero-meta { gap: 40px; }
    .about, .skills, .experience, .contact, .services { padding-top: 120px; padding-bottom: 120px; }
    .section-header { margin-bottom: 64px; }
    .about-content { grid-template-columns: 2fr 1fr; gap: 80px; }
    .about-stats { grid-template-columns: 1fr; gap: 32px; }
    .stat-card { padding: 28px; }
    .stat-number { font-size: 42px; }
    .contact-content { grid-template-columns: 1fr 1fr; gap: 80px; }
    .services-grid { grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); }
    .skills-grid { grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }
    .timeline { padding-left: 80px; }
    .timeline::before { left: 30px; }
    .timeline-dot { left: -56px; width: 11px; height: 11px; }
    .timeline-item { padding-bottom: 64px; }
    .timeline-group { padding-bottom: 64px; }
    .timeline-group-roles { padding-left: 28px; }
    .timeline-role-item::before { left: -32px; }
    .coord-marker { display: block; }
}
```

Note: `.timeline-dot { left: -56px }` corrects the existing `-54px` by 2px to properly center the dot on the line (formula: `30 − 80 − 5.5 = −55.5 → −56px`).

- [ ] **Step 2: Verify desktop unchanged**

Open `index.html` in a browser at ≥ 1024px width. Everything should look identical to before.

- [ ] **Step 3: Commit**

```bash
git add css/style.css
git commit -m "feat(responsive): add desktop 1024px+ media query block"
```

---

## Task 2: Update base declarations to mobile values + delete old queries

Change all base CSS declarations to mobile values and delete the old `max-width` blocks. After this commit, mobile and desktop are both correct; tablet gets mobile styles until Task 3.

**Files:**
- Modify: `css/style.css` — update ~25 scattered declarations, delete old responsive blocks

- [ ] **Step 1: Update `section` base padding**

Find: `section { padding: 0 40px; }`
Change `padding` to `0 16px`.

- [ ] **Step 2: Update `nav` base padding and height**

In the `nav { ... }` rule, change:
- `padding: 0 40px` → `padding: 0 16px`
- `height: 60px` → `height: 52px`

- [ ] **Step 3: Hide nav-links at base (mobile)**

In `.nav-links { display: flex; ... }`, change `display: flex` to `display: none`.

- [ ] **Step 4: Hide main nav lang-toggle at base (mobile)**

After the `.nav-right { ... }` rule, add:
```css
.nav-right .lang-toggle { display: none; }
```

- [ ] **Step 5: Update hero padding-top**

In `.hero { ... padding-top: 60px; ... }`, change `padding-top` to `52px`.

- [ ] **Step 6: Update hero-cta to column on mobile**

In `.hero-cta { ... }`, add `flex-direction: column;`.

After the `.hero-cta { ... }` rule, add:
```css
.hero-cta a { text-align: center; }
```

- [ ] **Step 7: Update hero-meta gap**

In `.hero-meta { ... gap: 40px; ... }`, change `gap` to `20px`.

- [ ] **Step 8: Update section padding-top/bottom**

For each of `.services`, `.about`, `.skills`, `.experience`, `.contact`, change `padding-top: 120px` → `80px` and `padding-bottom: 120px` → `80px`.

- [ ] **Step 9: Update section-header margin-bottom**

In `.section-header { ... margin-bottom: 64px; }`, change to `40px`.

- [ ] **Step 10: Update about-content grid**

In `.about-content { ... grid-template-columns: 2fr 1fr; gap: 80px; ... }`, change to:
`grid-template-columns: 1fr; gap: 40px;`

- [ ] **Step 11: Update about-stats grid**

In `.about-stats { display: grid; grid-template-columns: 1fr; gap: 32px; }`, change to:
`grid-template-columns: 1fr 1fr; gap: 16px;`

- [ ] **Step 12: Update stat-card padding**

In `.stat-card { padding: 28px; ... }`, change `padding` to `20px`.

- [ ] **Step 13: Update stat-number font-size**

In `.stat-number { ... font-size: 42px; ... }`, change to `32px`.

- [ ] **Step 14: Update contact-content grid**

In `.contact-content { ... grid-template-columns: 1fr 1fr; gap: 80px; ... }`, change to:
`grid-template-columns: 1fr; gap: 40px;`

- [ ] **Step 15: Update services-grid columns**

In `.services-grid { ... grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); ... }`, change to `grid-template-columns: 1fr;`.

- [ ] **Step 16: Update skills-grid columns**

In `.skills-grid { ... grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); ... }`, change to `grid-template-columns: 1fr;`.

- [ ] **Step 17: Update timeline padding-left**

In `.timeline { position: relative; padding-left: 80px; }`, change to `padding-left: 28px`.

- [ ] **Step 18: Update timeline line position**

In `.timeline::before { ... left: 30px; ... }`, change to `left: 6px`.

- [ ] **Step 19: Update timeline-dot**

In `.timeline-dot { ... left: -54px; ... width: 11px; height: 11px; ... }`, change to:
`left: -27px; width: 9px; height: 9px;`

- [ ] **Step 20: Update timeline-item padding-bottom**

In `.timeline-item { ... padding-bottom: 64px; ... }`, change to `40px`.

- [ ] **Step 21: Update timeline-group padding-bottom**

In `.timeline-group { ... padding-bottom: 64px; ... }`, change to `40px`.

- [ ] **Step 22: Update timeline-group-roles padding-left**

In `.timeline-group-roles { ... padding-left: 28px; ... }`, change to `16px`.

- [ ] **Step 23: Update timeline-role-item dot left**

In `.timeline-role-item::before { ... left: -32px; ... }`, change to `left: -20px`.

- [ ] **Step 24: Hide coord-markers at base**

In `.coord-marker { ... }`, add `display: none;`.

- [ ] **Step 25: Delete old responsive blocks**

Delete the entire `@media (max-width: 900px) { ... }` block and the entire `@media (max-width: 600px) { ... }` block (and the `/* ——— Responsive ——— */` comment that preceded them, if desired — keep the comment before the new blocks).

- [ ] **Step 26: Verify at multiple widths**

Open in browser:
- At 375px: all sections single-column, timeline compact, stat cards in 2 columns, hero CTA stacked
- At 1024px+: identical to before

- [ ] **Step 27: Commit**

```bash
git add css/style.css
git commit -m "feat(responsive): convert base CSS to mobile-first values"
```

---

## Task 3: Add tablet media query block (768px+)

**Files:**
- Modify: `css/style.css` — insert `@media (min-width: 768px)` block before the desktop block

- [ ] **Step 1: Insert tablet media query**

In `css/style.css`, find the `/* ——— Desktop 1024px+ ——— */` comment and insert the following **before** it:

```css
/* ——— Tablet 768px+ ——— */
@media (min-width: 768px) {
    section { padding: 0 32px; }
    nav { padding: 0 32px; height: 60px; }
    .hero { padding-top: 60px; }
    .hero-cta { flex-direction: row; }
    .hero-cta a { text-align: left; }
    .hero-meta { gap: 32px; }
    .about, .skills, .experience, .contact, .services { padding-top: 100px; padding-bottom: 100px; }
    .section-header { margin-bottom: 52px; }
    .about-content { gap: 48px; }
    .about-stats { gap: 20px; }
    .stat-card { padding: 24px; }
    .stat-number { font-size: 36px; }
    .contact-content { gap: 48px; }
    .services-grid { grid-template-columns: repeat(2, 1fr); }
    .skills-grid { grid-template-columns: repeat(2, 1fr); }
    .timeline { padding-left: 48px; }
    .timeline::before { left: 16px; }
    .timeline-dot { left: -37px; width: 10px; height: 10px; }
    .timeline-item { padding-bottom: 52px; }
    .timeline-group { padding-bottom: 52px; }
    .timeline-group-roles { padding-left: 24px; }
    .timeline-role-item::before { left: -28px; }
}
```

- [ ] **Step 2: Verify all three tiers**

Open in browser:
- At 375px: single-column, compact
- At 768px: services/skills show 2 columns, timeline slightly wider, more breathing room
- At 1024px+: identical to before the refactor

- [ ] **Step 3: Commit**

```bash
git add css/style.css
git commit -m "feat(responsive): add tablet 768px+ media query tier"
```

---

## Task 4: Add hamburger + overlay CSS and HTML (combined commit to avoid broken intermediate state)

**Files:**
- Modify: `css/style.css` — add `--overlay-bg` variable + hamburger/overlay styles
- Modify: `index.html` — add hamburger button in nav, add overlay div after nav

- [ ] **Step 1: Add `--overlay-bg` CSS variable**

In `css/style.css`, find the `:root, [data-theme="dark"]` block and add:
```css
--overlay-bg: rgba(10, 11, 13, 0.97);
```

Find the `@media (prefers-color-scheme: light)` block (`:root:not([data-theme="dark"])`) and add:
```css
--overlay-bg: rgba(245, 246, 248, 0.97);
```

Find the `[data-theme="light"]` block and add:
```css
--overlay-bg: rgba(245, 246, 248, 0.97);
```

- [ ] **Step 2: Add hamburger and overlay CSS**

In `css/style.css`, find the `/* ——— Scroll reveal ——— */` section. Insert the following new section **after** the scroll reveal block and **before** the responsive comment:

```css
/* ——— Hamburger Button ——— */
.nav-hamburger {
    font-family: var(--font-mono);
    font-size: 20px;
    line-height: 1;
    background: transparent;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 4px 8px;
    display: flex;
    align-items: center;
    transition: color 0.3s ease;
}

.nav-hamburger:hover { color: var(--text-primary); }

/* ——— Mobile Nav Overlay ——— */
.nav-overlay {
    position: fixed;
    inset: 0;
    z-index: 200;
    background: var(--overlay-bg);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 48px;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
}

.nav-overlay.open {
    opacity: 1;
    pointer-events: all;
}

.nav-overlay-close {
    position: absolute;
    top: 16px;
    right: 16px;
    font-family: var(--font-mono);
    font-size: 20px;
    line-height: 1;
    background: transparent;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 8px 12px;
    transition: color 0.3s ease;
}

.nav-overlay-close:hover { color: var(--text-primary); }

.nav-overlay-links {
    list-style: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
}

.nav-overlay-links li {
    opacity: 0;
    transform: translateY(16px);
    transition: opacity 0.4s ease, transform 0.4s ease;
}

.nav-overlay.open .nav-overlay-links li:nth-child(1) { opacity: 1; transform: translateY(0); transition-delay: 0.05s; }
.nav-overlay.open .nav-overlay-links li:nth-child(2) { opacity: 1; transform: translateY(0); transition-delay: 0.10s; }
.nav-overlay.open .nav-overlay-links li:nth-child(3) { opacity: 1; transform: translateY(0); transition-delay: 0.15s; }
.nav-overlay.open .nav-overlay-links li:nth-child(4) { opacity: 1; transform: translateY(0); transition-delay: 0.20s; }
.nav-overlay.open .nav-overlay-links li:nth-child(5) { opacity: 1; transform: translateY(0); transition-delay: 0.25s; }

.nav-overlay-links a {
    font-family: var(--font-mono);
    font-size: 14px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--text-secondary);
    text-decoration: none;
    padding: 12px 24px;
    display: block;
    transition: color 0.3s ease;
}

.nav-overlay-links a:hover { color: var(--text-primary); }

.nav-overlay .lang-toggle {
    opacity: 0;
    transform: translateY(16px);
    transition: opacity 0.4s ease 0.30s, transform 0.4s ease 0.30s;
}

.nav-overlay.open .lang-toggle {
    opacity: 1;
    transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
    .nav-overlay { transition: none; }
    .nav-overlay-links li { transition: none; }
    .nav-overlay.open .nav-overlay-links li { opacity: 1; transform: none; }
    .nav-overlay .lang-toggle { transition: none; }
    .nav-overlay.open .lang-toggle { opacity: 1; transform: none; }
}
```

- [ ] **Step 3: Add hamburger button inside nav**

In `index.html`, find:
```html
            <div class="lang-toggle">
```
Add the hamburger button **before** that line:
```html
            <button class="nav-hamburger" aria-label="Open menu" aria-expanded="false">&#9776;</button>
            <div class="lang-toggle">
```

- [ ] **Step 4: Add overlay div after nav**

Find `    </nav>` and add the overlay immediately after:
```html
    </nav>

    <div class="nav-overlay" aria-hidden="true">
        <button class="nav-overlay-close" aria-label="Close menu">&#10005;</button>
        <ul class="nav-overlay-links">
            <li><a href="#services"><span data-lang-en>Services</span><span data-lang-pt>Servi&ccedil;os</span></a></li>
            <li><a href="#about"><span data-lang-en>About</span><span data-lang-pt>Sobre</span></a></li>
            <li><a href="#skills"><span data-lang-en>Skills</span><span data-lang-pt>Habilidades</span></a></li>
            <li><a href="#experience"><span data-lang-en>Experience</span><span data-lang-pt>Experi&ecirc;ncia</span></a></li>
            <li><a href="#contact"><span data-lang-en>Contact</span><span data-lang-pt>Contato</span></a></li>
        </ul>
        <div class="lang-toggle overlay-lang-toggle">
            <button class="lang-btn" data-lang="en" onclick="setLang('en')">EN</button>
            <button class="lang-btn" data-lang="pt-BR" onclick="setLang('pt-BR')">PT</button>
        </div>
    </div>
```

The overlay lang-toggle uses the same `.lang-btn` + `data-lang` attributes as the main toggle. The existing `setLang()` in `main.js` queries all `.lang-btn` elements globally, so active state sync is automatic — no extra code needed.

- [ ] **Step 5: Verify CSS + HTML together**

Open in browser:
- At 375px: hamburger `☰` visible in nav. Temporarily add class `open` to `.nav-overlay` in the HTML to confirm the overlay renders correctly (centered links, backdrop blur), then remove it.
- At 1024px+: hamburger hidden, nav links and lang-toggle visible, no regressions.

- [ ] **Step 6: Commit**

```bash
git add css/style.css index.html
git commit -m "feat(responsive): add hamburger button and nav overlay (HTML + CSS)"
```

---

## Task 5: Add hamburger JavaScript logic

**Files:**
- Modify: `js/main.js` — append new section at the bottom

- [ ] **Step 1: Append hamburger JS**

Add the following to the end of `js/main.js`:

```js
// ——— Hamburger Menu ———
const hamburger = document.querySelector('.nav-hamburger');
const navOverlay = document.querySelector('.nav-overlay');
const overlayClose = document.querySelector('.nav-overlay-close');
const overlayNavLinks = document.querySelectorAll('.nav-overlay-links a');
const mainNavLangBtns = document.querySelectorAll('nav .lang-toggle .lang-btn');

let overlayScrollY = 0;

function openNav() {
    overlayScrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.top = '-' + overlayScrollY + 'px';
    navOverlay.classList.add('open');
    navOverlay.setAttribute('aria-hidden', 'false');
    hamburger.setAttribute('aria-expanded', 'true');
    mainNavLangBtns.forEach(btn => btn.setAttribute('tabindex', '-1'));
    overlayClose.focus();
}

function closeNav() {
    if (navOverlay.getAttribute('aria-hidden') === 'true') return;
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.top = '';
    window.scrollTo(0, overlayScrollY);
    navOverlay.classList.remove('open');
    navOverlay.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
    mainNavLangBtns.forEach(btn => btn.removeAttribute('tabindex'));
    hamburger.focus();
}

hamburger.addEventListener('click', openNav);
overlayClose.addEventListener('click', closeNav);
overlayNavLinks.forEach(link => link.addEventListener('click', closeNav));

document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navOverlay.getAttribute('aria-hidden') === 'false') closeNav();
});

// Focus trap
navOverlay.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const focusable = Array.from(navOverlay.querySelectorAll('a[href], button:not([disabled])'));
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
    }
});

// Auto-close on resize to desktop
window.matchMedia('(min-width: 1024px)').addEventListener('change', e => {
    if (e.matches) closeNav();
});
```

- [ ] **Step 2: Verify hamburger behavior**

At mobile width (375px):
1. Click `☰` → overlay fades in, links slide up staggered, focus moves to `✕`
2. Tab through overlay: cycles through `✕`, 5 nav links, EN, PT — wraps around
3. Click a nav link → overlay closes, smooth scrolls to section, focus returns to `☰`
4. Press Escape → overlay closes, focus returns to `☰`
5. Resize to ≥ 1024px while overlay is open → overlay auto-closes

At desktop (1024px+): hamburger hidden, nav links and lang-toggle visible.

- [ ] **Step 3: Verify language toggle in overlay**

With overlay open, click PT → all nav link text (main nav + overlay) switches to Portuguese. Click EN → switches back. Both instances stay in sync automatically.

- [ ] **Step 4: Commit**

```bash
git add js/main.js
git commit -m "feat(responsive): add hamburger menu JS with focus trap and scroll lock"
```

---

## Done

All five tasks complete. The site now supports:
- **Mobile (< 768px):** single-column layout, hamburger nav with fullscreen overlay
- **Tablet (768–1023px):** 2-column grids, slightly larger spacing, hamburger nav
- **Desktop (1024px+):** original full layout with inline nav links
