export type Track = {
  id: number
  title: string
  artist: string
  album?: string
  releaseDate?: string
  duration?: number
  size_mb?: number
  coverUrl?: string
  encoded_audio: string
  audioMimeType?: string
  isFavorite?: boolean
}

export type TrackResponse = Track[];