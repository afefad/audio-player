import { el } from 'redom'
import makeIcon from '../utils/MakeIcon'

export default class Logo {
  public el: HTMLElement
  private logoIcon: SVGElement

  constructor() {
    this.logoIcon = makeIcon(
      'logo__icon', 
      184, 
      30, 
      'sprite.svg#logo'
    ) as SVGElement

    this.el = el(
      'div.logo',
      this.logoIcon
    ) as HTMLDivElement
  }
}