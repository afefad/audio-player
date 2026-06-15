import { el } from 'redom'
import makeIcon from '../utils/MakeIcon'
import type { Track } from '../types/app/trackType'
import DummyBackend from '../api/DummyBackend'
import AuthManager from '../utils/AuthManager'
import Router from '../app/Router'

class FooterPlayer {
  el: HTMLElement

  audio: HTMLAudioElement
  audioUrl: string | null = null
  isPlaying = false
  isFavorite = false
  isMute = false

  coverImg: HTMLImageElement
  titleEl: HTMLSpanElement
  artistBlock: HTMLDivElement
  artistEl: HTMLSpanElement
  favoriteBtn: HTMLButtonElement
  favoriteIcon: SVGElement

  playerEl: HTMLDivElement
  playBtn: HTMLButtonElement
  currentTimeEl: HTMLSpanElement
  durationEl: HTMLSpanElement
  progressInput: HTMLInputElement

  volumeEl: HTMLDivElement
  volumeInput: HTMLInputElement
  volumeBtn: HTMLButtonElement

  private backend: DummyBackend
  private authManager: AuthManager
  private currentTrack: Track | null = null
  private isFavoriteLoading = false

  onFavoriteToggle?: (track: Track) => void

  constructor() {
    this.backend = new DummyBackend()
    this.authManager = new AuthManager()

    this.audio = new Audio()
    this.audio.preload = 'metadata'
    this.audio.volume = 0.7

    this.coverImg = el('img.artist__img', {
      src: '#',
      width: 60,
      height: 60,
      alt: 'Track cover',
    }) as HTMLImageElement

    this.titleEl = el('span.artist__title', '#') as HTMLSpanElement
    this.artistEl = el('span.artist__name', '#') as HTMLSpanElement

    this.favoriteIcon = makeIcon('artist__fav.like', 16, 16, 'sprite.svg#fav-icon')

    this.favoriteBtn = el(
      'button.artist__fav-btn',
      {
        type: 'button',
        'aria-label': 'Добавить в избранное',
      },
      this.favoriteIcon
    ) as HTMLButtonElement

    this.playBtn = el(
      'button.player__play-btn',
      {
        type: 'button',
        'aria-label': 'Воспроизвести',
      },
    ) as HTMLButtonElement

    this.currentTimeEl = el('span.player__time.player__time--current', '0:00') as HTMLSpanElement
    this.durationEl = el('span.player__time.player__time--duration', '0:00') as HTMLSpanElement

    this.progressInput = el('input.player__progress', {
      type: 'range',
      min: 0,
      max: 100,
      value: 0,
      step: 1,
      'aria-label': 'Прогресс воспроизведения',
    }) as HTMLInputElement

    this.playerEl = el(
      'div.footer__player.player',
      el('div.player__controls', this.playBtn),
      el(
        'div.player__timeline',
        this.currentTimeEl,
        this.progressInput,
        this.durationEl
      )
    ) as HTMLDivElement

    this.volumeBtn = el(
      'button.volume__btn',
      {
        type: 'button',
        'aria-label': 'Включить или выключить звук',
      },
      makeIcon('volume__icon', 24, 24, 'sprite.svg#volume-icon')
    ) as HTMLButtonElement

    this.renderLoudStae()

    this.volumeInput = el('input.volume__input', {
      type: 'range',
      min: 0,
      max: 1,
      step: 0.01,
      value: this.audio.volume,
      'aria-label': 'Громкость',
    }) as HTMLInputElement

    this.volumeEl = el(
      'div.footer__volume.volume',
      this.volumeBtn,
      this.volumeInput
    ) as HTMLDivElement

    this.artistBlock = el(
      'div.footer__artist.artist artist--disabled',
      el('div.artist__img-wrap', this.coverImg),
      el(
        'div.artist__description',
        el(
          'div.artist__title-wrap',
          this.titleEl,
          this.favoriteBtn
        ),
        this.artistEl
      )
    ) as HTMLDivElement

    this.el = el(
      'footer.footer',
      el(
        'div.container',
        el(
          'div.footer__content',
          this.artistBlock,
          this.playerEl,
          this.volumeEl
        )
      )
    )

    this.bindEvents()
    this.renderPlayState()
    this.renderFavoriteState()
    this.updateRangeProgress(this.progressInput)
    this.updateRangeProgress(this.volumeInput)
  }

  private updateRangeProgress(input: HTMLInputElement) {
    const min = Number(input.min) || 0
    const max = Number(input.max) || 100
    const value = Number(input.value) || 0
    const percent = ((value - min) / (max - min)) * 100

    input.style.setProperty('--progress', `${percent}%`)
  }

  private bindEvents() {
    this.playBtn.addEventListener('click', () => {
      if (!this.audio.src) return

      if (this.audio.paused) {
        let state = this.audio.play()
        state.catch((error) => {
          console.error('Player:', error);
        })
      } else {
        this.audio.pause()
      }
    })

    this.favoriteBtn.addEventListener('click', () => {
      void this.handleFavoriteClick()
    })

    this.progressInput.addEventListener('input', () => {
      this.updateRangeProgress(this.progressInput)

      if (!Number.isFinite(this.audio.duration) || this.audio.duration <= 0) return

      const percent = Number(this.progressInput.value)
      this.audio.currentTime = (this.audio.duration * percent) / 100
    })

    this.volumeInput.addEventListener('input', () => {
      const value = Number(this.volumeInput.value)
      this.audio.volume = value
      this.audio.muted = value === 0
      this.updateRangeProgress(this.volumeInput)
    })

    this.volumeBtn.addEventListener('click', () => {
      this.audio.muted = !this.audio.muted

      if (this.audio.muted) {
        this.volumeInput.value = '0'
      } else if (Number(this.volumeInput.value) === 0) {
        this.audio.volume = 0.7
        this.volumeInput.value = '0.7'
        this.audio.muted = false
      } else {
        this.volumeInput.value = String(this.audio.volume)
      }
    })

    this.audio.addEventListener('play', () => {
      this.isPlaying = true
      this.renderPlayState()
    })

    this.audio.addEventListener('pause', () => {
      this.isPlaying = false
      this.renderPlayState()
    })

    this.audio.addEventListener('loadedmetadata', () => {
      this.durationEl.textContent = this.formatTime(this.audio.duration)
      this.progressInput.value = '0'
      this.currentTimeEl.textContent = '0:00'
      this.updateRangeProgress(this.progressInput)
    })

    this.audio.addEventListener('timeupdate', () => {
      const { currentTime, duration } = this.audio
      this.currentTimeEl.textContent = this.formatTime(currentTime)

      if (Number.isFinite(duration) && duration > 0) {
        const progress = (currentTime / duration) * 100
        this.progressInput.value = String(progress)
        this.updateRangeProgress(this.progressInput)
      }
    })

    this.audio.addEventListener('ended', () => {
      this.isPlaying = false
      this.progressInput.value = '100'
      this.updateRangeProgress(this.progressInput)
      this.renderPlayState()
    })

    this.audio.addEventListener('volumechange', () => {
      if (this.audio.muted) {
        this.volumeInput.value = '0'
        this.renderLoudStae()
      } else {
        this.volumeInput.value = String(this.audio.volume)
        this.renderLoudStae()
      }

      this.updateRangeProgress(this.volumeInput)
    })
  }

  private async handleFavoriteClick(): Promise<void> {
    if (!this.currentTrack || this.isFavoriteLoading) return

    const token = await this.authManager.getToken()

    if (token === null) {
      Router.goAuth()
      return
    }

    this.isFavoriteLoading = true
    this.favoriteBtn.disabled = true

    const prevIsFavorite = this.currentTrack.isFavorite

    try {
      if (this.currentTrack.isFavorite) {
        await this.backend.removeFavorite(token, Number(this.currentTrack.id))
        this.currentTrack.isFavorite = false
      } else {
        await this.backend.addFavorite(token, Number(this.currentTrack.id))
        this.currentTrack.isFavorite = true
      }

      this.isFavorite = Boolean(this.currentTrack.isFavorite)
      this.renderFavoriteState()
      this.onFavoriteToggle?.(this.currentTrack)
    } catch (error) {
      this.currentTrack.isFavorite = prevIsFavorite
      this.isFavorite = Boolean(this.currentTrack.isFavorite)
      this.renderFavoriteState()
      console.error('Ошибка при изменении избранного:', error)
    } finally {
      this.isFavoriteLoading = false
      this.favoriteBtn.disabled = false
    }
  }

  private renderLoudStae() {
    this.volumeBtn.setAttribute(
      'aria-label',
      this.audio.muted ? 'Включить звук' : 'Выключить звук'
    )

    this.volumeBtn.innerHTML = ''

    const icon = this.audio.muted
      ? makeIcon('volume__icon volume__icon--mute', 16, 16, 'sprite.svg#volume-mute-icon')
      : makeIcon('volume__icon', 16, 16, 'sprite.svg#volume-icon')

    this.volumeBtn.append(icon)
  }

  private renderPlayState() {
    this.playBtn.setAttribute(
      'aria-label',
      this.isPlaying ? 'Пауза' : 'Воспроизвести'
    )

    this.playBtn.innerHTML = ''

    const icon = this.isPlaying
      ? makeIcon('player__icon player__icon--play', 32, 32, 'sprite.svg#pause-icon')
      : makeIcon('player__icon player__icon--pause', 32, 32, 'sprite.svg#play-icon')

    this.playBtn.append(icon)
    this.el.classList.toggle('is-playing', this.isPlaying)
  }

  private renderFavoriteState() {
    this.favoriteBtn.classList.toggle('is-favorite', this.isFavorite)
    this.favoriteBtn.setAttribute(
      'aria-label',
      this.isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'
    )

    this.favoriteIcon.classList.toggle('like--enable', this.isFavorite)
  }

  private formatTime(time: number) {
    if (!Number.isFinite(time) || time < 0) return '0:00'

    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)

    return `${minutes}:${String(seconds).padStart(2, '0')}`
  }

  private base64ToAudioUrl(base64: string, mimeType = 'audio/mpeg') {
    const cleanBase64 = base64.includes(',')
      ? base64.split(',')[1]
      : base64

    const byteString = atob(cleanBase64)
    const bytes = new Uint8Array(byteString.length)

    for (let i = 0; i < byteString.length; i++) {
      bytes[i] = byteString.charCodeAt(i)
    }

    const blob = new Blob([bytes], { type: mimeType })
    return URL.createObjectURL(blob)
  }

  loadTrack(track: Track) {
    this.currentTrack = track
    this.titleEl.textContent = track.title
    this.artistEl.textContent = track.artist
    this.coverImg.src = track.coverUrl ? track.coverUrl : 'images/example.png'
    this.coverImg.alt = `${track.title} cover`
    this.isFavorite = Boolean(track.isFavorite)
    this.renderFavoriteState()

    this.artistBlock.classList.remove('artist--disabled')

    if (this.audioUrl) {
      URL.revokeObjectURL(this.audioUrl)
      this.audioUrl = null
    }

    this.audio.pause()
    this.audio.currentTime = 0
    this.progressInput.value = '0'
    this.currentTimeEl.textContent = '0:00'
    this.durationEl.textContent = '0:00'
    this.updateRangeProgress(this.progressInput)

    this.audioUrl = this.base64ToAudioUrl(
      track.encoded_audio,
      track.audioMimeType || 'audio/mpeg'
    )

    this.audio.src = this.audioUrl
    this.audio.load()
  }

  play() {
    if (!this.audio.src) return
    void this.audio.play()
  }

  pause() {
    this.audio.pause()
  }

  toggle() {
    if (!this.audio.src) return

    if (this.audio.paused) {
      void this.audio.play()
    } else {
      this.audio.pause()
    }
  }

  destroy() {
    this.audio.pause()

    if (this.audioUrl) {
      URL.revokeObjectURL(this.audioUrl)
      this.audioUrl = null
    }
  }
}

export default FooterPlayer