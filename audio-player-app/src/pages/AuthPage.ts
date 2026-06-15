import { el, setChildren } from 'redom'
import AuthCard from '../components/AuthCard'

type AuthMode = 'login' | 'register'

export default class AuthPage {

  public el: HTMLElement
  private mode: AuthMode

  constructor() {
    this.mode = 'login'
    this.el = el('section.auth-page')
    this.render()
  }

  private toggleMode = (): void => {
    this.mode = this.mode === 'login' ? 'register' : 'login'
    this.render()
  }

  private render(): void {
    const card = new AuthCard({
      mode: this.mode,
      onToggleMode: this.toggleMode,
    })

    setChildren(this.el, [card.el])
  }
}