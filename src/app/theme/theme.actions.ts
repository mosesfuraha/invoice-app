import { createAction } from '@ngrx/store';

export const toggleTheme = createAction('[Theme] Toggle Theme');
export const setDarkTheme = createAction('[Theme] Set Dark Theme');
export const setLightTheme = createAction('[Theme] Set Light Theme');

export const ThemeActions = { toggleTheme, setDarkTheme, setLightTheme };
