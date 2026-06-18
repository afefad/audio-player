import { el } from "redom";
import { sanitizeText, sanitizeImageUrl } from "../utils/htmlSanitizer";
import makeIcon from "../utils/MakeIcon";

export default class Artist {
  el: HTMLDivElement;
  coverImg: HTMLImageElement;
  titleEl: HTMLSpanElement;
  artistEl: HTMLSpanElement;
  favoriteBtn: HTMLButtonElement;
  favoriteIcon: SVGElement;

  constructor(
    title: string,
    artistName: string,
    cover?: string,
    favVisible?: boolean,
  ) {
    this.coverImg = el("img.artist__img", {
      src: sanitizeImageUrl(cover? cover : 'images/cover-example.jpg'),
      width: 60,
      height: 60,
      alt: "Track cover",
    }) as HTMLImageElement;

    this.titleEl = el("span.artist__title", "#") as HTMLSpanElement;
    this.artistEl = el("span.artist__name", "#") as HTMLSpanElement;

    this.titleEl.textContent = sanitizeText(title);
    this.artistEl.textContent = sanitizeText(artistName);

    this.favoriteIcon = makeIcon(
      "artist__fav.like",
      16,
      16,
      "sprite.svg#fav-icon",
    );

    this.favoriteBtn = el(
      "button.artist__fav-btn",
      {
        type: "button",
        "aria-label": "Добавить в избранное",
      },
      this.favoriteIcon,
    ) as HTMLButtonElement;

    this.el = el(
      "div.footer__artist.artist",
      el("div.artist__img-wrap", this.coverImg),
      el(
        "div.artist__description",
        el("div.artist__title-wrap", this.titleEl, favVisible? this.favoriteBtn : ''),
        this.artistEl,
      ),
    ) as HTMLDivElement;
  }

  enabled() {
    this.el.classList.remove("artist--disabled");
  }

  disabled() {
    this.el.classList.add("artist--disabled");
  }
}
