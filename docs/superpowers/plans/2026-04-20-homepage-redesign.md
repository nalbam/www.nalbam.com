# Homepage Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Phaser space-scene homepage with a minimal about.me-style personal page and preserve the existing space experience at `/space.html`.

**Architecture:** Static HTML/CSS/JS under `docs/` (GitHub Pages). Two pages: minimal homepage (`index.html`) and preserved space scene (`space.html`). CSS split into `style.css` (homepage) and `space.css` (space). Random profile photo with click-to-flip rotation via vanilla JS. Theme auto-switches via `@media (prefers-color-scheme)`.

**Tech Stack:** HTML5, CSS3 custom properties, vanilla ES6 JavaScript, Font Awesome 6 (existing CDN), Phaser.js 3 (space.html only, existing).

**Spec:** [`docs/superpowers/specs/2026-04-20-homepage-redesign-design.md`](../specs/2026-04-20-homepage-redesign-design.md)

**Verification:** This is a static site without automated tests. Each task ends with a manual browser verification step using a local HTTP server (`python3 -m http.server 8000 --directory docs`). Before the first verification task, start the server once and keep it running.

---

## File Plan

**Create:**
- `docs/space.html` — copy of current `index.html` with adjusted title, stylesheet link, and back-to-home link
- `docs/static/space.css` — full copy of current `static/style.css`
- `docs/static/profile-photo.js` — random initial pick + click-to-flip rotation

**Rewrite:**
- `docs/index.html` — minimal about.me layout
- `docs/static/style.css` — clean slate; theme tokens + card layout

**Update:**
- `docs/README.md` — reflect new structure (optional, after visual verification)

**Unchanged:**
- `docs/static/phaser-interactive.js`, `profile-toggle.js`, `clock-widget.js` — used only by `space.html`
- `docs/static/profiles/*`, `logo/*`, `fonts/*`, `bg/*`, `images/*`
- `docs/static/analytics/nalbam.js`
- `docs/resume.html`, `docs/timer.html`

---

## Task 1: Preserve existing space scene as space.html

**Files:**
- Create: `docs/static/space.css` (copied from `static/style.css`)
- Create: `docs/space.html` (copied from current `index.html`, with 3 edits)

- [ ] **Step 1: Copy style.css to space.css**

```bash
cp docs/static/style.css docs/static/space.css
```

- [ ] **Step 2: Copy current index.html to space.html**

```bash
cp docs/index.html docs/space.html
```

- [ ] **Step 3: Edit space.html — update `<title>`**

Find:
```html
<title>nalbam | DevOps Engineer</title>
```
Replace with:
```html
<title>nalbam | space</title>
```

- [ ] **Step 4: Edit space.html — switch stylesheet link**

Find:
```html
<link rel="stylesheet" href="static/style.css" />
```
Replace with:
```html
<link rel="stylesheet" href="static/space.css" />
```

- [ ] **Step 5: Edit space.html — add "← home" link just after `<body>`**

Insert immediately after the opening `<body>` tag:
```html
  <a href="/" class="home-link" aria-label="Back to home">← home</a>
```

- [ ] **Step 6: Append `.home-link` styles to space.css**

Append to the end of `docs/static/space.css`:
```css
.home-link {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;
  padding: 8px 14px;
  border: 2px solid #64ffda;
  border-radius: 20px;
  background: rgba(10, 10, 26, 0.9);
  color: #64ffda;
  font-family: 'SF Mono', Menlo, monospace;
  font-size: 13px;
  text-decoration: none;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(100, 255, 218, 0.3);
  transition: all 0.3s ease;
}

.home-link:hover {
  background: rgba(100, 255, 218, 0.15);
  transform: translateY(-2px);
}
```

- [ ] **Step 7: Verify space.html in browser**

Start server (leave running for subsequent tasks):
```bash
python3 -m http.server 8000 --directory docs
```

Open `http://localhost:8000/space.html` and verify:
- Space scene renders (stars, nebulae, Phaser canvas visible)
- Profile toggle button (top-right) works
- Clock widget visible
- "← home" button in top-left; clicking it navigates to `/` (will 404 until Task 3 — expected for now)

- [ ] **Step 8: Commit**

```bash
git add docs/space.html docs/static/space.css
git commit -m "feat: add space.html preserving interactive space scene"
```

---

## Task 2: Rewrite style.css with minimal theme and layout

**Files:**
- Rewrite: `docs/static/style.css`

- [ ] **Step 1: Replace full contents of `docs/static/style.css`**

```css
:root {
  --bg: #ffffff;
  --text: #24292e;
  --text-secondary: #586069;
  --link: #0366d6;
  --btn-bg: #24292e;
  --btn-text: #ffffff;
  --btn-bg-hover: #0366d6;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0d1117;
    --text: #c9d1d9;
    --text-secondary: #8b949e;
    --link: #58a6ff;
    --btn-bg: #c9d1d9;
    --btn-text: #0d1117;
    --btn-bg-hover: #58a6ff;
  }
}

* {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
}

body {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 24px 64px;
  background-color: var(--bg);
  color: var(--text);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial,
    sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.card {
  width: 100%;
  max-width: 480px;
  padding: 48px 32px;
  text-align: center;
}

.profile-photo-wrapper {
  width: 160px;
  height: 160px;
  margin: 0 auto 24px;
  perspective: 800px;
  cursor: pointer;
}

.profile-photo {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}

.profile-photo-wrapper:hover .profile-photo {
  transform: scale(1.02);
}

.profile-photo-wrapper.flipping .profile-photo {
  transform: rotateY(90deg);
}

.name {
  margin: 0;
  font-size: 28px;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--text);
}

.handle {
  margin: 4px 0 16px;
  font-size: 16px;
  color: var(--text-secondary);
}

.bio {
  margin: 0 0 28px;
  font-size: 16px;
  color: var(--text);
}

.bio img.inline-logo {
  width: 20px;
  height: 20px;
  vertical-align: -4px;
  margin-right: 4px;
}

.bio a {
  color: var(--link);
  text-decoration: none;
}

.bio a:hover {
  text-decoration: underline;
}

.social {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-bottom: 28px;
}

.social a {
  color: var(--text);
  font-size: 20px;
  opacity: 0.7;
  transition: opacity 0.2s ease, color 0.2s ease;
}

.social a:hover {
  opacity: 1;
  color: var(--link);
}

.resume-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  border-radius: 8px;
  background-color: var(--btn-bg);
  color: var(--btn-text);
  font-size: 15px;
  font-weight: 500;
  text-decoration: none;
  transition: background-color 0.2s ease;
}

.resume-btn .arrow {
  display: inline-block;
  transition: transform 0.2s ease;
}

.resume-btn:hover {
  background-color: var(--btn-bg-hover);
}

.resume-btn:hover .arrow {
  transform: translateX(4px);
}

.site-footer {
  position: fixed;
  bottom: 16px;
  right: 20px;
  font-size: 12px;
  color: var(--text-secondary);
  opacity: 0.6;
}

.site-footer a {
  color: inherit;
  text-decoration: none;
}

.site-footer a:hover {
  text-decoration: underline;
}

a:focus-visible,
button:focus-visible,
.profile-photo-wrapper:focus-visible {
  outline: 2px solid var(--link);
  outline-offset: 3px;
  border-radius: 4px;
}

@media (max-width: 480px) {
  .card {
    padding: 32px 24px;
  }
  .profile-photo-wrapper {
    width: 128px;
    height: 128px;
    margin-bottom: 20px;
  }
  .name {
    font-size: 24px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .profile-photo {
    transition: opacity 0.2s ease;
  }
  .profile-photo-wrapper.flipping .profile-photo {
    transform: none;
    opacity: 0;
  }
  .resume-btn .arrow,
  .resume-btn:hover .arrow {
    transition: none;
    transform: none;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add docs/static/style.css
git commit -m "feat: rewrite style.css with minimal theme tokens and card layout"
```

---

## Task 3: Create profile-photo.js

**Files:**
- Create: `docs/static/profile-photo.js`

- [ ] **Step 1: Create `docs/static/profile-photo.js`**

```javascript
(function () {
  const PHOTOS = [
    'static/profiles/nalbam-2025.png',
    'static/profiles/nalbam-2022.jpg',
    'static/profiles/nalbam-2020.jpg'
  ];
  const HALF_FLIP_MS = 300;

  const wrapper = document.querySelector('.profile-photo-wrapper');
  const img = document.querySelector('.profile-photo');
  if (!wrapper || !img) return;

  let index = Math.floor(Math.random() * PHOTOS.length);
  img.src = PHOTOS[index];

  let animating = false;

  function next() {
    if (animating) return;
    animating = true;
    wrapper.classList.add('flipping');

    setTimeout(() => {
      index = (index + 1) % PHOTOS.length;
      img.src = PHOTOS[index];
      wrapper.classList.remove('flipping');
    }, HALF_FLIP_MS);

    setTimeout(() => {
      animating = false;
    }, HALF_FLIP_MS * 2);
  }

  wrapper.addEventListener('click', next);
  wrapper.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      next();
    }
  });
})();
```

- [ ] **Step 2: Commit**

```bash
git add docs/static/profile-photo.js
git commit -m "feat: add profile-photo.js for random pick and click-to-flip rotation"
```

---

## Task 4: Rewrite index.html as minimal homepage

**Files:**
- Rewrite: `docs/index.html`

- [ ] **Step 1: Replace full contents of `docs/index.html`**

```html
<!doctype html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Jungyoul Yu (nalbam) — SRE / DevOps Engineer at Karrot, AWS AI Hero">
  <meta name="keywords" content="nalbam, Jungyoul Yu, DevOps, SRE, AWS, Karrot, AWS Hero">
  <meta name="author" content="Jungyoul Yu">

  <meta property="og:title" content="nalbam | Jungyoul Yu">
  <meta property="og:description" content="SRE / DevOps Engineer at Karrot, AWS AI Hero">
  <meta property="og:image" content="https://www.nalbam.com/static/profiles/nalbam-2025.png">
  <meta property="og:url" content="https://www.nalbam.com/">
  <meta property="og:type" content="website">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="nalbam | Jungyoul Yu">
  <meta name="twitter:description" content="SRE / DevOps Engineer at Karrot, AWS AI Hero">
  <meta name="twitter:image" content="https://www.nalbam.com/static/profiles/nalbam-2025.png">

  <title>nalbam | Jungyoul Yu</title>
  <link rel="stylesheet" href="static/style.css" />
  <script src="https://kit.fontawesome.com/94bd0a58a5.js" crossorigin="anonymous"></script>
</head>

<body>
  <main class="card">
    <div class="profile-photo-wrapper" role="button" tabindex="0" aria-label="Change profile photo">
      <img class="profile-photo" src="static/profiles/nalbam-2025.png" alt="Jungyoul Yu profile photo" />
    </div>

    <h1 class="name">Jungyoul Yu</h1>
    <p class="handle">(nalbam)</p>

    <p class="bio">
      <img class="inline-logo" src="static/logo/karrot.png" alt="Karrot logo" />
      SRE / DevOps @ Karrot
      &nbsp;·&nbsp;
      <a href="https://builder.aws.com/community/@nalbam" target="_blank" rel="noopener noreferrer">
        <img class="inline-logo" src="static/logo/builder-favicon.svg" alt="AWS badge" />
        AWS AI Hero
      </a>
    </p>

    <nav class="social" aria-label="Social profiles">
      <a href="https://github.com/nalbam" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><i class="fa-brands fa-github"></i></a>
      <a href="https://linkedin.com/in/nalbam/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i class="fa-brands fa-linkedin"></i></a>
      <a href="https://twitter.com/nalbam" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><i class="fa-brands fa-twitter"></i></a>
      <a href="https://facebook.com/nalbam" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i class="fa-brands fa-facebook"></i></a>
      <a href="https://instagram.com/nalbam/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
      <a href="https://youtube.com/user/nalbam" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><i class="fa-brands fa-youtube"></i></a>
    </nav>

    <a class="resume-btn" href="https://resume.nalbam.com" target="_blank" rel="noopener noreferrer">
      Resume <span class="arrow">→</span>
    </a>
  </main>

  <footer class="site-footer">
    © 2026 nalbam · <a href="/space.html">space</a>
  </footer>

  <script src="static/profile-photo.js"></script>
  <script src="static/analytics/nalbam.js"></script>
</body>

</html>
```

- [ ] **Step 2: Verify homepage in browser**

Open `http://localhost:8000/` and verify:
- Profile photo appears centered, circular, 160px desktop
- One of `nalbam-2020.jpg`, `nalbam-2022.jpg`, `nalbam-2025.png` shows (random)
- Hard refresh several times — different photos appear across reloads
- Click the photo — 3D flip animation plays, next photo shown after
- Three clicks wrap back to the starting photo
- Name "Jungyoul Yu" visible, "(nalbam)" under it
- Bio line shows Karrot logo + "SRE / DevOps @ Karrot · [AWS badge] AWS AI Hero"
- Six social icons rendered horizontally, hoverable
- "Resume →" button renders as dark-filled pill; hover shifts arrow right
- Footer `© 2026 nalbam · space` fixed bottom-right; `space` link navigates to `/space.html`
- All external links open in new tab

- [ ] **Step 3: Verify dark mode**

On macOS: System Settings → Appearance → Dark.
Reload `http://localhost:8000/` and verify:
- Background becomes `#0d1117`
- Text is light-gray
- Resume button inverts (light bg, dark text)
- AWS Hero link reads as blue-toned

Switch back to Light and confirm instant revert.

- [ ] **Step 4: Verify mobile viewport**

Chrome DevTools → device toolbar → iPhone SE (375px) and 320px widths:
- Photo shrinks to 128px
- Name font drops to 24px
- No horizontal scroll
- All content fits in viewport

- [ ] **Step 5: Verify accessibility quick-check**

- Tab into the page: focus ring visible on photo wrapper, each social link, Resume button, footer link
- Press Enter on focused photo: flip animation plays
- Chrome DevTools → Lighthouse → Accessibility audit: score ≥ 95

- [ ] **Step 6: Verify space.html still works**

Open `http://localhost:8000/space.html`:
- Phaser canvas still renders
- "← home" link in top-left navigates back to `/`

- [ ] **Step 7: Commit**

```bash
git add docs/index.html
git commit -m "feat: rewrite homepage as minimal about.me-style page"
```

---

## Task 5: Update README.md to reflect new structure

**Files:**
- Modify: `docs/../README.md` (project root README)

- [ ] **Step 1: Update the "About" section of README.md**

Replace the `## About` section through the end of `## Project Structure` with:

```markdown
## About

This is the personal website of Jungyoul Yu (nalbam), featuring:

- **Minimal Homepage**: Clean about.me-style landing page with profile photo, bio, social links, and resume CTA
- **Random Profile Rotation**: Three profile photos selected randomly on load; click photo to flip to the next
- **Auto Light/Dark Theme**: Follows system `prefers-color-scheme` — no manual toggle needed
- **Space Scene**: Full Phaser-based interactive space environment preserved at `/space.html` with black holes, meteors, UFOs, and accurate physics
- **Resume Redirect**: `/resume.html` points to dedicated `resume.nalbam.com`

## Project Structure

```
docs/
├── index.html              # Minimal homepage
├── space.html              # Interactive space scene (Phaser)
├── resume.html             # Redirect to resume.nalbam.com
├── timer.html              # Timer utility
└── static/
    ├── style.css           # Homepage styles (minimal, theme tokens)
    ├── space.css           # Space scene styles
    ├── profile-photo.js    # Random photo selection + flip rotation
    ├── phaser-interactive.js  # Space simulation (space.html only)
    ├── profile-toggle.js      # Profile overlay toggle (space.html only)
    ├── clock-widget.js        # Clock widget (space.html only)
    ├── profiles/           # Profile photos (2020, 2022, 2025)
    ├── logo/               # Karrot, AWS builder icons
    ├── fonts/              # SF Mono (space.html only)
    └── analytics/          # Tracking modules
```
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: update README for minimal homepage + space.html split"
```

---

## Final Verification Checklist

After all tasks complete, run through this end-to-end:

- [ ] `/` — minimal homepage renders with random photo, 6 social icons, Resume button, space footer link
- [ ] Photo click → flip → next photo, wraps after 3rd
- [ ] Light/Dark OS toggle instantly reflects
- [ ] 320px mobile width shows no overflow
- [ ] `/space.html` — full Phaser space scene + "← home" link
- [ ] `/resume.html` — redirects to resume.nalbam.com
- [ ] `/timer.html` — unchanged
- [ ] Lighthouse Accessibility ≥ 95 on homepage
- [ ] `git log --oneline -6` shows 5 feat/docs commits from this plan

Stop the local server:
```bash
# Ctrl-C in the server terminal
```
