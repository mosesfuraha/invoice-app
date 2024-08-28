import { Injectable } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { tap, withLatestFrom } from 'rxjs/operators';
import * as ThemeActions from './theme.actions';

@Injectable()
export class ThemeEffects {
  constructor(
    private actions$: Actions,
    private store: Store<{ theme: { isDarkMode: boolean } }>
  ) {
    this.saveTheme();
  }

  private saveTheme() {
    this.actions$
      .pipe(
        // Listen for theme change actions
        ofType(
          ThemeActions.toggleTheme,
          ThemeActions.setDarkTheme,
          ThemeActions.setLightTheme
        ),
        // Get the latest `isDarkMode` value from the store
        withLatestFrom(this.store.select((state) => state.theme.isDarkMode)),
        tap(([action, isDarkMode]) => {
          localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
        })
      )
      .subscribe();
  }
}
