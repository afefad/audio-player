import { el, mount } from "redom";
import Header from "../components/header";
import MainSection from "../components/MainSection";
import FooterPlayer from "../components/player";
import AuthManager from "../utils/AuthManager";
import Router from "../app/Router";
import type { Track } from "../types/app/trackType";

export default class FavoritePage {
  el: HTMLElement;
  header: Header;
  mainSection: MainSection;
  player: FooterPlayer;
  authManager: AuthManager;

  constructor() {
    this.authManager = new AuthManager();

    if (!this.authManager.isAuth()) {
      Router.goAuth();
    }

    const username = this.authManager.getUsername();
    const avatar = this.authManager.getAvatar();

    this.header = new Header();
    this.header.setUser(username ? username : "User", avatar);
    this.mainSection = new MainSection("fav");
    this.player = new FooterPlayer();

    this.header.onSearch = (value: string) => {
      this.mainSection.setSearchQuery(value);
    };

    this.mainSection.onTrackSelect = (track: Track) => {
      this.player.loadTrack(track);
    };

    this.el = el("section.favorite-page");

    mount(this.el, this.header);
    mount(this.el, this.mainSection);
    mount(this.el, this.player);
  }
}
