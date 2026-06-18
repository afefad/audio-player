import { el } from "redom";
import makeIcon from "../utils/MakeIcon";
import DummyBackend from "../api/DummyBackend";
import AuthManager from "../utils/AuthManager";
import Router from "../app/Router";
import Artist from "./artist";
import type { Track } from "../types/app/trackType";

class FooterPlayer {
  el: HTMLElement;

  audio: HTMLAudioElement;
  audioUrl: string | null = null;
  isPlaying = false;
  isFavorite = false;
  isMute = false;

  artistBlock: Artist;

  playerEl: HTMLDivElement;
  playerControlEl: HTMLDivElement;
  playBtn: HTMLButtonElement;
  shuffleBtn: HTMLButtonElement;
  repeatBtn: HTMLButtonElement;
  nextBtn: HTMLButtonElement;
  nextIcon: SVGElement;
  prevBtn: HTMLButtonElement;
  prevIcon: SVGElement;
  currentTimeEl: HTMLSpanElement;
  durationEl: HTMLSpanElement;
  progressInput: HTMLInputElement;

  volumeEl: HTMLDivElement;
  volumeInput: HTMLInputElement;
  volumeBtn: HTMLButtonElement;

  private backend: DummyBackend;
  private authManager: AuthManager;
  private currentTrack: Track | null = null;
  private isFavoriteLoading = false;

  private playlist: Track[] = [];
  private currentIndex = -1;

  private isShuffle = false;
  private isRepeatAll = false;
  private shuffledOrder: number[] = [];
  private shuffledPointer = -1;

  onFavoriteToggle?: (track: Track) => void;
  onTrackChange?: (track: Track) => void;

  constructor() {
    this.backend = new DummyBackend();
    this.authManager = new AuthManager();

    this.audio = new Audio();
    this.audio.preload = "metadata";
    this.audio.volume = 0.7;

    this.playBtn = el("button.player__play-btn player-btn", {
      type: "button",
      "aria-label": "Воспроизвести",
    }) as HTMLButtonElement;

    this.shuffleBtn = el("button.player__shuffle-btn player-btn", {
      type: "button",
      "aria-label": "Включить перемешивание треков",
    }) as HTMLButtonElement;

    this.nextIcon = makeIcon(
      "player__icon player__icon--action",
      16,
      16,
      "sprite.svg#next-icon",
    ) as SVGElement;

    this.nextBtn = el(
      "button.player__next-btn player-btn",
      {
        type: "button",
        "aria-label": "Следующий трек",
      },
      this.nextIcon,
    ) as HTMLButtonElement;

    this.prevIcon = makeIcon(
      "player__icon player__icon--action",
      16,
      16,
      "sprite.svg#prev-icon",
    ) as SVGElement;

    this.prevBtn = el(
      "button.player__prev-btn player-btn",
      {
        type: "button",
        "aria-label": "Предыдущий трек",
      },
      this.prevIcon,
    ) as HTMLButtonElement;

    this.repeatBtn = el("button.player__repeat-btn player-btn", {
      type: "button",
      "aria-label": "Включить режим проигрывания плейлиста по кругу",
    }) as HTMLButtonElement;

    this.playerControlEl = el(
      "div.player__controls",
      this.shuffleBtn,
      this.prevBtn,
      this.playBtn,
      this.nextBtn,
      this.repeatBtn,
    ) as HTMLDivElement;

    this.currentTimeEl = el(
      "span.player__time.player__time--current",
      "0:00",
    ) as HTMLSpanElement;
    this.durationEl = el(
      "span.player__time.player__time--duration",
      "0:00",
    ) as HTMLSpanElement;

    this.progressInput = el("input.player__progress", {
      type: "range",
      min: 0,
      max: 100,
      value: 0,
      step: 1,
      "aria-label": "Прогресс воспроизведения",
    }) as HTMLInputElement;

    this.playerEl = el(
      "div.footer__player.player",
      this.playerControlEl,
      el(
        "div.player__timeline",
        this.currentTimeEl,
        this.progressInput,
        this.durationEl,
      ),
    ) as HTMLDivElement;

    this.volumeBtn = el(
      "button.volume__btn",
      {
        type: "button",
        "aria-label": "Включить или выключить звук",
      },
      makeIcon("volume__icon", 24, 24, "sprite.svg#volume-icon"),
    ) as HTMLButtonElement;

    this.renderLoudStae();

    this.volumeInput = el("input.volume__input", {
      type: "range",
      min: 0,
      max: 1,
      step: 0.01,
      value: this.audio.volume,
      "aria-label": "Громкость",
    }) as HTMLInputElement;

    this.volumeEl = el(
      "div.footer__volume.volume",
      this.volumeBtn,
      this.volumeInput,
    ) as HTMLDivElement;

    this.artistBlock = new Artist("", "", "", true);
    this.artistBlock.disabled();

    this.el = el(
      "footer.footer",
      el(
        "div.container",
        el(
          "div.footer__content",
          this.artistBlock,
          this.playerEl,
          this.volumeEl,
        ),
      ),
    );

    this.bindEvents();
    this.bindKeyboardEvents();
    this.renderPlayState();
    this.renderFavoriteState();
    this.renderShuffleState();
    this.renderRepeatState();
    this.updateRangeProgress(this.progressInput);
    this.updateRangeProgress(this.volumeInput);

    this.audio.addEventListener("ended", () => {
      const nextIndex = this.getNextIndex();

      if (nextIndex === null) {
        this.isPlaying = false;
        this.progressInput.value = "100";
        this.updateRangeProgress(this.progressInput);
        this.renderPlayState();
        return;
      }

      const nextTrack = this.playlist[nextIndex];
      this.loadTrack(nextTrack, this.playlist, nextIndex);
      this.play();
    });
  }

  private updateRangeProgress(input: HTMLInputElement) {
    const min = Number(input.min) || 0;
    const max = Number(input.max) || 100;
    const value = Number(input.value) || 0;
    const percent = ((value - min) / (max - min)) * 100;

    input.style.setProperty("--progress", `${percent}%`);
  }

  private bindEvents() {
    this.playBtn.addEventListener("click", () => {
      if (!this.currentTrack) {
        const firstTrack = this.playlist[0];

        if (!firstTrack) {
          return;
        }

        this.loadTrack(firstTrack, this.playlist, 0);
        this.play();
        return;
      }

      if (this.audio.paused) {
        const state = this.audio.play();
        state.catch((error) => {
          console.error("Player:", error);
        });
      } else {
        this.audio.pause();
      }
    });

    this.nextBtn.addEventListener("click", () => {
      this.next();
    });

    this.prevBtn.addEventListener("click", () => {
      this.prev();
    });

    this.artistBlock.favoriteBtn.addEventListener("click", () => {
      void this.handleFavoriteClick();
    });

    this.progressInput.addEventListener("input", () => {
      this.updateRangeProgress(this.progressInput);

      if (!Number.isFinite(this.audio.duration) || this.audio.duration <= 0)
        return;

      const percent = Number(this.progressInput.value);
      this.audio.currentTime = (this.audio.duration * percent) / 100;
    });

    this.volumeInput.addEventListener("input", () => {
      const value = Number(this.volumeInput.value);
      this.audio.volume = value;
      this.audio.muted = value === 0;
      this.updateRangeProgress(this.volumeInput);
    });

    this.volumeBtn.addEventListener("click", () => {
      this.audio.muted = !this.audio.muted;

      if (this.audio.muted) {
        this.volumeInput.value = "0";
      } else if (Number(this.volumeInput.value) === 0) {
        this.audio.volume = 0.7;
        this.volumeInput.value = "0.7";
        this.audio.muted = false;
      } else {
        this.volumeInput.value = String(this.audio.volume);
      }
    });

    this.audio.addEventListener("play", () => {
      this.isPlaying = true;
      this.renderPlayState();
    });

    this.audio.addEventListener("pause", () => {
      this.isPlaying = false;
      this.renderPlayState();
    });

    this.audio.addEventListener("loadedmetadata", () => {
      this.durationEl.textContent = this.formatTime(this.audio.duration);
      this.progressInput.value = "0";
      this.currentTimeEl.textContent = "0:00";
      this.updateRangeProgress(this.progressInput);
    });

    this.audio.addEventListener("timeupdate", () => {
      const { currentTime, duration } = this.audio;
      this.currentTimeEl.textContent = this.formatTime(currentTime);

      if (Number.isFinite(duration) && duration > 0) {
        const progress = (currentTime / duration) * 100;
        this.progressInput.value = String(progress);
        this.updateRangeProgress(this.progressInput);
      }
    });

    this.audio.addEventListener("volumechange", () => {
      if (this.audio.muted) {
        this.volumeInput.value = "0";
        this.renderLoudStae();
      } else {
        this.volumeInput.value = String(this.audio.volume);
        this.renderLoudStae();
      }

      this.updateRangeProgress(this.volumeInput);
    });

    this.shuffleBtn.addEventListener("click", () => {
      this.toggleShuffle();
    });

    this.repeatBtn.addEventListener("click", () => {
      this.toggleRepeatAll();
    });
  }

  private bindKeyboardEvents() {
    window.addEventListener("keydown", (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName;

      const isTyping =
        tag === "INPUT" || tag === "TEXTAREA" || target?.isContentEditable;

      if (isTyping) return;

      switch (event.code) {
        case "Space": {
          event.preventDefault();

          if (!this.currentTrack) {
            const firstTrack = this.playlist[0];
            if (!firstTrack) return;

            this.loadTrack(firstTrack, this.playlist, 0);
            this.play();
            return;
          }

          if (this.audio.paused) {
            void this.audio.play();
          } else {
            this.audio.pause();
          }
          break;
        }

        case "ArrowRight": {
          event.preventDefault();
          if (!Number.isFinite(this.audio.duration) || this.audio.duration <= 0)
            return;

          this.audio.currentTime = Math.min(
            this.audio.currentTime + 10,
            this.audio.duration,
          );

          const progress = (this.audio.currentTime / this.audio.duration) * 100;
          this.progressInput.value = String(progress);
          this.currentTimeEl.textContent = this.formatTime(
            this.audio.currentTime,
          );
          this.updateRangeProgress(this.progressInput);
          break;
        }

        case "ArrowLeft": {
          event.preventDefault();
          if (!Number.isFinite(this.audio.duration) || this.audio.duration <= 0)
            return;

          this.audio.currentTime = Math.max(this.audio.currentTime - 10, 0);

          const progress = (this.audio.currentTime / this.audio.duration) * 100;
          this.progressInput.value = String(progress);
          this.currentTimeEl.textContent = this.formatTime(
            this.audio.currentTime,
          );
          this.updateRangeProgress(this.progressInput);
          break;
        }

        case "ArrowUp": {
          event.preventDefault();

          const newVolume = Math.min(
            this.audio.muted ? 0.1 : this.audio.volume + 0.1,
            1,
          );
          this.audio.muted = false;
          this.audio.volume = Number(newVolume.toFixed(2));
          this.volumeInput.value = String(this.audio.volume);
          this.updateRangeProgress(this.volumeInput);
          break;
        }

        case "ArrowDown": {
          event.preventDefault();

          const newVolume = Math.max(this.audio.volume - 0.1, 0);
          this.audio.volume = Number(newVolume.toFixed(2));
          this.audio.muted = newVolume === 0;
          this.volumeInput.value = String(newVolume);
          this.updateRangeProgress(this.volumeInput);
          break;
        }
      }
    });
  }

  private renderShuffleState() {
    this.shuffleBtn.setAttribute(
      "aria-label",
      this.isShuffle
        ? "Выключить режим проигрывания плейлиста по кругу"
        : "Включить режим проигрывания плейлиста по кругу",
    );

    this.shuffleBtn.innerHTML = "";

    const icon = makeIcon(
      this.isShuffle
        ? "player__icon player__icon--action player__icon--enable"
        : "player__icon player__icon--action",
      16,
      16,
      "sprite.svg#shuffle-icon",
    );

    this.shuffleBtn.append(icon);
  }

  private renderRepeatState() {
    this.repeatBtn.setAttribute(
      "aria-label",
      this.isRepeatAll
        ? "Выключить режим перемешивания"
        : "Включить режим перемешивания",
    );

    this.repeatBtn.innerHTML = "";

    const icon = makeIcon(
      this.isRepeatAll
        ? "player__icon player__icon--action player__icon--enable"
        : "player__icon player__icon--action",
      16,
      16,
      "sprite.svg#repeat-icon",
    );

    this.repeatBtn.append(icon);
  }

  private async handleFavoriteClick(): Promise<void> {
    if (!this.currentTrack || this.isFavoriteLoading) return;

    const token = await this.authManager.getToken();

    if (token === null) {
      Router.goAuth();
      return;
    }

    this.isFavoriteLoading = true;
    this.artistBlock.favoriteBtn.disabled = true;

    const prevIsFavorite = this.currentTrack.isFavorite;

    try {
      if (this.currentTrack.isFavorite) {
        await this.backend.removeFavorite(token, Number(this.currentTrack.id));
        this.currentTrack.isFavorite = false;
      } else {
        await this.backend.addFavorite(token, Number(this.currentTrack.id));
        this.currentTrack.isFavorite = true;
      }

      this.isFavorite = Boolean(this.currentTrack.isFavorite);
      this.renderFavoriteState();
      this.onFavoriteToggle?.(this.currentTrack);
    } catch (error) {
      this.currentTrack.isFavorite = prevIsFavorite;
      this.isFavorite = Boolean(this.currentTrack.isFavorite);
      this.renderFavoriteState();
      console.error("Ошибка при изменении избранного:", error);
    } finally {
      this.isFavoriteLoading = false;
      this.artistBlock.favoriteBtn.disabled = false;
    }
  }

  private renderLoudStae() {
    this.volumeBtn.setAttribute(
      "aria-label",
      this.audio.muted ? "Включить звук" : "Выключить звук",
    );

    this.volumeBtn.innerHTML = "";

    const icon = this.audio.muted
      ? makeIcon(
          "volume__icon volume__icon--mute",
          16,
          16,
          "sprite.svg#volume-mute-icon",
        )
      : makeIcon("volume__icon", 16, 16, "sprite.svg#volume-icon");

    this.volumeBtn.append(icon);
  }

  private renderPlayState() {
    this.playBtn.setAttribute(
      "aria-label",
      this.isPlaying ? "Пауза" : "Воспроизвести",
    );

    this.playBtn.innerHTML = "";

    const icon = this.isPlaying
      ? makeIcon(
          "player__icon player__icon--play",
          32,
          32,
          "sprite.svg#pause-icon",
        )
      : makeIcon(
          "player__icon player__icon--pause",
          32,
          32,
          "sprite.svg#play-icon",
        );

    this.playBtn.append(icon);
    this.nextIcon.classList.value = this.isPlaying
      ? "player__icon player__icon--action player__icon--enable"
      : "player__icon player__icon--action";
    this.prevIcon.classList.value = this.isPlaying
      ? "player__icon player__icon--action player__icon--enable"
      : "player__icon player__icon--action";
    this.el.classList.toggle("is-playing", this.isPlaying);
  }

  private renderFavoriteState() {
    this.artistBlock.favoriteBtn.classList.toggle(
      "is-favorite",
      this.isFavorite,
    );
    this.artistBlock.favoriteBtn.setAttribute(
      "aria-label",
      this.isFavorite ? "Убрать из избранного" : "Добавить в избранное",
    );

    this.artistBlock.favoriteIcon.classList.toggle(
      "like--enable",
      this.isFavorite,
    );
  }

  private formatTime(time: number) {
    if (!Number.isFinite(time) || time < 0) return "0:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  }

  private base64ToAudioUrl(base64: string, mimeType = "audio/mpeg") {
    const cleanBase64 = base64.includes(",") ? base64.split(",")[1] : base64;

    const byteString = atob(cleanBase64);
    const bytes = new Uint8Array(byteString.length);

    for (let i = 0; i < byteString.length; i++) {
      bytes[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([bytes], { type: mimeType });
    return URL.createObjectURL(blob);
  }

  private ensureShuffleOrder(): void {
    if (
      !this.shuffledOrder.length ||
      this.shuffledOrder.length !== this.playlist.length
    ) {
      this.rebuildShuffleOrder();
      return;
    }

    this.syncShufflePointer();
  }

  public loadTrack(track: Track, playlist?: Track[], index?: number): void {
    if (playlist) {
      this.playlist = playlist;
    }

    if (typeof index === "number") {
      this.currentIndex = index;
    } else {
      this.currentIndex = this.playlist.findIndex(
        (item) => Number(item.id) === Number(track.id),
      );
    }

    this.currentTrack = track;
    this.isFavorite = Boolean(track.isFavorite);

    if (this.isShuffle) {
      this.ensureShuffleOrder();
    }

    this.onTrackChange?.(track);
    this.applyTrack(track);
  }

  private renderPlaybackModes(): void {
    this.shuffleBtn.classList.toggle("is-active", this.isShuffle);
    this.repeatBtn.classList.toggle("is-active", this.isRepeatAll);
  }

  private applyTrack(track: Track): void {
    this.artistBlock.titleEl.textContent = track.title;
    this.artistBlock.artistEl.textContent = track.artist;
    if (track.coverUrl) this.artistBlock.coverImg.src = track.coverUrl;
    this.artistBlock.coverImg.alt = `${track.title} cover`;
    this.renderFavoriteState();

    this.artistBlock.enabled();

    if (this.audioUrl) {
      URL.revokeObjectURL(this.audioUrl);
      this.audioUrl = null;
    }

    this.audio.pause();
    this.audio.currentTime = 0;
    this.progressInput.value = "0";
    this.currentTimeEl.textContent = "0:00";
    this.durationEl.textContent = "0:00";
    this.updateRangeProgress(this.progressInput);

    this.audioUrl = this.base64ToAudioUrl(
      track.encoded_audio,
      track.audioMimeType || "audio/mpeg",
    );

    this.audio.src = this.audioUrl;
    this.audio.load();
  }

  play() {
    if (!this.audio.src) return;
    void this.audio.play();
  }

  pause() {
    this.audio.pause();
  }

  toggle() {
    if (!this.audio.src) return;

    if (this.audio.paused) {
      void this.audio.play();
    } else {
      this.audio.pause();
    }
  }

  destroy() {
    this.audio.pause();

    if (this.audioUrl) {
      URL.revokeObjectURL(this.audioUrl);
      this.audioUrl = null;
    }
  }

  setPlaylist(tracks: Track[]): void {
    this.playlist = tracks;

    if (!tracks.length) {
      this.currentIndex = -1;
      this.shuffledOrder = [];
      this.shuffledPointer = -1;
      return;
    }

    if (this.currentTrack) {
      const nextIndex = tracks.findIndex(
        (item) => Number(item.id) === Number(this.currentTrack?.id),
      );
      this.currentIndex = nextIndex;
    }

    this.rebuildShuffleOrder();
  }

  next(): void {
    const nextIndex = this.getNextIndex();

    if (nextIndex === null) {
      this.pause();
      return;
    }

    const nextTrack = this.playlist[nextIndex];
    this.loadTrack(nextTrack, this.playlist, nextIndex);
    this.play();
  }

  prev(): void {
    const prevIndex = this.getPrevIndex();

    if (prevIndex === null) {
      return;
    }

    const prevTrack = this.playlist[prevIndex];
    this.loadTrack(prevTrack, this.playlist, prevIndex);
    this.play();
  }

  getNextIndex(): number | null {
    if (!this.playlist.length || this.currentIndex < 0) return null;

    if (this.isShuffle) {
      if (!this.shuffledOrder.length) {
        this.rebuildShuffleOrder();
        this.syncShufflePointer();
      }

      const nextPointer = this.shuffledPointer + 1;

      if (nextPointer < this.shuffledOrder.length) {
        return this.shuffledOrder[nextPointer];
      }

      if (!this.isRepeatAll) {
        return null;
      }

      this.rebuildShuffleOrder();
      this.shuffledPointer = 0;
      return this.shuffledOrder[0];
    }

    const nextIndex = this.currentIndex + 1;

    if (nextIndex < this.playlist.length) {
      return nextIndex;
    }

    return this.isRepeatAll ? 0 : null;
  }

  getPrevIndex(): number | null {
    if (!this.playlist.length || this.currentIndex < 0) return null;

    if (this.isShuffle) {
      if (!this.shuffledOrder.length) {
        this.rebuildShuffleOrder();
        this.syncShufflePointer();
      }

      const prevPointer = this.shuffledPointer - 1;

      if (prevPointer >= 0) {
        return this.shuffledOrder[prevPointer];
      }

      if (!this.isRepeatAll) {
        return null;
      }

      this.rebuildShuffleOrder();
      this.shuffledPointer = this.shuffledOrder.length - 1;
      return this.shuffledOrder[this.shuffledPointer];
    }

    const prevIndex = this.currentIndex - 1;

    if (prevIndex >= 0) {
      return prevIndex;
    }

    return this.isRepeatAll ? this.playlist.length - 1 : null;
  }

  rebuildShuffleOrder(): void {
    this.shuffledOrder = this.playlist.map((_, index) => index);

    for (let i = this.shuffledOrder.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.shuffledOrder[i], this.shuffledOrder[j]] = [
        this.shuffledOrder[j],
        this.shuffledOrder[i],
      ];
    }

    this.syncShufflePointer();
  }

  syncShufflePointer(): void {
    this.shuffledPointer = this.shuffledOrder.findIndex(
      (index) => index === this.currentIndex,
    );
  }

  toggleShuffle(): void {
    this.isShuffle = !this.isShuffle;

    if (this.isShuffle) {
      this.rebuildShuffleOrder();
    } else {
      this.shuffledOrder = [];
      this.shuffledPointer = -1;
    }

    this.renderPlaybackModes();
    this.renderShuffleState();
  }

  toggleRepeatAll(): void {
    this.isRepeatAll = !this.isRepeatAll;
    this.renderPlaybackModes();
    this.renderRepeatState();
  }

  updateFavorite(trackId: number, isFavorite: boolean): void {
    if (!this.currentTrack) return;
    if (Number(this.currentTrack.id) !== Number(trackId)) return;

    this.currentTrack.isFavorite = isFavorite;
    this.isFavorite = isFavorite;
    this.renderFavoriteState();
  }
}

export default FooterPlayer;
