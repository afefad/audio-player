import { mount, setChildren } from 'redom';
import MainPage from '../pages/MainPage';
import AuthPage from '../pages/AuthPage';
import AuthManager from '../utils/AuthManager';


type RoutePath = '/' | '/favorites' | '/auth';

export default class Routes {
  private root: HTMLElement
  private authManager: AuthManager

  constructor(root: HTMLElement) {
    this.root = root;
    this.authManager = new AuthManager()
  }

  init(): void {
    window.addEventListener('hashchange', this.renderCurrentPage);
    this.renderCurrentPage();
  }

  destroy(): void {
    window.removeEventListener('hashchange', this.renderCurrentPage);
  }

  private getPath(): RoutePath {
    const hash = window.location.hash.replace('#', '');

    if (!this.authManager.getToken()) {
      return '/auth';
    }

    if (hash === '/auth') {
      return '/auth';
    }

    if (hash === '/main') {
      return '/';
    }

    return '/';
  }

  private renderCurrentPage = (): void => {

    let path = this.getPath();

    if (path === '/') {
      setChildren(this.root, []);
      const mainPage = new MainPage()
      mount(this.root, mainPage);
      return;
    }

    setChildren(this.root, []);
    mount(this.root, new AuthPage());
  };

}