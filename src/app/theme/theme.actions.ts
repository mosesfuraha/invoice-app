import { createAction, props } from '@ngrx/store';

export const toggleTheme = createAction('[Theme] Toggle Theme');
export const setDarkTheme = createAction('[Theme] Set Dark Theme');
export const setLightTheme = createAction('[Theme] Set Light Theme');
export const setInitialTheme = createAction(
  '[Theme] Set Initial Theme',
  props<{ isDarkMode: boolean }>()
);

export const ThemeActions = { toggleTheme, setDarkTheme, setLightTheme, setInitialTheme };
