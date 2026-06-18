import { el } from "redom";
import { TrackTable } from "./trackTable";
import type { Track } from "../types/app/trackType";

export default class TracksLayout {
  el: HTMLElement;
  headerEl: HTMLHeadElement;
  trackTableWrapEl: HTMLDivElement;
  trackTableEl: TrackTable;
  tracksContentEl: HTMLDivElement;
  pageType: "main" | "fav";

  onTrackSelect?: (track: Track, tracks: Track[], index: number) => void;
  onFavoriteToggle?: (track: Track) => void;

  constructor(pageType: "main" | "fav", trackList: Track[]) {
    this.pageType = pageType;
    this.headerEl = el("h2.tracks__header") as HTMLHeadElement;

    this.trackTableEl = new TrackTable(trackList);

    this.trackTableEl.onTrackSelect = (
      track: Track,
      tracks: Track[],
      index: number,
    ) => {
      this.onTrackSelect?.(track, tracks, index);
    };

    this.trackTableEl.onFavoriteToggle = (track: Track) => {
      this.onFavoriteToggle?.(track);
    };

    this.trackTableWrapEl = el(
      "div.tracks__wrapper",
      this.trackTableEl,
    ) as HTMLDivElement;

    this.headerEl.textContent = "Аудифайлы и треки";

    this.tracksContentEl = el(
      "div.tracks__content",
      this.headerEl,
      this.trackTableWrapEl,
    ) as HTMLDivElement;

    this.el = el("div.container", this.tracksContentEl) as HTMLElement;

    this.renderHeader(this.pageType);
  }

  setPage(pageType: "main" | "fav", trackList: Track[]): void {
    this.pageType = pageType;

    this.trackTableEl.updateTracks(trackList);
  }

  renderHeader(pageType: "main" | "fav"): void {
    this.headerEl.textContent =
      pageType === "fav" ? "Избранные аудифайлы и треки" : "Аудифайлы и треки";
  }

  updateTracks(trackList: Track[]): void {
    this.trackTableEl.updateTracks(trackList);
  }

  setPlayingTrack(trackId: number | null): void {
    this.trackTableEl.setPlayingTrack(trackId);
  }

  updateTrackFavorite(trackId: number, isFavorite: boolean): void {
    this.trackTableEl.updateTrackFavorite(trackId, isFavorite);
  }
}
