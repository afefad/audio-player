import { el } from 'redom'
import makeIcon from '../utils/MakeIcon'

export default class LoginLogo {
  public el: HTMLElement
  private logoIcon: SVGElement

  constructor() {
    this.logoIcon = makeIcon(
      'logo__icon', 
      153, 
      30, 
      'sprite.svg#login-icon'
    ) as SVGElement

    this.el = el(
      'div.logo',
      this.logoIcon
    ) as HTMLDivElement
  }
}