<p align="center">
  <a href="https://vero.com">
    <img src="https://github.com/qveezzx/vero-site/blob/main/assets/banner.png?raw=true" alt="Vero Banner" width="150px">
  </a>
</p>

<h1 align="center">Vero</h1>

<p align="center">
  <strong>An open-sourced, privacy-respecting, ad-free Lossless streaming platform.</strong>
</p>

<p align="center">
  <a href="https://vero.com">Website</a> -
  <a href="https://github.com/qveezzx">Donate</a> -
  <a href="#features">Features</a> -
</p>

<p align="center">
  <a href="https://github.com/qveezzx/vero-site/stargazers">
    <img src="https://img.shields.io/github/stars/qveezzx/vero-site?style=for-the-badge&color=ffffff&labelColor=000000" alt="GitHub stars">
  </a>
  <a href="https://github.com/qveezzx/vero-site/forks">
    <img src="https://img.shields.io/github/forks/qveezzx/vero-site?style=for-the-badge&color=ffffff&labelColor=000000" alt="GitHub forks">
  </a>
  <a href="https://github.com/qveezzx/vero-site/issues">
    <img src="https://img.shields.io/github/issues/qveezzx/vero-site?style=for-the-badge&color=ffffff&labelColor=000000" alt="GitHub issues">
  </a>
</p>

<p align="center">
  <strong>Download now</strong><br>
  <a href="https://github.com/qveezzx/vero-site/releases/latest">
    <img src="https://img.shields.io/badge/Windows-0078D4?style=for-the-badge&logo=windows&logoColor=white" alt="Windows">
  </a>
  <a href="https://github.com/qveezzx/vero-site/releases/latest">
    <img src="https://img.shields.io/badge/Android-3DDC84?style=for-the-badge&logo=android&logoColor=white" alt="Android">
  </a>
  <a href="https://webvero.pages.dev/">
    <img src="https://img.shields.io/badge/Web-ffffff?style=for-the-badge&logo=google-chrome&logoColor=black" alt="Web">
  </a><br>
  <sub>This version is used on older hardware, iOS/iPadOS devices or Smart TV's.</sub>
</p>

---

## What is Vero?

**Vero** is an open-source, privacy-respecting, ad-free [TIDAL](https://tidal.com) based Streaming Service, built on top of Hi-Fi. It provides a beautiful, minimalist interface for streaming Lossless quality music without the clutter of traditional streaming platforms.

---

## Features

### Audio Quality

- High-quality High-Res/lossless audio streaming
- Support for local music files
- API caching for improved performance

### Interface

- Dark, minimalist interface optimized for focus
- Animated Album Covers For Supported Albums
- High-quality Music Videos
- Customizable themes & Community Theme Store
- Accurate and unique audio visualizer
- Offline-capable Progressive Web App (PWA)
- Media Session API integration for system controls

### Library & Organization

- Recently Played tracking for easy history access
- Comprehensive Personal Library for favorites
- Queue management with shuffle and repeat modes
- Native Podcast support & organization
- Playlist import from other platforms
- Public playlists for social sharing
- Smart recommendations for new songs, albums & artists
- Infinite Recommendation Radio
- Explore Page (Hot & New) for discovering newly added music and whats trending overall or within each genre

### Lyrics & Metadata

- Lyrics support with karaoke mode
- Genius integration for lyrics
- Track downloads with automatic metadata embedding

### Integrations

- Account system for cross-device syncing
- Customizable & Public Profiles
- Last.fm and ListenBrainz integration for scrobbling
- OAuth support (Google, Discord, GitHub, Spotify)
- Unreleased music from [ArtistGrid](https://artistgrid.cx)
- Dynamic Discord Embeds
- Artist Biography + Social Links for learning more about your favorite artists
- Multiple API instance support with failover

### Power User Features

- Keyboard shortcuts & Command Palette (CTRL+K) for power users

---

## Quick Start

### Live Instance

Our Recommended way to use Vero is through our official instance:

**[Vero.com](https://Vero.com)** / **[vero.to](https://vero.to)**

For alternative instances, check [INSTANCES.md](INSTANCES.md).

---

## Self-Hosting

NOTE: Accounts will not work on self-hosted instances. Our Appwrite authentication system only allows authorized domains.

We had to heavily customize the authentication system and write several custom scripts to support features like SMTP and Google OAuth (which are currently bugged in Appwrite). Because of this, we can no longer provide a self-hostable accounts system.

### Option 1: Docker (Recommended)

```bash
git clone https://github.com/qveezzx/vero-site.git
cd vero-site
docker compose up -d
```

Visit `http://localhost:3000`

### Tailscale Access

Visit `http://<tailscale_server_hostname_or_ip>:3000`

By default, the app uses Vite preview, which restricts access to localhost.  
To allow access over Tailscale:

1. Open `vite.config.js`

2. Uncomment and configure the `preview` section:

```js
preview: {
    host: true,
    allowedHosts: ['<your_tailscale_hostname>'], // e.g. pi5.tailf5f622.ts.net
},
```

3. Restart with a fresh container (if already running):

```bash
docker compose down
docker compose up -d
```

For development mode and advanced setups, see [DOCKER.md](DOCKER.md).

### Option 2: Manual Installation

#### Prerequisites

- [Bun](https://bun.sh/) (Preferred) or [Node.js](https://nodejs.org/) (Version 20+ or 22+ recommended)

#### Local Development

1. **Clone the repository:**

    ```bash
    git clone https://github.com/qveezzx/vero-site.git
    cd vero-site
    ```

2. **Install dependencies:**

    ```bash
    bun install
    # or
    npm install # NPM is included with Node.js
    ```

3. **Start the development server:**

    ```bash
    bun run dev
    # or
    npm run dev
    ```

4. **Open your browser:**
   Navigate to `http://localhost:5173/`

#### Building for Production

```bash
bun run build
# or
npm run build
```

---

## Usage

### Basic Usage

1. Visit the [Website](https://vero.to) or your local development server
2. Search for your favorite artists, albums, or tracks
3. Click play to start streaming
4. Use the media controls to manage playback, queue, and volume

### Keyboard Shortcuts

| Shortcut      | Action                       |
| ------------- | ---------------------------- |
| `Space`       | Play / Pause                 |
| `→`           | Seek forward 10s             |
| `←`           | Seek backward 10s            |
| `Shift` + `→` | Next track                   |
| `Shift` + `←` | Previous track               |
| `↑`           | Volume up                    |
| `↓`           | Volume down                  |
| `M`           | Mute / Unmute                |
| `S`           | Toggle shuffle               |
| `R`           | Toggle repeat                |
| `Q`           | Open queue                   |
| `L`           | Toggle lyrics                |
| `/`           | Focus search                 |
| `Esc`         | Close modals                 |
| `[`           | Previous visualizer preset   |
| `]`           | Next visualizer preset       |
| `\`           | Toggle visualizer auto-cycle |
| `Ctrl` + `K`  | Command Palette              |

### Account Features

To sync your library, history, and playlists across devices:

1. Click the "Accounts" Section
2. Sign in with Google or Email
3. Your data will automatically sync across all devices

---

## Contributing

We welcome contributions from the community! Please see our [Contributing Guide](CONTRIBUTING.md) for:

- Setting up your development environment
- Code style and linting
- Project structure
- Before You Contribute
- Commit message conventions
- Deployment information

---

<p align="center">
  Made with ❤️ by the qveezz
</p>
