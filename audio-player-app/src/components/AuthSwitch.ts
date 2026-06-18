import { el } from 'redom'
import makeIcon from '../utils/MakeIcon'

type AuthSwitchOptions = {
  questionText: string
  buttonText: string
  onClick: () => void
}

export default class AuthSwitch {
  public el: HTMLDivElement

  private chevronIcon: SVGElement

  constructor(options: AuthSwitchOptions) {
    const { questionText, buttonText, onClick } = options

    this.chevronIcon = makeIcon(
      'auth-switch__icon', 
      16, 16, 
      'sprite.svg#chevron-right-icon',
      {'id': 'chevron-right-id',}
    ) as SVGElement

    const text = el('span.auth-switch__text', questionText)
    const arrow = el('span.auth-switch__arrow', this.chevronIcon)
    const button = el(
      'button.auth-switch__button.btn.btn--auth.btn--auth-second',
      {
        type: 'button',
        onclick: onClick,
      },
      buttonText
    )

    this.el = el(
      'div.auth-switch', 
      text, 
      arrow, 
      button
    ) as HTMLDivElement
  }
}