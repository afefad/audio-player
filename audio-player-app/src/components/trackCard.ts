import { el } from "redom";
import Artist from "./artist";
import makeIcon from "../utils/MakeIcon";
import normalizeDuration from "../utils/durationNormalizer";
import DummyBackend from "../api/DummyBackend";
import AuthManager from "../utils/AuthManager";

import type { Track } from "../types/app/trackType";

export class TrackCard {
  el: HTMLDivElement;
  idEl: HTMLSpanElement;
  artistEl: Artist;
  albumEl: HTMLSpanElement;
  calendarEl: HTMLDivElement;
  durationEl: HTMLDivElement;

  likeBtn: HTMLButtonElement;
  likeIcon: SVGElement;

  calendarReleaseEl: HTMLSpanElement;

  durationTimeEl: HTMLSpanElement;
  durationMoreEl: HTMLSpanElement;
  durationMoreIcon: SVGElement;

  private track: Track;
  private backend: DummyBackend;
  private token: string | null;
  private isLikeLoading: boolean;
  private authManager: AuthManager

  onSelect?: (track: Track) => void;

  constructor(track: Track) {
    this.track = track;
    this.authManager = new AuthManager()
    this.token = this.authManager.getToken();
    this.backend = new DummyBackend();
    this.isLikeLoading = false;

    this.idEl = el("span.track-card__id", track.id) as HTMLSpanElement;

    this.track.isFavorite = this.track.isFavorite ? this.track.isFavorite : false

    this.artistEl = new Artist(
      track.title,
      track.artist,
      track.coverUrl ? track.coverUrl : "images/example.png"
    ) as Artist;

    this.albumEl = el(
      "span.track-card__album",
      track.album ? track.album : "-"
    ) as HTMLSpanElement;

    this.calendarReleaseEl = el(
      "span.track-card__release-date",
      track.releaseDate ? track.releaseDate : "-"
    ) as HTMLSpanElement;

    this.likeIcon = makeIcon(
      "track-card__fav-icon like",
      16,
      16,
      "sprite.svg#fav-icon"
    ) as SVGElement;

    this.likeBtn = el(
      "button.track-card__fav-btn",
      {
        type: "button",
        "aria-label": "Добавить в избранное",
      },
      this.likeIcon
    ) as HTMLButtonElement;

    this.calendarEl = el(
      "span.track-card__calendar",
      this.calendarReleaseEl,
      this.likeBtn
    ) as HTMLDivElement;

    this.durationTimeEl = el(
      "span.track-card__duration-time",
      track.duration ? normalizeDuration(track.duration) : "0:00"
    ) as HTMLSpanElement;

    this.durationMoreIcon = makeIcon(
      "track-card__more-icon",
      23,
      23,
      "sprite.svg#more-icon"
    ) as SVGElement;

    this.durationMoreEl = el(
      "span.track-card__more",
      this.durationMoreIcon
    ) as HTMLSpanElement;

    this.durationEl = el(
      "div.track-card__duration",
      this.durationTimeEl,
      this.durationMoreEl
    ) as HTMLDivElement;

    this.el = el(
      "div.track-card",
      this.idEl,
      this.artistEl,
      this.albumEl,
      this.calendarEl,
      this.durationEl
    ) as HTMLDivElement;

    this.el.dataset.trackId = String(track.id);

    this.el.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;

      if (target.closest(".track-card__fav-btn") || target.closest(".track-card__more")) {
        return;
      }

      this.onSelect?.(this.track);
    });

    this.renderLikeState();
    this.bindEvents();
  }

  private bindEvents(): void {
    this.likeBtn.addEventListener("click", () => {
      void this.handleLikeClick();
    });
  }

  private renderLikeState(): void {
    this.likeIcon.classList.toggle("like--enable", this.track.isFavorite);
    this.likeBtn.setAttribute(
      "aria-label",
      this.track.isFavorite ? "Убрать из избранного" : "Добавить в избранное"
    );
    this.likeBtn.disabled = this.isLikeLoading;
  }

  private async handleLikeClick(): Promise<void> {
    if (this.isLikeLoading || !this.token) {
      return;
    }

    this.isLikeLoading = true;
    this.renderLikeState();

    const prevIsFavorite = this.track.isFavorite;

    try {
      if (this.track.isFavorite) {
        await this.backend.removeFavorite(this.token, this.track.id);
        this.track.isFavorite = false;
      } else {
        await this.backend.addFavorite(this.token, this.track.id);
        this.track.isFavorite = true;
      }

      this.renderLikeState();
    } catch (error) {
      this.track.isFavorite = prevIsFavorite;
      this.renderLikeState();
      console.error("Ошибка при изменении избранного:", error);
    } finally {
      this.isLikeLoading = false;
      this.renderLikeState();
    }
  }

  public setToken(token: string | null): void {
    this.token = token;
  }

  public updateTrack(track: Track): void {
    this.track = track;
    this.renderLikeState();
  }
}