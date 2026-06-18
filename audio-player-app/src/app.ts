import './scss/style.scss'
import Routes from './app/Routes'

export default class App {
  router: Routes

  constructor(appEl: HTMLDivElement) {
    this.router = new Routes(appEl);
    window.addEventListener('hashchange', () => {
      this.init();
    })
  }

  init() {
    this.router.init();
  }
}








