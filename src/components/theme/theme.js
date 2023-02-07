import styles from './styles.js'

export default class YTheme extends HTMLElement {
  darkBgColor = '#262833'
  defaultBgColor = '#e6e7ee'

  constructor() {
    super()
    const shadowRoot = this.attachShadow({ mode: 'open' })

    shadowRoot.innerHTML = `<style>${styles}</style><iconpark-icon name="${this.iconName}" id="icon"></iconpark-icon>`
  }

  get storeTheme() {
    return window.localStorage.getItem('theme')
  }

  get iconName() {
    return this.storeTheme === null || this.storeTheme === 'null' ? 'moon' : 'sun-one'
  }

  get allCustomElements() {
    const list = document.querySelectorAll('[sign=query]')

    return list || []
  }

  set storeTheme(value) {
    window.localStorage.setItem('theme', value)
  }

  connectedCallback() {
    this.iconEle = this.shadowRoot.getElementById('icon')

    this.iconClick = () => this.handleIconClickEvent(false)

    this.addEventListener('click', this.iconClick)

    this.setAttribute('sign', 'query')

    this.handleIconClickEvent(true)
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.iconClick)
  }

  handleIconClickEvent(isInit) {
    let value = this.storeTheme === null || this.storeTheme === 'null' ? 'dark' : 'null'

    if (isInit) {
      value = this.storeTheme || 'null'
    }

    if (!isInit) {
      this.storeTheme = value
    }

    this.iconEle.setAttribute('name', this.iconName)
    this.handleBodyStyles(value)
    this.handleAllCustomElements(value)
  }

  handleAllCustomElements(value) {
    const list = this.allCustomElements

    if (list.length) {
      list.forEach((ele) => {
        if (value === 'null') {
          ele.removeAttribute('theme')
        } else {
          ele.setAttribute('theme', value)
        }
      })
    }
  }

  handleBodyStyles(value) {
    const body = document.querySelector('body')
    const bgColor = value === 'dark' ? this.darkBgColor : this.defaultBgColor

    body.style.backgroundColor = bgColor
  }
}

if (!customElements.get('y-theme')) {
  customElements.define('y-theme', YTheme)
}
