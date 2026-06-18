import { el } from "redom";
import makeIcon from "../utils/MakeIcon";

class Navigation {
  el: HTMLElement;

  favoritesLink: HTMLAnchorElement;
  tracksLink: HTMLAnchorElement;
  favoritesItem: HTMLElement;
  tracksItem: HTMLElement;

  constructor() {
    this.favoritesLink = el(
      "a.navigation-list__link",
      { href: "#/favorites" },
      makeIcon("navigation-list__icon", 32, 32, "sprite.svg#music-notes-icon"),
      makeIcon(
        "navigation-list__icon-mobile",
        24,
        24,
        "sprite.svg#play-mobile-icon",
      ),
      el("span.navigation-list__link-text", "Избранное"),
    ) as HTMLAnchorElement;

    this.favoritesItem = el(
      "li.navigation-list__item",
      this.favoritesLink,
    ) as HTMLElement;

    this.tracksLink = el(
      "a.navigation-list__link",
      { href: "#/" },
      makeIcon("navigation-list__icon", 32, 32, "sprite.svg#music-notes-icon"),
      makeIcon(
        "navigation-list__icon-mobile",
        24,
        24,
        "sprite.svg#play-mobile-icon",
      ),
      el("span.navigation-list__link-text", "Аудиокомпозиции"),
    ) as HTMLAnchorElement;

    this.tracksItem = el(
      "li.navigation-list__item",
      this.tracksLink,
    ) as HTMLElement;

    this.el = el(
      "aside.navigation",
      el(
        "div.container",
        el(
          "ul.navigation__list.navigation-list",
          this.favoritesItem,
          this.tracksItem,
        ),
      ),
    );
  }

  setCurrentPage(currPage: string) {
    if (currPage == "main") {
      this.tracksItem.classList.add("navigation-list__item--active");
    } else if (currPage == "fav") {
      this.favoritesItem.classList.add("navigation-list__item--active");
    }
  }
}

export default Navigation;
