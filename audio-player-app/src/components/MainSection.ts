import { el, mount } from 'redom'
import Navigation from './navigation'
import TracksLayout from './tracksLayout'
import type { Track } from '../types/app/trackType'
import DummyBackend from '../api/DummyBackend'
import AuthManager from '../utils/AuthManager'
import Router from '../app/Router'

class MainSection {
  el: HTMLElement
  navEl: Navigation
  tracksWrap: HTMLElement

  private allTracks: Track[] = []
  private searchQuery = ''
  private tracksLayout: TracksLayout | null = null

  onTrackSelect?: (track: Track) => void;

  public setSearchQuery(value: string): void {
    this.searchQuery = value.trim().toLowerCase()
    this.renderFilteredTracks()
  }

  private renderFilteredTracks(): void {
    if (!this.tracksLayout) return

    const filtered = this.allTracks.filter((track) => {
      return (
        track.title.toLowerCase().includes(this.searchQuery) ||
        track.artist.toLowerCase().includes(this.searchQuery) ||
        (track.album ?? '').toLowerCase().includes(this.searchQuery)
      )
    })

    this.tracksLayout.updateTracks(filtered)
  }

  constructor(pageType: string) {
    this.navEl = new Navigation()
    this.navEl.setCurrentPage(pageType)
    this.el = el(
      'main.main'
    )
    mount(this.el, this.navEl)

    this.tracksWrap = el(
      'div.tracks',
      {id: 'tracks'},
    ) as HTMLElement

    mount(this.el, this.tracksWrap)

    try {
      const api = new DummyBackend()
      const authManager = new AuthManager()
      const token = authManager.getToken()
      if (!token || typeof(token) !== 'string') {
        Router.goAuth()
      }


      const trackList = pageType === 'fav' ?
          api.getFavorites(String(token))
        : api.getTracks(String(token))

      trackList
        .then((data: Track[]) => {
          this.allTracks = data
          this.tracksLayout = new TracksLayout(pageType, data)
          this.tracksLayout.onTrackSelect = (track: Track) => {
            this.onTrackSelect?.(track);
          };
          mount(this.tracksWrap, this.tracksLayout)
        })
        .catch((error) => {
          let errorText = "Something went wrong, please try again later.";
          if (error instanceof Error) {
            errorText = error.message;
          }
          const tracksLayuout = el('div.tracks', errorText)
          mount(this.tracksWrap, tracksLayuout)
        })
    } catch (error) {
      let errorText = "Something went wrong, please try again later.";

      if (error instanceof Error) {
        errorText = error.message;
      }

      const tracksLayuout = el('div.tracks', errorText)
      mount(this.tracksWrap, tracksLayuout)
    }
  }
}

export default MainSection