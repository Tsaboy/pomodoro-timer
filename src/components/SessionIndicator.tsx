import type { SessionType } from '@/types'
import styles from './SessionIndicator.module.css'

interface SessionIndicatorProps {
  sessionType: SessionType
  sessionCount: number
  sessionsBeforeLongBreak: number
  cycleNumber: number
}

export function SessionIndicator({
  sessionType,
  sessionCount,
  sessionsBeforeLongBreak,
  cycleNumber,
}: SessionIndicatorProps) {
  const isFocus = sessionType === 'focus'
  const count = Math.min(sessionsBeforeLongBreak, 8)

  return (
    <div className={styles.container}>
      <span className={styles.label}>cycle: {cycleNumber}</span>
      {isFocus && count > 0 && (
        <div className={styles.tomatoes}>
          {Array.from({ length: count }, (_, i) => (
            <div
              key={i}
              className={`${styles.tomato} ${i < sessionCount ? styles.done : styles.pending}`}
              aria-hidden
            />
          ))}
        </div>
      )}
    </div>
  )
}
