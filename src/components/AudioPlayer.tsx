import type { Track } from '@/types'
import styles from './AudioPlayer.module.css'

interface AudioPlayerProps {
  currentTrack?: Track | null
  isPlaying: boolean
  volume: number
  onPlay: () => void
  onPause: () => void
  onNext: () => void
  onPrevious: () => void
  onVolumeChange: (v: number) => void
}

export function AudioPlayer({
  currentTrack,
  isPlaying,
  volume,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  onVolumeChange,
}: AudioPlayerProps) {
  return (
    <div className={styles.audioPlayer}>
      <div className={styles.trackInfo}>
        {currentTrack ? (
          <span className={styles.trackTitle} title={currentTrack.title}>
            {currentTrack.title}
          </span>
        ) : (
          <span className={styles.trackTitle}>No track</span>
        )}
      </div>
      <div className={styles.controls}>
        <button
          type="button"
          className={styles.controlBtn}
          onClick={onPrevious}
          aria-label="Previous track"
        >
          ⏮
        </button>
        <button
          type="button"
          className={styles.controlBtn}
          onClick={isPlaying ? onPause : onPlay}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button
          type="button"
          className={styles.controlBtn}
          onClick={onNext}
          aria-label="Next track"
        >
          ⏭
        </button>
      </div>
      <div className={styles.volume}>
        <label htmlFor="volume" className={styles.volumeLabel}>
          🔊
        </label>
        <input
          id="volume"
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
          className={styles.volumeSlider}
        />
      </div>
    </div>
  )
}
