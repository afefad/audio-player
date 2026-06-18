import { el, mount } from "redom";
import Header from "../components/header";
import MainSection from "../components/MainSection";
import FooterPlayer from "../components/player";
import AuthManager from "../utils/AuthManager";
import Router from "../app/Router";
import type { Track } from "../types/app/trackType";

export default class MainPage {
  el: HTMLElement;
  header: Header;
  mainSection: MainSection;
  player: FooterPlayer;
  authManager: AuthManager;
  currentPageType: "main" | "fav"

  constructor() {
    this.authManager = new AuthManager();

    if (!this.authManager.isAuth()) {
      Router.goAuth();
    }

    const username = this.authManager.getUsername();
    const avatar = this.authManager.getAvatar();

    this.header = new Header();
    this.header.setUser(username ? username : "User", avatar);
    this.mainSection = new MainSection("main");
    this.player = new FooterPlayer();

    this.currentPageType = this.mainSection.currentPageType

    this.header.onSearch = (value: string) => {
      this.mainSection.setSearchQuery(value);
    };

    this.mainSection.onTracksLoaded = (tracks: Track[]) => {
      this.player.setPlaylist(tracks);
    };

    this.mainSection.onFavoriteToggle = (track) => {
      this.player.updateFavorite(
        Number(track.id),
        Boolean(track.isFavorite),
      )
      this.mainSection.updateTrackFavorite(
        Number(track.id),
        Boolean(track.isFavorite),
      )
    }

    this.mainSection.onTrackSelect = (
      track: Track,
      tracks: Track[],
      index: number,
    ) => {
      this.player.loadTrack(track, tracks, index);
      this.player.play();
    };

    this.player.onTrackChange = (track: Track) => {
      this.mainSection.setPlayingTrack(Number(track.id));
    };

    this.el = el("section.main-page");

    mount(this.el, this.header);
    mount(this.el, this.mainSection);
    mount(this.el, this.player);

    this.player.onFavoriteToggle = (track) => {
      this.mainSection.updateTrackFavorite(
        Number(track.id),
        Boolean(track.isFavorite),
      )
    }
  }



}
