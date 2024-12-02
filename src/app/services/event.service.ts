import { Injectable } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { ApiService, BaseConfig } from './api.service';
import { HttpClient } from '@angular/common/http';
import { EventSearchRequest } from '../shared/model/event-search/event-search-request.model';
import { EventSearchResponse } from '../shared/model/event-search/event-search-response.model';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private readonly baseConfig$: Observable<BaseConfig>;
  constructor(
    private readonly httpClient: HttpClient,
    private readonly apiService: ApiService
  ) {
    this.baseConfig$ = this.apiService.baseConfig$;
  }

  searchEvents(request: EventSearchRequest): Observable<EventSearchResponse> {
    return this.baseConfig$.pipe(
      switchMap((baseConfig) => {
        let params = baseConfig.params;

        if (request.nameStartsWith) {
          params = params.set('nameStartsWith', request.nameStartsWith);
        }

        if (request.limit) {
          params = params.set('limit', request.limit);
        }

        if (request.offset) {
          params = params.set('offset', request.offset);
        }

        return this.httpClient.get<EventSearchResponse>(
          `${baseConfig.baseEndpoint}/events`,
          {
            headers: baseConfig.headers,
            params,
          }
        );
      })
    );
  }
}
