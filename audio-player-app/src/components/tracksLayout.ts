import { el } from "redom";
import { TrackTable } from "./trackTable";
import type { Track } from "../types/app/trackType";

export default class TracksLayout {
  el: HTMLElement;
  headerEl: HTMLHeadElement;
  trackTableWrapEl: HTMLDivElement;
  trackTableEl: TrackTable;
  tracksContentEl: HTMLDivElement;

  onTrackSelect?: (track: Track, tracks: Track[], index: number) => void;

  constructor(pageType: string, trackList: Track[]) {
    this.headerEl = el("h2.tracks__header") as HTMLHeadElement;

    const isFavorites = pageType === "fav";

    this.trackTableEl = new TrackTable(trackList);

    this.trackTableEl.onTrackSelect = (
      track: Track,
      tracks: Track[],
      index: number,
    ) => {
      this.onTrackSelect?.(track, tracks, index);
    };

    this.trackTableWrapEl = el(
      "div.tracks__wrapper",
      this.trackTableEl,
    ) as HTMLDivElement;

    this.headerEl.textContent = isFavorites
      ? "Избранные аудифайлы и треки"
      : "Аудифайлы и треки";

    this.tracksContentEl = el(
      "div.tracks__content",
      this.headerEl,
      this.trackTableWrapEl,
    ) as HTMLDivElement;

    this.el = el("div.container", this.tracksContentEl) as HTMLElement;
  }

  updateTracks(trackList: Track[]): void {
    this.trackTableEl.updateTracks(trackList);
  }

  setPlayingTrack(trackId: number | null): void {
    this.trackTableEl.setPlayingTrack(trackId);
  }
}
