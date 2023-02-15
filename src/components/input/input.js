import styles from './styles.js'

// https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/Input
export default class YInput extends HTMLElement {
  static get observedAttributes() {
    return ['disabled', 'pattern', 'required', 'readonly', 'placeholder', 'rows']
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({ mode: 'open' })

    const ele = this.isTextarea ? 'textarea' : 'input'
    const type = !this.isTextarea ? `type="${this.type}"` : ''
    const name = this.name ? `name="${this.name}"` : ''
    const placeholder = this.placeholder ? `placeholder="${this.placeholder}"` : ''
    const minlength = this.minlength ? `minlength="${this.minlength}"` : ''
    const maxlength = this.maxlength ? `maxlength="${this.maxlength}"` : ''

    const defaultAttr = `id="input" class="input" value="${this.defaultValue}" ${name} ${type} ${placeholder} ${minlength} ${maxlength}`
    const numberAttr = this.type === 'number' ? `min="${this.min}" max="${this.max}" step="${this.step}"` : ''

    const prefixIcon = this.getPrefixIconElement()
    const suffixIcon = this.getSuffixIconElement()

    shadowRoot.innerHTML = `<style>${styles}</style>
                            ${prefixIcon}
                            <${ele} ${defaultAttr} ${numberAttr} ></${ele}>
                            ${suffixIcon}
                            `
  }

  get suffixId() {
    return 'suffix'
  }

  get isTextarea() {
    return this.type === 'textarea'
  }

  get defaultValue() {
    return this.getAttribute('default-value') || ''
  }

  get disabled() {
    return this.getAttribute('disabled') !== null
  }

  get type() {
    return this.getAttribute('type')
  }

  get name() {
    return this.getAttribute('name') || ''
  }

  get placeholder() {
    return this.getAttribute('placeholder') || ''
  }

  get min() {
    return this.getAttribute('min') || 0
  }

  get max() {
    return this.getAttribute('max') || Infinity
  }

  get minlength() {
    return this.getAttribute('min-length') || ''
  }

  get maxlength() {
    return this.getAttribute('max-length') || ''
  }

  get step() {
    return this.getAttribute('step') || 1
  }

  get rows() {
    return this.getAttribute('rows') || 3
  }

  get pattern() {
    return this.getAttribute('pattern')
  }

  get value() {
    return this.inputEle.value || ''
  }

  get pattern() {
    return this.getAttribute('pattern')
  }

  get prefixIcon() {
    return this.getAttribute('prefix-icon') || ''
  }

  get suffixIcon() {
    return this.getAttribute('suffix-icon') || ''
  }

  get readonly() {
    return this.getAttribute('readonly') !== null
  }

  set readonly(value) {
    if (value === null || value === false) {
      this.removeAttribute('readonly')
    } else {
      this.setAttribute('readonly', '')
    }
  }

  set value(value) {
    this.inputEle.value = value
  }

  set pattern(value) {
    if (value === null || value === false) {
      this.removeAttribute('pattern')
    } else {
      this.setAttribute('pattern', value)
    }
  }

  set rows(value) {
    this.setAttribute('rows', value)
  }

  set disabled(value) {
    if (value === null || value === false) {
      this.removeAttribute('disabled')
    } else {
      this.setAttribute('disabled', '')
    }
  }

  connectedCallback() {
    this.setAttribute('sign', 'query')

    this.timer = 0
    this.isShowPassword = false

    this.inputEle = this.shadowRoot.getElementById('input')

    this.inputEleInput = (e) => this.handleInputEleInputEvent(e)
    this.inputEleChange = () => this.handleInputEleChangeEvent()
    this.inputEleKeydown = (e) => this.handleInputEleKeydownEvent(e)
    this.suffixEleClick = () => {}
    this.suffixEleChange = () => {}

    this.inputEle.addEventListener('input', this.inputEleInput)
    this.inputEle.addEventListener('change', this.inputEleChange)
    this.inputEle.addEventListener('keydown', this.inputEleKeydown)

    if (!this.isTextarea) {
      this.suffixEle = this.shadowRoot.getElementById(this.suffixId)

      this.suffixEleClick = () => this.handleSuffixEleClickEvent()
      this.suffixEleChange = () => this.handleSuffixEleChangeEvent()

      this.suffixEle.addEventListener('click', this.suffixEleClick)
      this.suffixEle.addEventListener('change', this.suffixEleChange)
    }

    this.disabled = this.disabled
    this.pattern = this.pattern
    this.readonly = this.readonly
  }

  disconnectedCallback() {
    this.inputEle.removeEventListener('input', this.inputEleInput)
    this.inputEle.removeEventListener('change', this.inputEleChange)
    this.inputEle.removeEventListener('keydown', this.inputEleKeydown)

    if (!this.isTextarea) {
      this.suffixEle.removeEventListener('click', this.suffixEleClick)
      this.suffixEle.removeEventListener('change', this.suffixEleChange)
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'disabled' && this.inputEle) {
      if (newValue !== null) {
        this.inputEle.setAttribute('disabled', '')
      } else {
        this.inputEle.removeAttribute('disabled')
      }
    }
    if (name === 'pattern' && this.inputEle) {
      if (newValue !== null) {
        this.inputEle.setAttribute('pattern', newValue)
      } else {
        this.inputEle.removeAttribute('pattern')
      }
    }
    if (name === 'placeholder' && this.inputEle) {
      if (newValue !== null) {
        this.inputEle.setAttribute('placeholder', newValue)
      } else {
        this.inputEle.removeAttribute('placeholder')
      }
    }
    if (name === 'required' && this.inputEle) {
      if (newValue !== null) {
        this.inputEle.setAttribute('required', 'required')
      } else {
        this.inputEle.removeAttribute('required')
      }
    }
    if (name === 'rows' && this.multi) {
      if (newValue !== null) {
        this.inputEle.setAttribute('rows', newValue)
      } else {
        this.inputEle.removeAttribute('rows')
      }
    }
    if (name === 'readonly' && this.inputEle) {
      if (newValue !== null) {
        this.inputEle.setAttribute('readonly', 'readonly')
      } else {
        this.inputEle.removeAttribute('readonly')
      }
    }
  }

  handleInputEleInputEvent(e) {
    e.stopPropagation()

    if (this.debounce) {
      this.timer && clearTimeout(this.timer)

      this.timer = setTimeout(() => {
        this.dispatchEvent(
          new CustomEvent('input', {
            detail: {
              value: this.value
            }
          })
        )
      }, this.debounce)
    } else {
      this.dispatchEvent(
        new CustomEvent('input', {
          detail: {
            value: this.value
          }
        })
      )
    }
  }

  handleInputEleChangeEvent() {
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: {
          value: this.value
        }
      })
    )
  }

  handleInputEleKeydownEvent(e) {
    if (e.code === 'Enter') {
      this.dispatchEvent(
        new CustomEvent('submit', {
          detail: {
            value: this.value
          }
        })
      )
    }
  }

  handleSuffixEleClickEvent() {
    switch (this.type) {
      case 'password':
        const pass = !this.isShowPassword

        this.isShowPassword = pass

        this.suffixEle.name = pass ? 'preview-open' : 'preview-close-one'
        this.suffixEle.setAttribute('type', pass ? 'text' : 'password')

        this.inputEle.focus()
        break
      default:
        this.dispatchEvent(
          new CustomEvent('submit', {
            detail: {
              value: this.value
            }
          })
        )
        break
    }
  }

  handleSuffixEleChangeEvent() {
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: {
          value: this.value
        }
      })
    )
  }

  getIconElement(name, selector) {
    return `<span class="${selector}"><iconpark-icon name="${name}" id="${selector}"></iconpark-icon></span>`
  }

  getPrefixIconElement() {
    let icon = this.prefixIcon
      ? this.getIconElement(this.prefixIcon, 'prefix')
      : '<span class="prefix"><slot name="prefix" id="prefix"></slot></span>'

    if (this.type === 'password') {
      icon = this.getIconElement('lock', this.suffixId)
    }

    return icon
  }

  getSuffixIconElement() {
    let icon = this.suffixIcon
      ? this.getIconElement(this.suffixIcon, this.suffixId)
      : `<span class="${this.suffixId}"><slot name="suffix" id="${this.suffixId}"></slot></span>`

    if (this.type === 'password') {
      icon = this.getIconElement('preview-close-one', this.suffixId)
    }
    if (this.type === 'search') {
      icon = this.getIconElement('search', this.suffixId)
    }

    return icon
  }
}

if (!customElements.get('y-input')) {
  customElements.define('y-input', YInput)
}
