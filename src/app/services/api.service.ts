import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ConfigurationService } from './configuration.service';
import { default as md5 } from 'md5';

export interface BaseConfig {
  params: HttpParams;
  baseEndpoint: string;
  headers: {
    [header: string]: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  public readonly baseConfig$: Observable<BaseConfig>;
  constructor(private readonly configurationService: ConfigurationService) {
    this.baseConfig$ = this.configurationService.appConfig$.pipe(
      map((appConfig) => {
        let params = new HttpParams();
        const ts = Date.now();
        params = params.set('ts', Date.now());
        params = params.set('apikey', appConfig.publicKey);
        params = params.set(
          'hash',
          md5(`${ts}${appConfig.privateKey}${appConfig.publicKey}`)
        );
        const headers = { 'Content-Type': 'application/json' };
        return { params, headers, baseEndpoint: appConfig.baseEndpoint };
      })
    );
  }
}
