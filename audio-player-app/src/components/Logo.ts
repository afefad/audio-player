import { el } from 'redom'
import makeIcon from '../utils/MakeIcon'

export default class Logo {
  public el: HTMLElement
  private logoIcon: SVGElement
  private width: number 
  private height: number
  private iconId: string
  private logoClass: string

  constructor() {
    
    this.height = 30
    this.width = 184
    this.iconId = 'sprite.svg#logo'
    this.logoClass = 'logo'

    this.logoIcon = makeIcon(
      'logo__icon', 
      this.width,
      this.height,
      this.iconId 
    ) as SVGElement

    this.el = el(
      'div.' + this.logoClass,
      this.logoIcon
    ) as HTMLDivElement
  }
}