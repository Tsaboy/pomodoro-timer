# Pomodoro Timer

A minimal, distraction-free Pomodoro timer web app built with React + TypeScript (Vite).

## Features

- **Configurable Timer**: Focus, short break, long break durations; sessions before long break
- **Accurate Countdown**: Stays correct even when the tab loses focus (uses `Date.now()`)
- **Pomodoro Logic**: Auto-switches Focus → Short Break → Focus → Long Break (after N sessions)
- **Music / Playlist**: Built-in ambient tracks with play, pause, next, previous, volume
- **Settings**: Auto-play on focus start, pause on break (configurable)
- **Persistence**: User settings and last state saved to `localStorage`

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173

## File Structure

```
pomodoro/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
└── src/
    ├── main.tsx              # Entry point
    ├── App.tsx               # Root component, wiring
    ├── App.module.css
    ├── index.css             # Global styles
    ├── vite-env.d.ts         # Module declarations (CSS, etc.)
    ├── types/
    │   └── index.ts          # SessionType, PomodoroSettings, Track
    ├── utils/
    │   └── time.ts           # formatTime, minutesToSeconds
    ├── hooks/
    │   ├── useLocalStorage.ts
    │   ├── usePomodoro.ts    # Timer logic (tab-accurate)
    │   └── useAudioPlayer.ts
    └── components/
        ├── TimerDisplay.tsx
        ├── SessionIndicator.tsx
        ├── Settings.tsx
        ├── AudioPlayer.tsx
        └── *.module.css
```

## Tech Notes

- **Framework**: Vite chosen over Next.js — simpler setup, faster HMR, ideal for a single-page timer app (no SSR required).
- **Tab-Accurate Countdown**: Stores `endTime = Date.now() + remainingMs` in a ref; each tick computes `remaining = endTime - Date.now()` so accuracy holds when the tab is backgrounded and `setInterval` is throttled.
- **Audio**: One repeating track (Google Drive link in `src/constants/audio.ts`). Music starts when you click the **Play/Start** button. If the Drive link doesn’t stream in your browser, download the file and put it in `public/` (e.g. `public/focus-music.mp3`), then point the playlist URL to `/focus-music.mp3`.
- **Background**: The app uses `public/background.jpg` as the background image. To use the [Spill](https://www.tumblr.com/mini-moss/706787418874036224/spill-this-piece-is-from-2021-i-added-some) pixel art by [@mini-moss](https://www.tumblr.com/mini-moss), save that image as `public/background.jpg`. If the file is missing, a gradient fallback is shown.
