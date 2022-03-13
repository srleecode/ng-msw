import { HeaderState, INITIAL_STATE } from '@srleecode/ng-shared/components/header/domain';
import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { catchError, EMPTY, map, switchMap, tap, withLatestFrom } from 'rxjs';
import { ThemeService } from '@srleecode/ng-shared/components/header/data-access';

@Injectable()
export class HeaderStoreService extends ComponentStore<HeaderState> {
  constructor(private themeService: ThemeService) {
    super(INITIAL_STATE);
  }

  readonly lightTheme$ = this.select(({ lightTheme }) => lightTheme);

  private readonly setLightTheme = this.updater((state, lightTheme: boolean) => ({
    ...state,
    lightTheme,
  }));

  readonly toggleTheme = this.effect(($) =>
    $.pipe(
      withLatestFrom(this.lightTheme$),
      map(([, lightTheme]) => lightTheme),
      tap((lightTheme) => {
        this.setLightTheme(!lightTheme);
      }),
      switchMap((lightTheme) => this.themeService.save$(!lightTheme).pipe(catchError(() => EMPTY)))
    )
  );

  readonly loadTheme = this.effect(($) =>
    $.pipe(
      switchMap(() =>
        this.themeService.load$().pipe(
          tapResponse(
            (rsp) => this.setLightTheme(rsp.lightTheme),
            (error: Error) => {
              console.error(error.message);
              return EMPTY;
            }
          )
        )
      )
    )
  );
}
