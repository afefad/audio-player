import { el } from "redom"
import { sanitizeText, sanitizeImageUrl } from "../utils/htmlSanitizer"

export default class Artist {
  el: HTMLElement
  coverImg: HTMLImageElement
  titleEl: HTMLSpanElement
  artistEl: HTMLSpanElement

  constructor(title: string, artistName: string, cover: string) {
    this.coverImg = el('img.artist__img', {
      src: sanitizeImageUrl(cover),
      width: 60,
      height: 60,
      alt: 'Track cover',
    }) as HTMLImageElement


    this.titleEl = el('span.artist__title', '#') as HTMLSpanElement
    this.artistEl = el('span.artist__name', '#') as HTMLSpanElement

    this.titleEl.textContent = sanitizeText(title)
    this.artistEl.textContent = sanitizeText(artistName)


    this.el = el(
      'div.artist',
      el(
        'div.artist__img-wrap',
        this.coverImg
      ),
      el(
        'div.artist__description',
        el(
          'div.artist__title-wrap',
          this.titleEl,
        ),
        this.artistEl
      )
    )
  }




}

