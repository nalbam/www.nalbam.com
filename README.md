# nalbam

Personal website and portfolio of Jungyoul Yu (nalbam) - SRE / DevOps Engineer / AWS AI Hero

🌐 **Live Site**: [https://nalbam.com](https://nalbam.com)

![nalbam's cover](docs/static/bg/nalbam-cover.png)

## About

This is the personal website of Jungyoul Yu (nalbam), featuring:

- **Minimal Homepage**: Clean about.me-style landing page with profile photo, bio, social links, and resume CTA
- **Random Profile Rotation**: Three profile photos selected randomly on load; click the photo to flip to the next
- **Auto Light/Dark Theme**: Follows system `prefers-color-scheme` — no manual toggle
- **Interactive Space Scene**: Full Phaser-based space environment preserved at [`/space.html`](https://www.nalbam.com/space.html) with scientifically-accurate black holes, meteors, UFOs, and physics simulation
- **Resume Redirect**: `/resume.html` points to the dedicated `resume.nalbam.com`

## Features

### 🏠 Minimal Homepage (`/`)
- **Profile Photo**: Randomized initial pick from three photos (2020, 2022, 2025); click-to-flip rotation
- **Social Integration**: GitHub, LinkedIn, Twitter, Facebook, Instagram, YouTube
- **AWS AI Hero Badge**: Links to the AWS Builder profile
- **Theme**: Automatic light/dark based on OS preference
- **Responsive**: Mobile-first layout down to 320px

### 🌌 Space Scene (`/space.html`)
- **Interstellar-inspired Black Holes**: Gargantua-style accretion disk with Doppler effect, gravitational lensing, photon rings
- **Dynamic Objects**: Meteors, asteroids, UFOs with physics-based movement
- **Real-time Interactions**: Click anywhere to create asteroids or black holes
- **Advanced Physics**: Phaser.js 3.88.2, real-time gravitational effects, star consumption
- **Profile Toggle & Clock Widget**: Preserved overlay widgets

## Project Structure

```
docs/
├── index.html              # Minimal homepage
├── space.html              # Interactive space scene (Phaser)
├── resume.html             # Redirect to resume.nalbam.com
├── timer.html              # Timer utility
└── static/
    ├── style.css           # Homepage styles (theme tokens, card layout)
    ├── space.css           # Space scene styles (SF Mono, overlays, animations)
    ├── profile-photo.js    # Random photo selection + flip rotation
    ├── phaser-interactive.js  # Space simulation (space.html only)
    ├── profile-toggle.js      # Profile overlay toggle (space.html only)
    ├── clock-widget.js        # Clock widget (space.html only)
    ├── profiles/           # nalbam-2020.jpg, nalbam-2022.jpg, nalbam-2025.png
    ├── logo/               # Karrot, AWS Hero icons
    ├── fonts/              # SF Mono (space.html only)
    ├── images/             # Space scene sprites (UFO, asteroids)
    ├── bg/                 # Background assets
    ├── timer/              # Timer utility assets
    └── analytics/          # Tracking modules
```

## Technologies Used

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Game Engine**: Phaser.js 3.80.1 (2D physics and rendering)
- **Physics Simulation**: Custom gravitational physics and relativistic effects
- **Fonts**: SF Mono (custom web fonts with multiple weights)
- **Icons**: Font Awesome 6
- **Styling**: CSS3 with gradients, animations, and backdrop filters
- **Hosting**: GitHub Pages
- **Analytics**: Custom JavaScript tracking modules

## How to Interact

### 🖱️ Mouse Controls
- **Left Click**: Create asteroids at cursor position
- **Watch**: Automatic black hole spawning every 45-75 seconds
- **Observe**: Real-time physics interactions between all objects

### 🕳️ Black Hole Physics
- **Manual Creation**: Click anywhere to create interactive black holes
- **Automatic Spawning**: Random black holes appear periodically
- **Gravitational Effects**: Watch objects get pulled into black holes
- **Doppler Visualization**:
  - **Blue side**: Matter approaching you (blue-shifted)
  - **Red side**: Matter receding from you (red-shifted)
- **Star Consumption**: Stars disappear when consumed by black holes
- **Lifetime**: Each black hole lasts approximately 5 seconds (2s growth + 3s active)

### 🌟 Space Environment
- **Dynamic Starfield**: Multiple layers of stars with varying brightness
- **Nebulae**: Colorful cosmic clouds with organic movement
- **Meteors**: Periodic shooting stars across the sky
- **UFO Investigations**: UFOs appear after black hole events
- **Atmospheric Effects**: Real-time distortion and twinkling effects

## Scientific Accuracy

The black hole implementation is inspired by the scientific visualization from Christopher Nolan's **Interstellar** (2014), consulting with physicist Kip Thorne:

### 🔬 Physics Features
- **Doppler Effect**: Realistic color shifting based on rotational velocity
- **Gravitational Lensing**: Light-bending effects near the event horizon
- **Accretion Disk**: Hot matter spiraling into the black hole
- **Photon Ring**: Unstable circular orbits of light
- **Event Horizon**: The point of no return (black center)
- **Frame Dragging**: Spacetime rotation effects from spinning black hole

### 📚 Educational Value
- **Visual Learning**: See relativistic effects in real-time
- **Interactive Physics**: Experiment with gravitational interactions
- **Astronomical Accuracy**: Based on current black hole research
- **Simplified Model**: Complex physics made accessible and beautiful

## Connect

- 🐱 GitHub: [@nalbam](https://github.com/nalbam)
- 💼 LinkedIn: [linkedin.com/in/nalbam](https://linkedin.com/in/nalbam/)
- 🐦 Twitter: [@nalbam](https://twitter.com/nalbam)
- 📷 Instagram: [@nalbam](https://instagram.com/nalbam/)
- 🎥 YouTube: [nalbam](https://youtube.com/user/nalbam)
- 📘 Facebook: [nalbam](https://facebook.com/nalbam)
