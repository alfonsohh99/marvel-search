import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { AppConfig } from '../shared/model/app-config.model';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {
  appConfig$: Observable<AppConfig>;
  constructor(private http: HttpClient) {
    this.appConfig$ = this.http
      .get<AppConfig>('/app.config.json')
      .pipe(shareReplay());
  }
}
