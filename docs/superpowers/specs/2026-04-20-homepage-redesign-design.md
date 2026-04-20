# Homepage Redesign — Minimal about.me Style

- **Date**: 2026-04-20
- **Author**: nalbam (Jungyoul Yu)
- **Status**: Approved, pending implementation plan

## Problem

The current `index.html` is a Phaser-based interactive space scene with only a small profile toggle. As a personal homepage for Jungyoul Yu (nalbam) — SRE / DevOps Engineer at Karrot and AWS AI Hero — it lacks identifiable personal information and does not communicate who the visitor landed on.

## Goals

1. Replace the homepage with a clean, minimal about.me-style page focused on identity.
2. Preserve the existing space scene as `space.html` (no feature loss).
3. Surface key social and professional links in a single glanceable view.
4. Support automatic light/dark theme via OS preference.
5. Add a playful touch via randomized profile photo rotation.

## Non-Goals

- No full resume content on the homepage (link to `resume.nalbam.com`).
- No manual theme switcher UI (keep it minimal; follow system only).
- No navigation to sub-pages like `timer`, `spickr`, `ether` from the homepage.
- No blog integration or post feed.

## File Structure

```
docs/
├── index.html          # New minimal homepage (full rewrite)
├── space.html          # New: existing index.html content moved here
├── resume.html         # Unchanged (redirects to resume.nalbam.com)
├── timer.html          # Unchanged
└── static/
    ├── style.css       # Rewritten for minimal homepage
    ├── space.css       # New: extracted space-scene rules from old style.css
    ├── profile-photo.js # New: random initial + click-to-flip rotation
    ├── phaser-interactive.js  # Unchanged (space.html)
    ├── profile-toggle.js      # Unchanged (space.html)
    ├── clock-widget.js        # Unchanged (space.html)
    ├── profiles/
    │   ├── nalbam-2020.jpg
    │   ├── nalbam-2022.jpg
    │   └── nalbam-2025.png
    ├── logo/builder-favicon.svg  # AWS Hero badge
    ├── logo/karrot.png            # Karrot logo
    ├── fonts/sf-mono-*            # Used only by space.html
    ├── bg/, images/               # Used only by space.html
    └── analytics/nalbam.js        # Unchanged
```

## Layout (Centered Single Column)

```
<body> flex center, min-height 100vh
  <main class="card"> max-width 480px, padding 48px 32px
    <img class="profile-photo">     # 160px circle, clickable
    <h1 class="name">Jungyoul Yu</h1>
    <p class="handle">(nalbam)</p>
    <p class="bio">
      <img src="karrot.png"> SRE / DevOps @ Karrot
      · <a href="builder.aws.com/..."><img src="builder-favicon.svg"> AWS AI Hero</a>
    </p>
    <nav class="social">            # 6 icons, horizontal
      GitHub LinkedIn Twitter Facebook Instagram YouTube
    </nav>
    <a class="resume-btn" href="https://resume.nalbam.com">Resume →</a>
  </main>
  <footer class="site-footer">
    © 2026 nalbam · <a href="/space.html">space</a>
  </footer>
</body>
```

## Visual Design

### Theme Tokens

Light (default) / Dark (via `@media (prefers-color-scheme: dark)`):

| Token | Light | Dark |
|-------|-------|------|
| `--bg` | `#ffffff` | `#0d1117` |
| `--text` | `#24292e` | `#c9d1d9` |
| `--text-secondary` | `#586069` | `#8b949e` |
| `--link` | `#0366d6` | `#58a6ff` |
| `--btn-bg` | `#24292e` | `#c9d1d9` |
| `--btn-text` | `#ffffff` | `#0d1117` |
| `--btn-bg-hover` | `#0366d6` | `#58a6ff` |

Transitions: `background-color 0.3s, color 0.3s`.

### Typography

- Font family: `-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"`
- Name (h1): 28px desktop / 24px mobile, weight 600, letter-spacing -0.02em
- Handle: 16px, `--text-secondary`
- Bio: 16px, line-height 1.6
- Social icons: 20px, spacing 24px between
- Button: 15px, weight 500
- Footer: 12px, opacity 0.6

### Spacing

- Photo → Name: 24px
- Name → Handle: 4px
- Handle → Bio: 16px
- Bio → Social: 28px
- Social → Button: 28px
- Footer: `position: fixed; bottom: 16px; right: 20px`

### Profile Photo

- Circle: `border-radius: 50%`, `object-fit: cover`
- Size: 160px (desktop) / 128px (mobile)
- `cursor: pointer`
- Hover: `transform: scale(1.02)` over 0.2s
- Click: 3D flip animation (Y-axis rotation, 0.6s)

## Interactions

### Profile Photo Rotation (`profile-photo.js`)

```js
const photos = [
  'static/profiles/nalbam-2025.png',
  'static/profiles/nalbam-2022.jpg',
  'static/profiles/nalbam-2020.jpg'
];

// On load: pick random index, set src
// On click: flip animation, advance to next index (wraps)
// Disable clicks during animation
```

Implementation uses CSS `transform: rotateY()` + `transition`. At 0.3s (midpoint of flip), swap `src` while photo is edge-on to viewer.

### Theme Detection

Pure CSS via `@media (prefers-color-scheme: dark)` toggling `:root` custom properties. No JavaScript needed. No flash of incorrect theme since CSS applies synchronously on first paint.

### Resume Button

```html
<a class="resume-btn" href="https://resume.nalbam.com" target="_blank" rel="noopener">
  Resume <span class="arrow">→</span>
</a>
```

- Full-width inside card (max 200px)
- Padding 12px 24px, border-radius 8px
- Hover: background → `--btn-bg-hover`, arrow translates 4px right (0.2s)

## Responsive

- `@media (max-width: 480px)`:
  - Photo: 128px
  - Name: 24px
  - Card padding: 32px 24px
- Tested viewport widths: 320, 375, 768, 1280

## Accessibility

- `<html lang="en">`
- Profile photo: `alt="Jungyoul Yu profile"`, clickable wrapper has `role="button"` and `aria-label="Change profile photo"`
- Social icons: each anchor has `aria-label` (e.g., "GitHub profile")
- AWS Hero link: external with `rel="noopener noreferrer"`
- Focus visible: `outline: 2px solid var(--link); outline-offset: 2px`
- Prefers-reduced-motion: disable flip animation, use crossfade instead

## Metadata / SEO

```html
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="Jungyoul Yu (nalbam) — SRE / DevOps Engineer at Karrot, AWS AI Hero">
<meta name="author" content="Jungyoul Yu">
<meta name="keywords" content="nalbam, Jungyoul Yu, DevOps, SRE, AWS, Karrot, AWS Hero">

<!-- Open Graph -->
<meta property="og:title" content="nalbam | Jungyoul Yu">
<meta property="og:description" content="SRE / DevOps Engineer at Karrot, AWS AI Hero">
<meta property="og:image" content="https://www.nalbam.com/static/profiles/nalbam-2025.png">
<meta property="og:url" content="https://www.nalbam.com/">
<meta property="og:type" content="website">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="nalbam | Jungyoul Yu">
<meta name="twitter:description" content="SRE / DevOps Engineer at Karrot, AWS AI Hero">
<meta name="twitter:image" content="https://www.nalbam.com/static/profiles/nalbam-2025.png">

<title>nalbam | Jungyoul Yu</title>
```

## space.html

Verbatim copy of current `index.html` with these changes:
1. Link CSS to `static/space.css` instead of `static/style.css`
2. Update `<title>` to `nalbam | space`
3. Add a small "← home" link in a corner to return to `/`
4. Preserve all existing scripts (`phaser-interactive.js`, `profile-toggle.js`, `clock-widget.js`) and behavior

## CSS Split

### `style.css` (new, homepage only)

All rules for: `body`, `.card`, `.profile-photo`, `.name`, `.handle`, `.bio`, `.social`, `.resume-btn`, `.site-footer`, theme tokens, responsive breakpoints.

### `space.css` (new, space.html only)

Move from existing `style.css`:
- Phaser canvas styles (`#phaser-game`)
- Clock widget (`.clock-widget`, `.clock-container`, etc.)
- Profile toggle button (`.profile-toggle-btn`)
- Pop box / profile card (`.pop-box`, `.pop-container`, `.pop-name`, etc.)
- Any background gradients / star animations
- SF Mono `@font-face` declarations

## Analytics

Keep `static/analytics/nalbam.js` loaded on both `index.html` and `space.html` (unchanged from current).

## Testing Checklist

- [ ] 3 profile photos cycle on click in order: 2025 → 2022 → 2020 → 2025
- [ ] Random initial photo selection works across reloads
- [ ] OS dark mode toggle applies instantly (no refresh needed)
- [ ] Layout intact at 320px, 375px, 768px, 1280px widths
- [ ] All 6 social links open in new tab and point to correct URLs
- [ ] Resume button opens `resume.nalbam.com` in new tab
- [ ] `/space.html` renders full existing space scene with Phaser, profile toggle, clock widget
- [ ] "← home" link on space.html returns to `/`
- [ ] Footer `space` link on homepage navigates to `/space.html`
- [ ] `prefers-reduced-motion: reduce` disables flip animation
- [ ] Lighthouse scores: Accessibility ≥ 95, Performance ≥ 90

## Out of Scope (Future Ideas)

- Blog post feed integration
- Dynamic "current status" line (e.g., from GitHub activity)
- Custom Open Graph card generator per photo
- i18n (Korean version at `/ko` or via language switcher)
