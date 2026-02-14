import { useRef, useEffect, useCallback } from 'react'
import type { SessionType, PomodoroSettings } from '@/types'
import { minutesToSeconds } from '@/utils/time'

// Refs keep current sessionType/sessionCount for the interval callback (closure staleness)
function useSessionRefs(
  sessionType: SessionType,
  sessionCount: number,
  settings: PomodoroSettings
) {
  const refs = useRef({ sessionType, sessionCount, settings })
  useEffect(() => {
    refs.current = { sessionType, sessionCount, settings }
  })
  return refs
}

/**
 * Tab-accurate countdown: we store endTime (Date.now() + remainingMs) in a ref.
 * Each tick computes remaining = endTime - Date.now(), so accuracy is preserved
 * even when the tab is backgrounded and setInterval is throttled.
 */
export function usePomodoro(
  settings: PomodoroSettings,
  remainingSeconds: number,
  setRemainingSeconds: (v: number | ((p: number) => number)) => void,
  sessionType: SessionType,
  setSessionType: (v: SessionType | ((p: SessionType) => SessionType)) => void,
  sessionCount: number,
  setSessionCount: (v: number | ((p: number) => number)) => void,
  setIsRunning: (v: boolean) => void,
  setIsPaused: (v: boolean) => void,
  onSessionChange?: (type: SessionType) => void
) {
  const endTimeRef = useRef<number>(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const sessionRefs = useSessionRefs(sessionType, sessionCount, settings)

  const getDurationSeconds = useCallback(
    (type: SessionType): number => {
      if (type === 'focus') return settings.focusDuration * 60
      if (type === 'shortBreak') return settings.shortBreakDuration * 60
      return settings.longBreakDuration * 60
    },
    [settings]
  )

  const tickRef = useRef<() => void>(() => {})

  const tick = useCallback(() => {
    const remaining = Math.max(0, Math.ceil((endTimeRef.current - Date.now()) / 1000))
    setRemainingSeconds(remaining)

    if (remaining <= 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      setIsRunning(false)
      setIsPaused(false)

      const { sessionType: st, sessionCount: sc, settings: s } = sessionRefs.current
      if (st === 'focus') {
        const nextCount = sc + 1
        const isLongBreak = nextCount >= s.sessionsBeforeLongBreak
        setSessionCount(isLongBreak ? 0 : nextCount)
        const nextType: SessionType = isLongBreak ? 'longBreak' : 'shortBreak'
        const duration = getDurationSeconds(nextType)
        setSessionType(nextType)
        setRemainingSeconds(duration)
        endTimeRef.current = Date.now() + duration * 1000
        onSessionChange?.(nextType)
        setIsRunning(true)
        setIsPaused(false)
        intervalRef.current = setInterval(tickRef.current, 500)
      } else {
        const duration = getDurationSeconds('focus')
        setSessionType('focus')
        setRemainingSeconds(duration)
        endTimeRef.current = Date.now() + duration * 1000
        onSessionChange?.('focus')
        setIsRunning(true)
        setIsPaused(false)
        intervalRef.current = setInterval(tickRef.current, 500)
      }
    }
  }, [
    getDurationSeconds,
    setRemainingSeconds,
    setSessionType,
    setSessionCount,
    setIsRunning,
    setIsPaused,
    onSessionChange,
  ])

  tickRef.current = tick

  const start = useCallback(() => {
    const now = Date.now()
    endTimeRef.current = now + remainingSeconds * 1000
    setIsRunning(true)
    setIsPaused(false)
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(tick, 500) // 500ms for snappy updates
  }, [remainingSeconds, setIsRunning, setIsPaused, tick])

  const pause = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsRunning(false)
    setIsPaused(true)
    const remaining = Math.max(0, Math.ceil((endTimeRef.current - Date.now()) / 1000))
    setRemainingSeconds(remaining)
  }, [setRemainingSeconds, setIsRunning, setIsPaused])

  const resume = useCallback(() => {
    const now = Date.now()
    endTimeRef.current = now + remainingSeconds * 1000
    setIsRunning(true)
    setIsPaused(false)
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(tick, 500)
  }, [remainingSeconds, setIsRunning, setIsPaused, tick])

  const reset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsRunning(false)
    setIsPaused(false)
    const duration = getDurationSeconds(sessionType)
    setRemainingSeconds(duration)
  }, [sessionType, getDurationSeconds, setRemainingSeconds, setIsRunning, setIsPaused])

  const resetToFocus = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsRunning(false)
    setIsPaused(false)
    setSessionType('focus')
    setSessionCount(0)
    const duration = minutesToSeconds(settings.focusDuration)
    setRemainingSeconds(duration)
  }, [settings.focusDuration, setSessionType, setSessionCount, setRemainingSeconds, setIsRunning, setIsPaused])

  /** Stop timer without changing remainingSeconds (e.g. when switching mode) */
  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsRunning(false)
    setIsPaused(false)
  }, [setIsRunning, setIsPaused])

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return { start, pause, resume, reset, resetToFocus, stop }
}
