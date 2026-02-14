import { formatTime } from '@/utils/time'
import styles from './TimerDisplay.module.css'

interface TimerDisplayProps {
  remainingSeconds: number
  totalSeconds: number
}

/** Simple pixel-style fox icon (runner along the ring) */
function FoxIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M12 4c-1.5 0-2.5 1-3 2.5l-1 3H4l2 4 2-2 1 4 2-5 1 1 1-3 1 1 1-4 2 2 2-4-2-1-1 2.5-2.5C15 6 14 4 12 4z"
        fill="#e07a45"
        stroke="#fff"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
      <ellipse cx="10" cy="14" rx="1.2" ry="1" fill="#fff" />
      <ellipse cx="14" cy="14" rx="1.2" ry="1" fill="#fff" />
    </svg>
  )
}

export function TimerDisplay({ remainingSeconds, totalSeconds }: TimerDisplayProps) {
  const elapsed = Math.max(0, totalSeconds - remainingSeconds)
  const progressPercent = totalSeconds > 0 ? (elapsed / totalSeconds) * 100 : 0
  const progressDeg = progressPercent * 3.6
  const progressBg =
    `conic-gradient(var(--accent) 0deg, var(--accent) ${progressDeg}deg, transparent ${progressDeg}deg)` as const

  return (
    <div className={styles.wrapper} aria-live="polite">
      {/* White ring background */}
      <div className={styles.ringBg} />
      {/* Orange progress arc */}
      <div
        className={styles.ringProgress}
        style={{ '--progress-bg': progressBg } as React.CSSProperties}
      />
      {/* Fox at progress tip */}
      <div
        className={styles.fox}
        style={{
          transform: `translateY(-126px) rotate(${progressDeg}deg)`,
        }}
      >
        <FoxIcon />
      </div>
      {/* Time in center */}
      <div className={styles.time}>{formatTime(remainingSeconds)}</div>
    </div>
  )
}
