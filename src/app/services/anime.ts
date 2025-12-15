import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Anime {
  private apiUrl = 'https://api.jikan.moe/v4';
  constructor(private http: HttpClient) {}

  //Este método recibe un texto en búsqueda y devuelve los resultados de la Api
  searchAnime(query: string, type?: string, status?: string) {
    const params: any = { q: query };
    if (type) params.type = type;
    if (status) params.status = status;
    return this.http.get('https://api.jikan.moe/v4/anime', { params });
  }

  //Este método recibe un id y devuelve los detalles del anime
  getAnimeDetail(id: number) {
    const url = `https://api.jikan.moe/v4/anime/${id}`;
    return this.http.get(url);
  }
  //Este método devuelve las reseñas del anime
  getAnimeReviews(id: number) {
    const url = `https://api.jikan.moe/v4/anime/${id}/reviews`;
    return this.http.get(url);
  }

  //Este método devuelve los episodios del anime
  getAnimeEpisodes(id: number) {
    const url = `https://api.jikan.moe/v4/anime/${id}/episodes`;
    return this.http.get(url);
  }

  //Este método devuelve los animes top
  getTopAnimes() {
    const url = `https://api.jikan.moe/v4/top/anime`;
    return this.http.get(url);
  }

  //Este método devuelve un numero random de animes
  //uso forkJoin en vez de promise.all paorque con esto
  //se ejecutan todas las peticiones al mismo tiempo

  getRandomAnimes(limit: number = 12): Observable<any> {
    const requests: Observable<any>[] = [];
    for (let i = 0; i < limit; i++) {
      requests.push(this.http.get(`${this.apiUrl}/random/anime`));
    }
    return forkJoin(requests).pipe(
      map((responses: any[]) => responses.map((response: any) => response.data))
    );
  }
}
