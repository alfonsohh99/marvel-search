import { Injectable } from '@angular/core';
import { delay, Observable, of, switchMap } from 'rxjs';
import { ApiService, BaseConfig } from './api.service';
import { HttpClient } from '@angular/common/http';
import { ComicSearchRequest } from '../shared/model/comic-search/comic-search-request.model';
import { ComicSearchResponse } from '../shared/model/comic-search/comic-search-response.model';

@Injectable({
  providedIn: 'root',
})
export class ComicService {
  private readonly baseConfig$: Observable<BaseConfig>;
  constructor(
    private readonly httpClient: HttpClient,
    private readonly apiService: ApiService
  ) {
    this.baseConfig$ = this.apiService.baseConfig$;
  }

  searchComics(request: ComicSearchRequest): Observable<ComicSearchResponse> {
    return this.baseConfig$.pipe(
      switchMap((baseConfig) => {
        let params = baseConfig.params;

        if (request.titleStartsWith) {
          params = params.set('titleStartsWith', request.titleStartsWith);
        }

        if (request.limit) {
          params = params.set('limit', request.limit);
        }

        if (request.offset) {
          params = params.set('offset', request.offset);
        }

                return this.httpClient.get<ComicSearchResponse>(
          `${baseConfig.baseEndpoint}/comics`,
          {
            headers: baseConfig.headers,
            params,
          }
        );
      })
    );
  }
}
