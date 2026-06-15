import { el } from 'redom'

type CustomInputOptions = {
  type?: string
  name?: string
  placeholder: string
  icon?: SVGElement
  autocomplete?: string
}

export default class CustomInput {
  el: HTMLLabelElement
  inputEl: HTMLInputElement
  iconPlaceholder: HTMLDivElement


  constructor(options: CustomInputOptions) {

    const { type = 'text', name = '', placeholder, icon, autocomplete = 'off' } = options

    this.inputEl = el('input.custom-input__field', {
      type,
      name,
      placeholder,
      autocomplete,
    })as HTMLInputElement

    this.iconPlaceholder = el('div.custom-input__icon') as HTMLDivElement

    this.el = el(
      'label.custom-input',
      icon ? icon : this.iconPlaceholder,
      this.inputEl
    ) as HTMLLabelElement

  }

  getValue(): string {
    return this.inputEl.value.trim()
  }
}