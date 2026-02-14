/**
 * Pomodoro Timer App – Pomofox-style UI
 */
import { useState, useCallback, useEffect } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { usePomodoro } from '@/hooks/usePomodoro'
import { useAudioPlayer } from '@/hooks/useAudioPlayer'
import type { PomodoroSettings, SessionType } from '@/types'
import { minutesToSeconds } from '@/utils/time'
import { PLAYLIST } from '@/constants/audio'
import { TimerDisplay } from '@/components/TimerDisplay'
import { SessionIndicator } from '@/components/SessionIndicator'
import { AudioPlayer } from '@/components/AudioPlayer'
import { Settings } from '@/components/Settings'
import styles from './App.module.css'

const DEFAULT_SETTINGS: PomodoroSettings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsBeforeLongBreak: 4,
  autoPlayMusicOnFocus: false,
  pauseMusicOnBreak: true,
}

export default function App() {
  const [settings, setSettings] = useLocalStorage<PomodoroSettings>('pomodoro-settings', DEFAULT_SETTINGS)
  const [sessionType, setSessionType] = useLocalStorage<SessionType>('pomodoro-session', 'focus')
  const [sessionCount, setSessionCount] = useLocalStorage<number>('pomodoro-sessionCount', 0)
  const [cycleNumber, setCycleNumber] = useLocalStorage<number>('pomodoro-cycle', 1)
  const [remainingSeconds, setRemainingSeconds] = useLocalStorage<number>(
    'pomodoro-remaining',
    settings.focusDuration * 60
  )
  const [isRunning, setIsRunning] = useLocalStorage<boolean>('pomodoro-running', false)
  const [isPaused, setIsPaused] = useLocalStorage<boolean>('pomodoro-paused', false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [audioOpen, setAudioOpen] = useState(false)
  const [isMuted, setIsMuted] = useLocalStorage<boolean>('pomodoro-muted', false)

  const audio = useAudioPlayer(PLAYLIST)

  const onSessionChange = useCallback(
    (type: SessionType) => {
      if (type === 'longBreak') setCycleNumber((c) => c + 1)
      if (type === 'focus' && settings.autoPlayMusicOnFocus) {
        audio.play()
      } else if ((type === 'shortBreak' || type === 'longBreak') && settings.pauseMusicOnBreak) {
        audio.pause()
      }
    },
    [settings.autoPlayMusicOnFocus, settings.pauseMusicOnBreak, audio, setCycleNumber]
  )

  const timer = usePomodoro(
    settings,
    remainingSeconds,
    setRemainingSeconds,
    sessionType,
    setSessionType,
    sessionCount,
    setSessionCount,
    setIsRunning,
    setIsPaused,
    onSessionChange
  )

  useEffect(() => {
    if (!isRunning && !isPaused) {
      const duration =
        sessionType === 'focus'
          ? minutesToSeconds(settings.focusDuration)
          : sessionType === 'shortBreak'
            ? minutesToSeconds(settings.shortBreakDuration)
            : minutesToSeconds(settings.longBreakDuration)
      setRemainingSeconds(duration)
    }
  }, [settings.focusDuration, settings.shortBreakDuration, settings.longBreakDuration, sessionType])

  const handleSettingsChange = useCallback(
    (partial: Partial<PomodoroSettings>) => {
      setSettings((prev) => ({ ...prev, ...partial }))
    },
    [setSettings]
  )

  const totalSeconds =
    sessionType === 'focus'
      ? minutesToSeconds(settings.focusDuration)
      : sessionType === 'shortBreak'
        ? minutesToSeconds(settings.shortBreakDuration)
        : minutesToSeconds(settings.longBreakDuration)

  const switchMode = useCallback(
    (type: SessionType) => {
      if (isRunning || isPaused) timer.stop()
      setSessionType(type)
      const duration =
        type === 'focus'
          ? minutesToSeconds(settings.focusDuration)
          : type === 'shortBreak'
            ? minutesToSeconds(settings.shortBreakDuration)
            : minutesToSeconds(settings.longBreakDuration)
      setRemainingSeconds(duration)
    },
    [settings, setSessionType, setRemainingSeconds, isRunning, isPaused, timer]
  )

  return (
    <div className={styles.app}>
      {/* Scenic background */}
      <div className={styles.bgMountains} aria-hidden>
        <div className={`${styles.mountain} ${styles.mountain1}`} />
        <div className={`${styles.mountain} ${styles.mountain2}`} />
        <div className={`${styles.mountain} ${styles.mountain3}`} />
        <div className={`${styles.mountain} ${styles.mountain4}`} />
        <div className={`${styles.mountain} ${styles.mountain5}`} />
      </div>
      <div className={styles.bgForest} aria-hidden />

      <header className={styles.header}>
        <h1 className={styles.title}>Bacalin</h1>
        <div className={styles.headerIcons}>
          <button
            type="button"
            className={`${styles.iconBtn} ${audioOpen ? styles.active : ''}`}
            onClick={() => setAudioOpen((o) => !o)}
            aria-label="Music"
          >
            ♪
          </button>
          <button
            type="button"
            className={`${styles.iconBtn} ${isMuted ? styles.active : ''}`}
            onClick={() => setIsMuted((m) => !m)}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => setSettingsOpen(true)}
            aria-label="Settings"
          >
            ⚙
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.controlRow}>
          {!isRunning ? (
            <button
              type="button"
              className={`${styles.controlBtn} ${styles.primary}`}
              onClick={() => {
                if (isPaused) timer.resume()
                else timer.start()
                if (!isMuted) audio.play()
              }}
              aria-label={isPaused ? 'Resume' : 'Start'}
            >
              ▶
            </button>
          ) : (
            <button
              type="button"
              className={`${styles.controlBtn} ${styles.primary}`}
              onClick={timer.pause}
              aria-label="Pause"
            >
              ⏸
            </button>
          )}
          <button type="button" className={styles.controlBtn} onClick={timer.reset} aria-label="Reset">
            ↻
          </button>
          <button
            type="button"
            className={`${styles.controlBtn} ${isMuted ? styles.active : ''}`}
            onClick={() => setIsMuted((m) => !m)}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
          <button
            type="button"
            className={styles.controlBtn}
            onClick={() => setSettingsOpen(true)}
            aria-label="Settings"
          >
            ⚙
          </button>
        </div>

        <TimerDisplay remainingSeconds={remainingSeconds} totalSeconds={totalSeconds} />

        <SessionIndicator
          sessionType={sessionType}
          sessionCount={sessionCount}
          sessionsBeforeLongBreak={settings.sessionsBeforeLongBreak}
          cycleNumber={cycleNumber}
        />

        <div className={styles.modeTabs}>
          <button
            type="button"
            className={`${styles.modeTab} ${sessionType === 'focus' ? styles.active : ''}`}
            onClick={() => switchMode('focus')}
          >
            pomodoro
          </button>
          <button
            type="button"
            className={`${styles.modeTab} ${sessionType === 'shortBreak' ? styles.active : ''}`}
            onClick={() => switchMode('shortBreak')}
          >
            short break
          </button>
          <button
            type="button"
            className={`${styles.modeTab} ${sessionType === 'longBreak' ? styles.active : ''}`}
            onClick={() => switchMode('longBreak')}
          >
            long break
          </button>
        </div>

        {audioOpen && (
          <section className={styles.audio}>
            <AudioPlayer
              currentTrack={audio.currentTrack}
              isPlaying={audio.isPlaying}
              volume={isMuted ? 0 : audio.volume}
              onPlay={audio.play}
              onPause={audio.pause}
              onNext={audio.next}
              onPrevious={audio.previous}
              onVolumeChange={(v) => (isMuted ? audio.setVolume(0) : audio.setVolume(v))}
            />
          </section>
        )}
      </main>

      <Settings
        settings={settings}
        onChange={handleSettingsChange}
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  )
}
