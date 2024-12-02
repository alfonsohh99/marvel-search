import { HttpClient } from '@angular/common/http';
import { ElementRef, Injectable, ViewChild } from '@angular/core';
import { delay, Observable, of, switchMap } from 'rxjs';
import { CharacterSearchRequest } from '../shared/model/character-search/character-search-request.model';
import { CharacterSearchResponse } from '../shared/model/character-search/character-search-response.model';
import { ApiService, BaseConfig } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  private readonly baseConfig$: Observable<BaseConfig>;
  constructor(
    private readonly httpClient: HttpClient,
    private readonly apiService: ApiService
  ) {
    this.baseConfig$ = this.apiService.baseConfig$;
  }

  searchCharacters(
    request: CharacterSearchRequest
  ): Observable<CharacterSearchResponse> {
    return this.baseConfig$.pipe(
      switchMap((baseConfig) => {
        let params = baseConfig.params;

        if (request.name) {
          params = params.set('name', request.name);
        }

        if (request.nameStartsWith) {
          params = params.set('nameStartsWith', request.nameStartsWith);
        }

        if (request.modifiedSince) {
          // Target format  => "2014-04-29T14:18:17-0000"
          // ISO string     => "2014-04-29T14:18:17.235Z"
          const dateString = request.modifiedSince.toISOString();
          params = params.set(
            'modifiedSince',
            `${dateString.split('.')[0]}-0000`
          );
        }

        if (request.comics?.length) {
          params = params.set('comics', request.comics.join(','));
        }

        if (request.series) {
          params = params.set('series', request.series.join(','));
        }

        if (request.events?.length) {
          params = params.set('events', request.events.join(','));
        }

        if (request.stories) {
          params = params.set('stories', request.stories.join(','));
        }

        if (request.orderBy) {
          params = params.set('orderBy', request.orderBy);
        }

        if (request.limit) {
          params = params.set('limit', request.limit);
        }

        if (request.offset) {
          params = params.set('offset', request.offset);
        }

                return this.httpClient.get<CharacterSearchResponse>(
          `${baseConfig.baseEndpoint}/characters`,
          {
            headers: baseConfig.headers,
            params,
          }
        );
      })
    );
  }
}
