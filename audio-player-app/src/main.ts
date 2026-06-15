import './scss/style.scss'
import Routes from './app/Routes'



const appEl = document.querySelector<HTMLDivElement>('#app')

if (appEl) {
  const router = new Routes(appEl);
  router.init();
  window.addEventListener('hashchange', () => {
    router.init();
  })
}

