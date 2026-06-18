export default class LocalStorage {
  private readonly usernameKey = 'username';
  private readonly tokenKey = 'token';

  setUsername(username: string): void {
    localStorage.setItem(this.usernameKey, username);
  }

  getUsername(): string | null {
    return localStorage.getItem(this.usernameKey);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  removeUsername(): void {
    localStorage.removeItem(this.usernameKey);
  }

  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  clearAuth(): void {
    this.removeUsername();
    this.removeToken();
  }
}