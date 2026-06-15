export default class LocalStorage {
  private readonly usernameKey = 'username';
  private readonly tokenKey = 'token';

  public setUsername(username: string): void {
    localStorage.setItem(this.usernameKey, username);
  }

  public getUsername(): string | null {
    return localStorage.getItem(this.usernameKey);
  }

  public setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  public getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  public removeUsername(): void {
    localStorage.removeItem(this.usernameKey);
  }

  public removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  public clearAuth(): void {
    this.removeUsername();
    this.removeToken();
  }
}