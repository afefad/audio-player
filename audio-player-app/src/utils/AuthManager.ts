import DummyBackend from "../api/DummyBackend";
import LocalStorage from "./LocalStorageManager";
import type { User } from "../types/api/apiTypes";

export default class AuthManager {
  private storage: LocalStorage;
  private api: DummyBackend;

  constructor() {
    this.storage = new LocalStorage();
    this.api = new DummyBackend();
  }

  async login(
    username: string,
    password: string,
  ): Promise<boolean | string> {
    const loginPayload: User = {
      username,
      password,
    };

    try {
      const response = await this.api.login(loginPayload);
      this.storage.setUsername(username);
      this.storage.setToken(response.token);

      return true;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Auth error:", error.message);
      }
      throw error;
    }
  }

  async register(
    username: string,
    password: string,
  ): Promise<boolean | string> {
    const loginPayload: User = {
      username,
      password,
    };

    try {
      await this.api.register(loginPayload);
      this.storage.setUsername(username);

      return true;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Auth error:", error.message);
      }
      throw error;
    }
  }

  logout(): boolean {
    try {
      this.storage.removeUsername();
      this.storage.removeToken();
      return true;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Auth error:", error.message);
      }
      return false;
    }
  }

  getUsername(): string | null {
    return this.storage.getUsername();
  }

  getAvatar(): string {
    return "/images/example.png";
  }

  getToken(): string | null {
    return this.storage.getToken();
  }

  isAuth(): boolean {
    return this.getToken() !== null;
  }
}
