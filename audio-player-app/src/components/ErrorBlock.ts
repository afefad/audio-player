import { el } from "redom";

export default class ErrorBlock {

  el: HTMLElement
  errorWrapper: HTMLDivElement

  
  constructor(statusCode: number, error: string) {

    this.errorWrapper = el(
      'div.error-block__wrapper',
      el('div.error-block__header',
        el('span.error-block__status-code'),
        statusCode
      ),
      el('div.error-block__content',
        el('span.error-block__text',
          error
        )
      )
    ) as HTMLDivElement

    this.el = el('div.error-block',
      this.errorWrapper
    )
  }
}