import { el } from 'redom'
import makeIcon from '../utils/MakeIcon'

export default class RegistrationLogo {
  public el: HTMLElement
  private logoIcon: SVGElement

  constructor() {
    this.logoIcon = makeIcon(
      'logo__icon', 
      153, 
      30, 
      'sprite.svg#reg-icon'
    ) as SVGElement

    this.el = el(
      'div.logo',
      this.logoIcon
    ) as HTMLDivElement
  }
}