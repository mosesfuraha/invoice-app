import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import * as ThemeActions from './theme.actions';

@Injectable()
export class ThemeEffects {
  constructor(private actions$: Actions) {
    this.saveTheme();
  }

  private getIsDarkMode(): boolean {
    const state = JSON.parse(localStorage.getItem('appState') || '{}');
    return state.theme?.isDarkMode ?? false;
  }

  private saveTheme() {
    this.actions$.subscribe((action) => {
      if (
        action.type === ThemeActions.toggleTheme.type ||
        action.type === ThemeActions.setDarkTheme.type ||
        action.type === ThemeActions.setLightTheme.type
      ) {
        const isDarkMode = this.getIsDarkMode();
        localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
      }
    });
  }
}
