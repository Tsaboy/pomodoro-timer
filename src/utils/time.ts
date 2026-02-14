/** Format seconds as mm:ss */
export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

/** Convert minutes to seconds */
export function minutesToSeconds(minutes: number): number {
  return minutes * 60
}
