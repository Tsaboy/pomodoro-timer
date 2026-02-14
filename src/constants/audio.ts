import type { Track } from '@/types'

/** Single track playlist - repeats this one song. Google Drive direct link. */
const DRIVE_FILE_ID = '1y8bqMcvtNc9Jrs5VUbCqcTVyixddocLv'
export const DEFAULT_TRACK: Track = {
  id: '1',
  title: 'Focus music',
  url: `https://drive.google.com/uc?export=download&id=${DRIVE_FILE_ID}`,
}

export const PLAYLIST: Track[] = [DEFAULT_TRACK]
