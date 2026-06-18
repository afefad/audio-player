import App from "./app";

const appEl = document.querySelector<HTMLDivElement>('#app')

if (appEl) {
  const app = new App(appEl)
  app.init()
}
