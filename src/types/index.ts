export type SessionType = 'focus' | 'shortBreak' | 'longBreak'

export interface PomodoroSettings {
  focusDuration: number // minutes
  shortBreakDuration: number
  longBreakDuration: number
  sessionsBeforeLongBreak: number
  autoPlayMusicOnFocus: boolean
  pauseMusicOnBreak: boolean
}

export interface Track {
  id: string
  title: string
  url: string
}

export interface PomodoroState {
  sessionType: SessionType
  sessionCount: number // how many focus sessions completed in current cycle
  remainingSeconds: number
  isRunning: boolean
  isPaused: boolean
  settings: PomodoroSettings
}
