import { el, mount, setChildren } from "redom";
import type { Track } from "../types/app/trackType";
import { TrackCard } from "./trackCard";
import makeIcon from "../utils/MakeIcon";

export class TrackTable {
  el: HTMLElement;
  tableHeaderEl: HTMLDivElement;
  tracksBodyEl: HTMLDivElement;

  idEl: HTMLSpanElement;
  titleEl: HTMLSpanElement;
  albumEl: HTMLSpanElement;
  calendarEl: HTMLSpanElement;
  calendarIcon: SVGElement;
  durationEl: HTMLSpanElement;
  durationIcon: SVGElement;

  private trackList: Track[] = [];

  onTrackSelect?: (track: Track) => void;

  constructor(trackList: Track[]) {
    this.idEl = el("span.track-table__id", "№") as HTMLSpanElement;
    this.titleEl = el("span.track-table__title", "Название") as HTMLSpanElement;
    this.albumEl = el("span.track-table__album", "Альбом") as HTMLSpanElement;
    this.calendarEl = el("span.track-table__calendar") as HTMLSpanElement;
    this.durationEl = el("span.track-table__duration") as HTMLSpanElement;

    this.calendarIcon = makeIcon(
      "track-table__icon",
      16,
      16,
      "sprite.svg#calendar-icon"
    ) as SVGElement;

    this.durationIcon = makeIcon(
      "track-table__icon",
      16,
      16,
      "sprite.svg#duration-icon"
    ) as SVGElement;

    mount(this.calendarEl, this.calendarIcon);
    mount(this.durationEl, this.durationIcon);

    this.tableHeaderEl = el(
      "div.track-table__header",
      this.idEl,
      this.titleEl,
      this.albumEl,
      this.calendarEl,
      this.durationEl
    ) as HTMLDivElement;

    this.tracksBodyEl = el("div.track-table__body") as HTMLDivElement;

    this.el = el(
      "div.track-table",
      this.tableHeaderEl,
      this.tracksBodyEl
    ) as HTMLElement;

    this.updateTracks(trackList);
  }

  public updateTracks(trackList: Track[]): void {
    this.trackList = trackList;

    const trackCards = this.trackList.map((track) => {
      const card = new TrackCard(track);
      card.onSelect = (selectedTrack: Track) => {
        this.onTrackSelect?.(selectedTrack);
      };
      return card;
    });

    if (trackCards.length === 0) {
      setChildren(this.tracksBodyEl, [
        el("div.track-table__empty", "Ничего не найдено"),
      ]);
      return;
    }

    setChildren(this.tracksBodyEl, trackCards);
  }
}