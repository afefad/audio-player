import { el, mount } from "redom";
import Navigation from "./navigation";
import TracksLayout from "./tracksLayout";
import type { Track } from "../types/app/trackType";
import DummyBackend from "../api/DummyBackend";
import AuthManager from "../utils/AuthManager";
import Router from "../app/Router";
import ErrorBlock from "./ErrorBlock";
import HttpError from "./Error";

class MainSection {
  el: HTMLElement;
  navEl: Navigation;
  tracksWrap: HTMLElement;

  allTracks: Track[] = [];
  searchQuery = "";
  tracksLayout: TracksLayout | null = null;
  
  readonly chunkSize = 10;
  visibleCount = 9;
  observer: IntersectionObserver | null = null;
  filteredTracks: Track[] = [];

  onTrackSelect?: (track: Track, tracks: Track[], index: number) => void;
  onTracksLoaded?: (tracks: Track[]) => void;

  constructor(pageType: string) {
    this.navEl = new Navigation();
    this.navEl.setCurrentPage(pageType);
    this.el = el("main.main");
    mount(this.el, this.navEl);

    this.tracksWrap = el("div.tracks", { id: "tracks" }) as HTMLElement;

    mount(this.el, this.tracksWrap);

    try {
      const api = new DummyBackend();
      const authManager = new AuthManager();
      const token = authManager.getToken();
      if (!token || typeof token !== "string") {
        Router.goAuth();
      }

      const trackList =
        pageType === "fav"
          ? api.getFavorites(String(token))
          : api.getTracks(String(token));

      trackList
        .then((data: Track[]) => {
          this.allTracks = data;
          this.filteredTracks = data;
          this.onTracksLoaded?.(data);
          this.visibleCount = this.chunkSize;

          this.tracksLayout = new TracksLayout(pageType, []);
          this.tracksLayout.onTrackSelect = (track: Track) => {
            const index = this.filteredTracks.findIndex(
              (item) => Number(item.id) === Number(track.id),
            );

            this.onTrackSelect?.(track, this.filteredTracks, index);
          };

          mount(this.tracksWrap, this.tracksLayout);

          this.renderFilteredTracks();
          this.initLazyObserver();
        })
        .catch((error) => {
          let errorText = "Something went wrong, please try again later.";
          let errorCode = 500;

          if (error instanceof HttpError) {
            errorText = error.message;
            errorCode = error.statusCode;
            const errorBlock = new ErrorBlock(errorCode, errorText);
            mount(this.tracksWrap, errorBlock);
          } else if (error instanceof Error) {
            errorText = error.message;
            this.tracksWrap.textContent = errorText;
          } else {
            this.tracksWrap.textContent = errorText;
          }
        });
    } catch (error) {
      let errorText = "Something went wrong, please try again later.";
      let errorCode = 500;
      const tracksLayuout = el("div.tracks2");

      if (error instanceof HttpError) {
        errorText = error.message;
        errorCode = error.statusCode;
        const errorBlock = new ErrorBlock(errorCode, errorText);
        mount(this.tracksWrap, errorBlock);
      } else if (error instanceof Error) {
        errorText = error.message;
        this.tracksWrap.textContent = errorText;
      } else {
        this.tracksWrap.textContent = errorText;
      }

      mount(this.tracksWrap, tracksLayuout);
    }
  }

  private getFilteredTracks(): Track[] {
    return this.allTracks.filter((track) => {
      return (
        track.title.toLowerCase().includes(this.searchQuery) ||
        track.artist.toLowerCase().includes(this.searchQuery) ||
        (track.album ?? "").toLowerCase().includes(this.searchQuery)
      );
    });
  }

  private observeSentinel(): void {
    if (!this.observer || !this.tracksLayout) return;

    const sentinel = this.tracksLayout.trackTableEl.sentinelEl;
    this.observer.disconnect();
    this.observer.observe(sentinel);
  }

  private renderFilteredTracks(): void {
    if (!this.tracksLayout) return;

    this.filteredTracks = this.getFilteredTracks();

    const visibleTracks = this.filteredTracks.slice(0, this.visibleCount);
    this.tracksLayout.updateTracks(visibleTracks);
    this.observeSentinel();
  }

  private initLazyObserver(): void {
    if (!this.tracksLayout) return;

    const scrollRoot = this.tracksLayout.trackTableEl.tracksBodyEl;
    const sentinel = this.tracksLayout.trackTableEl.sentinelEl;

    if (!scrollRoot || !sentinel) return;

    if (this.observer) {
      this.observer.disconnect();
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (!entry?.isIntersecting) {
          return;
        }

        if (this.visibleCount >= this.filteredTracks.length) {
          this.observer?.unobserve(sentinel);
          sentinel.style.display = "none";
          return;
        }

        this.visibleCount += this.chunkSize;
        this.renderFilteredTracks();

        if (this.visibleCount >= this.filteredTracks.length) {
          this.observer?.unobserve(sentinel);
          sentinel.style.display = "none";
        }
      },
      {
        root: scrollRoot,
        rootMargin: "200px 0px",
        threshold: 0,
      },
    );

    sentinel.style.display = "";
    this.observer.observe(sentinel);
  }

  setSearchQuery(value: string): void {
    this.searchQuery = value.trim().toLowerCase();
    this.visibleCount = this.chunkSize;
    this.renderFilteredTracks();
  }

  setPlayingTrack(trackId: number | null): void {
    this.tracksLayout?.setPlayingTrack(trackId);
  }
}

export default MainSection;
