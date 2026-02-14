import { useRef, useState, useCallback, useEffect } from 'react'
import type { Track } from '@/types'

export function useAudioPlayer(playlist: Track[]) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.7)

  const tracks = playlist.length > 0 ? playlist : []
  const currentTrack = tracks[currentIndex]
  const isSingleTrack = tracks.length === 1

  const ensureAudio = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
    }
    return audioRef.current
  }, [])

  const play = useCallback(() => {
    if (tracks.length === 0) return
    const audio = ensureAudio()
    audio.src = tracks[currentIndex].url
    audio.volume = volume
    audio.loop = isSingleTrack
    audio.play().then(() => setIsPlaying(true)).catch(() => {})
  }, [ensureAudio, tracks, currentIndex, volume, isSingleTrack])

  const pause = useCallback(() => {
    const audio = audioRef.current
    if (audio) {
      audio.pause()
      setIsPlaying(false)
    }
  }, [])

  const toggle = useCallback(() => {
    if (isPlaying) pause()
    else play()
  }, [isPlaying, play, pause])

  const next = useCallback(() => {
    if (tracks.length === 0) return
    const nextIndex = (currentIndex + 1) % tracks.length
    setCurrentIndex(nextIndex)
    const audio = ensureAudio()
    audio.src = tracks[nextIndex].url
    audio.volume = volume
    audio.loop = tracks.length === 1
    if (isPlaying) {
      audio.play().then(() => {}).catch(() => {})
    }
  }, [currentIndex, tracks, volume, isPlaying, ensureAudio])

  const previous = useCallback(() => {
    if (tracks.length === 0) return
    const prevIndex = currentIndex === 0 ? tracks.length - 1 : currentIndex - 1
    setCurrentIndex(prevIndex)
    const audio = ensureAudio()
    audio.src = tracks[prevIndex].url
    audio.volume = volume
    audio.loop = tracks.length === 1
    if (isPlaying) {
      audio.play().then(() => {}).catch(() => {})
    }
  }, [currentIndex, tracks, volume, isPlaying, ensureAudio])

  const setVolumeLevel = useCallback((v: number) => {
    const clamped = Math.max(0, Math.min(1, v))
    setVolume(clamped)
    if (audioRef.current) {
      audioRef.current.volume = clamped
    }
  }, [])

  useEffect(() => {
    const audio = ensureAudio()
    const onEnded = () => {
      if (isSingleTrack) {
        audio.play().catch(() => {})
      } else {
        next()
      }
    }
    audio.addEventListener('ended', onEnded)
    return () => audio.removeEventListener('ended', onEnded)
  }, [ensureAudio, isSingleTrack, next])

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [])

  return {
    currentTrack,
    currentIndex,
    isPlaying,
    volume,
    tracks,
    play,
    pause,
    toggle,
    next,
    previous,
    setVolume: setVolumeLevel,
  }
}
