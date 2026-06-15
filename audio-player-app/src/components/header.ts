import { el } from 'redom'
import makeIcon from '../utils/MakeIcon'
import Logo from './Logo'
import AuthManager from '../utils/AuthManager';
 
export default class Header {
  el: HTMLElement

  logoEl: Logo
  searchInput: HTMLInputElement
  searchIcon: SVGElement
  avatarImg: HTMLImageElement
  usernameEl: HTMLSpanElement
  chevronIcon: SVGElement
  logoutBtn: HTMLButtonElement
	profileEl: HTMLElement

  authManager: AuthManager

  onSearch?: (value: string) => void

  constructor() {

    this.logoEl = new Logo()
    this.authManager = new AuthManager()

    this.searchInput = el('input.search__input', {
      type: 'text',
      name: 'search',
      id: 'search',
      placeholder: 'Что будем искать?',
    }) as HTMLInputElement

    this.searchIcon = makeIcon(
      'search__icon', 
      24, 
      24, 
      'sprite.svg#search-icon'
    ) as SVGElement

    this.avatarImg = el('img.profile__img', {
      src: '#',
      width: 42,
      height: 42,
      alt: 'User avatar',
      id: 'avatar-id',
    }) as HTMLImageElement

    this.usernameEl = el(
      'span.profile__username',
      { id: 'username-id' },
      'Username'
    ) as HTMLSpanElement

    this.chevronIcon = makeIcon(
        'profile__icon', 
        16, 16, 
        'sprite.svg#chevron-right-icon',
        {'id': 'chevron-right-id',}
    ) as SVGElement

    this.logoutBtn = el(
      'button.profile__btn.btn.btn--logout',
      { type: 'button', id: 'logout-btn' },
      'Выход'
    ) as HTMLButtonElement

    this.profileEl = el(
      'div.header__profile.profile',

      el(
        'div.profile__img-wrap',
        this.avatarImg
      ),
      el(
        'div.profile__username-wrap',
        this.usernameEl,
      ),
      this.chevronIcon,
      this.logoutBtn
    ) as HTMLElement

    this.profileEl.addEventListener('click', () => {
      this.profileEl.classList.toggle('profile--active')
    })

    this.el = el(
      'header.header',
      el(
            'a.header__logo',
            { href: '/' },
            this.logoEl
          ),
      el(
        'div.container',
        el(
          'div.header__content',

          el(
            'div.header__right',

            el(
              'label.header__search.search__label',
              { for: 'search' },
              this.searchIcon,
              this.searchInput
            ),

            this.profileEl

          )
        )
      )
    )

    this.logoutBtn.addEventListener('click', this.handleLogoutClick)

    this.searchInput.addEventListener('input', () => {
      this.onSearch?.(this.searchInput.value)
    })
  }

  setUser(username: string, avatarUrl: string) {
    this.usernameEl.textContent = username
    this.avatarImg.src = avatarUrl
  }

  handleLogoutClick = () => {
    this.authManager.logout()
    window.location.hash = '/#/main'
  }
}