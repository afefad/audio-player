import { el } from 'redom'
import makeIcon from '../utils/MakeIcon'
import RegistrationLogo from './RegistrationLogo'
import LoginLogo from './LoginLogo'
import AuthSwitch from './AuthSwitch'
import CustomInput from './CustomInput'
import AuthManager from '../utils/AuthManager';

type AuthMode = 'login' | 'register'

type AuthCardOptions = {
  mode: AuthMode
  onToggleMode: () => void
}

export default class AuthCard {
  el: HTMLDivElement
  loginInput: CustomInput
  passwordInput: CustomInput
  logoEl: HTMLDivElement
  logoIcon: RegistrationLogo | LoginLogo
  titleEl: HTMLParagraphElement
  inputWrapEl: HTMLDivElement
  authManager: AuthManager
  authForm: HTMLFormElement
  authButton: HTMLButtonElement
  errorEl: HTMLDivElement

  mode: string

  constructor(options: AuthCardOptions) {
    this.mode = options.mode
    const onToggleMode = options.onToggleMode
    this.authManager = new AuthManager();

    this.logoIcon = 
      this.mode === 'register'
        ? new RegistrationLogo()
        : new LoginLogo()
    this.logoEl = el(
      'div.auth-card__logo',
      this.logoIcon
    )as HTMLDivElement

    const titleText =
      this.mode === 'register'
        ? 'Введите логин и пароль для регистрации'
        : 'Введите логин и пароль для авторизации'
 
    this.titleEl = el(
      'p.auth-card__title', 
      titleText
    ) as HTMLParagraphElement

    this.loginInput = new CustomInput({
      name: 'username',
      placeholder: 'Логин',
      icon: makeIcon('custom-input__icon', 18, 18, 'sprite.svg#user-icon'),
      autoсomplete: 'username'
    })

    this.passwordInput = new CustomInput({
      type: 'password',
      name: 'password',
      placeholder: 'Пароль',
      icon: makeIcon('custom-input__icon', 18, 18, 'sprite.svg#pass-icon'),
      autoсomplete: 'current-password'
    })

    const authText =
      this.mode === 'register'
        ? 'Регистрация'
        : 'Войти'

    this.authButton = el(
      'button.custom-input__button.btn.btn--auth',
      {type: 'submit'},
      authText
    ) as HTMLButtonElement

    this.inputWrapEl = el(
      'div.auth-card__wrapper',
      this.passwordInput,
      this.authButton
    ) as HTMLDivElement

    this.errorEl = el('div.auth-card__error error') as HTMLDivElement

    this.authForm = el(
      'form.auth-card__form', 
      this.titleEl,
      this.loginInput, 
      this.inputWrapEl,
      this.errorEl
    ) as HTMLFormElement

    const switchBlock =
      this.mode === 'register'
        ? new AuthSwitch({
            questionText: 'Уже есть логин и пароль?',
            buttonText: 'Авторизация',
            onClick: onToggleMode,
          })
        : new AuthSwitch({
            questionText: 'Нет профиля?',
            buttonText: 'Зарегестрироваться',
            onClick: onToggleMode,
          })

    this.el = el(
      'div.auth-card',
      this.logoEl,
      this.authForm,
      switchBlock.el
    ) as HTMLDivElement

    this.authButton.addEventListener('click', this.handleAuthClick)
  }

  private handleAuthClick = (e: MouseEvent) => {
    e.preventDefault()
    const username = this.loginInput.getValue()
    const password = this.passwordInput.getValue()


  this.mode === 'register'
    ? this.register(username, password)
    : this.login(username, password)

  }

  private async register(username: string, password: string) {
    try {
      const res = await this.authManager.register(username, password)
      if (res && typeof(res) !== 'string') {

        this.el = el(
          'div.auth-card',
          'Регистрация успешная!'
        ) as HTMLDivElement

        this.login(username, password)
      }
    } catch (error) {
      let errorText = "Something went wrong, please try again later.";

      if (error instanceof Error) {
        errorText = error.message;
      }

      this.errorEl.textContent = errorText
      if (!this.errorEl.classList.contains('error--enable')){
        this.errorEl.classList.add('error--enable')      
      }  
    }
  }

  private async login(username: string, password: string) {
    try {
      const res = await this.authManager.login(username, password)
      if (res && typeof(res) !== 'string') {
        const newEl = el(
          'div.auth-card',
          'Регистрация успешная!'
        ) as HTMLDivElement

        this.el.replaceWith(newEl)


          window.location.hash = '/main'
      }  else {
        const newEl = el(
          'div.auth-card',
          String(res)
        ) as HTMLDivElement

        this.el.replaceWith(newEl)

          window.location.hash = '/auth'
      }
    } catch (error) {
      let errorText = "Something went wrong, please try again later.";

      if (error instanceof Error) {
        errorText = error.message;
      }

      this.errorEl.textContent = errorText
      if (!this.errorEl.classList.contains('error--enable')){
        this.errorEl.classList.add('error--enable')      
      }
    } 
  }

}