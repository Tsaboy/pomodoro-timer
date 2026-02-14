import type { PomodoroSettings } from '@/types'
import styles from './Settings.module.css'

interface SettingsProps {
  settings: PomodoroSettings
  onChange: (s: Partial<PomodoroSettings>) => void
  isOpen: boolean
  onClose: () => void
}

export function Settings({ settings, onChange, isOpen, onClose }: SettingsProps) {
  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Settings</h2>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <div className={styles.body}>
          <div className={styles.field}>
            <label htmlFor="focus">Focus (minutes)</label>
            <input
              id="focus"
              type="number"
              min={1}
              max={90}
              value={settings.focusDuration}
              onChange={(e) => onChange({ focusDuration: Math.max(1, Math.min(90, +e.target.value)) })}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="shortBreak">Short break (minutes)</label>
            <input
              id="shortBreak"
              type="number"
              min={1}
              max={30}
              value={settings.shortBreakDuration}
              onChange={(e) => onChange({ shortBreakDuration: Math.max(1, Math.min(30, +e.target.value)) })}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="longBreak">Long break (minutes)</label>
            <input
              id="longBreak"
              type="number"
              min={1}
              max={60}
              value={settings.longBreakDuration}
              onChange={(e) => onChange({ longBreakDuration: Math.max(1, Math.min(60, +e.target.value)) })}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="sessions">Sessions before long break</label>
            <input
              id="sessions"
              type="number"
              min={1}
              max={10}
              value={settings.sessionsBeforeLongBreak}
              onChange={(e) => onChange({ sessionsBeforeLongBreak: Math.max(1, Math.min(10, +e.target.value)) })}
            />
          </div>
          <div className={styles.toggle}>
            <input
              id="autoPlay"
              type="checkbox"
              checked={settings.autoPlayMusicOnFocus}
              onChange={(e) => onChange({ autoPlayMusicOnFocus: e.target.checked })}
            />
            <label htmlFor="autoPlay">Auto-play music when focus starts</label>
          </div>
          <div className={styles.toggle}>
            <input
              id="pauseOnBreak"
              type="checkbox"
              checked={settings.pauseMusicOnBreak}
              onChange={(e) => onChange({ pauseMusicOnBreak: e.target.checked })}
            />
            <label htmlFor="pauseOnBreak">Pause music when break starts</label>
          </div>
        </div>
      </div>
    </div>
  )
}
