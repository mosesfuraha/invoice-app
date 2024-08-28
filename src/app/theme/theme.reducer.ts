import { createReducer, on } from '@ngrx/store';
import * as ThemeActions from './theme.actions';

export interface ThemeState {
  isDarkMode: boolean;
}

const initialState: ThemeState = {
  isDarkMode: false,
};

export const themeReducer = createReducer(
  initialState,
  on(ThemeActions.toggleTheme, (state) => {
    const newIsDarkMode = !state.isDarkMode;

    localStorage.setItem('isDarkMode', JSON.stringify(newIsDarkMode));
    return {
      ...state,
      isDarkMode: newIsDarkMode,
    };
  }),
  on(ThemeActions.setInitialTheme, (state, { isDarkMode }) => {
    return {
      ...state,
      isDarkMode,
    };
  }),
  on(ThemeActions.setDarkTheme, (state) => ({ ...state, isDarkMode: true })),
  on(ThemeActions.setLightTheme, (state) => ({ ...state, isDarkMode: false }))
);
