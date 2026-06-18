import type {
  User,
  RegisterResponse,
  LoginResponse,
  MessageResponse,
} from "../types/api/apiTypes";
import type { Track } from "../types/app/trackType";
import HttpError from "../components/Error";

export default class DummyBackend {
  private readonly baseUrl = "/api";

  private async request<T>(
    url: string,
    options?: RequestInit,
    timeoutMs = 10000, // 10 секунд
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      controller.abort();
    }, timeoutMs);

    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...(options?.headers ?? {}),
        },
        signal: controller.signal,
        ...options,
      });

      if (!response.ok) {

        let errorMessage = "Request error";
        let errorCode = 500


        try {
          const errorData = (await response.json()) as { message?: string };
          const errorStatus = (await response.status) as number;
          errorMessage = errorData.message ?? errorMessage;
          errorCode = errorStatus ?? errorCode
        } catch {
          errorMessage = response.statusText || errorMessage;
          errorCode = response.status || errorCode;
        }
        
        throw new HttpError(errorMessage, errorCode);
      }

      return response.json() as Promise<T>;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new HttpError("Request timeout", 504);
      }

      throw error;
    } finally {
      window.clearTimeout(timeoutId);
    }
  }

  register(data: User): Promise<RegisterResponse> {
    return this.request<RegisterResponse>(`${this.baseUrl}/register`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  login(data: User): Promise<LoginResponse> {
    return this.request<LoginResponse>(`${this.baseUrl}/login`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  getTracks(token: string): Promise<Track[]> {
    return Promise.all([
      this.request<Track[]>(`${this.baseUrl}/tracks`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      this.request<Track[]>(`${this.baseUrl}/favorites`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    ]).then(([trackList, favorites]) => {
      const favoriteIds = new Set(favorites.map((el) => el.id));

      return trackList.map((track) => ({
        ...track,
        isFavorite: favoriteIds.has(track.id),
      }));
    });
  }

  getFavorites(token: string): Promise<Track[]> {
    const favorites =  this.request<Track[]>(`${this.baseUrl}/favorites`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    favorites.then(data => {
      data.forEach(el => {
        el.isFavorite = true
      })
    })

    return favorites
  }

  addFavorite(token: string, trackId: number): Promise<MessageResponse> {

    const normalizedTrackId = Number(trackId);

    if (Number.isNaN(normalizedTrackId)) {
      throw new Error("trackId должен быть числом");
    }

    const resp = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ trackId: Number(trackId) }),
    }
    return this.request<MessageResponse>(`${this.baseUrl}/favorites`, resp);
  }

  removeFavorite(
    token: string,
    trackId: number,
  ): Promise<MessageResponse> {
    return this.request<MessageResponse>(`${this.baseUrl}/favorites`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ trackId: Number(trackId) }),
    });
  }
}
