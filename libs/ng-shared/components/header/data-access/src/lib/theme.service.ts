import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ThemeResponse } from '@srleecode/ng-shared/components/header/domain';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  constructor(private httpClient: HttpClient) {}

  save$(isLightTheme: boolean) {
    return this.httpClient.post('user/theme', {
      isLightTheme,
    });
  }

  load$(): Observable<ThemeResponse> {
    return this.httpClient.get<ThemeResponse>('user/theme');
  }
}
